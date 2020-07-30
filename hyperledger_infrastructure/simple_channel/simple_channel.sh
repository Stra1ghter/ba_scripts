#!/bin/bash
echo Use the commands of this scripts interactively!
exit

# fabric liest den config path für die yaml datei über FABRIC_CFG_PATH
# da der CLI container einen mount nach home hat:


# aktuell per command aufgerufen
#export FABRIC_CFG_PATH=/home/ec2-user/ba_scripts/hyperledger_infrastructure/simple_channel/

# channel config erzeugen
docker exec cli configtxgen \
-outputCreateChannelTx /opt/home/mychannel.pb \
-profile OneOrgChannel -channelID mychannel \
--configPath  /opt/home/ba_scripts/hyperledger_infrastructure/simple_channel


# channel erzeugen
docker exec cli peer channel create -c mychannel \
-f /opt/home/mychannel.pb -o $ORDERER \
--cafile /opt/home/managedblockchain-tls-chain.pem --tls

# tell peer join channel
docker exec cli peer channel join -b mychannel.block \
-o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls

# install code
docker exec cli peer chaincode install \
-n mycc -v v0 -p github.com/chaincode_example02/go

# instantiate
docker exec cli peer chaincode instantiate \
-o $ORDERER -C mychannel -n mycc -v v0 \
-c '{"Args":["init","a","100","b","200"]}' \
--cafile /opt/home/managedblockchain-tls-chain.pem --tls

# list instantiated
docker exec cli peer chaincode list --instantiated \
-o $ORDERER -C mychannel \
--cafile /opt/home/managedblockchain-tls-chain.pem --tls

# query
docker exec cli peer chaincode query -C mychannel \
-n mycc -c '{"Args":["query","a"]}'

# invoke
docker exec cli peer chaincode invoke -C mychannel \
-n mycc -c  '{"Args":["invoke","a","b","10"]}' \
-o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls