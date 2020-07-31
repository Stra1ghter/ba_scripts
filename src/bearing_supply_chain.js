/*
#		Prototype of a supply chain application
#		The goal is to have a supply chain blockchain, that tracks products
#		It should also track different kinds of information with the product
#		e.g. shipment date, type
#	  
#   Chaincode-Version (for deployment): 1.0.4
*/

'use strict';
const shim = require('fabric-shim');
//const shim  = require('./mock.js');
const util = require('util');

let log = function(msg){
		console.log("[Bearing_supply_chain-CC]: " + msg);	
}


/**
 * Executes a query using a specific key
 * 
 * @param {*} key - the key to use in the query
 */
async function queryByKey(stub, key) {
  console.log('============= START : queryByKey ===========');
  console.log('##### queryByKey key: ' + key);

  let resultAsBytes = await stub.getState(key); 
  if (!resultAsBytes || resultAsBytes.toString().length <= 0) {
    throw new Error('##### queryByKey key: ' + key + ' does not exist');
  }
  console.log('##### queryByKey response: ' + resultAsBytes);
  console.log('============= END : queryByKey ===========');
  return resultAsBytes;
}

/**
 * Executes a query based on a provided queryString
 * 
 * I originally wrote this function to handle rich queries via CouchDB, but subsequently needed
 * to support LevelDB range queries where CouchDB was not available.
 * 
 * @param {*} queryString - the query string to execute
 * example '{"selector": {"docType": "spendAllocation", "ngoRegistrationNumber": "' + ngo + '"}}''
 */
async function queryByString(stub, queryString) {
  console.log('============= START : queryByString ===========');
  console.log("##### queryByString queryString: " + queryString);

  // CouchDB Query
  // let iterator = await stub.getQueryResult(queryString);

  // Equivalent LevelDB Query. We need to parse queryString to determine what is being queried
  // In this chaincode, all queries will either query ALL records for a specific docType, or
  // they will filter ALL the records looking for a specific NGO, Donor, Donation, etc. So far, 
  // in this chaincode there is a maximum of one filter parameter in addition to the docType.
  let docType = "";
  let startKey = "";
  let endKey = "";
  let jsonQueryString = JSON.parse(queryString);
  if (jsonQueryString['selector'] && jsonQueryString['selector']['docType']) {
    docType = jsonQueryString['selector']['docType'];
    startKey = docType + "0";
    endKey = docType + "z";
  }
  else {
    throw new Error('##### queryByString - Cannot call queryByString without a docType element: ' + queryString);   
  }

  let iterator = await stub.getStateByRange(startKey, endKey);

  // Iterator handling is identical for both CouchDB and LevelDB result sets, with the 
  // exception of the filter handling in the commented section below
  let allResults = [];
  while (true) {
    let res = await iterator.next();

    if (res.value && res.value.value.toString()) {
      let jsonRes = {};
      console.log('##### queryByString iterator: ' + res.value.value.toString('utf8'));

      jsonRes.Key = res.value.key;
      try {
        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
      } 
      catch (err) {
        console.log('##### queryByString error: ' + err);
        jsonRes.Record = res.value.value.toString('utf8');
      }
      // ******************* LevelDB filter handling ******************************************
      // LevelDB: additional code required to filter out records we don't need
      // Check that each filter condition in jsonQueryString can be found in the iterator json
      // If we are using CouchDB, this isn't required as rich query supports selectors
      let jsonRecord = jsonQueryString['selector'];
      // If there is only a docType, no need to filter, just return all
      console.log('##### queryByString jsonRecord - number of JSON keys: ' + Object.keys(jsonRecord).length);
      if (Object.keys(jsonRecord).length == 1) {
        allResults.push(jsonRes);
        continue;
      }
      for (var key in jsonRecord) {
        if (jsonRecord.hasOwnProperty(key)) {
          console.log('##### queryByString jsonRecord key: ' + key + " value: " + jsonRecord[key]);
          if (key == "docType") {
            continue;
          }
          console.log('##### queryByString json iterator has key: ' + jsonRes.Record[key]);
          if (!(jsonRes.Record[key] && jsonRes.Record[key] == jsonRecord[key])) {
            // we do not want this record as it does not match the filter criteria
            continue;
          }
          allResults.push(jsonRes);
        }
      }
      // ******************* End LevelDB filter handling ******************************************
      // For CouchDB, push all results
      // allResults.push(jsonRes);
    }
    if (res.done) {
      await iterator.close();
      console.log('##### queryByString all results: ' + JSON.stringify(allResults));
      console.log('============= END : queryByString ===========');
      return Buffer.from(JSON.stringify(allResults));
    }
  }
}


const Chaincode = class {

  /**
   * Initialize the state of the chaincode ledger
   * 
   * @param {ChaincodeStub} stub 
   */
  async Init(stub) {
    log('Instantiated or upgraded beaing_supply_chain chaincode');
    return shim.success();
  }

   /**
   * Invoke method called when Chaincode is invoked with a function name and parameter argument
   * 
   * @param {ChainCodeStub} stub 
   */
  async Invoke(stub) {
    console.log('============= START : Invoke ===========');
    let ret = stub.getFunctionAndParameters();
    console.log('##### Invoke args: ' + JSON.stringify(ret));

    let method = this[ret.fcn];
    if (!method) {
      console.error('##### Invoke - error: no chaincode function with name: ' + ret.fcn + ' found');
      throw new Error('No chaincode function with name: ' + ret.fcn + ' found');
    }
    try {
      let response = await method(stub, ret.params);
      console.log('##### Invoke response payload: ' + response);
      return shim.success(response);
    } catch (err) {
      console.log('##### Invoke - error: ' + err);
      return shim.error(err);
    }
  }

  /**
   * Stores a produced bearing in the chain.
   * 
   * @param {ChainCodeStub} stub 
   * @param {*} args - JSON string with the format as follows:
   * {
   *    "UID": "d8a83c3eeer3werw",
   *    "producedDate": "2020-07-30T14:42:20.182Z"
   * }
   */
  async produceBearing(stub, args){
    console.log('============= START : produceBearing ===========');
    console.log('##### produceBearing arguments: ' + JSON.stringify(args));

    let json = JSON.parse(args);
    json['docType'] = 'bearing';
    let UID = json['UID'];
    let key = 'bearing' + UID;   
    json['owner'] = 'SKF';

    let bearingQuery = await stub.getState(key);
    if(bearingQuery.toString()){
      console.log('##### This bearing already exists: ' + UID);
      return '##### This bearing already exists: ' + UID;
	  }

    let datetime = json['producedDate'];
    if(!datetime)
      json['producedDate'] = new Date().toISOString();
    

    await stub.putState(key, Buffer.from(JSON.stringify(json)))
    console.log('============= END : produceBearing ===========');
  }

  async initLedger(stub, args) {
    console.log('============= START : Initialize Ledger ===========');
    console.log('============= END : Initialize Ledger ===========');
  }


  /**
   * Transfer the ownership of a bearing
   * 
   * @param {ChainCodeStub} stub 
   * @param {*} args - JSON string with the format as follows:
   * {
   *    "UID": "d8a83c3eeer3werw",
   *    "owner": "nameOfNewOwner"
   * }
   */
  async transfer(stub, args){
    console.log('============= START : transfer ===========');
    console.log('##### transfer arguments: ' + JSON.stringify(args));

    let json = JSON.parse(args);
    
    let newOwner = json["owner"];
    if(!newOwner || !newOwner.toString())
      throw new Error('##### transfer - New owner not supplied as argument: ' + JSON.stringify(args));

    let UID = json["UID"];
    if(!UID || !UID.toString())
      throw new Error('##### transfer - UID not supplied as argument: ' + JSON.stringify(args));

    let bearingAsBytes = await stub.getState("bearing" + UID);
    throw new Error(bearingAsBytes);
    if (!bearingAsBytes.toString() || bearingAsBytes.toString().length <= 0) {
      throw new Error('##### transfer - Cannot transfer ownership as the bearing does not exist: ' + json["UID"]);
    }

    let bearing = JSON.parse(Buffer.toString(bearingAsBytes));
    bearing["owner"] = newOwner;


    await stub.putState("bearing" + UID, Buffer.from(JSON.stringify(bearing)));

    
    console.log('============= END : transfer ===========');
    return queryByKey(stub, 'bearing' + UID);
   }

   async transfer2(stub, args){
    console.log('============= START : transfer ===========');
    console.log('##### transfer arguments: ' + JSON.stringify(args));

    let json = JSON.parse(args);
        let newOwner = json["owner"];
      throw new Error('##### transfer - New owner not supplied as argument: ' + JSON.stringify(args));
  }

  // put associated metadata

  // get associated metadata

  /**
   * Retrieve a specific bearing
   * 
   * @param {ChainCodeStub} stub 
   * @param {*} args - JSON string with the format as follows:
   * {
   *    "UID": "d8a83c3eeer3werw"
   * }
   */
  async queryBearing(stub, args){
    console.log('============= START : queryBearing ===========');
    console.log('##### queryDonor arguments: ' + JSON.stringify(args));

    // args is passed as a JSON string
    let json = JSON.parse(args);
    let key = 'bearing' + json['UID'];
    console.log('##### queryBearing key: ' + key);

    return queryByKey(stub, key);
   }

  /**
  * Retrieves all bearings
  * 
  * @param {ChainCodeStub} stub 
  * @param {*} args 
  */
  async queryAllBearings(stub, args) {
    console.log('============= START : queryAllNGOs ===========');
    console.log('##### queryAllNGOs arguments: ' + JSON.stringify(args));
 
    let queryString = '{"selector": {"docType": "bearing"}}';
    return queryByString(stub, queryString);
  }

}

//module.exports = Chaincode;
shim.start(new Chaincode());
//let c = new Chaincode();
//c.Init();
//c.queryBearing(shim, "{\"UID\": \"d8a83c3eeer3werw\"}")
