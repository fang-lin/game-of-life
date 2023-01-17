import React, {Component, RefObject} from 'react';
import {CanvasWrapper} from './Canvas.styles';
import {LifeMap} from '../LifeMap';
import {draw, shouldLayoutCanvas} from './Canvas.functions';
import {Attributes, ParsedParams, PlayState, Speed} from '../App.functions';

export type Size = [number, number];
export type Coordinate = [number, number];

export interface GetCellsHook {
    getCellsHook: () => Coordinate[]
}

export interface SetCellsHook {
    setCellsHook: (addedCells: Coordinate[]) => void;
}

export interface EditHook {
    editHook: () => void;
}

export interface GetCellsHook {
    getCellsHook: () => Coordinate[];
}

export interface PlayHook {
    playHook: () => void;
}

export interface PauseHook {
    pauseHook: () => void;
}

export interface NextHook {
    nextHook: () => void;
}

export interface ResetHook {
    resetHook: (cells: Coordinate[]) => void;
}

export interface RenderingHook {
    renderingHook: (cells: Coordinate[]) => void;
}

export type LifeMapHooks =
    GetCellsHook
    & SetCellsHook
    & EditHook
    & PlayHook
    & PauseHook
    & NextHook
    & ResetHook
    & RenderingHook;

export interface CanvasProps {
    size: [number, number];
    playState: PlayState;
    params: ParsedParams;
    attributes: Attributes;
    setLifeMapHooks: (hooks: () => LifeMapHooks) => void;
    origin: Coordinate;
    onEvolve: (cells: Coordinate[]) => void;
}

const durations = [1000, 500, 100, 50, 25, 0];

function getDuration(speed: number) {
    return durations[speed] === undefined ? durations[Speed.Default] : durations[speed];
}

export class Canvas extends Component<CanvasProps> implements LifeMapHooks {
    lifeMap: LifeMap;
    private playTimeout = NaN;
    private readonly canvasRef: RefObject<HTMLCanvasElement>;
    private start: number = -Infinity;

    constructor(props: CanvasProps) {
        super(props);
        this.canvasRef = React.createRef();
        this.lifeMap = new LifeMap();
        this.props.setLifeMapHooks(() => ({
            getCellsHook: this.getCellsHook,
            setCellsHook: this.setCellsHook,
            editHook: this.editHook,
            playHook: this.playHook,
            pauseHook: this.pauseHook,
            nextHook: this.nextHook,
            resetHook: this.resetHook,
            renderingHook: this.renderingHook,
        }));
    }

    componentDidUpdate(prevProps: CanvasProps) {
        if (shouldLayoutCanvas(prevProps, this.props)) {
            this.renderCells([]);
        }
    }

    render() {
        const {attributes} = this.props;
        return (<CanvasWrapper ref={this.canvasRef} {...attributes}/>);
    }

    renderingHook = (hoveringCells: Coordinate[]) => {
        window.requestAnimationFrame(() => this.renderCells(hoveringCells));
    }

    editHook = () => {
        window.cancelAnimationFrame(this.playTimeout);
    }

    getCellsHook = (): Coordinate[] => this.lifeMap.getCells();

    setCellsHook = (addedCells: Coordinate[]) => {
        this.lifeMap.toggleCells(addedCells);
        this.renderCells([]);
    }

    nextHook = () => this.evolve();

    pauseHook = () => window.cancelAnimationFrame(this.playTimeout);

    playHook = () => window.requestAnimationFrame(this.play);

    resetHook = (cells: Coordinate[]) => {
        const {lifeMap, playTimeout, renderCells} = this;
        window.cancelAnimationFrame(playTimeout);
        lifeMap.reset();
        lifeMap.addCells(cells);
        renderCells([]);
    }

    private evolve() {
        const {
            lifeMap,
            props: {onEvolve}
        } = this;
        lifeMap.evolve();
        onEvolve(lifeMap.getCells());
        this.renderCells([]);
    }

    private play = (timestamp: number) => {
        if (timestamp - this.start >= getDuration(this.props.params.speed)) {
            this.start = timestamp;
            this.evolve();
        }
        this.playTimeout = window.requestAnimationFrame(this.play);
    };

    private renderCells = (hoveringCells: Coordinate[]) => {
        const {
            lifeMap,
            canvasRef,
            props: {params: {scale, gridType, showDeadCells}, size, origin}
        } = this;

        draw({
            canvasRef,
            size,
            lifeMap,
            hoveringCells,
            scale,
            gridType,
            origin,
            showDeadCells
        });
    };
}

export default Canvas;
