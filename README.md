# Description of the project

Icons from FontAwesome

Dijkstra: start from the root node with distance 0 and all the other nodes with distance infintity. Hence once a node is visited, the first is the starting node, update the neighbours distance as the distance of the current node from the beginning + the weight of the node. It is weighted and does guarantee the shortest path.

BFS: corresponds to the dijkstra algorithm with all the nodes unweighted (or with the same weight, e.g. 1). It does guarantee the shortest path.

DFS: is an implementation of the backtracking algorithm to search a path that connects the starting node with the target node. The changes in the code are few with respect to BFS. Indeed it is only important to use unshift() instead of push and to modify when the node is considered visited. It is unweighted and does not guarantee the shortest path.

<!-- Swarm algorithm:

Convergent Swarm algorithm:

Bidirectional Swarm algorithm: -->

Greedy best first search: works similarly to the dijkstra but the distance corresponds to the distance estimated between the nodes and the target Node. It is weighted and does guarantee the shortest path.

A star: works similarly to the dijkstra but the distance is computed as the sum of the distance estimated between the node and the target node, the node's weight and the distance between the node and the starting node. It is weighted and does guarantee the shortest path.

## Ideas

Ideas still to implement: weihgts (correct dijkstra code and add weight field), intermediary objectives(restart the algorithm considering all the nodes logically unvisited), create mazes algorithm, add intro or algorithm descirptions.

HEURISTIC CONSIDERING WEIGHTED MANHATTAN Distance FOR GREEDY AND A STAR
