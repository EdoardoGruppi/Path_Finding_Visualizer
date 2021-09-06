# Description of the project

Icons from FontAwesome

Dijkstra: start from the root node with distance 0 and all the other nodes with distance infintity. Hence once a node is visited, the first is the starting node, update the neighbours distance as the distance of the current node from the beginning + the weight of the node.

BFS: corresponds to the dijkstra algorithm with all the nodes unweighted (or with the same weight, e.g. 1).

DFS: is an implementation of the backtracking algorithm to search a path that connects the starting node with the target node. The changes in the code are few with respect to BFS. Indeed it is only important to use unshift() instead of push and to modify when the node is considered visited.
