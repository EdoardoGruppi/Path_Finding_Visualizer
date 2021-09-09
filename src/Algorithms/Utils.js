export function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  // Get the neighbour at the right
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  // Get the neighbour at the top
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  // Get the neighbour at the bottom
  if (col > 0) neighbors.push(grid[row][col - 1]);
  // Get the neighbour at the left
  if (row > 0) neighbors.push(grid[row - 1][col]);
  // Return only the neighbours that have not been already visited
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

// Backtracks from the finishNode to find the shortest path.
// It must be called only AFTER the pathfinding algorithm.
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

export function sortNodesByDistanceToEnd(unvisitedNodes) {
  // The sorting occurs following an ascending order
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.heuristic - nodeB.heuristic);
}

export function sortNodesByTotalDistance(unvisitedNodes) {
  // The sorting occurs following an ascending order
  unvisitedNodes.sort(
    (nodeA, nodeB) =>
      nodeA.heuristic + nodeA.distance - (nodeB.heuristic + nodeB.distance)
  );
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

export function heuristic(nodeA, nodeB) {
  // Heursitic function computed with the manhattan distance
  return manhattanDistance(nodeA, nodeB);
}

function manhattanDistance(nodeA, nodeB) {
  return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

export function weightedHeuristic(grid, nodeA, nodeB) {
  // Heursitic function computed with a weighted version of the manhattan distance
  return weightedManhattanDistance(grid, nodeA, nodeB);
}

function weightedManhattanDistance(grid, nodeA, nodeB) {
  // To get the weighted manhattan distance, this function considers two distinct paths.
  // The first pass through x1 to x2 and then from y1 to y2. The second viceversa.
  const additionalXChange = sumHorizontalWeights(
    grid,
    nodeA.row,
    nodeA.col,
    nodeB.col
  );
  const otherXChange = sumHorizontalWeights(
    grid,
    nodeB.row,
    nodeA.col,
    nodeB.col
  );
  const additionalYChange = sumVerticalWeights(
    grid,
    nodeB.col,
    nodeA.row,
    nodeB.row
  );
  const otherYChange = sumVerticalWeights(
    grid,
    nodeA.col,
    nodeA.row,
    nodeB.row
  );
  const additionalChange = additionalXChange + additionalYChange;
  const otherChange = otherXChange + otherYChange;
  // Compare the two paths to return the one that is shortest
  if (additionalChange < otherChange) return additionalChange;
  else return otherChange;
}

function sumHorizontalWeights(grid, row, col1, col2) {
  let sum = 0;
  // Swap y1 and y2 if y1 > y2
  if (col1 > col2) [col1, col2] = [col2, col1];
  // Sum all the weights of the nodes in the path
  for (let currentCol = col1; currentCol <= col2; currentCol++) {
    const currentNode = grid[row][currentCol];
    sum += currentNode.weight;
  }
  return sum;
}

function sumVerticalWeights(grid, col, row1, row2) {
  let sum = 0;
  // Swap x1 and x2 if x1 > x2. The '+1' and '-1' below are inserted to avoid
  // considering twice the same node in the corner.
  if (row1 > row2) [row1, row2] = [row2 + 1, row1];
  else row2 = row2 - 1;
  for (let currentRow = row1; currentRow <= row2; currentRow++) {
    const currentNode = grid[currentRow][col];
    sum += currentNode.weight;
  }
  return sum;
}
