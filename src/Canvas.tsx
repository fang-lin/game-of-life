import React, {Component, RefObject} from 'react';
import {CanvasWrapper} from './Canvas.styles';
import {LifeMap} from './LifeMap';
import {drawGrid, drawLife, wipe} from './drawer';
import {objectify, ParsedParams, shouldUpdateCanvas} from './utils';
import {Attributes, OnClickCell, PlayState} from './App';

export type Size = [number, number];
export type Coordinate = [number, number];

export interface CanvasProps {
    size: [number, number];
    playState: PlayState;
    setPlayState: (s: PlayState) => void;
    clickCellCallback: (cb: OnClickCell) => void;
    params: ParsedParams;
    attributes: Attributes;
}

const duration = 0;
export const cell = 20;

export class Canvas extends Component<CanvasProps> {
    lifeMap: LifeMap;
    initCells: Array<Coordinate>;
    playTimout?: NodeJS.Timeout;
    private readonly canvasRef: RefObject<HTMLCanvasElement>;

    constructor(props: CanvasProps) {
        super(props);
        this.canvasRef = React.createRef();
        this.lifeMap = new LifeMap();
        this.initCells = [];
        this.props.clickCellCallback((coords) => {
            this.lifeMap.toggleCell(coords);
            const context = this.canvasRef.current?.getContext('2d');
            if (context) {
                this.draw(context);
            }
        });
    }

    draw(context: CanvasRenderingContext2D) {
        const {params: {cellSize, gridOn}, size} = this.props;
        wipe(context, size);
        gridOn && drawGrid(context, size, cellSize);
        drawLife(context, this.lifeMap.cells, cellSize);
    }

    componentDidUpdate(prevProps: CanvasProps) {
        const element = this.canvasRef.current;
        if (element) {
            const context = element.getContext('2d');
            if (context) {
                const {playState} = this.props;
                if (shouldUpdateCanvas(prevProps, this.props)) {
                    this.draw(context);
                }
                switch (playState) {
                case PlayState.Paused:
                    this.playTimout && clearTimeout(this.playTimout);
                    break;
                case prevProps.playState !== PlayState.Paused && PlayState.Playing:
                    this.initCells = objectify(this.lifeMap.cells);
                    this.play();
                    break;
                case PlayState.Playing:
                    this.play();
                    break;
                // case PlayState.Cleaned:
                //     this.playTimout && clearTimeout(this.playTimout);
                //     this.lifeMap.reset();
                //     this.draw(context);
                //     break;
                // case PlayState.Reset:
                //     this.playTimout && clearTimeout(this.playTimout);
                //     this.lifeMap.reset();
                //     this.lifeMap.addCells(this.initCells);
                //     this.draw(context);
                //     break;
                }
            }
        }
    }

    frame = () => {
        const context = this.canvasRef.current?.getContext('2d');
        if (context) {
            this.draw(context);
            this.lifeMap.evolve();
            console.log(this.lifeMap.toString());
        }
    };

    play = () => {
        this.frame();
        this.playTimout = setTimeout(this.play, duration);
    };

    render() {
        const {attributes} = this.props;
        return (<CanvasWrapper ref={this.canvasRef} {...attributes}/>);
    }
}

export default Canvas;