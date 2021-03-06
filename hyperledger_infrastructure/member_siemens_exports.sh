#!/bin/bash
export MEMBERNAME=Siemens
export NETWORKID=n-RPTBIFE6UJGFHKXXVMDS35RG7M
export MEMBERID=m-X7LNL2K26BDULAZEIQ2N4NGJRM

if [[ -z "${ADMINUSER}" ]] || [[ -z "${ADMINPWD}" ]]; then
	echo You forgot to export the following environment variables:
	echo todo: export ADMINUSER=
	echo todo: export ADMINPWD=
fi

export MSP=$MEMBERID
export ORDERER=$ORDERINGSERVICEENDPOINT
export PEER=$PEERSERVICEENDPOINT


export nodeID=nd-7N3R2LZGIBBMDCBKG6E2LKRFVQ
export peerEndpoint=nd-7n3r2lzgibbmdcbkg6e2lkrfvq.m-x7lnl2k26bdulazeiq2n4ngjrm.n-rptbife6ujgfhkxxvmds35rg7m.managedblockchain.eu-west-1.amazonaws.com:30006
export peerEventEndpoint=nd-7n3r2lzgibbmdcbkg6e2lkrfvq.m-x7lnl2k26bdulazeiq2n4ngjrm.n-rptbife6ujgfhkxxvmds35rg7m.managedblockchain.eu-west-1.amazonaws.com:30007
export PEERNODEID=$nodeID
export PEERSERVICEENDPOINT=$peerEndpoint
export PEERSERVICEENDPOINTNOPORT=${PEERSERVICEENDPOINT::-6}
export PEEREVENTENDPOINT=$peerEventEndpoint


export CaEndpoint=ca.m-x7lnl2k26bdulazeiq2n4ngjrm.n-rptbife6ujgfhkxxvmds35rg7m.managedblockchain.eu-west-1.amazonaws.com:30005
export VPCENDPOINTSERVICENAME=com.amazonaws.eu-west-1.managedblockchain.n-rptbife6ujgfhkxxvmds35rg7m
export VpcEndpointServiceName=com.amazonaws.eu-west-1.managedblockchain.n-rptbife6ujgfhkxxvmds35rg7m
export VPCENDPOINTSERVICENAME=$VpcEndpointServiceName
export CASERVICEENDPOINT=$CaEndpoint
export CASERVICEENDPOINTNOPORT=${CaEndpoint::-6}

export MSP_PATH=/opt/home/admin-msp
export MSP=$MEMBERID
export ORDERER=$ORDERINGSERVICEENDPOINT
export PEER=$PEERSERVICEENDPOINT
export CAFILE=/opt/home/managedblockchain-tls-chain.pem

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