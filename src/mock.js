console.log("test");

function success(){
	console.log("SHIM SUCCESS");
}
exports.success = success;

map = new Map(); 

async function getState(key){
	return map.get(key);
}
exports.getState = getState;

async function putState(key, value){
	map.set(key, value);
}
exports.putState = putState;
