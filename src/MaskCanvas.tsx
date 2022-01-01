import React, {Component, MouseEvent, RefObject} from 'react';
import {CanvasWrapper} from './Canvas.styles';
import {ParsedParams, pixelRatio, shouldUpdateCanvas} from './utils';
import {Coordinate, Size} from './Canvas';
import {drawCell, wipe} from './drawer';
import {Attributes, PlayState} from './App';

interface MaskCanvasProps {
    size: Size;
    playState: PlayState;
    onClickCell: (xy: Coordinate) => void;
    params: ParsedParams;
    attributes: Attributes;
}

class MaskCanvas extends Component<MaskCanvasProps> {

    private readonly canvasRef: RefObject<HTMLCanvasElement>;

    constructor(props: MaskCanvasProps) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidUpdate(prevProps: MaskCanvasProps) {
        if (shouldUpdateCanvas(prevProps, this.props)) {
            const context = this.canvasRef.current?.getContext('2d');
            context && wipe(context, this.props.size);
        }
    }

    onMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
        const {params: {cellSize}, playState} = this.props;
        if (playState === PlayState.Cleaned || playState === PlayState.Reset) {
            const x = (Math.floor(event.clientX / cellSize) * cellSize + 1) * pixelRatio;
            const y = (Math.floor(event.clientY / cellSize) * cellSize + 1) * pixelRatio;
            const context = event.currentTarget.getContext('2d');
            if (context) {
                wipe(context, this.props.size);
                drawCell(context, 'rgba(0,0,0,0.6)', x, y, (cellSize - 1) * pixelRatio, (cellSize - 1) * pixelRatio);
            }
        }
    };

    onClick = (event: MouseEvent<HTMLCanvasElement>) => {
        const {params: {cellSize}, playState} = this.props;
        if (playState === PlayState.Cleaned || playState === PlayState.Reset) {
            this.props.onClickCell([
                Math.floor(event.clientY / cellSize),
                Math.floor(event.clientX / cellSize)
            ]);
        }
    };

    render() {
        const {attributes} = this.props;
        return <CanvasWrapper className="mask-canvas"
            ref={this.canvasRef}
            onMouseMove={this.onMouseMove}
            {...attributes}
            onClick={this.onClick}/>;
    }
}

export default MaskCanvas;
