export function getUnvisitedNeighbors(node, grid) {
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

export function sortNodesByDistance(unvisitedNodes) {
  // The sorting occurs following an ascending order
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

export function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}
