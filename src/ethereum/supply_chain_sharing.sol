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

/**
 * Exchange information along a supply chain in return for money.
 */
contract SupplyChainInformationSharepoint is Destructible {
    event addressApproved(address indexed _address, uint256 _ether);
    event informationTraded(address indexed _sender, uint256 _hash);
    
    mapping(address => uint) approvedEther;
    mapping(address => uint256[]) hashes;
    
    function approve(address payable partner, uint _ether) external payable {
        require(tx.origin == msg.sender); // function isn't usable via contract redirection
        require(msg.sender == owner);
        require(address(this).balance + msg.value >= _ether);
        
        approvedEther[partner] = _ether;
        
        emit addressApproved(partner, _ether);
    }
    
    function tradeInformation(uint256 hash) external{
        require(tx.origin == msg.sender);
        
        uint approvedEtherValue = approvedEther[msg.sender];
        require(approvedEtherValue > 0);
        approvedEther[msg.sender] = 0;
        
        hashes[msg.sender].push(hash);
        msg.sender.transfer(approvedEtherValue);
        
        emit informationTraded(msg.sender, hash);
    }
    
    function getApprovedEther(address partner) view external returns (uint _ether) {
        return approvedEther[partner];
    }
    
    function getHashListItem(address partner, uint hashId) view external returns (uint hash) {
        return hashes[partner][hashId];
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