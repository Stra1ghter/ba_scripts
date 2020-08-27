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

print("ABIT: " + abi)
