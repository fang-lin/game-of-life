import React, {Component, RefObject} from 'react';
import {CanvasWrapper} from './Canvas.styles';
import {LifeMap} from './LifeMap';
import {draw, shouldLayoutCanvas} from './Canvas.functions';
import {ParsedParams, Speed} from './App.functions';
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
    setCellsCount: (cellsCount: number) => void;
}

const durations = [1000, 500, 100, 50, 25, 0];

function getDuration(speed: number) {
    return durations[speed] === undefined ? durations[Speed.Default] : durations[speed];
}

export class Canvas extends Component<CanvasProps> {
    lifeMap: LifeMap;
    private playTimeout = NaN;
    private readonly canvasRef: RefObject<HTMLCanvasElement>;
    private start: number = -Infinity;

    constructor(props: CanvasProps) {
        super(props);
        this.canvasRef = React.createRef();
        this.lifeMap = new LifeMap();
    }

    componentDidUpdate(prevProps: CanvasProps) {
        const {
            lifeMap,
            canvasRef,
            props: {
                setFrameIndex,
                frameIndex,
                clickedCell,
                playState,
                setPlayState,
                params: {cellSize, gridOn},
                size,
                setCellsCount
            },
        } = this;

        if (playState === PlayState.Editing && clickedCell) {
            // Clicked cell when editing
            lifeMap.toggleCell(clickedCell);
            setCellsCount(lifeMap.cells.size);
            draw(canvasRef, size, lifeMap.cells, cellSize, gridOn);
        }

        if (playState === PlayState.Editing && frameIndex !== 0) {
            // Edit
            window.cancelAnimationFrame(this.playTimeout);
            setFrameIndex(() => 0);
        }

        if ((prevProps.playState === PlayState.Paused || prevProps.playState === PlayState.Editing) && playState === PlayState.Playing) {
            // Play
            window.requestAnimationFrame(this.play);
        }

        if (prevProps.playState === PlayState.Playing && playState === PlayState.Paused) {
            // Pause
            window.cancelAnimationFrame(this.playTimeout);
        }

        if (prevProps.playState === PlayState.Paused && playState === PlayState.Next) {
            // Next
            this.frame();
            setPlayState(PlayState.Paused);
        }

        if (playState === PlayState.Reset) {
            // Reset
            window.cancelAnimationFrame(this.playTimeout);
            lifeMap.reset();
            setCellsCount(lifeMap.cells.size);
            draw(canvasRef, size, lifeMap.cells, cellSize, gridOn);
            setPlayState(PlayState.Editing);
        }

        if (shouldLayoutCanvas(prevProps, this.props)) {
            draw(canvasRef, size, lifeMap.cells, cellSize, gridOn);
        }
    }

    frame() {
        const {
            lifeMap,
            canvasRef,
            props: {setFrameIndex, params: {cellSize, gridOn}, size, setCellsCount}
        } = this;
        setFrameIndex(i => i + 1);
        lifeMap.evolve();
        setCellsCount(lifeMap.cells.size);
        draw(canvasRef, size, lifeMap.cells, cellSize, gridOn);
    }

    play = (timestamp: number) => {
        if (timestamp - this.start >= getDuration(this.props.params.speed)) {
            this.start = timestamp;
            this.frame();
        }
        this.playTimeout = window.requestAnimationFrame(this.play);
    };

    render() {
        const {attributes} = this.props;
        return (<CanvasWrapper ref={this.canvasRef} {...attributes}/>);
    }
}

export default Canvas;
