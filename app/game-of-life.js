'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';
import './game-of-life.css';

function Cell(props) {
    const status = props.status&1 ?" live":"";
    return (
        <div className={"cell" + status} onClick={props.onClick}></div>
    );
}

class Space extends React.Component {
    initBoard() {
        const board = Array(),
              cells = this.props.cells;

        for (let i = 0; i <= cells.length-1; i++) {
            board.push(
                <Cell 
                    key = {i.toString()}
                    status = {cells[i]}
                    onClick={() => this.props.onClick(i)}
                />
            )
        }
        return board
    }

    render() {
        return (
            <div className="space">
                { this.initBoard() }
            </div>
        );
    }
}

function ControlBtn(props) {
    return (
        <button className="btn" onClick={props.onClick}>
            {props.name}
        </button>
    );
}

function LifeForm(props) {
    return (
        <form className="init-form">
            <label> Pick a life-from:
            <select onChange={props.onChange}>
                <option value="none">None</option>
                <option value="gilder">Gilder</option>
                <option value="smallExploder">Small Exploder</option>
                <option value="cellsRow">3 cell row</option>
                <option value="lightShip">Spaceship</option>
            </select>
            </label>
        </form>
    );
}

function SideBar(props) {
    return (
        <div className="side-bar">
            <h2 className="caption">Conway's Game of Life</h2>
            <LifeForm onChange={props.onLifeFromChange}/>
            <ControlBtn name="Start" onClick={props.onStartClick}/>
            <ControlBtn name="Stop" onClick={props.onStopClick}/>
            <ControlBtn name="Clear" onClick={props.onClearClick}/>
        </div>
    );
}

function liveNeighbors(cells, index, columNum) {
    var aroundIndex,
        lives = 0,
        length = cells.length-1;
    // 左边界
    if (index%columNum == 0) {
        aroundIndex = [
            index-columNum, index-columNum+1,
            index+1,
            index+columNum, index+columNum+1
        ];
    }
    // 右边界
    else if ((index+1)%columNum == 0){
        aroundIndex = [
            index-columNum-1, index-columNum,
            index-1,
            index+columNum-1, index+columNum
        ];
    }
    else {
        aroundIndex = [
            index-columNum-1, index-columNum, index-columNum+1,
            index-1, index+1,
            index+columNum-1, index+columNum, index+columNum+1
        ];
    }
    for (let paraIndex of aroundIndex) {
        if (paraIndex>=0 && paraIndex<=length) {
            lives += cells[paraIndex] & 1;
        }
    }
    return lives;
}

function nextGeneration(currCells, columNum) {
    /*
        [2nd bit, 1st bit] = [next state, current state]
        - 00  dead (next) <- dead (current) 0
        - 01  dead (next) <- live (current) 1
        - 10  live (next) <- dead (current) 2 
        - 11  live (next) <- live (current) 3
    */
    const cells = currCells.slice();
    for (let i = 0; i < cells.length; i++) {
        const lives = liveNeighbors(cells, i, columNum);
         if (cells[i] == 1 && lives >= 2 && lives <= 3) {  
            cells[i] = 3;
         }
         if (cells[i] == 0 && lives == 3) {
             cells[i] = 2;
         }
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i] >>= 1;
    }
    return cells;
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cells: Array(1995).fill(0),
        }
    }

    // 初始化点击
    handleClick(i) {
        const cells = this.state.cells.slice();
        cells[i] = 1;
        this.setState({cells: cells});
    }

    BuiltinLifeFroms(form) {
        const cells = Array(1995).fill(0);
        const lifeFrom = {
            'none': [],
            'gilder': [822, 880, 935, 936, 937],
            'smallExploder': [825, 881, 882, 883, 938, 940, 996],   
            'cellsRow': [881, 882, 883,],
            'lightShip': [763, 764, 765, 766, 819, 823, 880, 933, 936]
        };
        for (let index of lifeFrom[form]) {
            cells[index] = 1
        }
        return cells;
    }

    handleLifeFormChange(event) {
        clearInterval(this.timerID);
        const form = event.target.value;
        this.setState({cells: this.BuiltinLifeFroms(form)});
    }

    setnextGeneration() {
        this.setState(function(prevState) {
            return {
                cells: nextGeneration(prevState.cells, 57)
            };
        });
    }

    handleClearClick() {
        clearInterval(this.timerID);
        this.setState({cells: Array(1995).fill(0)});
    }

    handleStartClick() {
        this.timerID = setInterval(
            () => this.setnextGeneration(),
            1000
        );
    }

    handleStopClick() {
        clearInterval(this.timerID);
    }

    render() {
        return (
            <div>
                <Space
                    cells = {this.state.cells}
                    onClick = {(i) => this.handleClick(i)}
                />
                <SideBar
                    onStartClick = {() => this.handleStartClick()}
                    onStopClick = {() => this.handleStopClick()}
                    onClearClick = {() => this.handleClearClick()}
                    onLifeFromChange = {(event) => this.handleLifeFormChange(event)}
                />
            </div>
        );
    }
}


ReactDOM.render(
    <Game />,
    document.getElementById('container')
);
