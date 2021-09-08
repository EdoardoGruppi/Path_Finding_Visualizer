import {
  getUnvisitedNeighbors,
  weightedHeuristic,
  getAllNodes,
  sortNodesByTotalDistance,
} from "./Utils";

export function aStar(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  // Except for the starting node the distance == Infinity
  startNode.distance = 0;
  startNode.heuristic = weightedHeuristic(grid, startNode, finishNode);
  // At the beginning all the nodes are unvisited
  const unvisitedNodes = getAllNodes(grid);
  // While there are still unvisited nodes
  while (unvisitedNodes.length) {
    // Sort nodes by distance
    sortNodesByTotalDistance(unvisitedNodes);
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
    updateUnvisitedNeighbors(closestNode, grid, finishNode);
  }
}

function updateUnvisitedNeighbors(node, grid, finishNode) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    const distance = node.distance + neighbor.weight;
    if (neighbor.distance > distance) neighbor.distance = distance;
    neighbor.heuristic = 1.5 * weightedHeuristic(grid, neighbor, finishNode);
    // Link each neighbour to the previous node
    neighbor.previousNode = node;
  }
}
