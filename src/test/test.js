
//import { Chaincode } from './bearing_supply_chain.js';
//const fs = require("fs");
//eval(fs.readFileSync('bearing_supply_chain.js')+''); // '' turns the object to a string
const Chaincode = require('../bearing_supply_chain.js');

const chai = require('chai');
const expect = chai.expect;

// const ChaincodeMockStub = require("@theledger/fabric-mock-stub")
const ChaincodeMockStub = require("@theledger/fabric-mock-stub").ChaincodeMockStub;

const chaincode = new Chaincode();
console.log("chaincode: " + chaincode);

describe('Test MyChaincode', () => {
    it("Should init without issues", async () => {
        const mockStub = new ChaincodeMockStub("MyMockStub", chaincode);
        const response = await mockStub.mockInit("tx1", []);
        expect(response.status).to.eql(200)
    });
});
