import React, {Component, MouseEvent, RefObject} from 'react';
import {CanvasWrapper} from './MaskCanvas.styles';
import {ParsedParams, pixelRatio, shouldUpdateCanvas} from './utils';
import {Coordinate, Size} from './Canvas';
import {drawCell, wipe} from './Canvas.functions';
import {Attributes, PlayState} from './App';

interface MaskCanvasProps {
    size: Size;
    playState: PlayState;
    setClickedCell: (xy: Coordinate | null, cb?: () => void) => void;
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
        const {size, playState} = this.props;

        if (shouldUpdateCanvas(prevProps, this.props)) {
            wipe(this.canvasRef, size);
        }

        if (playState !== PlayState.Editing) {
            wipe(this.canvasRef, this.props.size);
        }
    }

    onMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
        const {params: {cellSize}, playState} = this.props;
        if (playState === PlayState.Editing) {
            const x = (Math.floor(event.clientX / cellSize) * cellSize + 1) * pixelRatio;
            const y = (Math.floor(event.clientY / cellSize) * cellSize + 1) * pixelRatio;
            wipe(this.canvasRef, this.props.size);
            drawCell(this.canvasRef, 'rgba(0,0,0,0.5)', x, y, (cellSize - 1) * pixelRatio, (cellSize - 1) * pixelRatio);
        }
    };

    onClick = (event: MouseEvent<HTMLCanvasElement>) => {
        const {params: {cellSize}, playState, setClickedCell} = this.props;
        if (playState === PlayState.Editing) {
            setClickedCell([
                Math.floor(event.clientY / cellSize),
                Math.floor(event.clientX / cellSize)
            ], () => setClickedCell(null));
        }
    };

    render() {
        const {attributes} = this.props;
        return <CanvasWrapper className="mask-canvas" ref={this.canvasRef}
            onMouseMove={this.onMouseMove} {...attributes} onClick={this.onClick}/>;
    }
}

export default MaskCanvas;
