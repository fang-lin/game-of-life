import React, {Component, MouseEvent, RefObject} from 'react';
import {AppWrapper, BottomSection} from './App.styles';
import {Coordinate} from './Canvas';
import {RouteComponentProps} from 'react-router-dom';
import Panel from './Panel';
import {combinePathToURL, OriginalParams, ParsedParams, parseParams, stringifyParams} from './utils';
import Dashboard from './Dashboard';
import Footer from './Footer';
import Header from './Header';
import {Stage} from './Stage';

function isTouchEvent(event: DragEvent): event is TouchEvent {
    return window.TouchEvent && event instanceof TouchEvent;
}

export type DragEvent = MouseEvent | TouchEvent;

export function getClient(event: DragEvent): Coordinate {
    const {clientX, clientY} = isTouchEvent(event) ? event.changedTouches[0] : event;
    return [clientX, clientY];
}

export const isMobile: boolean = ((): boolean => {
    try {
        document.createEvent('TouchEvent');
        return true;
    } catch (e) {
        return false;
    }
})();

export enum DragState {
    start,
    moving,
    end
}


export enum PlayState {
    Reset = 'reset',
    Editing = 'editing',
    Playing = 'playing',
    Paused = 'paused',
}

interface AppState {
    size: [number, number];
    playState: PlayState;
    frameIndex: number;
    clickedCell: Coordinate | null;
    hoveringCell: Coordinate | null;
    cellsCount: number;
    client: Coordinate;
    transform: Coordinate;
    dragState: DragState;
}

export interface Attributes {
    width: number;
    height: number;
}

export const DragEvents: Record<DragState, keyof WindowEventMap> = isMobile ? {
    [DragState.start]: 'touchstart',
    [DragState.moving]: 'touchmove',
    [DragState.end]: 'touchend',
} : {
    [DragState.start]: 'mousedown',
    [DragState.moving]: 'mousemove',
    [DragState.end]: 'mouseup',
};

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
            hoveringCell: null,
            cellsCount: 0,
            client: [0, 0],
            transform: [0, 0],
            dragState: DragState.end,
        };
    }

    onResize = () => requestAnimationFrame(() => {
        const {width = 0, height = 0} = this.appRef.current?.getBoundingClientRect() || {};
        this.setState({size: [width, height]});
    });

    setPlayState = (playState: PlayState, cb?: () => void) => this.setState({playState}, cb);
    setFrameIndex = (op: (index: number) => number) => this.setState({frameIndex: op(this.state.frameIndex)});
    setClickedCell = (clickedCell: Coordinate | null, cb?: () => void) => this.setState({clickedCell}, cb);
    setHoveringCell = (hoveringCell: Coordinate | null, cb?: () => void) => this.setState({hoveringCell}, cb);
    setCellsCount = (cellsCount: number) => this.setState({cellsCount});

    pushToHistory = (parsedParams: Partial<ParsedParams>): void => {
        const {history: {push}, match: {params}} = this.props;
        push(combinePathToURL(stringifyParams({...parseParams(params), ...parsedParams})));
    };

    componentDidMount(): void {
        this.onResize();
        window.addEventListener('resize', this.onResize);
        window.addEventListener(DragEvents[DragState.start], this.onDragStart);
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('click', this.onClick);
    }

    componentWillUnmount(): void {
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener(DragEvents[DragState.start], this.onDragStart);
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('click', this.onClick);
    }

    onMouseMove = (event: Event) => {
        const {clientX, clientY} = event as unknown as MouseEvent;
        const {cellSize} = parseParams(this.props.match.params);
        this.setHoveringCell([
            Math.floor(clientX / cellSize),
            Math.floor(clientY / cellSize)
        ]);
    };

    onClick = (event: Event) => {
        const {clientX, clientY} = event as unknown as MouseEvent;
        const {playState} = this.state;
        if (playState === PlayState.Editing) {
            const {cellSize} = parseParams(this.props.match.params);
            this.setClickedCell([
                Math.floor(clientY / cellSize),
                Math.floor(clientX / cellSize)
            ], () => this.setClickedCell(null));
        }
    };

    onDragging = (event: Event): void => {
        const instantaneousClient = getClient(event as DragEvent);
        const {client} = this.state;

        this.setState({
            transform: [instantaneousClient[0] - client[0], instantaneousClient[1] - client[1]],
            dragState: DragState.moving
        });
    };

    onDragStart = (event: Event): void => {
        this.setState({
            client: getClient(event as DragEvent),
            dragState: DragState.start
        });
        window.addEventListener(DragEvents[DragState.moving], this.onDragging);
        window.addEventListener(DragEvents[DragState.end], this.onDragEnd);
    };

    onDragEnd = (event: Event): void => {
        const instantaneousClient = getClient(event as DragEvent);
        const {state: {client}, props: {match: {params}}} = this;
        const {origin} = parseParams(params);

        this.pushToHistory({
            origin: [
                origin[0] + (instantaneousClient[0] - client[0]),
                origin[1] + (instantaneousClient[1] - client[1])
            ]
        });
        this.setState({
            transform: [0, 0],
            dragState: DragState.end,
            client: [0, 0]
        });
        window.removeEventListener(DragEvents[DragState.moving], this.onDragging);
        window.removeEventListener(DragEvents[DragState.end], this.onDragEnd);
    };

    render() {
        const {size, playState, frameIndex, clickedCell, hoveringCell, cellsCount, transform} = this.state;
        const {
            pushToHistory,
            setFrameIndex,
            setClickedCell,
            setPlayState,
            setCellsCount,
        } = this;

        const params = parseParams(this.props.match.params);

        return (
            <AppWrapper ref={this.appRef} className={playState}>
                <Stage {...{
                    setFrameIndex,
                    setClickedCell,
                    setPlayState,
                    setCellsCount,
                    size,
                    playState,
                    clickedCell,
                    hoveringCell,
                    frameIndex,
                    transform,
                    params
                }}/>
                <Header/>
                <Dashboard {...{frameIndex, cellsCount, params, hoveringCell}}/>
                <BottomSection>
                    <Footer/>
                    <Panel {...{playState, pushToHistory, params, setPlayState}}/>
                </BottomSection>
            </AppWrapper>
        );
    }
}

export default App;
