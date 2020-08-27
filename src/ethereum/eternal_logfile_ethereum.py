import sys
from mt import MerkleTree
from web3.auto import w3

if not w3.isConnected():
    print("Failed to connect to local Ethereum client, make sure that Geth or Parity is running with http enabled")
    sys.exit()


