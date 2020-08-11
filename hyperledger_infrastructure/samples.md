## install chaincode example:

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" -e "CORE_PEER_ADDRESS=$PEER" cli peer chaincode install -n bearing_supply_chain -l node -v v1.0.20 -p /opt/home/ba_scripts/src/package/

docker exec cli peer chaincode install -n bearing_supply_chain -l node -v v1.0.19 -p /opt/home/ba_scripts/src/package/


## instantiate chaincode example:

docker exec cli peer chaincode instantiate -o $ORDERER -C mychannel -n bearing_supply_chain -v v1.0.7 -c 
'{"Args":["init"]}' --cafile /opt/home/managedblockchain-tls-chain.pem --tls

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" cli peer chaincode instantiate -o $ORDERER -C secondchannel -n bearing_supply_chain -l node -v v1.0.19 -c '{"Args":["init"]}' --cafile /opt/home/managedblockchain-tls-chain.pem --tls -P "AND ('m-QXRPGOE44FEURB3374MPCU3ADE.member','m-X7LNL2K26BDULAZEIQ2N4NGJRM.member')"


### sonstiges
docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" -e "CORE_PEER_ADDRESS=$PEER" cli peer channel join -b /opt/home/secondchannel.block -o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" -e "CORE_PEER_ADDRESS=$PEER" cli peer channel join -b /opt/home/secondchannel.block -o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls

## upgrade

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem"  -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" -e "CORE_PEER_ADDRESS=$PEER" cli peer chaincode upgrade -n bearing_supply_chain -v v1.0.20 -c '{"Args":[""]}' -p /opt/home/ba_scripts/src/package/ -C mychannel -o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls
 
docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem"  -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" -e "CORE_PEER_ADDRESS=$PEER" cli peer chaincode upgrade -n ngo -v v1.1 -c '{"Args":[""]}' -p /opt/home/non-profit-blockchain/ngo-chaincode/src/ -C mychannel -o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls

## list instantiated chaincode

docker exec cli peer chaincode list --instantiated -o $ORDERER -C mychannel --cafile /opt/home/managedblockchain-tls-chain.pem --tls


## query all bearings

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" cli peer chaincode query -C mychannel -n bearing_supply_chain -c '{"Args":["queryAllBearings"]}'


## query bearing

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" cli peer chaincode query -C mychannel -n bearing_supply_chain -c '{"Args":["queryBearing","{\"UID\": \"d8a83c3eeer3werw\"}"]}'

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" cli peer chaincode query -C mychannel -n bearing_supply_chain -c '{"Args":["queryBearing","{\"UID\": \"e7c1ac3eeer4werw\"}"]}'
 

## invoke

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" cli peer chaincode invoke -C mychannel -n bearing_supply_chain -c  '{"Args":["produceBearing","{\"UID\": \"d8a83c3eeer3werw\", \"producedDate\": \"2020-07-30T14:42:20.182Z\"}"]}' -o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" cli peer chaincode invoke -C mychannel -n bearing_supply_chain -c  '{"Args":["produceBearing","{\"UID\": \"d8a83c3eeer3aaa\"}"]}' -o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" cli peer chaincode invoke -C mychannel -n bearing_supply_chain -c  '{"Args":["produceBearing","{\"UID\": \"e7c1ac3eeer4werw\", \"producedDate\": \"2020-08-11T10:42:20.182Z\"}"]}' -o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls


### change_ownership

docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" cli peer chaincode invoke -C mychannel -n bearing_supply_chain -c  '{"Args":["transfer","{\"UID\": \"d8a83c3eeer3werw\", \"owner\": \"test\"}"]}' -o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls


docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" cli peer chaincode invoke -C mychannel -n bearing_supply_chain -c  '{"Args":["transfer","{\"UID\": \"e7c1ac3eeer4werw\", \"owner\": \"test\"}"]}' -o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls


## get metadata
docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" cli peer chaincode query -C mychannel -n bearing_supply_chain -c  '{"Args":["getBearingMetadata","{\"UID\": \"d8a83c3eeer3werw\"}"]}' -o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls


## put
docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" cli peer chaincode invoke -C mychannel -n bearing_supply_chain -c  '{"Args":["putBearingMetadata","{\"UID\": \"d8a83c3eeer3werw\", \"metadata\": {\"productionPlant\":\"Schweinfurt\",\"OR_diameter_m\":10} }"]}' -o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls