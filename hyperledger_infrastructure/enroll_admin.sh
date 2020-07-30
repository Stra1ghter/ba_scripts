#!/bin/bash
fabric-ca-client enroll -u https://$USERNAME:$PW@$CASERVICEENDPOINT \
						--tls.certfiles /home/ec2-user/managedblockchain-tls-chain.pem \
						-M /home/ec2-user/admin-msp