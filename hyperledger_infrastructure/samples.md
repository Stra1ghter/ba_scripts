# Bearing supply chain command examples 
These examples should help use the bearing supply chain chaincode on AWS Managed Blockchain.
The examples use the real endpoints used for the examination in the thesis, make sure to use the endpoints of a live system before using the code.

To use the commands, make sure that the client has a docker container running with the Hyperledger Fabric CLI as described in the [AWS documentation](https://docs.aws.amazon.com/managed-blockchain/latest/managementguide/get-started-create-client.html).


## Enviroment variables
The Hyperledger Fabric binaries like ```peer``` or ```configtxgen``` expect a number of enviroment variables to work correctly. Make sure to the change the used values to the correct paths and URLs for your system.

The general environment variables can be exported as follows.
```
export REGION=eu-west-1
export NETWORKNAME=test-nw
export NETWORKID=n-RPTBIFE6UJGFHKXXVMDS35RG7M

export OrderingServiceEndpoint=orderer.n-rptbife6ujgfhkxxvmds35rg7m.managedblockchain.eu-west-1.amazonaws.com:30001
export ORDERINGSERVICEENDPOINT=$OrderingServiceEndpoint
export ORDERINGSERVICEENDPOINTNOPORT=${ORDERINGSERVICEENDPOINT::-6}
export ORDERER=$OrderingServiceEndpoint

export VPCENDPOINTSERVICENAME=com.amazonaws.eu-west-1.managedblockchain.n-rptbife6ujgfhkxxvmds35rg7m
export VpcEndpointServiceName=$VPCENDPOINTSERVICENAME
export VPCENDPOINTSERVICENAME=$VpcEndpointServiceName
```

The peer specific variables can be exported as follows.
```
export MEMBERNAME=SKF
export MEMBERID=m-QXRPGOE44FEURB3374MPCU3ADE
export MSP=$MEMBERID

export nodeID=nd-XSKKRLEQB5DUVEINFQAOGL36YQ
export peerEndpoint=nd-xskkrleqb5duveinfqaogl36yq.m-qxrpgoe44feurb3374mpcu3ade.n-rptbife6ujgfhkxxvmds35rg7m.managedblockchain.eu-west-1.amazonaws.com:30003
export peerEventEndpoint=nd-xskkrleqb5duveinfqaogl36yq.m-qxrpgoe44feurb3374mpcu3ade.n-rptbife6ujgfhkxxvmds35rg7m.managedblockchain.eu-west-1.amazonaws.com:30004
export PEERNODEID=$nodeID
export PEERSERVICEENDPOINT=$peerEndpoint
export PEERSERVICEENDPOINTNOPORT=${PEERSERVICEENDPOINT::-6}
export PEEREVENTENDPOINT=$peerEventEndpoint
export PEER=$PEERSERVICEENDPOINT

export CaEndpoint=ca.m-qxrpgoe44feurb3374mpcu3ade.n-rptbife6ujgfhkxxvmds35rg7m.managedblockchain.eu-west-1.amazonaws.com:30002
export CASERVICEENDPOINT=$CaEndpoint
export CASERVICEENDPOINTNOPORT=${CaEndpoint::-6}

export MSP_PATH=/opt/home/admin-msp
export CAFILE=/opt/home/managedblockchain-tls-chain.pem
```

## Single member network
This example uses only a simple network for testing purposes.
The commands expect a peer, an orderer and an enrolled user in the CA with keys and ceritificates in the MSP directory.

### Install chaincode
Install chaincode on a peer.

```docker exec cli peer chaincode install -n bearing_supply_chain -l node -v v1.0.28 -p /opt/home/ba_scripts/src/package/```


### Instantiate chaincode
Instantiate the chaincode on a channel (needed only once).

```docker exec cli peer chaincode instantiate -o $ORDERER -C mychannel -n bearing_supply_chain -v v1.0.21 -c '{"Args":["init"]}' --cafile /opt/home/managedblockchain-tls-chain.pem --tls```


### Upgrade chaincode 
Upgrade the chaincode of peers.

```docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem"  -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" -e "CORE_PEER_ADDRESS=$PEER" cli peer chaincode upgrade -n bearing_supply_chain -v v1.0.28 -c '{"Args":[""]}' -p /opt/home/ba_scripts/src/package/ -C mychannel -o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls```


### List active chaincode versions of peer
List the active chaincodes on a peer.

```docker exec cli peer chaincode list --instantiated -o $ORDERER -C mychannel --cafile /opt/home/managedblockchain-tls-chain.pem --tls```


### Query all bearings
Query for all produced bearings stored in the chain.

```docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" cli peer chaincode query -C mychannel -n bearing_supply_chain -c '{"Args":["queryAllBearings"]}'```


### Query a single bearing
Query for a single bearing stored in the chain.


```docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" cli peer chaincode query -C mychannel -n bearing_supply_chain -c '{"Args":["queryBearing","{\"UID\": \"d8a83c3eeer3werw\"}"]}'```


### Produce a bearing
Produce a single bearing through using the ```produceBearing``` chaincode function.

```docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" cli peer chaincode invoke -C mychannel -n bearing_supply_chain -c  '{"Args":["produceBearing","{\"UID\": \"d8a83c3eeer3werw\", \"producedDate\": \"2020-07-30T14:42:20.182Z\"}"]}' -o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls```


### Change ownership of a bearing
Change the ownership of a produced bearing via the ```transfer``` chaincode function .

```docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" cli peer chaincode invoke -C mychannel -n bearing_supply_chain -c  '{"Args":["transfer","{\"UID\": \"d8a83c3eeer3werw\", \"owner\": \"test\"}"]}' -o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls```


### Get metadata of a bearing
Get the metadata of a bearing via the ```getBearingMetadata``` chaincode function.

```docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" cli peer chaincode query -C mychannel -n bearing_supply_chain -c  '{"Args":["getBearingMetadata","{\"UID\": \"d8a83c3eeer3werw\"}"]}' -o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls```


### Put metadata of a bearing
Put metadata for a bearing via the ```putBearingMetadata``` chaincode function.

```docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" cli peer chaincode invoke -C mychannel -n bearing_supply_chain -c  '{"Args":["putBearingMetadata","{\"UID\": \"d8a83c3eeer3werw\", \"metadata\": {\"productionPlant\":\"Schweinfurt\",\"OR_diameter_m\":10} }"]}' -o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls```



## Multiple member network
This example uses multiple members.
The commands expect multiple peers, an orderer and an enrolled user in the CA with keys and ceritificates in the MSP directory for each organisation.

### Create .pb file
In order to use this, make sure that:  

* the client nodes are ready.
* the client nodes have a connectivity to their peer nodes.
* a valid configtx.yaml is present in the path. 

```docker exec cli configtxgen -outputCreateChannelTx /opt/home/thirdchannel.pb -profile TwoOrgChannel -channelID thirdchannel --configPath /opt/home/```

### Create the channel
Create the channel on one client.

```docker exec cli peer channel create -c thirdchannel -f /opt/home/thirdchannel.pb -o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls```

### Get genesis block
All participants need to have the genesis block of the channel (.block file).

```docker exec cli peer channel fetch oldest /opt/home/thirdchannel.block -c thirdchannel -o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls```

### Join peer nodes to channel
Join the channel with each peer.

```docker exec cli peer channel join -b /opt/home/thirdchannel.block -o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls```

### Install the chaincode
Install the chaincode on each peer.

```docker exec cli peer chaincode install -n bearing_supply_chain -l node -v v1.0.29 -p /opt/home/ba_scripts/src/package/```

### Instantiate chaincode
Instantiate the chaincode for with the first organisation.
The ```-P```-argument specifies the endorsement policy.

```docker exec cli peer chaincode instantiate -o $ORDERER -C thirdchannel -n bearing_supply_chain -v v1.0.29 -c '{"Args":["init"]}' --cafile /opt/home/managedblockchain-tls-chain.pem --tls -P "AND ('m-QXRPGOE44FEURB3374MPCU3ADE.member','m-X7LNL2K26BDULAZEIQ2N4NGJRM.member')"```

### Query bearings
Query all active bearings in the chain.

```docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" cli peer chaincode query -C thirdchannel -n bearing_supply_chain -c '{"Args":["queryAllBearings"]}'```

### Produce a bearing
Make sure to send the transaction to enough peers so that the endorsement policy is satisfied.

```docker exec -e "CORE_PEER_TLS_ENABLED=true" -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/home/managedblockchain-tls-chain.pem" -e "CORE_PEER_ADDRESS=$PEER" -e "CORE_PEER_LOCALMSPID=$MSP" -e "CORE_PEER_MSPCONFIGPATH=$MSP_PATH" cli peer chaincode invoke -C thirdchannel -n bearing_supply_chain -c  '{"Args":["produceBearing","{\"UID\": \"d8a83c3eeer3werw\", \"producedDate\": \"2020-07-30T14:42:20.182Z\"}"]}' --peerAddresses nd-xskkrleqb5duveinfqaogl36yq.m-qxrpgoe44feurb3374mpcu3ade.n-rptbife6ujgfhkxxvmds35rg7m.managedblockchain.eu-west-1.amazonaws.com:30003 --tlsRootCertFiles /opt/home/managedblockchain-tls-chain.pem --peerAddresses nd-7n3r2lzgibbmdcbkg6e2lkrfvq.m-x7lnl2k26bdulazeiq2n4ngjrm.n-rptbife6ujgfhkxxvmds35rg7m.managedblockchain.eu-west-1.amazonaws.com:30006 --tlsRootCertFiles /opt/home/managedblockchain-tls-chain.pem \ -o $ORDERER --cafile /opt/home/managedblockchain-tls-chain.pem --tls```