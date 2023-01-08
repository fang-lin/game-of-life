import React, {Component, RefObject} from 'react';
import {CanvasWrapper} from './MaskCanvas.styles';
import {ParsedParams, pixelRatio, shouldUpdateCanvas} from './utils';
import {Coordinate, Size} from './Canvas';
import {drawCell, wipe} from './Canvas.functions';
import {Attributes, PlayState} from './App';

interface MaskCanvasProps {
    size: Size;
    playState: PlayState;
    setClickedCell: (xy: Coordinate | null, cb?: () => void) => void;
    hoveringCell: Coordinate | null;
    params: ParsedParams;
    attributes: Attributes;
}

class MaskCanvas extends Component<MaskCanvasProps, any> {

    private readonly canvasRef: RefObject<HTMLCanvasElement>;

    constructor(props: MaskCanvasProps) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidUpdate(prevProps: MaskCanvasProps) {
        const {canvasRef} = this;
        const {size, playState, hoveringCell, params: {cellSize}} = this.props;

        if (playState !== PlayState.Editing || shouldUpdateCanvas(prevProps, this.props)) {
            wipe(canvasRef, size);
        }

        if (playState === PlayState.Editing && hoveringCell && prevProps.hoveringCell !== hoveringCell) {
            wipe(canvasRef, size);
            drawCell(
                canvasRef,
                'rgba(0,0,0,0.5)',
                (hoveringCell[0] * cellSize + 1) * pixelRatio,
                (hoveringCell[1] * cellSize + 1) * pixelRatio,
                (cellSize - 1) * pixelRatio,
                (cellSize - 1) * pixelRatio
            );
        }
    }

    render() {
        const {attributes} = this.props;
        return <CanvasWrapper ref={this.canvasRef} {...attributes}/>;
    }
}

export default MaskCanvas;
