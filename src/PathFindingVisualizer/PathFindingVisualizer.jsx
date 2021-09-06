import React, { Component } from "react";
import Node from "./Node/Node";
import "./PathFindingVisualizer.css";
import { dijkstra, getNodesInShortestPathOrder } from "../Algorithms/Dijkstra";
import "../Design/Button.css";
import "../Design/SelectBox.css";
import "../Design/Slider.css";

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      rows: 20,
      cols: 52,
      speed: 10,
      mouseIsPressed: false,
      startNodeRow: 10,
      startNodeCol: 15,
      finishNodeRow: 10,
      finishNodeCol: 35,
      itemPressed: null,
    };
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.setState({ grid: grid });
  }

  createNode(col, row) {
    // Create a node with the default values
    return {
      col,
      row,
      isStart:
        row === this.state.startNodeRow && col === this.state.startNodeCol,
      isFinish:
        row === this.state.finishNodeRow && col === this.state.finishNodeCol,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  }

  getInitialGrid() {
    const grid = [];
    for (let row = 0; row < this.state.rows; row++) {
      const currentRow = [];
      for (let col = 0; col < this.state.cols; col++) {
        currentRow.push(this.createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  }

  handleMouseDown(row, col) {
    // Function called when the mouse is pressed down
    const node = this.state.grid[row][col];
    let itemPressed = null;
    let newGrid = [];
    if (node.isStart) {
      newGrid = this.moveStartNode(this.state.grid, row, col);
      itemPressed = "startNode";
    } else if (node.isFinish) {
      newGrid = this.moveFinishNode(this.state.grid, row, col);
      itemPressed = "finishNode";
    } else {
      newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    }
    this.setState({
      grid: newGrid,
      mouseIsPressed: true,
      itemPressed: itemPressed,
    });
  }

  handleMouseEnter(row, col) {
    // Change the nodes wall status if the mouse is moved after being pressed down
    if (!this.state.mouseIsPressed) return;
    let newGrid = [];
    if (this.state.itemPressed === "startNode") {
      newGrid = this.moveStartNode(this.state.grid, row, col);
    } else if (this.state.itemPressed === "finishNode") {
      newGrid = this.moveFinishNode(this.state.grid, row, col);
    } else {
      newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    }
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    // Function called when the mouse is pressed up
    this.setState({ mouseIsPressed: false, itemPressed: null });
  }

  moveStartNode(grid, row, col) {
    const { startNodeRow, startNodeCol } = this.state;
    const previousStartNode = grid[startNodeRow][startNodeCol];
    previousStartNode.isStart = false;

    const newStartNode = grid[row][col];
    const newNode = {
      ...newStartNode,
      isStart: true,
    };
    grid[row][col] = newNode;
    this.setState({ startNodeRow: row, startNodeCol: col });
    return grid;
  }

  moveFinishNode(grid, row, col) {
    const { finishNodeRow, finishNodeCol } = this.state;
    const previousFinishNode = grid[finishNodeRow][finishNodeCol];
    previousFinishNode.isFinish = false;

    const newFinishNode = grid[row][col];
    const newNode = {
      ...newFinishNode,
      isFinish: true,
    };
    grid[row][col] = newNode;
    this.setState({ finishNodeRow: row, finishNodeCol: col });
    return grid;
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    // For each visited node
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      // Only if it is the last node start the final animation
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, this.state.speed * i);
        return;
      } else {
        setTimeout(() => {
          const node = visitedNodesInOrder[i];
          let extraClass = "";
          if (node.isStart) extraClass = "start-";
          else if (node.isFinish) extraClass = "finish-";
          document.getElementById(
            `node-${node.row}-${node.col}`
          ).className = `node ${extraClass}node-visited`;
        }, this.state.speed * i);
      }
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    // Animation showing the shortest path
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        let extraClass = "";
        if (node.isStart) extraClass = "start-";
        else if (node.isFinish) extraClass = "finish-";
        document.getElementById(
          `node-${node.row}-${node.col}`
        ).className = `node ${extraClass}node-shortest-path`;
      }, this.state.speed * 5 * i);
    }
  }

  visualizeDijkstra() {
    const { grid, startNodeRow, startNodeCol, finishNodeRow, finishNodeCol } =
      this.state;
    // Set up the starting and final nodes
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
    // Get the visited nodes in order
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    // Get the nodes, belonging to the shortest path and visisted in order
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  clearGrid() {
    const { grid } = this.state;
    for (let row of grid) {
      for (let node of row) {
        resetNode(node);
        const extraClassName = node.isFinish
          ? "node-finish"
          : node.isStart
          ? "node-start"
          : node.isWall
          ? "node-wall"
          : "";
        document.getElementById(
          `node-${node.row}-${node.col}`
        ).className = `node ${extraClassName}`;
      }
    }
  }

  updateGridSize() {
    this.clearGrid();
    const rows = document.getElementById("n_rows").value;
    const cols = rows * 2.6;
    this.setState(
      {
        rows: rows,
        cols: cols,
        startNodeRow: randomIntFromInterval(0, rows - 1),
        startNodeCol: randomIntFromInterval(0, cols / 2),
        finishNodeRow: randomIntFromInterval(0, rows - 1),
        finishNodeCol: randomIntFromInterval(cols / 2 + 1, cols - 1),
      },
      () => {
        const grid = this.getInitialGrid();
        this.setState({ grid: grid });
      }
    );
  }

  render() {
    const { grid, mouseIsPressed } = this.state;
    const side = 65 / this.state.rows;
    // const side = 95 / this.state.cols;

    return (
      <>
        <div style={{ display: "inline-block" }}>
          <span className="rangeValue">ROWS: {this.state.rows}</span>
          <input
            className="range"
            id="n_rows"
            type="range"
            min="6"
            step="2"
            defaultValue="20"
            max="28"
            onChange={() => this.updateGridSize()}
          ></input>
        </div>
        <button
          className="button_slide slide_down"
          id="btn"
          onClick={() => this.clearGrid()}
        >
          CLEAN GRID
        </button>
        <select
          id="select_box"
          className="box slide_down"
          onChange={() => {
            let value = document.getElementById("select_box").value;
            if (value !== "default") this[value]();
          }}
          defaultValue="default"
        >
          <option value="default">ALGORITHM</option>
          <option value="visualizeDijkstra">DIJKSTRA</option>
        </select>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      row={row}
                      col={col}
                      side={side}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

function resetNode(node) {
  node.distance = Infinity;
  node.isVisited = false;
  node.previousNode = null;
  node.isWall = false;
}

const getNewGridWithWallToggled = (grid, row, col) => {
  // Recreate the grid changing the wall prop where needed
  const node = grid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  grid[row][col] = newNode;
  return grid;
};

// Function to generate random numbers from min to max, both inclusive
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Size with sliders. Change only rows and il rapporto rimane questo (quindi anche le colonne si rimettono noramli)
