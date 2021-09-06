import { getUnvisitedNeighbors } from "./Utils";

export function breadthFirst(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const queueNodesToVisit = [];
  startNode.isVisited = true;
  queueNodesToVisit.push(startNode);
  // While there are still unvisited nodes
  while (queueNodesToVisit.length) {
    const closestNode = queueNodesToVisit.shift();
    // If it corresponds to a wall, it is skipped
    if (closestNode.isWall) continue;
    // Otherwise the node is traversed by the algorithm
    visitedNodesInOrder.push(closestNode);
    // If the node is the target the objective is accomplished
    if (closestNode === finishNode) return visitedNodesInOrder;
    queueNodesToVisit.push(...updateUnvisitedNeighbors(closestNode, grid));
  }
}

function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    // Link each neighbour to the previous node
    neighbor.previousNode = node;
    neighbor.isVisited = true;
  }
  return unvisitedNeighbors;
}
