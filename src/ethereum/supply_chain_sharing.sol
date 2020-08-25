//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract Owned {
    constructor() { owner = msg.sender; }
    address payable owner;
}

contract Destructible is Owned {
    function destroy() virtual external {
        if (msg.sender == owner) selfdestruct(owner);
    }
}


////////////// TODO: events und views

/**
 * Exchange information along a supply chain in return for money.
 */
contract SupplyChainInformationSharepoint is Destructible {
    // the ether that an account is able to withdraw
    mapping(address => uint) approvedEther;
    mapping(address => uint256[]) hashList;
    
    constructor() {}
    
    function approve(address payable partner, uint value) external payable {
        require(msg.sender == owner);
        require(address(this).balance + msg.value >= value);
        
        approvedEther[partner] = value;   
    }
    
    function tradeInformation(uint256 hash) external{
        // the function is only usable directly (no middle contracts allowed)
        require(tx.origin == msg.sender);
        
        hashList[msg.sender].push(hash);
        msg.sender.transfer(approvedEther[msg.sender]);
    }
    
    receive() external payable {}
    
}

/**
 * Stores hashes for eternity
 */
contract EternityHashstore is Owned {
    event hashStored(address indexed _from, uint256 _hash);
    
    uint256[] hashList;
    uint256[] timestamps;
    
    function storeHash(uint256 hash) external {
        require(msg.sender == owner);
        
        hashList.push(hash);
        timestamps.push(block.timestamp);
        
        emit hashStored(msg.sender, hash);
    }
    
    function getHashList(uint32 id) view external returns (uint256 hash) {
        return hashList[id];
    }
    
    function getHashBlocktime(uint32 id) view external returns (uint256 timestamp) {
        return timestamps[id];
    }
    
    function getHashListLength() view external returns (uint size) {
        return hashList.length;
    }
}