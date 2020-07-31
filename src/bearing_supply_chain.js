/*
#		Prototype of a supply chain application
#		The goal is to have a supply chain blockchain, that tracks products
#		It should also track different kinds of information with the product
#		e.g. shipment date, type
#		
*/
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
async function queryByKey(stub, key){
  log("queryByKey() called");
  log("queryByKey args: " + key);

  let resultAsBytes = await stub.getState(key);
  if(!resultAsBytes || resultAsBytes.toString().length == 0) {
    throw new Error('queryByKey key: ' + key + ' does not exist!');
  }
  log("queryByKey response: " + resultAsBytes);
  log("End queryByKey");
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
    log('Invoke() called');    
    let fap = stub.getFunctionAndParameters();
    log('Invoke args: ' + JSON.stringify(fap));

    let method = this[fab.fcn];
    if (!method) {
      error('Invoke - error: no chaincode function with name: ' + ret.fcn + ' found');
      throw new Error('No chaincode function with name: ' + ret.fcn + ' found');
    }
    try {
      let response = await method(stub, fab.params);
      log('Invoke response: ' + response);
      return shim.success(response);
    } catch (err) {
      console.log('Invoke - error: ' + err);
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
    log("queryBearing() called");
    log("queryBearing args: " + JSON.stringify(args));

    let json = JSON.parse(args);
    let key = 'bearing' + json['UID'];
    log("Query by key: " + key);

    return queryByKey(stub, key);
   }

}

module.exports = Chaincode;
//let c = new Chaincode();
//c.Init();
