export MSP_PATH=/opt/home/admin-msp
export MSP=$MEMBERID
export ORDERER=$ORDERINGSERVICEENDPOINT
export PEER=$PEERSERVICEENDPOINT
export CHANNEL=mychannel
export CAFILE=/opt/home/managedblockchain-tls-chain.pem
export CHAINCODENAME=mycc
export CHAINCODEVERSION=v0
export CHAINCODEDIR=github.com/chaincode_example02/go



echo
echo install chaincode example:
echo docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \
 -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" -e "CORE_PEER_ADDRESS=$PEER"  \
 cli peer chaincode install -n bearing_supply_chain -l node -v v1.0.1 -p /opt/home/ba_scripts/src/package/


echo
echo instantiate chaincode example:
echo docker exec cli peer chaincode instantiate \
-o $ORDERER -C mychannel -n bearing_supply_chain -v v1.0.1 \
-c \'{\"Args\":[\"init\"]}\' \
--cafile /opt/home/managedblockchain-tls-chain.pem --tls


echo 
echo upgradate chaincode
echo peer chaincode upgrade -n bearing_supply_chain -v 1.0.3 \
               -c \'{\"Args\":[\"\"]}\' \
               -p /opt/home/ba_scripts/src/package/ -C mychannel \
               -o $ORDERER


echo 
echo not ready
echo docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" \
    -e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" \
    cli peer chaincode invoke -C mychannel -n bearing_supply_chain \
    -c  '{"Args":["produceBearing","{\"UID\": \"d8a83c3eeer3werw\", \"producedDate\": \"2020-07-30T14:42:20.182Z\"}"]}' \
    -o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls