/*
#		Prototype chain code that tracks produced bearings and its metadata
#
#   Chaincode-Version: 1.0.21
*/

'use strict';
const shim = require('fabric-shim');
const util = require('util');

/**
 * Executes a query using a specific key
 * 
 * @param {*} key - the key to query
 */
async function queryByKey(stub, key) {
  console.log('queryByKey() - key arg: ' + key);

  let res = await stub.getState(key); 
  if (!res || res.toString().length <= 0)
    throw new Error('queryByKey() key: ' + key + ' does not exist');
  
  return res;
}

/**
 * Executes a leveldb query via the provided queryString
 * 
 * @param {*} queryString - the query string
 * example argument: '{"selector": {"docType": "bearing"}}''
 */
async function queryByString(stub, queryString) {
  console.log("queryByString() - queryString arg: " + queryString);

  // Parse queryString
  // We filter for a specific doctype, one additional filter argument is possible, e.g. a bearing UID
  let docType = "";
  let startKey = "";
  let endKey = "";
  let jsonQueryString = JSON.parse(queryString);
  if (jsonQueryString['selector'] && jsonQueryString['selector']['docType']) {
    docType = jsonQueryString['selector']['docType'];
    startKey = docType + "0";
    endKey = docType + "z";
  }
  else
    throw new Error('queryByString() - cannot call queryByString without a docType element: ' + queryString);   

  let iterator = await stub.getStateByRange(startKey, endKey);
  
  let allResults = [];
  while (true) {
    let res = await iterator.next();

    if (res.value && res.value.value.toString()) {
      let jsonRes = {};
      console.log('queryByString() iterator: ' + res.value.value.toString('utf8'));

      jsonRes.Key = res.value.key;
      try {
        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
      } 
      catch (err) {
        console.log('queryByString() error: ' + err);
        jsonRes.Record = res.value.value.toString('utf8');
      }

      let jsonRecord = jsonQueryString['selector'];
      // If there is only a docType, no need to filter, just return all
      console.log('queryByString() jsonRecord - number of JSON keys: ' + Object.keys(jsonRecord).length);
      if (Object.keys(jsonRecord).length == 1) {
        allResults.push(jsonRes);
        continue;
      }
      for (var key in jsonRecord) {
       // if (jsonRecord.hasOwnProperty(key)) {
          console.log('queryByString() jsonRecord key: ' + key + " value: " + jsonRecord[key]);
          if (key == "docType")
            continue;
          
          console.log('queryByString() json iterator has key: ' + jsonRes.Record[key]);
          if (!(jsonRes.Record[key] && jsonRes.Record[key] == jsonRecord[key])) {
            // we skip this record as it does not fit the filter criteria
            continue;
          }
          allResults.push(jsonRes);
     //   }
      }
    }
    if (res.done) {
      await iterator.close();
      console.log('queryByString() result: ' + JSON.stringify(allResults));
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
    console.log('Instantiated or upgraded bearing_supply_chain chaincode');
    return shim.success();
  }

   /**
   * Invoke method called when Chaincode is invoked with a function name and parameter argument
   * 
   * @param {ChainCodeStub} stub 
   */
  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.log('Invoke() - args: ' + JSON.stringify(ret));

    let method = this[ret.fcn];
    if (!method) {
      console.error('Invoke() - error: no chaincode function with name: ' + ret.fcn + ' found');
      throw new Error('No chaincode function with name: ' + ret.fcn + ' found');
    }
    try {
      let response = await method(stub, ret.params);
      console.log('Invoke() response payload: ' + response);
      return shim.success(response);
    } catch (err) {
      console.log('Invoke() - error: ' + err);
      return shim.error(err);
    }
  }

  /**
   * Stores a produced bearing in the chain
   * 
   * @param {ChainCodeStub} stub 
   * @param {*} args - JSON string with the format as follows:
   * {
   *    "UID": "d8a83c3eeer3werw",
   *    "producedDate": "2020-07-30T14:42:20.182Z"
   * }
   */
  async produceBearing(stub, args){
    console.log('produceBearing() - args: ' + JSON.stringify(args));

    let json = JSON.parse(args);
    json['docType'] = 'bearing';
    let UID = json['UID'];
    let key = 'bearing' + UID;   
    json['owner'] = 'SKF';

    let bearingQuery = await stub.getState(key);
    if(bearingQuery.toString()){
      console.log('This bearing already exists: ' + UID);
      return 'This bearing already exists: ' + UID;
	  }

    let datetime = json['producedDate'];
    if(!datetime)
      json['producedDate'] = new Date().toISOString();
    

    await stub.putState(key, Buffer.from(JSON.stringify(json)))    
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
    console.log('transfer() - args: ' + JSON.stringify(args));

    let json = JSON.parse(args);
    
    let newOwner = json["owner"];
    if(!newOwner || !newOwner.toString())
      throw new Error('transfer() - New owner not supplied as argument: ' + JSON.stringify(args));

    let UID = json["UID"];
    if(!UID || !UID.toString())
      throw new Error('transfer() - UID not supplied as argument: ' + JSON.stringify(args));

    let bearingAsBytes = await stub.getState("bearing" + UID);
    if (!bearingAsBytes.toString() || bearingAsBytes.toString().length <= 0) {
      throw new Error('transfer() - Cannot transfer ownership as the bearing does not exist: ' + json["UID"]);
    }

    let bearing = JSON.parse(bearingAsBytes);
    bearing["owner"] = newOwner;

    await stub.putState("bearing" + UID, Buffer.from(JSON.stringify(bearing)));

    return queryByKey(stub, 'bearing' + UID);
   }

  /**
   * Store associated metadata for a bearing
   * Note: overwrites existing metadata of a bearing!
   * 
   * @param {ChainCodeStub} stub 
   * @param {*} args - JSON string with the format as follows:
   * {
   *    "UID": "d8a83c3eeer3werw",
   *    "metadata": {...}
   * }
   */
   async putBearingMetadata(stub, args){
    console.log('putBearingMetadata() - args: ' + JSON.stringify(args));

    let json = JSON.parse(args);
    json['docType'] = 'metadata';
    let UID = json['UID'];
    let key = 'metadata' + UID;   
    let metadata = json["metadata"];
  
    await stub.putState(key, Buffer.from(JSON.stringify(metadata)))
   }

  /**
   * Get the associated metadata of a bearing
   * 
   * @param {ChainCodeStub} stub 
   * @param {*} args - JSON string with the format as follows:
   * {
   *    "UID": "d8a83c3eeer3werw"
   * }
   */
   async getBearingMetadata(stub, args){
    console.log('getBearingMetadata() - args: ' + JSON.stringify(args));

    let json = JSON.parse(args);
    json['docType'] = 'metadata';
    let UID = json['UID'];
    let key = 'metadata' + UID;   

    let res = await stub.getState(key); 
    if (!res || res.toString().length <= 0)
      throw new Error('getBearingMetadata() key: ' + key + ' does not exist');
    
    return res;
   }

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
    console.log('queryDonor() - args: ' + JSON.stringify(args));

    // args is passed as a JSON string
    let json = JSON.parse(args);
    let key = 'bearing' + json['UID'];
    console.log('queryBearing() key: ' + key);

    return queryByKey(stub, key);
   }

  /**
  * Retrieves all bearings
  * 
  * @param {ChainCodeStub} stub 
  * @param {*} args 
  */
  async queryAllBearings(stub, args) {
    console.log('queryAllBearings() - args: ' + JSON.stringify(args));
 
    let queryString = '{"selector": {"docType": "bearing"}}';
    return queryByString(stub, queryString);
  }git

}

shim.start(new Chaincode());