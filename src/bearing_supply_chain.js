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


let Chaincode = class {

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

    let method = this[fap.fcn];
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
}
