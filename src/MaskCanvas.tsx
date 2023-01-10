import React, {Component, RefObject} from 'react';
import isEmpty from 'lodash/isEmpty';
import {CanvasWrapper} from './MaskCanvas.styles';
import {Attributes, ParsedParams, PlayState} from './App.functions';
import {Coordinate, Size} from './Canvas';
import {drawCell, drawCells, shouldLayoutCanvas, wipe} from './Canvas.functions';

interface MaskCanvasProps {
    size: Size;
    playState: PlayState;
    hoveringCell: Coordinate | null;
    selectedCells: Coordinate[];
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
        const {size, playState, hoveringCell, params: {scale, gridType}, origin, selectedCells} = this.props;

        if (playState !== PlayState.Editing || shouldLayoutCanvas(prevProps, this.props)) {
            wipe(canvasRef, size);
        }

        if (playState === PlayState.Editing &&
            hoveringCell &&
            (prevProps.hoveringCell !== hoveringCell || prevProps.selectedCells !== selectedCells)) {
            wipe(canvasRef, size);
            if (isEmpty(selectedCells)) {
                drawCell(canvasRef, 'rgba(0,0,0,.3)', hoveringCell, scale, size, origin, gridType);
            } else {
                drawCells(canvasRef, 'rgba(0,0,0,.3)', selectedCells.map(cell => [cell[0] + hoveringCell[0], cell[1] + hoveringCell[1]]), scale, size, origin, gridType);
            }
        }
    }

    render() {
        const {attributes} = this.props;
        return <CanvasWrapper ref={this.canvasRef} {...attributes}/>;
    }
}

export default MaskCanvas;
