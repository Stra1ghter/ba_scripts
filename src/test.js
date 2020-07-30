//const fs = require("fs");
//eval(fs.readFileSync('bearing_supply_chain.js')+''); // '' turns the object to a string


import { Chaincode } from './bearing_supply_chain.js';

const ChaincodeMockStub = require("@theledger/fabric-mock-stub")

const chaincode = new MyChaincode();

describe('Test MyChaincode', () => {
    it("Should init without issues", async () => {
        const mockStub = new ChaincodeMockStub("MyMockStub", chaincode);
        const response = await mockStub.mockInit("tx1", []);
        expect(response.status).to.eql(200)
    });
});