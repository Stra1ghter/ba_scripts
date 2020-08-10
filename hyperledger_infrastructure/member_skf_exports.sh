#!/bin/bash
export MEMBERNAME=SKF
export NETWORKID=n-RPTBIFE6UJGFHKXXVMDS35RG7M
export MEMBERID=m-QXRPGOE44FEURB3374MPCU3ADE

if [[ -z "${ADMINUSER}" ]] || [[ -z "${ADMINPWD}" ]]; then
	echo You forgot to export the following environment variables:
	echo todo: export ADMINUSER=
	echo todo: export ADMINPWD=
fi

export MSP=$MEMBERID
export ORDERER=$ORDERINGSERVICEENDPOINT
export PEER=$PEERSERVICEENDPOINT


export nodeID=nd-XSKKRLEQB5DUVEINFQAOGL36YQ
export peerEndpoint=nd-xskkrleqb5duveinfqaogl36yq.m-qxrpgoe44feurb3374mpcu3ade.n-rptbife6ujgfhkxxvmds35rg7m.managedblockchain.eu-west-1.amazonaws.com:30003
export peerEventEndpoint=nd-xskkrleqb5duveinfqaogl36yq.m-qxrpgoe44feurb3374mpcu3ade.n-rptbife6ujgfhkxxvmds35rg7m.managedblockchain.eu-west-1.amazonaws.com:30004
export PEERNODEID=$nodeID
export PEERSERVICEENDPOINT=$peerEndpoint
export PEERSERVICEENDPOINTNOPORT=${PEERSERVICEENDPOINT::-6}
export PEEREVENTENDPOINT=$peerEventEndpoint


export CaEndpoint=ca.m-qxrpgoe44feurb3374mpcu3ade.n-rptbife6ujgfhkxxvmds35rg7m.managedblockchain.eu-west-1.amazonaws.com:30002
export VPCENDPOINTSERVICENAME=com.amazonaws.eu-west-1.managedblockchain.n-rptbife6ujgfhkxxvmds35rg7m
export VpcEndpointServiceName=com.amazonaws.eu-west-1.managedblockchain.n-rptbife6ujgfhkxxvmds35rg7m
export VPCENDPOINTSERVICENAME=$VpcEndpointServiceName
export CASERVICEENDPOINT=$CaEndpoint
export CASERVICEENDPOINTNOPORT=${CaEndpoint::-6}


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