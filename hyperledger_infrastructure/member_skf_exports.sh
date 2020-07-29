export MEMBERNAME=SKF
export NETWORKID=n-RPTBIFE6UJGFHKXXVMDS35RG7M
export MEMBERID=m-QXRPGOE44FEURB3374MPCU3ADE

echo todo: export ADMINUSER=
echo todo: export ADMINPWD=

export VpcEndpointServiceName=com.amazonaws.eu-west-1.managedblockchain.n-rptbife6ujgfhkxxvmds35rg7m
export OrderingServiceEndpoint=orderer.n-rptbife6ujgfhkxxvmds35rg7m.managedblockchain.eu-west-1.amazonaws.com:30001
export CaEndpoint=ca.m-qxrpgoe44feurb3374mpcu3ade.n-rptbife6ujgfhkxxvmds35rg7m.managedblockchain.eu-west-1.amazonaws.com:30002

nodeID=$(aws managedblockchain list-nodes --region $REGION --network-id $NETWORKID --member-id $MEMBERID --query 'Nodes[?Status==`AVAILABLE`] | [0].Id' --output text)
peerEndpoint=$(aws managedblockchain get-node --region $REGION --network-id $NETWORKID --member-id $MEMBERID --node-id $nodeID --query 'Node.FrameworkAttributes.Fabric.PeerEndpoint' --output text)
peerEventEndpoint=$(aws managedblockchain get-node --region $REGION --network-id $NETWORKID --member-id $MEMBERID --node-id $nodeID --query 'Node.FrameworkAttributes.Fabric.PeerEventEndpoint' --output text)
export ORDERINGSERVICEENDPOINT=$OrderingServiceEndpoint
export ORDERINGSERVICEENDPOINTNOPORT=${ORDERINGSERVICEENDPOINT::-6}
export VPCENDPOINTSERVICENAME=$VpcEndpointServiceName
export CASERVICEENDPOINT=$CaEndpoint
export PEERNODEID=$nodeID
export PEERSERVICEENDPOINT=$peerEndpoint
export PEERSERVICEENDPOINTNOPORT=${PEERSERVICEENDPOINT::-6}
export PEEREVENTENDPOINT=$peerEventEndpoint

echo Useful information stored in EXPORT variables
echo REGION: $REGION
echo NETWORKNAME: $NETWORKNAME
echo NETWORKVERSION: $NETWORKVERSION
echo ADMINUSER: $ADMINUSER
echo ADMINPWD: $ADMINPWD
echo MEMBERNAME: $MEMBERNAME
echo NETWORKID: $NETWORKID
echo MEMBERID: $MEMBERID
echo ORDERINGSERVICEENDPOINT: $ORDERINGSERVICEENDPOINT
echo ORDERINGSERVICEENDPOINTNOPORT: $ORDERINGSERVICEENDPOINTNOPORT
echo VPCENDPOINTSERVICENAME: $VPCENDPOINTSERVICENAME
echo CASERVICEENDPOINT: $CASERVICEENDPOINT
echo PEERNODEID: $PEERNODEID
echo PEERSERVICEENDPOINT: $PEERSERVICEENDPOINT
echo PEERSERVICEENDPOINTNOPORT: $PEERSERVICEENDPOINTNOPORT
echo PEEREVENTENDPOINT: $PEEREVENTENDPOINT

# Exports to be exported before executing any Fabric 'peer' commands via the CLI
cat << EOF > peer-exports.sh
export MSP_PATH=/opt/home/admin-msp
export MSP=$MEMBERID
export ORDERER=$ORDERINGSERVICEENDPOINT
export PEER=$PEERSERVICEENDPOINT
export CHANNEL=mychannel
export CAFILE=/opt/home/managedblockchain-tls-chain.pem
export CHAINCODENAME=mycc
export CHAINCODEVERSION=v0
export CHAINCODEDIR=github.com/chaincode_example02/go
EOF