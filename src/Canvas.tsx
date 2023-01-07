import React, {Component, RefObject} from 'react';
import {CanvasWrapper} from './Canvas.styles';
import {LifeMap} from './LifeMap';
import {draw} from './drawer';
import {ParsedParams, Speed} from './utils';
import {Attributes, PlayState} from './App';

export type Size = [number, number];
export type Coordinate = [number, number];

export interface CanvasProps {
    size: [number, number];
    playState: PlayState;
    setPlayState: (playState: PlayState) => void;
    frameIndex: number;
    setFrameIndex: (op: (index: number) => number) => void;
    clickedCell: Coordinate | null;
    params: ParsedParams;
    attributes: Attributes;
}

const durations = [1000, 500, 100, 50, 0];

function getDuration(speed: number) {
    return durations[speed] === undefined ? durations[Speed.Default] : durations[speed];
}

export class Canvas extends Component<CanvasProps> {
    lifeMap: LifeMap;
    private playTimeout = NaN;
    private readonly canvasRef: RefObject<HTMLCanvasElement>;

    constructor(props: CanvasProps) {
        super(props);
        this.canvasRef = React.createRef();
        this.lifeMap = new LifeMap();
    }

    componentDidUpdate(prevProps: CanvasProps) {
        const {
            lifeMap,
            canvasRef,
            props: {setFrameIndex, frameIndex, clickedCell, playState, setPlayState, params: {cellSize, gridOn}, size}
        } = this;

        if (playState === PlayState.Editing && clickedCell) {
            lifeMap.toggleCell(clickedCell);
            draw(canvasRef, size, lifeMap.cells, cellSize, gridOn);
        }

        if (playState === PlayState.Editing && frameIndex !== 0) {
            window.clearTimeout(this.playTimeout);
            setFrameIndex(() => 0);
        }

        if (prevProps.size !== size || prevProps.params.gridOn !== gridOn) {
            draw(canvasRef, size, lifeMap.cells, cellSize, gridOn);
        }

        if ((prevProps.playState === PlayState.Paused || prevProps.playState === PlayState.Editing) && playState === PlayState.Playing) {
            this.play();
        }

        if (prevProps.playState === PlayState.Playing && playState === PlayState.Paused) {
            window.clearTimeout(this.playTimeout);
        }

        if (playState === PlayState.Reset) {
            window.clearTimeout(this.playTimeout);
            lifeMap.reset();
            draw(canvasRef, size, lifeMap.cells, cellSize, gridOn);
            setPlayState(PlayState.Editing);
        }

        if (prevProps.params.cellSize !== cellSize) {
            draw(canvasRef, size, lifeMap.cells, cellSize, gridOn);
        }
    }

    frame() {
        const {
            lifeMap,
            canvasRef,
            props: {setFrameIndex, params: {cellSize, gridOn}, size}
        } = this;
        setFrameIndex(i => i + 1);
        lifeMap.evolve();
        draw(canvasRef, size, lifeMap.cells, cellSize, gridOn);
    }

    play = () => {
        this.frame();
        this.playTimeout = window.setTimeout(this.play, getDuration(this.props.params.speed));
    }

    render() {
        const {attributes} = this.props;
        return (<CanvasWrapper ref={this.canvasRef} {...attributes}/>);
    }
}

export default Canvas;
