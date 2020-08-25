# Merkle tree
# Builds a merkle tree out of of json files that have to be in the directory ./data/

from hashlib import sha256
from pathlib import Path

class LeafNode:
    __file_hash_obj = ""

    def __init__(self, file_path):
        with file_path.open("rb") as f:
            b = bytes(f.read())
            print(b)
            b = b.replace(b"\r\n", b"\n") # make the newline character system independent
            print(b)
            self.__file_hash_obj = sha256(b)

    def __str__(self):
        return "LeafNode(" + self.__file_hash_obj.hexdigest() + ")"



class Node:
    def __init__(self, child_node_l, child_node_r):
        pass


class MerkleTree:

    ordered_file_list = []
    leaf_nodes = []

    def __init__(self, data_dir):
        """
        Creates a merkle tree.
        Expects all data to be directly in the data_dir directory next to this code with a ".json" extension.
        """
        data_path = Path(".") / data_dir

        if not data_path.exists():
            raise FileNotFoundError(f"Data directory \"{data_path}\" not found.")

        self.ordered_file_list = [f for f in data_path.iterdir() if f.is_file() and f.suffix == ".json"]
        self.ordered_file_list.sort() # The order of files have to be the same on all systems

        for file_path in self.ordered_file_list:
            self.leaf_nodes.append(LeafNode(file_path))

        for node in self.leaf_nodes:
            print(node)

mt = MerkleTree("data")
