import React, {Component, RefObject} from 'react';
import {CanvasWrapper} from "./Canvas.styles";
import {CellsMap} from "./CellsMap";
import {drawGrid, drawLife, wipe} from "./drawer";
import {getSize, updateCanvasSize} from "./utils";
import {PlayState} from "./App";

// const initLifeMap: Array<[number, number]> = [
//     [21, 22],
//     [22, 21],
//     [22, 22],
//     [22, 23],
//     [23, 22]
// ]

// const initLifeMap: Array<[number, number]> = [
//     [20, 20],
//     [20, 21],
//     [20, 22],
//     [21, 19],
//     [21, 20],
//     [21, 21],
// ]

// const initLifeMap: Array<[number, number]> = [
//     [20, 20],
//     [21, 21],
//     [22, 19],
//     [22, 20],
//     [22, 21],
// ]

const initLifeMap: Array<[number, number]> = [
    [20, 20],
    [20, 21],
    [20, 22],
    [20, 23],
    [21, 19],
    [21, 23],
    [22, 23],
    [23, 19],
    [23, 22]
]

export type Size = [number, number]

interface CanvasProps {
    size: [number, number];
    playState: PlayState;
    setPlayState: (s: PlayState) => void;
    clickNextCallback: (cb: () => void) => void;
}

const duration = 100;

export class Canvas extends Component<CanvasProps, {}> {

    cellsMap: CellsMap;
    playTimout?: NodeJS.Timeout;
    private readonly canvasRef: RefObject<HTMLCanvasElement>;

    constructor(props: CanvasProps) {
        super(props);
        this.canvasRef = React.createRef();
        this.cellsMap = new CellsMap();
        this.props.clickNextCallback(this.frame);
    }

    componentDidUpdate(prevProps: CanvasProps) {
        const element = this.canvasRef.current;
        if (element) {
            const context = element.getContext('2d');
            if (context) {
                if (updateCanvasSize(prevProps.size, this.props.size, element)) {
                    wipe(context, this.props.size);
                    drawGrid(context, this.props.size);
                    drawLife(context, this.cellsMap.cells);
                }

                switch (this.props.playState) {
                    case PlayState.Paused:
                        this.playTimout && clearTimeout(this.playTimout);
                        break;
                    case PlayState.Playing:
                        this.play();
                        break;
                    case PlayState.Stopped:
                        this.playTimout && clearTimeout(this.playTimout);
                        this.cellsMap.reset();
                        this.cellsMap.init(initLifeMap);
                        wipe(context, this.props.size);
                        drawGrid(context, this.props.size);
                        drawLife(context, this.cellsMap.cells);
                        break;
                    case PlayState.Reset:
                        this.playTimout && clearTimeout(this.playTimout);
                        this.cellsMap.reset();
                        wipe(context, this.props.size);
                        drawGrid(context, this.props.size);
                        drawLife(context, this.cellsMap.cells);
                        break;
                }
            }
        }


    }

    frame = () => {
        const context = this.canvasRef.current?.getContext('2d');
        if (context) {
            const size = getSize(this.props.size);
            wipe(context, size);
            drawGrid(context, size);
            this.cellsMap.grow();
            this.cellsMap.clean();
            drawLife(context, this.cellsMap.cells);
            // setTimeout(() => {
            //     drawDeadLife(context, lifeMap.dying);
            //     drawNewLife(context, lifeMap.newborn);
            //     setTimeout(() => {
            //         lifeMap.clean();
            //     }, duration * .05);
            // }, duration * .9);
        }
    }

    play() {
        this.playTimout = setTimeout(() => {
            this.frame();
            this.play();
        }, duration);
    }

    render() {
        return (<CanvasWrapper ref={this.canvasRef}/>);
    }
}

export default Canvas;
