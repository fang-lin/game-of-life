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

class MaskCanvas extends Component<MaskCanvasProps, any> {

    private readonly canvasRef: RefObject<HTMLCanvasElement>;

    constructor(props: MaskCanvasProps) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('click', this.onClick);
    }

    componentWillUnmount() {
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('click', this.onClick);
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

    onMouseMove = (event: Event) => {
        const {clientX, clientY} = event as unknown as MouseEvent;
        const {params: {cellSize}, playState} = this.props;
        if (playState === PlayState.Editing) {
            const x = (Math.floor(clientX / cellSize) * cellSize + 1) * pixelRatio;
            const y = (Math.floor(clientY / cellSize) * cellSize + 1) * pixelRatio;
            wipe(this.canvasRef, this.props.size);
            drawCell(this.canvasRef, 'rgba(0,0,0,0.5)', x, y, (cellSize - 1) * pixelRatio, (cellSize - 1) * pixelRatio);
        }
    };

    onClick = (event: Event) => {
        const {clientX, clientY} = event as unknown as MouseEvent;
        const {params: {cellSize}, playState, setClickedCell} = this.props;
        if (playState === PlayState.Editing) {
            setClickedCell([
                Math.floor(clientY / cellSize),
                Math.floor(clientX / cellSize)
            ], () => setClickedCell(null));
        }
    };

    render() {
        const {attributes} = this.props;
        return <CanvasWrapper ref={this.canvasRef} {...attributes}/>;
    }
}

export default MaskCanvas;
