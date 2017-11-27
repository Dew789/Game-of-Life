function Cell(props) {
    const status = props.status&1?" live":"";
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

function SideBar(props) {
    return (
        <div className="side-bar">
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
    for (index of aroundIndex) {
        if (index>=0 && index<=length) {
            lives += cells[index] & 1;
        }
    }
    return lives;
}

function nextGeneration(cells, columNum) {
    /*
        [2nd bit, 1st bit] = [next state, current state]
        - 00  dead (next) <- dead (current) 0
        - 01  dead (next) <- live (current) 1
        - 10  live (next) <- dead (current) 2 
        - 11  live (next) <- live (current) 3
    */
    for (var i = 0; i < cells.length; i++) {
        var lives = liveNeighbors(cells, i, columNum);
         if (cells[i] == 1 && lives >= 2 && lives <= 3) {  
            cells[i] = 3;
         }
         if (cells[i] == 0 && lives == 3) {
             cells[i] = 2;
         }
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i] >>= 1;
    }
    return cells;
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cells: Array(1995).fill(0)
        }
    }

    // 初始化点击
    handleClick(i) {
        this.state.cells[i] = 1;
        this.setState({cells: this.state.cells});
    }

    handleClearClick() {
        this.setState({cells: Array(1995).fill(0)});
    }

    handleStartClick() {
        this.timerID = setInterval(function() {
            const next = nextGeneration(this.state.cells, 57);
            that.setState({cells: next});
        },1000);
    }

    handleStopClick() {
        clearInterval(this.timerID);
        this.setState({cells: Array(1995).fill(false)});
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
                />
            </div>
        );
    }
}


ReactDOM.render(
    <Game />,
    document.getElementById('container')
);
