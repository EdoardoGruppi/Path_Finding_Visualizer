import React, { Component } from "react";
import "./Node.css";

export default class Node extends Component {
  render() {
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
    } = this.props;

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
          height: `${side}vh`,
          width: `${side}vh`,
        }}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
      ></div>
    );
  }
}
