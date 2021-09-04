import React, { Component } from "react";
import Node from './Node/Node'
import './PathFindingVisualizer.css'

export default class PathFindingVisualizer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            rows: 20,
            cols: 50,
        };
    }

    componentDidMount() {
        const nodes = [];
        for (let row = 0; row < this.state.rows; row++) {
            const currentRow = [];
            for (let col = 0; col < this.state.cols; col++) {
                // This creates a grid of zeros, one for each node
                currentRow.push(0);
            }
            nodes.push(currentRow);
        }
        this.setState({ nodes: nodes })
    }

    render() {
        const { nodes } = this.state;
        const side = 65 / this.state.rows;
        console.log(nodes);
        console.log(side)

        return (
            <div className='grid'>
                {nodes.map((row, rowIdx) => {
                    return <div key={rowIdx}>
                        {row.map((node, nodeIdx) => <Node key={nodeIdx} side={side}></Node>)}
                    </div>
                })}                
            </div>
        )
    }
}

// Size with sliders. Change only rows and il rapporto rimane questo (quindi anche le colonne si rimettono noramli)