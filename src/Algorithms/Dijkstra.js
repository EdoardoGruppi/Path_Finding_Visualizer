import {
  getUnvisitedNeighbors,
  getAllNodes,
  sortNodesByDistance,
} from "./Utils";

export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  // Except for the starting node the distance == Infinity
  startNode.distance = 0;
  // At the beginning all the nodes are unvisited
  const unvisitedNodes = getAllNodes(grid);
  // While there are still unvisited nodes
  while (unvisitedNodes.length) {
    // Sort nodes by distance
    sortNodesByDistance(unvisitedNodes);
    // Take from the array the first element, i.e. the nearest
    const closestNode = unvisitedNodes.shift();
    // If it corresponds to a wall, it is skipped
    if (closestNode.isWall) continue;
    // If the closest node is at a distance of infinity, the game is trapped and must be stopped
    if (closestNode.distance === Infinity) return visitedNodesInOrder;
    // Otherwise the node is traversed by the algorithm
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    // If the node is the target the objective is accomplished
    if (closestNode === finishNode) return visitedNodesInOrder;
    // Update distances
    updateUnvisitedNeighbors(closestNode, grid);
  }
}

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    // The distance of the neighbours is equal to that of the node plus one
    // So far, the algorithm version does not involve weights
    neighbor.distance = node.distance + 1;
    // Link each neighbour to the previous node
    neighbor.previousNode = node;
  }
}
