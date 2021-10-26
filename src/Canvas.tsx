import React, {Component, RefObject} from 'react';
import {CanvasWrapper} from "./Canvas.styles";
import {CellsMap} from "./CellsMap";
import {clean, drawDeadLife, drawGrid, drawLife, drawNewLife} from "./drawer";
import {pixelRatio} from "./const";

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

const lifeMap = new CellsMap(initLifeMap);

export type Size = [number, number]

interface CanvasProps {
    size: [number, number];
}

function getSize(size: Size): Size {
    return [size[0] * pixelRatio, size[1] * pixelRatio];
}

const duration = 500;

export class Canvas extends Component<CanvasProps, {}> {

    private readonly canvasRef: RefObject<HTMLCanvasElement>;

    constructor(props: CanvasProps) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidUpdate(prevProps: CanvasProps) {
        const element = this.canvasRef.current;
        if (element) {
            const size = getSize(this.props.size);
            element.width = size[0];
            element.height = size[1];
            const context = element.getContext('2d');
            if (context) {
                clean(context, size);
                drawGrid(context, size);
                drawLife(context, lifeMap.cells);
            }
        }
    }

    frame = () => {
        const context = this.canvasRef.current?.getContext('2d');
        if (context) {
            const size = getSize(this.props.size);
            clean(context, size);
            drawGrid(context, size);
            lifeMap.grow();
            lifeMap.clean();
            drawLife(context, lifeMap.cells);
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
        setInterval(() => {
            this.frame();
        }, duration)
    }

    componentDidMount() {
        this.play();
    }

    render() {
        return (<CanvasWrapper ref={this.canvasRef}/>);
    }
}

export default Canvas;
