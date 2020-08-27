import sys
import json
from mt import MerkleTree
from web3.auto import w3

if not w3.isConnected():
    print("Failed to connect to local Ethereum client, make sure that Geth or Parity is running with http enabled")
    sys.exit()

mt = MerkleTree("data")
hexdigest = mt.hexdigest()


abi = ""
with open("sc_contract_abi.json", "r") as f:
    abi = json.loads(f.read())

sc_contract = w3.eth.contract(
    address="0x2e115363c04f25b5F04752B846F8CA4E52Fd6c7D",
    abi=abi
)

hash_as_int = int(mt.hexdigest(), 16)
tx_hash = sc_contract.functions.tradeInformation(hash_as_int).transact({'from':"0x4022f0126020C395dc81693e0271114E2667C221"})
tx_receipt = w3.eth.waitForTransactionReceipt(tx_hash)
print("Result: " + tx_receipt) 
