import React, {useCallback, useEffect, useRef, useState} from 'react';
import {AppWrapper, BottomSection} from './App.styles';
import {GlobalStyle} from './index.styles';
import {Coordinate} from './Canvas/Canvas';
import {CanvasWrapper} from './Canvas/Canvas.styles';
import {useNavigate, useParams} from 'react-router-dom';
import Panel from './Panels/Panel';
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
    pixelRatio,
    PlayState,
    rotateCells,
    stringifyParams,
    Attributes,
} from './App.functions';
import Dashboard from './Dashboard';
import Footer from './Footer';
import Header from './Header';
import {Pattern} from './Panels/PatternsPanel';
import Toast from './Toast';
import {LifeMap} from './Canvas/LifeMap';
import {draw} from './Canvas/Canvas.functions';

export function App() {
    const navigate = useNavigate();
    const routerParams = useParams<Record<string, string>>() as OriginalParams;
    const params = parseParams(routerParams);

    const appRef = useRef<HTMLDivElement>(null);
    const lifeMapRef = useRef<LifeMap>(new LifeMap());
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const clientRef = useRef<Coordinate>([NaN, NaN]);
    const playTimeoutRef = useRef<number>(NaN);
    const hoveringCellsRef = useRef<Coordinate[]>([]);

    const [size, setSize] = useState<[number, number]>([0, 0]);
    const [playState, setPlayState] = useState(PlayState.Editing);
    const [evolutionIndex, setEvolutionIndex] = useState(0);
    const [hoveringCell, setHoveringCell] = useState<Coordinate | null>(null);
    const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);
    const [showPatternPanel, setShowPatternPanel] = useState(false);
    const [cellsCount, setCellsCount] = useState(0);
    const [origin, setOrigin] = useState<Coordinate>(params.origin);
    const [dragState, setDragState] = useState(DragState.end);
    const [showToast, setShowToast] = useState(false);

    const pushToHistory = useCallback((parsedParams: Partial<ParsedParams>): void => {
        navigate(combinePathToURL(stringifyParams({...parseParams(routerParams), ...parsedParams})));
    }, [navigate, routerParams]);

    // Use refs to avoid stale closures in event handlers
    const paramsRef = useRef(params);
    paramsRef.current = params;
    const sizeRef = useRef(size);
    sizeRef.current = size;
    const originRef = useRef(origin);
    originRef.current = origin;
    const dragStateRef = useRef(dragState);
    dragStateRef.current = dragState;
    const playStateRef = useRef(playState);
    playStateRef.current = playState;
    const selectedPatternRef = useRef(selectedPattern);
    selectedPatternRef.current = selectedPattern;
    const hoveringCellRef = useRef(hoveringCell);
    hoveringCellRef.current = hoveringCell;

    const renderCells = useCallback(() => {
        const {scale, gridType, showDeadCells} = paramsRef.current;
        draw({
            canvasRef,
            size: sizeRef.current,
            lifeMap: lifeMapRef.current,
            hoveringCells: hoveringCellsRef.current,
            scale,
            gridType,
            origin: originRef.current,
            showDeadCells,
        });
    }, []);

    const getHoveringCells = useCallback((cell: Coordinate | null): Coordinate[] => {
        const pattern = selectedPatternRef.current;
        if (cell) {
            return pattern ? pattern.cells.map(s => [s[0] + cell[0], s[1] + cell[1]]) : [cell];
        }
        return [];
    }, []);

    const clientToCell = useCallback((currentClient: Coordinate): Coordinate => {
        const s = sizeRef.current;
        const {scale, origin} = paramsRef.current;
        return [
            Math.floor(origin[0] + (currentClient[0] - s[0] / 2) / scale),
            Math.floor(origin[1] + (currentClient[1] - s[1] / 2) / scale),
        ];
    }, []);

    const clientToOrigin = useCallback((currentClient: Coordinate): Coordinate => {
        const client = clientRef.current;
        const {origin, scale} = paramsRef.current;
        return [
            origin[0] + (client[0] - currentClient[0]) / scale,
            origin[1] + (client[1] - currentClient[1]) / scale
        ];
    }, []);

    const rendering = useCallback((cells: Coordinate[]) => {
        hoveringCellsRef.current = cells;
        window.requestAnimationFrame(() => renderCells());
    }, [renderCells]);

    // Canvas lifecycle hooks
    const setCellsOnMap = useCallback((addedCells: Coordinate[]) => {
        lifeMapRef.current.toggleCells(addedCells);
        renderCells();
    }, [renderCells]);

    const getCells = useCallback((): Coordinate[] => {
        return lifeMapRef.current.getCells();
    }, []);

    const edit = useCallback(() => {
        window.cancelAnimationFrame(playTimeoutRef.current);
        setPlayState(PlayState.Editing);
        setEvolutionIndex(0);
    }, []);

    const next = useCallback(() => {
        const lifeMap = lifeMapRef.current;
        lifeMap.evolve();
        const cells = lifeMap.getCells();
        setCellsCount(cells.length);
        setEvolutionIndex(prev => prev + 1);
        renderCells();
    }, [renderCells]);

    const pause = useCallback(() => {
        setPlayState(PlayState.Paused);
        window.cancelAnimationFrame(playTimeoutRef.current);
    }, []);

    const play = useCallback(() => {
        setPlayState(PlayState.Playing);
        const startRef = {value: -Infinity};
        const durations = [1000, 500, 100, 50, 25, 0];
        const getDuration = (speed: number) => durations[speed] ?? durations[3];

        const animate = (timestamp: number) => {
            if (timestamp - startRef.value >= getDuration(paramsRef.current.speed)) {
                startRef.value = timestamp;
                const lifeMap = lifeMapRef.current;
                lifeMap.evolve();
                const cells = lifeMap.getCells();
                setCellsCount(cells.length);
                setEvolutionIndex(prev => prev + 1);
                renderCells();
            }
            playTimeoutRef.current = window.requestAnimationFrame(animate);
        };
        playTimeoutRef.current = window.requestAnimationFrame(animate);
    }, [renderCells]);

    const reset = useCallback(() => {
        const {cells} = parseParams(routerParams);
        pushToHistory({origin: [0, 0]});
        window.cancelAnimationFrame(playTimeoutRef.current);
        hoveringCellsRef.current = [];
        lifeMapRef.current.reset();
        lifeMapRef.current.addCells(cells);
        setCellsCount(cells.length);
        setHoveringCell(null);
        setPlayState(PlayState.Editing);
        setEvolutionIndex(0);
        setOrigin([0, 0]);
        renderCells();
    }, [routerParams, pushToHistory, renderCells]);

    const createSharedLink = useCallback(() => {
        const path = combinePathToURL(stringifyParams({
            ...parseParams(routerParams),
            cells: lifeMapRef.current.getCells()
        }));
        navigator.clipboard.writeText(`${window.location.origin}${path}`).then(() => {
            setShowToast(true);
        });
    }, [routerParams]);

    const rotateHoveringCells = useCallback((clockwise = true) => {
        const pattern = selectedPatternRef.current;
        if (pattern) {
            const newPattern = {
                name: pattern.name,
                cells: rotateCells(pattern.cells, clockwise)
            };
            setSelectedPattern(newPattern);
            selectedPatternRef.current = newPattern;
            rendering(getHoveringCells(hoveringCellRef.current));
        }
    }, [rendering, getHoveringCells]);

    // Resize handler
    useEffect(() => {
        const onResize = () => requestAnimationFrame(() => {
            const {width = 0, height = 0} = appRef.current?.getBoundingClientRect() || {};
            setSize([width, height]);
        });
        onResize();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    // Load cells from URL params on mount
    useEffect(() => {
        const {cells} = parseParams(routerParams);
        if (cells.length) {
            lifeMapRef.current.reset();
            lifeMapRef.current.addCells(cells);
            setCellsCount(cells.length);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Mouse move (hovering)
    useEffect(() => {
        if (isTouchscreenDevices) return;

        const onMouseMove = (event: Event) => {
            if (dragStateRef.current !== DragState.end) return;
            const cell = clientToCell(getClient(event as DragEvent));
            setHoveringCell(cell);
            hoveringCellRef.current = cell;
            rendering(getHoveringCells(cell));
        };

        window.addEventListener('mousemove', onMouseMove);
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, [clientToCell, rendering, getHoveringCells]);

    // Click cell
    useEffect(() => {
        const onClickCell = (event: Event) => {
            const currentClient = getClient(event as DragEvent);
            const client = clientRef.current;
            const {scale} = paramsRef.current;
            const offset: Coordinate = [
                currentClient[0] - client[0],
                currentClient[1] - client[1],
            ];
            const shouldDrag = Math.abs(offset[0]) > scale || Math.abs(offset[1]) > scale;

            if (!shouldDrag && playStateRef.current === PlayState.Editing) {
                const cell = clientToCell(currentClient);
                const cells = getHoveringCells(cell);
                lifeMapRef.current.toggleCells(cells);
                renderCells();
            }
        };

        window.addEventListener('click', onClickCell);
        return () => window.removeEventListener('click', onClickCell);
    }, [clientToCell, getHoveringCells, renderCells]);

    // Keyboard handler
    useEffect(() => {
        const onKeydown = (event: globalThis.KeyboardEvent) => {
            switch (event.key) {
            case 'Escape':
                setSelectedPattern(null);
                break;
            case 'ArrowLeft':
                rotateHoveringCells(false);
                break;
            case 'ArrowRight':
                rotateHoveringCells(true);
                break;
            }
        };
        window.addEventListener('keydown', onKeydown);
        return () => window.removeEventListener('keydown', onKeydown);
    }, [rotateHoveringCells]);

    // Drag handler
    useEffect(() => {
        const onDragStart = (event: Event): void => {
            setDragState(DragState.start);
            const cell = clientToCell(getClient(event as DragEvent));
            setHoveringCell(cell);
            hoveringCellRef.current = cell;
            clientRef.current = getClient(event as DragEvent);

            const onDragging = (event: Event): void => {
                const newOrigin = clientToOrigin(getClient(event as DragEvent));
                setDragState(DragState.moving);
                setOrigin(newOrigin);
                originRef.current = newOrigin;
                rendering(getHoveringCells(hoveringCellRef.current));
            };

            const onDragEnd = (event: Event): void => {
                const newOrigin = clientToOrigin(getClient(event as DragEvent));
                const cell = clientToCell(getClient(event as DragEvent));
                setHoveringCell(cell);
                hoveringCellRef.current = cell;
                rendering(getHoveringCells(cell));
                setDragState(DragState.end);
                setOrigin(newOrigin);
                originRef.current = newOrigin;
                pushToHistory({origin: newOrigin});

                window.removeEventListener(DragEvents[DragState.moving], onDragging);
                window.removeEventListener(DragEvents[DragState.end], onDragEnd);
            };

            window.addEventListener(DragEvents[DragState.moving], onDragging);
            window.addEventListener(DragEvents[DragState.end], onDragEnd);
        };

        window.addEventListener(DragEvents[DragState.start], onDragStart);
        return () => {
            window.removeEventListener(DragEvents[DragState.start], onDragStart);
        };
    }, [clientToCell, clientToOrigin, rendering, getHoveringCells, pushToHistory]);

    // Re-render when size/params change
    useEffect(() => {
        renderCells();
    }, [size, params.scale, params.gridType, params.showDeadCells, origin, renderCells]);

    const attributes: Attributes = {
        width: size[0] * pixelRatio,
        height: size[1] * pixelRatio
    };

    return (
        <AppWrapper ref={appRef} playState={playState} dragState={dragState}>
            <GlobalStyle/>
            <CanvasWrapper
                ref={canvasRef}
                width={attributes.width}
                height={attributes.height}
                role="img"
                aria-label="Game of Life simulation grid"
            />
            <Header/>
            <Dashboard {...{evolutionIndex, cellsCount, params, hoveringCell}}/>
            <BottomSection>
                <Footer/>
                <Panel {...{
                    playState,
                    pushToHistory,
                    params,
                    showPatternPanel,
                    togglePatternPanel: setShowPatternPanel,
                    setSelectedPattern,
                    selectedPattern,
                    reset,
                    next,
                    pause,
                    play,
                    edit,
                    createSharedLink,
                    rotateHoveringCells,
                }}/>
            </BottomSection>
            <Toast showToast={showToast} toggleToast={setShowToast}>Copied the shared link to clipboard.</Toast>
        </AppWrapper>
    );
}
