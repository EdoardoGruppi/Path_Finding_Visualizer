import React from "react";
import "./Node.css";


export default function Node(props) {
  const {
    col,
    isFinish,
    isStart,
    weight,
    isWall,
    side,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    row,
  } = props;

  const extraClassName = isFinish
    ? "node-finish"
    : isStart
    ? "node-start"
    : isWall
    ? "node-wall"
    : weight > 1
    ? "node-weight"
    : "";

  return (
    <div
      id={`node-${row}-${col}`}
      style={{
        height: `${side}px`,
        width: `${side}px`,
      }}
      className={`node ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    ></div>
  );
}
