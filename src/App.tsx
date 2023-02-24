import React, {
    Component,
    ComponentType,
    KeyboardEvent,
    RefObject
} from 'react';
import {AppWrapper, BottomSection} from './App.styles';
import Canvas, {Coordinate, LifeMapHooks} from './Canvas/Canvas';
import {useNavigate, useParams, NavigateFunction} from 'react-router-dom';
import Panel from './Panels/Panel';
import {
    Attributes,
    combinePathToURL,
    DragEvent,
    DragEvents,
    DragState,
    getClient,
    isTouchscreenDevices,
    OriginalParams,
    ParsedParams,
    parseParams,
    pixelRatio,
    PlayState,
    rotateCells,
    stringifyParams,
} from './App.functions';
import Dashboard from './Dashboard';
import Footer from './Footer';
import Header from './Header';
import {Pattern} from './Panels/PatternsPanel';
import Toast from './Toast';


interface RouterProps{
    router: {
        navigate: NavigateFunction;
        params: OriginalParams;
    }
}

function withRouter(WrappedComponent: ComponentType){
    return (props: any) => {
        let navigate = useNavigate();
        let params = useParams();
        return (
            <WrappedComponent {...props} router={{ navigate, params }}/>
        );
    };
}

interface AppState {
    size: [number, number];
    playState: PlayState;
    evolutionIndex: number;
    hoveringCell: Coordinate | null;
    selectedPattern: Pattern | null;
    showPatternPanel: boolean;
    cellsCount: number;
    origin: Coordinate;
    dragState: DragState;
    showToast: boolean;
}

