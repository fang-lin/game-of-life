import React, {Component, RefObject} from 'react';
import {CanvasWrapper} from './MaskCanvas.styles';
import {Attributes, ParsedParams, PlayState} from './App.functions';
import {Coordinate, Size} from './Canvas';
import {drawCell, shouldLayoutCanvas, wipe} from './Canvas.functions';

interface MaskCanvasProps {
    size: Size;
    playState: PlayState;
    setClickedCell: (xy: Coordinate | null, cb?: () => void) => void;
    hoveringCell: Coordinate | null;
    params: ParsedParams;
    attributes: Attributes;
    origin: Coordinate;
}

class MaskCanvas extends Component<MaskCanvasProps, any> {

    private readonly canvasRef: RefObject<HTMLCanvasElement>;

    constructor(props: MaskCanvasProps) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidUpdate(prevProps: MaskCanvasProps) {
        const {canvasRef} = this;
        const {size, playState, hoveringCell, params: {scale, gridType}, origin} = this.props;

        if (playState !== PlayState.Editing || shouldLayoutCanvas(prevProps, this.props)) {
            wipe(canvasRef, size);
        }

        if (playState === PlayState.Editing && hoveringCell && prevProps.hoveringCell !== hoveringCell) {
            wipe(canvasRef, size);
            drawCell(canvasRef, 'rgba(0,0,0,.3)', hoveringCell, scale, size, origin, gridType);
        }
    }

    render() {
        const {attributes} = this.props;
        return <CanvasWrapper ref={this.canvasRef} {...attributes}/>;
    }
}

export default MaskCanvas;
