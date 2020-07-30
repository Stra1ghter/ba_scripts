# fabric liest den config path für die yaml datei über FABRIC_CFG_PATH
# da der CLI container einen mount nach home hat:

# aktuell per command aufgerufen
#export FABRIC_CFG_PATH=/home/ec2-user/ba_scripts/hyperledger_infrastructure/simple_channel/

# channel erzeugen
docker exec cli configtxgen \
-outputCreateChannelTx /opt/home/mychannel.pb \
-profile OneOrgChannel -channelID mychannel \
--configPath  /opt/home/ba_scripts/hyperledger_infrastructure/simple_channel