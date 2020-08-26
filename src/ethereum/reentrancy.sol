function tradeInformation(uint256 hash) external{
    // the function is only usable directly (no middle contracts allowed)
    require(tx.origin == msg.sender);

    hashList[msg.sender].push(hash);

    msg.sender.transfer(approvedEther[msg.sender]);
    approvedEther[msg.sender] = 0;

    emit informationTraded(msg.sender, hash);
}    