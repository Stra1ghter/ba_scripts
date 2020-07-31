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
 cli peer chaincode install -n bearing_supply_chain -l node -v v0 -p /opt/home/ba_scripts/src/


echo
echo instantiate chaincode example:
echo docker exec cli peer chaincode instantiate \
-o $ORDERER -C mychannel -n bearing_supply_chain -v v0 \
-c \'{\"Args\":[\"init\"]}\' \
--cafile /opt/home/managedblockchain-tls-chain.pem --tls