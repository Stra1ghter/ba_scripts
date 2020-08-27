# Merkle tree
# Builds a merkle tree out of of json files that have to be in the directory ./data/

from hashlib import sha256
from pathlib import Path

class LeafNode:
    __file_hash_obj = ""
    __merge_into = None

    def __init__(self, file_path):
        with file_path.open("rb") as f:
            b = bytes(f.read())
            b = b.replace(b"\r\n", b"\n") # make the newline character system independent to \n
            self.__file_hash_obj = sha256(b)
            assert len(self.__file_hash_obj.hexdigest()) == 64 # 64 hex chars == 256 bit

    def __str__(self):
        return "LeafNode(" + self.__file_hash_obj.hexdigest() + ")"
    def __repr__(self):
        return "LeafNode(" + self.__file_hash_obj.hexdigest() + ")"

    def digest(self):
        return self.__file_hash_obj.digest()

    def hexdigest(self):
        return self.__file_hash_obj.hexdigest()

class Node:
    __layer = 0
    __hash_obj = ""

    def __init__(self, left_child, right_child):
        if not right_child:
            self.__hash_obj = sha256(left_child.digest())
        else:
            self.__hash_obj = sha256(left_child.digest() + right_child.digest())

    def __str__(self):
        return "Node(" + self.__hash_obj.hexdigest() + ")"
    def __repr__(self):
        return "Node(" + self.__hash_obj.hexdigest() + ")"

    def digest(self):
        return self.__hash_obj.digest()

    def hexdigest(self):
        return self.__hash_obj.hexdigest()


class MerkleTree:

    __leaf_nodes = []
    __merkle_root_node = None

    def __init__(self, data_dir):
        """
        Creates a merkle tree.
        Expects all data to be directly in the data_dir directory next to this code with a ".json" extension.
        """
        data_path = Path(".") / data_dir

        if not data_path.exists():
            raise FileNotFoundError(f"Data directory \"{data_path}\" not found.")
        print("Found data directory containing JSON files")

        self.ordered_file_list = [f for f in data_path.iterdir() if f.is_file() and f.suffix == ".json"]
        self.ordered_file_list.sort() # The order of files have to be the same on all systems

        for file_path in self.ordered_file_list:
            self.__leaf_nodes.append(LeafNode(file_path))

        self.__build_tree(),

    def __build_tree(self):
        """
        Builds a Merkle tree over the leaf node list.
        """
        
        print("Building Merkle tree ...")
        print()

        current_layer = self.__leaf_nodes
        next_layer = []

        left = None
        while len(current_layer) != 1:
            print("Layer:" + str(current_layer))
            for i, node in enumerate(current_layer):
                if i % 2 == 0:
                    if i == len(current_layer) - 1:
                        next_layer.append(Node(node, None)) # at the last index, there may only be a left node to build the next node level
                    left = node
                else:
                    next_layer.append(Node(left, node))

            current_layer = next_layer
            next_layer = []

        self.__merkle_root_node = current_layer[0]
        print("Last Layer:" + str(current_layer))
        print()

    def digest(self):
        return self.__merkle_root_node.digest()


if __name__ == "__main__":
    mt = MerkleTree("data")
