# Description of the project

[Project](https://github.com/EdoardoGruppi/Path_Finding_Visualizer) ~ [Visualization tool](https://edoardogruppi.github.io/Path_Finding_Visualizer/)

This project aims to provide an easy-to-use Graphical User Interface in order to facilitate the visualization of the most widespread pathfinding algorithms. It allows users to change the size of the grid as well as the position of the starting and final nodes. In addition, it is also possible to insert walls and weighted nodes which respectively have a weight of Infinity and 15.

## How to run

The Sorting Algorithms Visualiser tool is available at the following GitHub page:
https://edoardogruppi.github.io/Path_Finding_Visualizer/.

## Algorithms

**Dijkstra:** starts associating a distance equal to 0 with the root node and equal to Infinity with all the other nodes. Then each time a node is visited (the first cell visited is the starting node), it updates the neighbours distance as the sum of the distance of the current node from the beginning and the weight of the node itself. Dijkstra is weighted and does guarantee the shortest path.

**Breadth First Search (BFS):** corresponds to the Dijkstra algorithm when all the nodes are unweighted (or have the same weight, e.g. 1). It does guarantee the shortest path.

**Depth First Search (DFS):** is an implementation of the backtracking algorithm when applied to search a path that connects a starting node with a target node. The changes in the code are few with respect to BFS. Indeed it is only important to use unshift() instead of push and to modify when the node is considered visited. DFS is unweighted and does not guarantee the shortest path.

**Greedy best first search:** works similarly to the Dijkstra. Nevertheless, in this case the distance of a node corresponds to the gap heuristically estimated between it and the target Node. It is weighted and does guarantee the shortest path.

**A star:** operates as the Dijkstra when the heuristic contribute is set to 0. In general, in A\* the distance of a node is computed as the sum of the gap estimated between the node and the target node, the node's weight and the distance between the node and the starting node. It is weighted and guarantees the shortest path whenever the heuristic function is admissible, i.e. it never overestimates the actual cost to reach the objective node.

## Some GIFs

### Setup

![ezgif com-gif-maker](https://user-images.githubusercontent.com/48513387/132551692-5fbcb7e2-ac10-441e-9035-a600f8d040f3.gif)

### Greedy algorithm

![ezgif com-gif-maker (1)](https://user-images.githubusercontent.com/48513387/132551707-b9423f65-f83d-4595-928f-88571e46359d.gif)

### Depth First Search algorithm

Note that, being an unweighted algorithm, DFS does not consider the insertion of weights.

![ezgif com-gif-maker (2)](https://user-images.githubusercontent.com/48513387/132551701-2641c98f-947c-41c8-b4d1-017fba285dfd.gif)

### Dijkstra

![ezgif com-gif-maker (3)](https://user-images.githubusercontent.com/48513387/132551697-96438e8f-ce6e-47bd-b625-fae38871a134.gif)

## Additional notes

<!-- Ideas still to implement: intermediary objectives(restart the algorithm considering all the nodes logically unvisited), create mazes algorithm. -->

The A\* and Greedy functioning strictly depends on the heuristic function chosen. Albeit both of them exploit a function based on the manhattan distance, this is implemented differently into two distinct variants. Obviously the accuracy of the search algorithm is greater as the heuristic function better estimates the distance between a node and the target node.

## References

This work is inspired by an idea of Clement Mihailescu ([webpage](http://www.clementmihailescu.com/)).

The icons exploited for the starting node, the final node and the weighted nodes are taken from the FontAwesome Icon Library ([Official website](https://fontawesome.com/v5.15/icons?d=gallery&p=2&m=free)).
