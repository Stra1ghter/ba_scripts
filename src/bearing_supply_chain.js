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
    log("produceBearing() called");
    log("produceBearing args: " + JSON.stringify(args));

    let json = JSON.parse(args);
    json['docType'] = 'bearing';
    let UID = json['UID'];
    let key = 'bearing' + UID;   
    json['owner'] = 'SKF';

    let bearingQuery = await stub.getState(key);
    if(bearingQuery.toString())
      throw new Error('This bearing already exists: ' + UID);

    await stub.putState(key, Buffer.from(JSON.stringify(json)))
    console.log("End produceBearing()")
  }

  async initLedger(stub, args) {
    console.log('============= START : Initialize Ledger ===========');
    console.log('============= END : Initialize Ledger ===========');
  }


  // transfer 

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

}

//module.exports = Chaincode;
shim.start(new Chaincode());
//let c = new Chaincode();
//c.Init();
