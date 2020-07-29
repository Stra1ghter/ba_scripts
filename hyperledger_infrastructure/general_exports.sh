export REGION=eu-west-1
export NETWORKNAME=test-nw
export NETWORKID=n-RPTBIFE6UJGFHKXXVMDS35RG7M
export VPCENDPOINTSERVICENAME=com.amazonaws.eu-west-1.managedblockchain.n-rptbife6ujgfhkxxvmds35rg7m
export VpcEndpointServiceName=com.amazonaws.eu-west-1.managedblockchain.n-rptbife6ujgfhkxxvmds35rg7m
export OrderingServiceEndpoint=orderer.n-rptbife6ujgfhkxxvmds35rg7m.managedblockchain.eu-west-1.amazonaws.com:30001
export ORDERINGSERVICEENDPOINT=$OrderingServiceEndpoint
export ORDERINGSERVICEENDPOINTNOPORT=${ORDERINGSERVICEENDPOINT::-6}

export VpcEndpointServiceName=com.amazonaws.eu-west-1.managedblockchain.n-rptbife6ujgfhkxxvmds35rg7m
export OrderingServiceEndpoint=orderer.n-rptbife6ujgfhkxxvmds35rg7m.managedblockchain.eu-west-1.amazonaws.com:30001
export CaEndpoint=ca.m-qxrpgoe44feurb3374mpcu3ade.n-rptbife6ujgfhkxxvmds35rg7m.managedblockchain.eu-west-1.amazonaws.com:30002
export VPCENDPOINTSERVICENAME=$VpcEndpointServiceName
export CASERVICEENDPOINT=$CaEndpoint

echo Client-node for member SKF: ec2-3-250-171-199.eu-west-1.compute.amazonaws.com
echo ssh ec2-user@ec2-3-250-171-199.eu-west-1.compute.amazonaws.com -i test-nw-keypair.pem 