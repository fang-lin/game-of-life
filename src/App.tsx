import React, {Component, RefObject, KeyboardEvent} from 'react';
import {AppWrapper, BottomSection} from './App.styles';
import {Coordinate} from './Canvas';
import {RouteComponentProps} from 'react-router-dom';
import Panel from './Panel';
import {
    combinePathToURL,
    DragEvent,
    DragEvents,
    DragState,
    getClient,
    isTouchscreenDevices,
    OriginalParams,
    ParsedParams,
    parseParams,
    PlayState,
    stringifyParams
} from './App.functions';
import Dashboard from './Dashboard';
import Footer from './Footer';
import Header from './Header';
import {Stage} from './Stage';
import isEmpty from 'lodash/isEmpty';

interface AppState {
    size: [number, number];
    playState: PlayState;
    frameIndex: number;
    addedCells: Coordinate[];
    hoveringCell: Coordinate | null;
    selectedCells: Coordinate[];
    cellsCount: number;
    client: Coordinate;
    origin: Coordinate;
    dragState: DragState;
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
            addedCells: [],
            hoveringCell: null,
            selectedCells: [],
            cellsCount: 0,
            client: [0, 0],
            origin: parseParams(this.props.match.params).origin,
            dragState: DragState.end,
        };
    }

    onResize = () => requestAnimationFrame(() => {
        const {width = 0, height = 0} = this.appRef.current?.getBoundingClientRect() || {};
        this.setState({size: [width, height]});
    });

    setPlayState = (playState: PlayState) => this.setState({playState});
    setFrameIndex = (op: (index: number) => number) => this.setState({frameIndex: op(this.state.frameIndex)});
    setSelectedCells = (selectedCells: Coordinate[], cb?: () => void) => this.setState({selectedCells}, cb);
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
        window.addEventListener('keydown', this.onKeydown);
    }

    componentWillUnmount(): void {
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener(DragEvents[DragState.start], this.onDragStart);
        isTouchscreenDevices || window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('click', this.onClickCell);
        window.removeEventListener('keydown', this.onKeydown);
    }

    onKeydown = (event: Event) => {
        if ((event as unknown as KeyboardEvent).key === 'Escape') {
            this.setState({selectedCells: []});
        }
    };

    onMouseMove = (event: Event) => {
        this.setState({hoveringCell: this.clientToCell(getClient(event as DragEvent))});
    };

    clientToCell = (currentClient: Coordinate): Coordinate => {
        const {size, origin} = this.state;
        const {scale} = parseParams(this.props.match.params);
        return [
            Math.floor(origin[0] + (currentClient[0] - size[0] / 2) / scale),
            Math.floor(origin[1] + (currentClient[1] - size[1] / 2) / scale),
        ];
    }

    onClickCell = (event: Event) => {
        const currentClient = getClient(event as DragEvent);
        const instantaneousOffset = this.getInstantaneousOffset(currentClient);
        if (!this.shouldDragCanvas(instantaneousOffset)) {
            const {playState, selectedCells} = this.state;
            const cell: Coordinate = this.clientToCell(currentClient);
            if (playState === PlayState.Editing) {
                if (isEmpty(selectedCells)) {
                    this.setState({
                        addedCells: [cell],
                        hoveringCell: cell,
                    }, () => this.setState({addedCells: []}));
                } else {
                    this.setState({
                        addedCells: selectedCells.map(s => [s[0] + cell[0], s[1] + cell[1]]),
                        hoveringCell: cell,
                    }, () => this.setState({addedCells: []}));
                }

            } else {
                this.setState({
                    hoveringCell: cell,
                });
            }
        }
    };

    clientToOrigin = (currentClient: Coordinate): Coordinate => {
        const {client} = this.state;
        const {origin, scale} = parseParams(this.props.match.params);
        return [
            origin[0] + (client[0] - currentClient[0]) / scale,
            origin[1] + (client[1] - currentClient[1]) / scale
        ];
    }

    onDragStart = (event: Event): void => {
        this.setState({
            client: getClient(event as DragEvent),
            dragState: DragState.start
        });
        window.addEventListener(DragEvents[DragState.moving], this.onDragging);
        window.addEventListener(DragEvents[DragState.end], this.onDragEnd);
    };

    onDragging = (event: Event): void => {
        this.setState({
            origin: this.clientToOrigin(getClient(event as DragEvent)),
            dragState: DragState.moving
        });
    };

    onDragEnd = (event: Event): void => {
        const origin = this.clientToOrigin(getClient(event as DragEvent));
        this.pushToHistory({origin});
        this.setState({
            dragState: DragState.end,
            origin,
        });
        window.removeEventListener(DragEvents[DragState.moving], this.onDragging);
        window.removeEventListener(DragEvents[DragState.end], this.onDragEnd);
    };

    render() {
        const {
            size,
            playState,
            frameIndex,
            hoveringCell,
            cellsCount,
            origin,
            dragState,
            selectedCells,
            addedCells,
        } = this.state;

        const {
            pushToHistory,
            setFrameIndex,
            setPlayState,
            setCellsCount,
            setSelectedCells,
        } = this;

        const params = parseParams(this.props.match.params);

        return (
            <AppWrapper ref={this.appRef} {...{playState, dragState}}>
                <Stage {...{
                    setFrameIndex,
                    setPlayState,
                    setCellsCount,
                    size,
                    playState,
                    addedCells,
                    hoveringCell,
                    selectedCells,
                    frameIndex,
                    params,
                    origin,
                }}/>
                <Header/>
                <Dashboard {...{frameIndex, cellsCount, params, hoveringCell, setSelectedCells}}/>
                <BottomSection>
                    <Footer/>
                    <Panel {...{playState, pushToHistory, params, setPlayState}}/>
                </BottomSection>
            </AppWrapper>
        );
    }

    private shouldDragCanvas(instantaneousOffset: Coordinate): boolean {
        const {scale} = parseParams(this.props.match.params);
        return Math.abs(instantaneousOffset[0]) > scale || Math.abs(instantaneousOffset[1]) > scale;
    }

    private getInstantaneousOffset(instantaneousClient: Coordinate): Coordinate {
        const {state: {client}} = this;
        return [
            instantaneousClient[0] - client[0],
            instantaneousClient[1] - client[1],
        ];
    }
}

export default App;
