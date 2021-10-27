import React, {Component, RefObject} from 'react';
import {CanvasWrapper} from "./Canvas.styles";
import {CellsMap} from "./CellsMap";
import {draw, drawGrid, drawLife, wipe} from "./drawer";
import {getSize, objectify, updateCanvasSize} from "./utils";
import {OnClickCell, PlayState} from "./App";

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

// const initLifeMap: Array<[number, number]> = [
//     [20, 20],
//     [20, 21],
//     [20, 22],
//     [20, 23],
//     [21, 19],
//     [21, 23],
//     [22, 23],
//     [23, 19],
//     [23, 22]
// ]

export type Size = [number, number];
export type Coords = [number, number];

interface CanvasProps {
    size: [number, number];
    playState: PlayState;
    setPlayState: (s: PlayState) => void;
    clickCellCallback: (cb: OnClickCell) => void;
}

const duration = 0;
export const cell = 10;

export class Canvas extends Component<CanvasProps, {}> {

    cellsMap: CellsMap;
    initCells: Array<Coords>;
    playTimout?: NodeJS.Timeout;
    private readonly canvasRef: RefObject<HTMLCanvasElement>;

    constructor(props: CanvasProps) {
        super(props);
        this.canvasRef = React.createRef();
        this.cellsMap = new CellsMap();
        this.initCells = [];
        this.props.clickCellCallback((coords) => {
            this.cellsMap.toggleCell(coords);
            const context = this.canvasRef.current?.getContext('2d');
            if (context) {
                wipe(context, this.props.size);
                drawGrid(context, this.props.size);
                drawLife(context, this.cellsMap.cells);
            }
        });
    }

    componentDidUpdate(prevProps: CanvasProps) {
        const element = this.canvasRef.current;
        if (element) {
            const context = element.getContext('2d');
            if (context) {
                if (updateCanvasSize(prevProps.size, this.props.size, element)) {
                    draw(context, this.props.size, this.cellsMap.cells);
                }
                switch (this.props.playState) {
                    case PlayState.Paused:
                        this.playTimout && clearTimeout(this.playTimout);
                        break;
                    case prevProps.playState !== PlayState.Paused && PlayState.Playing:
                        this.initCells = objectify(this.cellsMap.cells);
                        this.play();
                        break;
                    case PlayState.Playing:
                        this.play();
                        break;
                    case PlayState.Cleaned:
                        this.playTimout && clearTimeout(this.playTimout);
                        this.cellsMap.reset();
                        draw(context, this.props.size, this.cellsMap.cells);
                        break;
                    case PlayState.Reset:
                        this.playTimout && clearTimeout(this.playTimout);
                        this.cellsMap.reset();
                        this.cellsMap.addCells(this.initCells);
                        draw(context, this.props.size, this.cellsMap.cells);
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

    play = () => {
        this.frame();
        this.playTimout = setTimeout(this.play, duration);
    }

    render() {
        return (<CanvasWrapper ref={this.canvasRef}/>);
    }
}

export default Canvas;