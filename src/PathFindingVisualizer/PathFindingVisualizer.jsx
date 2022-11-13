import { useState, useEffect, useRef } from "react";
import Node from "./Node/Node";
import "./PathFindingVisualizer.css";
import { dijkstra } from "../Algorithms/Dijkstra";
import { breadthFirst } from "../Algorithms/BreadthFirst";
import { depthFirst } from "../Algorithms/DepthFirst";
import { greedy } from "../Algorithms/Greedy";
import { aStar } from "../Algorithms/AStar";
import { getNodesInShortestPathOrder } from "../Algorithms/Utils";

export default function PathFindingVisualizer() {
    const [rows, setRows] = useState(10);
    const [cols, setCols] = useState(Math.round((0.8*window.innerWidth)/50));
    const [speed, setSpeed] = useState(10);
    const [grid, setGrid] = useState([]);
    // Element that follows the mouse events
    const [mouseIsPressed, setMouseIsPressed] = useState(false);
    // Rows and Cols of the starting and final node
    const [startNodeRow, setStartNodeRow] = useState(randomIntFromInterval(0, rows - 1));
    const [startNodeCol, setStartNodeCol] = useState(randomIntFromInterval(0, cols / 2));
    const [finishNodeRow, setFinishNodeRow] = useState(randomIntFromInterval(0, rows - 1));
    const [finishNodeCol, setFinishNodeCol] = useState(randomIntFromInterval(cols / 2 + 1, cols - 1));
    // Element to keep track whether a special node is pressed
    const [itemPressed, setItemPressed] = useState(null);
    // Element to know which key has been pressed
    const [keyPressed, setKeyPressed] = useState("r");
    const [description, setDescription] = useState("Press W to insert weights and R to get back to walls.");
    // Keep track of the animation ops
    let timeIDs = useRef([]);
    let running = useRef(false);
    let algo = useRef(-1);
    const descriptions = ["Press W to insert weights and R to get back to walls.",
                          "Dijkstra is a weighted algorithm that guarantees the shortest possible path.",
                          "BreadthFirst is an unweighted algorithm that guarantees the shortest possible path.",
                          "DepthFirst is an unweighted algorithm that does not guarantee the shortest path.",
                          "Greedy is a weighted algorithm that does not guarantee the shortest path.",
                          "A* is a weighted algorithm that usually guarantees the shortest possible path."]; 
    const functions = [dijkstra, breadthFirst, depthFirst, greedy, aStar];
    
    useEffect(()=>{
      const new_grid = getInitialGrid();
      // Add a listener to react when a key is pressed
      document.addEventListener("keydown", handleKeyDown);
      setGrid(new_grid);
      // eslint-disable-next-line
    }, [])

    useEffect(()=>{
      setGrid(getInitialGrid());
      // eslint-disable-next-line
    }, [rows])

    const createNode = (col, row) => {
      // Create a node with the default values
      return {
        col,
        row,
        isStart:
          row === startNodeRow && col === startNodeCol,
        isFinish:
          row === finishNodeRow && col === finishNodeCol,
        // Distance from the starting Node
        distance: Infinity,
        // Distance from the end node computed with heuristic
        heuristic: Infinity,
        weight: 1,
        isVisited: false,
        isWall: false,
        previousNode: null,
      };
    }

    const getInitialGrid = () => {
      // Create a 2d Array of new nodes
      const new_grid = [];
      for (let row = 0; row < rows; row++) {
        const currentRow = [];
        for (let col = 0; col < cols; col++) {
          currentRow.push(createNode(col, row));
        }
        new_grid.push(currentRow);
      }
      return new_grid;
    }

    const handleKeyDown = (e) => {
      // Keep track of the jey pressed only if it corresponds to r or w
      if ("rw".includes(e.key)) setKeyPressed(e.key);
    }

    const handleMouseUp = () => {
      // Function called when the mouse is pressed up
      setMouseIsPressed(false);
      setItemPressed(null);
    }
    
    const clearGrid = () => {
      for (let row of grid) {
        for (let node of row) {
          // Reset the features of the node
          resetNode(node);
          const extraClassName = node.isFinish
            ? "node-finish"
            : node.isStart
            ? "node-start"
            : node.isWall
            ? "node-wall"
            : "";
          // Update the node visualization
          document.getElementById(
            `node-${node.row}-${node.col}`
          ).className = `node ${extraClassName}`;
        }
      }
    }

    const updateGridSize = () => {
      // Clear the entire grid
      clearGrid();
      // Get the new row values selected through the slider
      const rows = document.getElementById("n_rows").value;
      const cols = Math.round((0.8*window.innerWidth)/50);
      setStartNodeRow(randomIntFromInterval(0, rows - 1));
      setStartNodeCol(randomIntFromInterval(0, cols / 2));
      setFinishNodeRow(randomIntFromInterval(0, rows - 1));
      setFinishNodeCol(randomIntFromInterval(cols / 2 + 1, cols - 1));
      setCols(cols);
      setRows(rows);
    }

    const clearPath = () => {
      for (let row of grid) {
        for (let node of row) {
          // Reset each node but retain the wall and the weighted cells
          resetNode(node, true, true);
          const extraClassName = node.isFinish
            ? "node-finish"
            : node.isStart
            ? "node-start"
            : node.isWall
            ? "node-wall"
            : node.weight > 1
            ? "node-weight"
            : "";
          // Update the node visualization
          document.getElementById(
            `node-${node.row}-${node.col}`
          ).className = `node ${extraClassName}`;
        }
      }
    }

    const moveStartNode = (grid, row, col) => {
      const previousStartNode = grid[startNodeRow][startNodeCol];
      previousStartNode.isStart = false;
      const newStartNode = grid[row][col];
      const newNode = {
        ...newStartNode,
        isStart: true,
      };
      grid[row][col] = newNode;
      setStartNodeRow(row);
      setStartNodeCol(col);
      return grid;
    }

    const handleMouseDown = (row, col) => {
      // Function called when the mouse is pressed down
      const node = grid[row][col];
      let itemPressed = null;
      let newGrid = [];
      if (node.isStart) {
        newGrid = moveStartNode(grid, row, col);
        itemPressed = "startNode";
      } else if (node.isFinish) {
        newGrid = moveFinishNode(grid, row, col);
        itemPressed = "finishNode";
      } else if (keyPressed === "w") {
        newGrid = getNewGridWithWeightToggled(grid, row, col);
      } else {
        newGrid = getNewGridWithWallToggled(grid, row, col);
      }
      setGrid(newGrid);
      setMouseIsPressed(true);
      setItemPressed(itemPressed);
    }
  
    const handleMouseEnter = (row, col) => {
      // Change the nodes wall status if the mouse is moved after being pressed down
      if (!mouseIsPressed) return;
      let newGrid = [];
      if (itemPressed === "startNode") {
        newGrid = moveStartNode(grid, row, col);
      } else if (itemPressed === "finishNode") {
        newGrid = moveFinishNode(grid, row, col);
      } else if (keyPressed === "w") {
        newGrid = getNewGridWithWeightToggled(grid, row, col);
      } else {
        newGrid = getNewGridWithWallToggled(grid, row, col);
      }
      setGrid(newGrid);
    }
  
    const moveFinishNode = (grid, row, col) => {
      const previousFinishNode = grid[finishNodeRow][finishNodeCol];
      previousFinishNode.isFinish = false;
      const newFinishNode = grid[row][col];
      const newNode = {
        ...newFinishNode,
        isFinish: true,
      };
      grid[row][col] = newNode;
      setFinishNodeRow(row);
      setFinishNodeCol(col);
      return grid;
    }
  
    const animateAlgorithm = (visitedNodesInOrder, nodesInShortestPathOrder) => {
      // For each visited node
      for (let i = 0; i <= visitedNodesInOrder.length; i++) {
        // Only if it is the last node start the final animation
        if (i === visitedNodesInOrder.length) {
          timeIDs.current.push(setTimeout(() => {
            animateShortestPath(nodesInShortestPathOrder);
          }, speed * i));
          return;
        } else {
          timeIDs.current.push(setTimeout(() => {
            const node = visitedNodesInOrder[i];
            let extraClass = "";
            if (node.isStart) extraClass = "start-";
            else if (node.isFinish) extraClass = "finish-";
            else if (node.weight > 1) extraClass = "weight-";
            // Animate the node according to its characteristics
            document.getElementById(
              `node-${node.row}-${node.col}`
            ).className = `node ${extraClass}node-visited`;
          }, speed * i));
        }
      }
    }
  
    const animateShortestPath = (nodesInShortestPathOrder) => {
      // Animation showing the shortest path
      for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
        timeIDs.current.push(setTimeout(() => {
          const node = nodesInShortestPathOrder[i];
          let extraClass = "";
          if (node.isStart) extraClass = "start-";
          else if (node.isFinish) extraClass = "finish-";
          else if (node.weight > 1) extraClass = "weight-";
          // Animate the node according to its characteristics
          document.getElementById(
            `node-${node.row}-${node.col}`
          ).className = `node ${extraClass}node-shortest-path`;
        }, speed * 5 * i));
      }
      timeIDs.current.push(setTimeout(()=>{
        running.current = false;
        changeButtonText();
      }, nodesInShortestPathOrder.length * speed * 5))
    }
  
    const visualizeAlgorithm = (algorithm) => {
      // Update algorithm description
      setDescription(descriptions[algorithm]); 
      // Clean the board from the previous path
      clearPath();
      // Set up the starting and final nodes
      const startNode = grid[startNodeRow][startNodeCol];
      const finishNode = grid[finishNodeRow][finishNodeCol];
      // Get the visited nodes in order
      const visitedNodesInOrder = functions[algorithm-1](grid, startNode, finishNode);
      // Get the nodes, belonging to the shortest path and visisted in order
      const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
      animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    // Stop the execution of the animation
    const stopExecution = () => {
      running.current = false;
      changeButtonText();
      for (let i=0; i<timeIDs.current.length; i++){
        clearTimeout(timeIDs.current[i]);
      }
      timeIDs.current = [];
    }

    const changeButtonText = () => {
      const btn = document.getElementById("run_btn");
      btn.innerText = running.current ? 'STOP' : 'RUN';
    }

    const playButtonLogic = () => {
      if (running.current){ 
        stopExecution(); 
        clearPath();
      } else {
        if (algo.current>0) {
          running.current = true;
          changeButtonText();
          visualizeAlgorithm(algo.current);
        }
      }
    }

    return (
      <>
        <div className="header">
          <div style={{ display: "inline-block" }}>
            <span className="rangeValue">SPEED: {speed}</span>
            <input
              className="range"
              id="speed"
              type="range"
              min="1"
              step="1"
              defaultValue="10"
              max="1000"
              onChange={() => setSpeed(document.getElementById("speed").value)}
            ></input>
          </div>
          <div style={{ display: "inline-block" }}>
            <span className="rangeValue">ROWS: {rows}</span>
            <input
              className="range"
              id="n_rows"
              type="range"
              min="1"
              step="1"
              defaultValue="10"
              max="25"
              onChange={() => {stopExecution(); updateGridSize()}}
            ></input>
          </div>
          <button
            className="button_slide slide_down"
            id="btn"
            onClick={() => {stopExecution(); clearGrid();}}
          >
            CLEAR GRID
          </button>
          <button
            className="button_slide slide_down"
            id="btn2"
            onClick={() => {stopExecution(); clearPath()}}
          >
            CLEAR PATH
          </button>
          <select
            id="select_box"
            className="box slide_down"
            onChange={() => {
              let value = document.getElementById("select_box").value;
              setDescription(descriptions[value]);
              algo.current = value;
            }}
            defaultValue={0}
          >
            <option value={0}>ALGORITHM</option>
            <option value={1}>DIJKSTRA</option>
            <option value={2}>BREADTH FIRST</option>
            <option value={3}>DEPTH FIRST</option>
            <option value={4}>GREEDY</option>
            <option value={5}>A STAR</option>
          </select>
          <button
            className="button_slide slide_down"
            id="run_btn"
            onClick={playButtonLogic}
          >
            RUN
          </button>
        </div>
        <div className="text">{description}</div>
        <div className="grid" id='grid'>
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} className="row">
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall, weight } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      row={row}
                      col={col}
                      side={50}
                      weight={weight}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                      onMouseUp={() => handleMouseUp()}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
          <div className="footer"></div>
        </div>
      </>
    );
  }

function resetNode(node, keepWall = false, keepWeights = false) {
  node.distance = Infinity;
  node.heuristic = Infinity;
  node.isVisited = false;
  node.previousNode = null;
  if (!keepWall) node.isWall = false;
  if (!keepWeights) node.weight = 1;
}

const getNewGridWithWallToggled = (grid, row, col) => {
  // Recreate the grid changing the wall property where needed
  const node = grid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
    weight: 1,
  };
  grid[row][col] = newNode;
  return grid;
};

const getNewGridWithWeightToggled = (grid, row, col) => {
  // Recreate the grid changing the weight property where needed
  const node = grid[row][col];
  const newNode = {
    ...node,
    isWall: false,
    weight: node.weight === 15 ? 1 : 15,
  };
  grid[row][col] = newNode;
  return grid;
};

// Function to generate random numbers from min to max, both inclusive
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
