import React, {Component, RefObject} from "react";
import {AppWrapper} from "./App.styles";
import debounce from 'lodash/debounce';
import Canvas from "./Canvas";
import {RouteComponentProps} from 'react-router-dom';
import MaskCanvas from "./MaskCanvas";
import Panel from "./Panel";

interface AppProps {

}

export enum PlayState {
    Playing,
    Stopped,
    Paused,
    Reset
}

interface AppState {
    size: [number, number];
    playState: PlayState;
}

export class App extends Component<RouteComponentProps<AppProps>, AppState> {

    private readonly appRef: RefObject<HTMLDivElement>;

    constructor(props: RouteComponentProps<AppProps>) {
        super(props);
        this.appRef = React.createRef();
        this.state = {
            size: [0, 0],
            playState: PlayState.Stopped
        };
    }

    onClickNext: () => void = () => undefined;

    onResize = () => requestAnimationFrame(() => {
        const {width = 0, height = 0} = this.appRef.current?.getBoundingClientRect() || {};
        this.setState({size: [width, height]});
    });

    onResizing = debounce(this.onResize, 200);

    setPlayState = (playState: PlayState) => {
        this.setState({playState})
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
        const {setPlayState, onClickNext} = this;
        const clickNextCallback = (cb: () => void) => this.onClickNext = cb;
        return (
            <AppWrapper ref={this.appRef}>
                <Canvas {...{size, playState, setPlayState, clickNextCallback}}/>
                <MaskCanvas {...{size, playState}} />
                <Panel {...{playState, setPlayState, onClickNext}}/>
            </AppWrapper>
        );
    }
}

export default App;