export const App = withRouter(class extends Component<RouterProps, AppState>{
    private getCells?: () => Coordinate[];
    private edit?: () => void;
    private createSharedLink?: () => void;
    private next?: () => void;
    private pause?: () => void;
    private play?: () => void;
    private reset?: () => void;
    private setCells?: (addedCells: Coordinate[]) => void;
    private rendering?: (cells: Coordinate[]) => void;
    private readonly appRef: RefObject<HTMLDivElement>;
    private client: Coordinate = [NaN, NaN];

    constructor(props: any) {
        super(props);
        this.appRef = React.createRef();
        const {origin} = parseParams(this.props.router.params);
        this.state = {
            evolutionIndex: 0,
            size: [0, 0],
            playState: PlayState.Editing,
            hoveringCell: null,
            selectedPattern: null,
            showPatternPanel: false,
            cellsCount: 0,
            dragState: DragState.end,
            showToast: false,
            origin,
        };
    }

    onResize = () => requestAnimationFrame(() => {
        const {width = 0, height = 0} = this.appRef.current?.getBoundingClientRect() || {};
        this.setState({size: [width, height]});
    });

    setSelectedPattern = (selectedPattern: Pattern | null) => this.setState({selectedPattern});

    togglePatternPanel = (showPatternPanel: boolean) => this.setState({showPatternPanel});

    pushToHistory = (parsedParams: Partial<ParsedParams>): void => {
        const {navigate, params} = this.props.router;
        navigate(combinePathToURL(stringifyParams({...parseParams(params), ...parsedParams})));
    };

    setCellsFromParams = () => {
        const {cells} = parseParams(this.props.router.params);
        if (cells && this.setCells) {
            this.setCells(cells);
            this.setState({cellsCount: cells.length});
        }
    };

    componentDidMount(): void {
        this.onResize();
        this.setCellsFromParams();
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
        const {key} = event as unknown as KeyboardEvent;
        switch (key) {
        case 'Escape':
            this.setState({selectedPattern: null});
            break;
        case 'ArrowLeft':
            this.rotateHoveringCells(false);
            break;
        case 'ArrowRight':
            this.rotateHoveringCells(true);
            break;
        }
    };

    clientToCell = (currentClient: Coordinate): Coordinate => {
        const {size} = this.state;
        const {scale, origin} = parseParams(this.props.router.params);
        return [
            Math.floor(origin[0] + (currentClient[0] - size[0] / 2) / scale),
            Math.floor(origin[1] + (currentClient[1] - size[1] / 2) / scale),
        ];
    };

    clientToOrigin = (currentClient: Coordinate): Coordinate => {
        const {client} = this;
        const {origin, scale} = parseParams(this.props.router.params);
        return [
            origin[0] + (client[0] - currentClient[0]) / scale,
            origin[1] + (client[1] - currentClient[1]) / scale
        ];
    };

    onClickCell = (event: Event) => {
        const currentClient = getClient(event as DragEvent);
        const instantaneousOffset = this.getInstantaneousOffset(currentClient);
        if (!this.shouldDragCanvas(instantaneousOffset)) {
            const {playState} = this.state;
            if (playState === PlayState.Editing) {
                this.setCells && this.setCells(this.getHoveringCells(this.clientToCell(currentClient)));
            }
        }
    };

    onMouseMove = (event: Event) => {
        if (this.rendering && this.state.dragState === DragState.end) {
            this.setHoveringCell(event);
            this.rendering(this.getHoveringCells(this.state.hoveringCell));
        }
    };

    onDragStart = (event: Event): void => {
        this.setState({dragState: DragState.start});
        this.setHoveringCell(event);
        this.client = getClient(event as DragEvent);
        window.addEventListener(DragEvents[DragState.moving], this.onDragging);
        window.addEventListener(DragEvents[DragState.end], this.onDragEnd);
    };

    onDragging = (event: Event): void => {
        if (this.rendering) {
            this.setState({
                dragState: DragState.moving,
                origin: this.clientToOrigin(getClient(event as DragEvent)),
            }, () => {
                this.rendering && this.rendering(this.getHoveringCells(this.state.hoveringCell));
            });
        }
    };

    onDragEnd = (event: Event): void => {
        if (this.rendering) {
            const origin = this.clientToOrigin(getClient(event as DragEvent));
            this.setHoveringCell(event);
            this.rendering(this.getHoveringCells(this.state.hoveringCell));
            this.setState({
                dragState: DragState.end,
                origin,
            });
            this.pushToHistory({origin});
        }
        window.removeEventListener(DragEvents[DragState.moving], this.onDragging);
        window.removeEventListener(DragEvents[DragState.end], this.onDragEnd);
    };

    setLifeMapHooks = (hooks: () => LifeMapHooks) => {
        const {pushToHistory} = this;
        const {
            getCellsHook,
            setCellsHook,
            editHook,
            playHook,
            pauseHook,
            nextHook,
            resetHook,
            renderingHook,
        } = hooks();

        this.setCells = setCellsHook;
        this.createSharedLink = () => {
            const path = combinePathToURL(stringifyParams({...parseParams(this.props.router.params), ...{cells: getCellsHook()}}));
            navigator.clipboard.writeText(`${window.location.origin}/#${path}`).then(() => {
                this.setState({showToast: true});
            });
        };
        this.rendering = renderingHook;
        this.edit = () => {
            editHook();
            this.setState({
                playState: PlayState.Editing,
                evolutionIndex: 0
            });
        };
        this.next = nextHook;
        this.pause = () => {
            this.setState({
                playState: PlayState.Paused
            });
            pauseHook();
        };

        this.reset = () => {
            const {cells} = parseParams(this.props.router.params);
            pushToHistory({
                origin: [0, 0]
            });
            this.setState({
                cellsCount: cells.length,
                hoveringCell: null,
                playState: PlayState.Editing,
                evolutionIndex: 0,
                origin: [0, 0],
            }, () => resetHook(cells));
        };

        this.play = () => {
            this.setState({
                playState: PlayState.Playing
            });
            playHook();
        };
    };

    onEvolve = (cells: Coordinate[]) => {
        this.setState(({evolutionIndex}) => ({
            cellsCount: cells.length,
            evolutionIndex: evolutionIndex + 1
        }));
    };

    toggleToast = (showToast: boolean, cb?: () => void) => this.setState({showToast}, cb);

    render() {
        const {
            size,
            playState,
            evolutionIndex,
            hoveringCell,
            cellsCount,
            origin,
            dragState,
            selectedPattern,
            showPatternPanel,
            showToast,
        } = this.state;

        const {
            pushToHistory,
            setSelectedPattern,
            togglePatternPanel,
            getCells,
            setLifeMapHooks,
            reset,
            next,
            pause,
            play,
            edit,
            onEvolve,
            createSharedLink,
            toggleToast,
            rotateHoveringCells,
        } = this;

        const params = parseParams(this.props.router.params);

        const attributes: Attributes = {
            width: size[0] * pixelRatio,
            height: size[1] * pixelRatio
        };

        return (
            <AppWrapper ref={this.appRef} {...{playState, dragState}}>
                <Canvas {...{
                    size,
                    playState,
                    params,
                    attributes,
                    origin,
                    setLifeMapHooks,
                    onEvolve,
                }}/>
                <Header/>
                <Dashboard {...{evolutionIndex, cellsCount, params, hoveringCell}}/>
                <BottomSection>
                    <Footer/>
                    {reset && next && pause && play && edit && createSharedLink && <Panel {...{
                        playState,
                        pushToHistory,
                        params,
                        showPatternPanel,
                        togglePatternPanel,
                        setSelectedPattern,
                        selectedPattern,
                        getCells,
                        reset,
                        next,
                        pause,
                        play,
                        edit,
                        createSharedLink,
                        rotateHoveringCells,
                    }}/>}
                </BottomSection>
                <Toast {...{showToast, toggleToast}}>Copied the shared link to clipboard.</Toast>
            </AppWrapper>
        );
    }

    private rotateHoveringCells = (clockwise = true) => {
        if (this.state.selectedPattern) {
            const {name, cells} = this.state.selectedPattern;
            this.setState({
                selectedPattern: {
                    name,
                    cells: rotateCells(cells, clockwise)
                }
            }, () => this.rendering && this.rendering(this.getHoveringCells(this.state.hoveringCell)));
        }
    };

    private setHoveringCell = (event: Event) => {
        this.setState({hoveringCell: this.clientToCell(getClient(event as DragEvent))});
    };

    private getHoveringCells(cell: Coordinate | null): Coordinate[] {
        const {selectedPattern} = this.state;
        if (cell) {
            return selectedPattern ? selectedPattern.cells.map(s => [s[0] + cell[0], s[1] + cell[1]]) : [cell];
        }
        return [];
    }

    private shouldDragCanvas(instantaneousOffset: Coordinate): boolean {
        const {scale} = parseParams(this.props.router.params);
        return Math.abs(instantaneousOffset[0]) > scale || Math.abs(instantaneousOffset[1]) > scale;
    }

    private getInstantaneousOffset(instantaneousClient: Coordinate): Coordinate {
        const {client} = this;
        return [
            instantaneousClient[0] - client[0],
            instantaneousClient[1] - client[1],
        ];
    }
});
