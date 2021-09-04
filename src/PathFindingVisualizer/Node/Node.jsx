import React, { Component } from "react";
import './Node.css'

export default class Node extends Component{
    constructor(props) {
        super(props);
        this.state = {
            side: this.props.side,
        };
    }

    render() {
        return <div className='node' style={{ height: `${this.state.side}vh`, width: `${this.state.side}vh`}}></div>;
    }
}