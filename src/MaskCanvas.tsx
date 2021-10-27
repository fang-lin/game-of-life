import React, {Component, MouseEvent, RefObject} from 'react';
import {CanvasWrapper} from "./Canvas.styles";
import {pixelRatio, updateCanvasSize} from "./utils";
import {cell, Coords, Size} from "./Canvas";
import {drawCell, wipe} from "./drawer";
import {PlayState} from "./App";

interface MaskCanvasProps {
    size: Size;
    playState: PlayState;
    onClickCell: (xy: Coords) => void;
}

class MaskCanvas extends Component<MaskCanvasProps, {}> {

    private readonly canvasRef: RefObject<HTMLCanvasElement>;

    constructor(props: MaskCanvasProps) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidUpdate(prevProps: MaskCanvasProps) {
        updateCanvasSize(prevProps.size, this.props.size, this.canvasRef.current);
        const context = this.canvasRef.current?.getContext('2d');
        context && wipe(context, this.props.size);
    }

    onMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
        if (this.props.playState === PlayState.Cleaned || this.props.playState === PlayState.Reset) {
            const x = (Math.floor(event.clientX / cell) * cell + 1) * pixelRatio;
            const y = (Math.floor(event.clientY / cell) * cell + 1) * pixelRatio;
            const context = event.currentTarget.getContext('2d');
            if (context) {
                wipe(context, this.props.size);
                drawCell(context, 'rgba(0,0,0,0.6)', x, y, (cell - 1) * pixelRatio, (cell - 1) * pixelRatio)
            }
        }
    }

    onClick = (event: MouseEvent<HTMLCanvasElement>) => {
        if (this.props.playState === PlayState.Cleaned || this.props.playState === PlayState.Reset) {
            this.props.onClickCell([
                Math.floor(event.clientY / cell),
                Math.floor(event.clientX / cell)
            ]);
        }
    }

    render() {
        return (<CanvasWrapper className="mask-canvas" ref={this.canvasRef} onMouseMove={this.onMouseMove}
                               onClick={this.onClick}/>);
    }
}

export default MaskCanvas;
