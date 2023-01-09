import React, {Component, MouseEvent, RefObject} from 'react';
import {AppWrapper, BottomSection} from './App.styles';
import {Coordinate} from './Canvas';
import {RouteComponentProps} from 'react-router-dom';
import Panel from './Panel';
import {
    combinePathToURL,
    isTouchscreenDevices,
    OriginalParams,
    ParsedParams,
    parseParams,
    stringifyParams
} from './App.functions';
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

export enum DragState {
    start,
    moving,
    end
}

export enum PlayState {
    Reset = 'reset',
    Next = 'next',
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

export const DragEvents: Record<DragState, keyof WindowEventMap> = isTouchscreenDevices ? {
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

    setPlayState = (playState: PlayState) => this.setState({playState});
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
        isTouchscreenDevices || window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('click', this.onClickCell);
    }

    componentWillUnmount(): void {
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener(DragEvents[DragState.start], this.onDragStart);
        isTouchscreenDevices || window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('click', this.onClickCell);
    }

    onMouseMove = (event: Event) => {
        const currentClient = getClient(event as DragEvent);
        const {cellSize} = parseParams(this.props.match.params);
        this.setHoveringCell([
            Math.floor(currentClient[0] / cellSize),
            Math.floor(currentClient[1] / cellSize)
        ]);
    };

    onClickCell = (event: Event) => {
        const currentClient = getClient(event as DragEvent);
        const instantaneousTransform = this.getInstantaneousTransform(currentClient);
        const {playState} = this.state;
        console.log('onClickCell');
        if (!this.shouldDragCanvas(instantaneousTransform)) {
            const {cellSize} = parseParams(this.props.match.params);
            const cell: Coordinate = [
                Math.floor(currentClient[0] / cellSize),
                Math.floor(currentClient[1] / cellSize),
            ];
            if (playState === PlayState.Editing) {
                this.setState({
                    clickedCell: cell,
                    hoveringCell: cell,
                }, () => this.setState({clickedCell: null}));
            } else {
                this.setState({
                    hoveringCell: cell,
                });
            }
        }
    };

    onDragging = (event: Event): void => {
        const currentClient = getClient(event as DragEvent);
        const {client} = this.state;

        this.setState({
            transform: [currentClient[0] - client[0], currentClient[1] - client[1]],
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
        console.log('onDragEnd');
        const instantaneousTransform = this.getInstantaneousTransform(getClient(event as DragEvent));
        if (this.shouldDragCanvas(instantaneousTransform)) {
            const {props: {match: {params}}} = this;
            const {origin} = parseParams(params);

            this.pushToHistory({
                origin: [
                    origin[0] + instantaneousTransform[0],
                    origin[1] + instantaneousTransform[1]
                ]
            });
            this.setState({
                transform: [0, 0],
                dragState: DragState.end,
                client: [0, 0]
            });
        }
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

    private shouldDragCanvas(instantaneousTransform: Coordinate): boolean {
        const {cellSize} = parseParams(this.props.match.params);
        return Math.abs(instantaneousTransform[0]) > cellSize || Math.abs(instantaneousTransform[1]) > cellSize;
    }

    private getInstantaneousTransform(instantaneousClient: Coordinate): Coordinate {
        const {state: {client}} = this;
        return [
            instantaneousClient[0] - client[0],
            instantaneousClient[1] - client[1],
        ];
    }
}

export default App;
