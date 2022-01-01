import React, {Component, RefObject} from 'react';
import {AppWrapper} from './App.styles';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import Canvas, {Coordinate} from './Canvas';
import {RouteComponentProps} from 'react-router-dom';
import MaskCanvas from './MaskCanvas';
import Panel from './Panel';
import {combinePathToURL, pixelRatio, OriginalParams, ParsedParams, parseParams, stringifyParams} from './utils';

export enum PlayState {
    Playing,
    Cleaned,
    Paused,
    Reset
}

interface AppState {
    size: [number, number];
    playState: PlayState;
}

export interface Attributes {
    width: number;
    height: number;
}

export type OnClickCell = (xy: Coordinate) => void;

export class App extends Component<RouteComponentProps<OriginalParams>, AppState> {
    onClickCell: OnClickCell = noop;
    private readonly appRef: RefObject<HTMLDivElement>;

    constructor(props: RouteComponentProps<OriginalParams>) {
        super(props);
        this.appRef = React.createRef();
        this.state = {
            size: [0, 0],
            playState: PlayState.Cleaned
        };
    }

    onResize = () => requestAnimationFrame(() => {
        const {width = 0, height = 0} = this.appRef.current?.getBoundingClientRect() || {};
        this.setState({size: [width, height]});
    });

    onResizing = debounce(this.onResize, 200);

    setPlayState = (playState: PlayState, callback?: () => void) => this.setState({playState}, callback);

    pushToHistory = (parsedParams: Partial<ParsedParams>): void => {
        const {history: {push}, match: {params}} = this.props;
        push(combinePathToURL(stringifyParams({...parseParams(params), ...parsedParams})));
    }

    componentDidMount(): void {
        this.onResize();
        window.addEventListener('resize', this.onResize);
        // window.addEventListener(DragEvents[DragState.moving], this.onMoving);
        // window.addEventListener(DragEvents[DragState.start], this.onDragStart);
    }

    componentWillUnmount(): void {
        window.removeEventListener('resize', this.onResize);
        // window.removeEventListener(DragEvents[DragState.moving], this.onMoving);
        // window.removeEventListener(DragEvents[DragState.start], this.onDragStart);
    }

    render() {
        const {size, playState} = this.state;
        const {setPlayState, onClickCell, pushToHistory} = this;
        const clickCellCallback = (cb: OnClickCell) => this.onClickCell = cb;
        const params = parseParams(this.props.match.params);
        const attributes: Attributes = {
            width: size[0] * pixelRatio,
            height: size[1] * pixelRatio
        };
        return (
            <AppWrapper ref={this.appRef}>
                <Canvas {...{size, playState, setPlayState, clickCellCallback, params, attributes}}/>
                <MaskCanvas {...{size, playState, onClickCell, params, attributes}} />
                <Panel {...{playState, setPlayState, pushToHistory, params}}/>
            </AppWrapper>
        );
    }
}

export default App;
