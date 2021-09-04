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

function sortNodesByDistance(unvisitedNodes) {
  // The sorting occurs following an ascending order
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
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

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  // Get the neighbour at the left
  if (row > 0) neighbors.push(grid[row - 1][col]);
  // Get the neighbour at the right
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  // Get the neighbour at the bottom
  if (col > 0) neighbors.push(grid[row][col - 1]);
  // Get the neighbour at the top
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  // Return only the neighbours that have not been already visited
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}

// Backtracks from the finishNode to find the shortest path.
// It must be called only AFTER the dijkstra method above.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    // Add the current node and pass to the previous node which is pointed by the current node
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
