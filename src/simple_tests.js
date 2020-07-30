let CC = class{
	async Invoke(fcn) {
		let method = this[fcn];
		if (!method) {
			console.error('##### Invoke - error: no chaincode function with name: ' + ret.fcn + ' found');
			throw new Error('No chaincode function with name: ' + ret.fcn + ' found');
		}
		
		console.log("calling method " + method.name);
		method();
	}


	async sayHello(){
			log("HELLO WORLD");
	}
}


let log = function(word){
		console.log("[Bearing_supply_chain]: " + word);	
}


let instance = new CC();
instance.Invoke("sayHello");
