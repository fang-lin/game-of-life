import React, {Component, RefObject} from 'react';
import {AppWrapper, BottomSection} from './App.styles';
import debounce from 'lodash/debounce';
import Canvas, {Coordinate} from './Canvas';
import {RouteComponentProps} from 'react-router-dom';
import MaskCanvas from './MaskCanvas';
import Panel from './Panel';
import {combinePathToURL, pixelRatio, OriginalParams, ParsedParams, parseParams, stringifyParams} from './utils';
import Dashboard from './Dashboard';
import Footer from './Footer';
import Header from './Header';

export enum PlayState {
    Reset,
    Editing,
    Playing,
    Paused,
}

interface AppState {
    size: [number, number];
    playState: PlayState;
    frameIndex: number;
    clickedCell: Coordinate | null;
    cellsCount: number;
}

export interface Attributes {
    width: number;
    height: number;
}

export class App extends Component<RouteComponentProps<OriginalParams>, AppState> {
    private readonly appRef: RefObject<HTMLDivElement>;

    constructor(props: RouteComponentProps<OriginalParams>) {
        super(props);
        this.appRef = React.createRef();
        this.state = {
            frameIndex: 0,
            size: [0, 0],
            playState: PlayState.Editing,
            clickedCell: null,
            cellsCount: 0
        };
    }

    onResize = () => requestAnimationFrame(() => {
        const {width = 0, height = 0} = this.appRef.current?.getBoundingClientRect() || {};
        this.setState({size: [width, height]});
    });

    onResizing = debounce(this.onResize, 200);

    setPlayState = (playState: PlayState, cb?: () => void) => this.setState({playState}, cb);
    setFrameIndex = (op: (index: number) => number) => this.setState({frameIndex: op(this.state.frameIndex)});
    setClickedCell = (clickedCell: Coordinate | null, cb?: () => void) => this.setState({clickedCell}, cb);
    setCellsCount = (cellsCount: number) => this.setState({cellsCount});

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
        const {size, playState, frameIndex, clickedCell, cellsCount} = this.state;
        const {
            pushToHistory,
            setFrameIndex,
            setClickedCell,
            setPlayState,
            setCellsCount,
        } = this;

        const params = parseParams(this.props.match.params);
        const attributes: Attributes = {
            width: size[0] * pixelRatio,
            height: size[1] * pixelRatio
        };

        return (
            <AppWrapper ref={this.appRef}>
                <Canvas {...{
                    size,
                    playState,
                    setPlayState,
                    clickedCell,
                    params,
                    attributes,
                    frameIndex,
                    setFrameIndex,
                    setCellsCount
                }}/>
                <MaskCanvas {...{size, playState, setClickedCell, params, attributes}} />
                <Header/>
                <Dashboard {...{frameIndex, cellsCount}}/>
                <BottomSection>
                    <Footer/>
                    <Panel {...{playState, pushToHistory, params, setPlayState}}/>
                </BottomSection>
            </AppWrapper>
        );
    }
}

export default App;
