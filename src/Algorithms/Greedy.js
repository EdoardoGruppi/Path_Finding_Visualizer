import {
  getUnvisitedNeighbors,
  weightedHeuristic,
  getAllNodes,
  sortNodesByDistanceToEnd,
} from "./Utils";

export function greedy(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  // Except for the starting node the distance == Infinity
  startNode.heuristic = 0;
  // At the beginning all the nodes are unvisited
  const unvisitedNodes = getAllNodes(grid);
  // While there are still unvisited nodes
  while (unvisitedNodes.length) {
    // Sort nodes by distance
    sortNodesByDistanceToEnd(unvisitedNodes);
    // Take from the array the first element, i.e. the nearest
    const closestNode = unvisitedNodes.shift();
    // If it corresponds to a wall, it is skipped
    if (closestNode.isWall) continue;
    // If the closest node is at a distance of infinity, the game is trapped and must be stopped
    if (closestNode.heuristic === Infinity) return visitedNodesInOrder;
    // Otherwise the node is traversed by the algorithm
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    // If the node is the target the objective is accomplished
    if (closestNode === finishNode) return visitedNodesInOrder;
    // Update distances
    updateUnvisitedNeighbors(closestNode, grid, finishNode);
  }
}

function updateUnvisitedNeighbors(node, grid, finishNode) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    // The heuristic here used to compute the distance from the current node to the end is formulated
    // as the sum between the weighted manhattan distance and the node weight.
    const distanceToEnd =
      neighbor.weight + weightedHeuristic(grid, neighbor, finishNode);
    if (neighbor.heuristic > distanceToEnd) neighbor.heuristic = distanceToEnd;
    // Link each neighbour to the previous node
    neighbor.previousNode = node;
  }
}
