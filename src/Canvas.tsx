import React, {Component, RefObject} from 'react';
import {CanvasWrapper} from './Canvas.styles';
import {LifeMap} from './LifeMap';
import {draw, shouldLayoutCanvas} from './Canvas.functions';
import {Attributes, ParsedParams, PlayState, Speed} from './App.functions';
import isEmpty from 'lodash/isEmpty';

export type Size = [number, number];
export type Coordinate = [number, number];

export interface CanvasProps {
    size: [number, number];
    playState: PlayState;
    setPlayState: (playState: PlayState) => void;
    frameIndex: number;
    setFrameIndex: (op: (index: number) => number) => void;
    addedCells: Coordinate[];
    params: ParsedParams;
    attributes: Attributes;
    setCellsCount: (cellsCount: number) => void;
    origin: Coordinate;
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
            props: {
                setFrameIndex,
                frameIndex,
                addedCells,
                playState,
                setPlayState,
                origin,
                setCellsCount
            },
        } = this;

        if (playState === PlayState.Editing && !isEmpty(addedCells)) {
            // Clicked cell when editing
            lifeMap.toggleCells(addedCells);
            console.log(JSON.stringify(Array.from(lifeMap.cells.values())));
            setCellsCount(lifeMap.cells.size);
            this.renderCells();
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
            this.renderCells();
            setPlayState(PlayState.Editing);
        }

        if (shouldLayoutCanvas(prevProps, this.props)) {
            this.renderCells();
        }

        if (prevProps.origin !== origin) {
            window.requestAnimationFrame(this.renderCells);
        }
    }

    frame() {
        const {
            lifeMap,
            props: {setFrameIndex, setCellsCount}
        } = this;
        setFrameIndex(i => i + 1);
        lifeMap.evolve();
        setCellsCount(lifeMap.cells.size);
        this.renderCells();
    }

    play = (timestamp: number) => {
        if (timestamp - this.start >= getDuration(this.props.params.speed)) {
            this.start = timestamp;
            this.frame();
        }
        this.playTimeout = window.requestAnimationFrame(this.play);
    };

    renderCells = () => {
        const {
            lifeMap,
            canvasRef,
            props: {params: {scale, gridType}, size, origin}
        } = this;
        draw(canvasRef, 'black', size, lifeMap.cells, scale, gridType, origin);
    };

    render() {
        const {attributes} = this.props;
        return (<CanvasWrapper ref={this.canvasRef} {...attributes}/>);
    }
}

export default Canvas;
