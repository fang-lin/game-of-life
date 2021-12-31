import React, {Component, RefObject} from 'react';
import {CanvasWrapper} from './Canvas.styles';
import {LifeMap} from './LifeMap';
import {draw, drawGrid, drawLife, wipe} from './drawer';
import {getSize, objectify, updateCanvasSize} from './utils';
import {OnClickCell, PlayState} from './App';

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
export type Coordinate = [number, number];

interface CanvasProps {
    size: [number, number];
    playState: PlayState;
    setPlayState: (s: PlayState) => void;
    clickCellCallback: (cb: OnClickCell) => void;
}

const duration = 1000;
export const cell = 20;

export class Canvas extends Component<CanvasProps> {

    lifeMap: LifeMap;
    initCells: Array<Coordinate>;
    playTimout?: NodeJS.Timeout;
    private readonly canvasRef: RefObject<HTMLCanvasElement>;

    constructor(props: CanvasProps) {
        super(props);
        this.canvasRef = React.createRef();
        this.lifeMap = new LifeMap();
        this.initCells = [];
        this.props.clickCellCallback((coords) => {
            this.lifeMap.toggleCell(coords);
            const context = this.canvasRef.current?.getContext('2d');
            if (context) {
                wipe(context, this.props.size);
                drawGrid(context, this.props.size);
                drawLife(context, this.lifeMap.cells);
            }
        });
    }

    componentDidUpdate(prevProps: CanvasProps) {
        const element = this.canvasRef.current;
        if (element) {
            const context = element.getContext('2d');
            if (context) {
                if (updateCanvasSize(prevProps.size, this.props.size, element)) {
                    draw(context, this.props.size, this.lifeMap.cells);
                }
                switch (this.props.playState) {
                case PlayState.Paused:
                    this.playTimout && clearTimeout(this.playTimout);
                    break;
                case prevProps.playState !== PlayState.Paused && PlayState.Playing:
                    this.initCells = objectify(this.lifeMap.cells);
                    this.play();
                    break;
                case PlayState.Playing:
                    this.play();
                    break;
                case PlayState.Cleaned:
                    this.playTimout && clearTimeout(this.playTimout);
                    this.lifeMap.reset();
                    draw(context, this.props.size, this.lifeMap.cells);
                    break;
                case PlayState.Reset:
                    this.playTimout && clearTimeout(this.playTimout);
                    this.lifeMap.reset();
                    this.lifeMap.addCells(this.initCells);
                    draw(context, this.props.size, this.lifeMap.cells);
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
            this.lifeMap.evolve();
            console.log(this.lifeMap.toString());
            drawLife(context, this.lifeMap.cells);
        }
    };

    play = () => {
        this.frame();
        this.playTimout = setTimeout(this.play, duration);
    };

    render() {
        return (<CanvasWrapper ref={this.canvasRef}/>);
    }
}

export default Canvas;