import React, {Component, RefObject} from 'react';
import {AppWrapper} from './App.styles';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import Canvas, {Coordinate} from './Canvas';
import {RouteComponentProps} from 'react-router-dom';
import MaskCanvas from './MaskCanvas';
import Panel from './Panel';

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

export type OnClickCell = (xy: Coordinate) => void;
export type OnClickNext = () => void;

export class App extends Component<RouteComponentProps, AppState> {
    onClickCell: OnClickCell = noop;
    private readonly appRef: RefObject<HTMLDivElement>;

    constructor(props: RouteComponentProps) {
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
        const {setPlayState, onClickCell} = this;
        const clickCellCallback = (cb: OnClickCell) => this.onClickCell = cb;
        return (
            <AppWrapper ref={this.appRef}>
                <Canvas {...{size, playState, setPlayState, clickCellCallback}}/>
                <MaskCanvas {...{size, playState, onClickCell}} />
                <Panel {...{playState, setPlayState}}/>
            </AppWrapper>
        );
    }
}

export default App;
