import React, {Component, MouseEvent, RefObject} from 'react';
import {CanvasWrapper} from "./Canvas.styles";
import {cell, pixelRatio, updateCanvasSize} from "./utils";
import {Size} from "./Canvas";
import {drawCell, wipe} from "./drawer";
import {PlayState} from "./App";

interface MaskCanvasProps {
    size: Size;
    playState: PlayState,
}

class MaskCanvas extends Component<MaskCanvasProps, {}> {

    private readonly canvasRef: RefObject<HTMLCanvasElement>;

    constructor(props: MaskCanvasProps) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidUpdate(prevProps: MaskCanvasProps) {
        updateCanvasSize(prevProps.size, this.props.size, this.canvasRef.current);
    }

    onMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
        const x = (Math.floor(event.clientX / cell) * cell + 1) * pixelRatio;
        const y = (Math.floor(event.clientY / cell) * cell + 1) * pixelRatio;
        const context = event.currentTarget.getContext('2d');
        if (context) {
            wipe(context, this.props.size);
            drawCell(context, '#333', x, y, (cell - 1) * pixelRatio, (cell - 1) * pixelRatio)
        }
    }

    onClick = (event: MouseEvent<HTMLCanvasElement>) => {
        const x = Math.floor(event.clientX / cell);
        const y = Math.floor(event.clientY / cell);
    }

    render() {
        return (<CanvasWrapper className="mask-canvas" ref={this.canvasRef} onMouseMove={this.onMouseMove}
                               onClick={this.onClick}/>);
    }
}

export default MaskCanvas;
