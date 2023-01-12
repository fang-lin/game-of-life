import {Coordinate} from './Canvas/Canvas';

export const isTouchscreenDevices: boolean = ((): boolean => {
    try {
        document.createEvent('TouchEvent');
        return true;
    } catch (e) {
        return false;
    }
})();

export const pixelRatio = window.devicePixelRatio;

type NumberConstraint = Record<'Max' | 'Min' | 'Default', number>;

export const Scale: NumberConstraint = {
    Max: 30,
    Min: 2,
    Default: 20
};

export const Speed: NumberConstraint = {
    Max: 5,
    Min: 0,
    Default: 3
};

export const GridTypes = ['Dark', 'Blank', 'None'] as const;
export type GridType = typeof GridTypes[number];

export const defaultParams: ParsedParams = {
    scale: Scale.Default,
    gridType: GridTypes[0],
    speed: Speed.Default,
    origin: [0, 0],
    cells: [],
};

export interface ParsedParams {
    scale: number;
    gridType: GridType;
    speed: number;
    origin: Coordinate;
    cells: Coordinate[];
}

export type OriginalParams = {
    scale: string;
    gridType: string;
    speed: string;
    originX: string;
    originY: string;
    cells: string;
}

export type DragEvent = MouseEvent | TouchEvent;

export enum DragState {
    start,
    moving,
    end
}

export enum PlayState {
    Editing = 'editing',
    Playing = 'playing',
    Paused = 'paused',
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

const paramsSegments: Array<keyof OriginalParams> = ['scale', 'speed', 'gridType', 'originX', 'originY', 'cells'];

function parseString(s: string, constraint: NumberConstraint): number {
    const n = parseInt(s);
    return n >= constraint.Min && n <= constraint.Max ? n : constraint.Default;
}

function parseGridType(g: string): GridType {
    return GridTypes[parseInt(g)] || GridTypes[0];
}

export function parseParams({scale, gridType, speed, originX, originY, cells}: OriginalParams): ParsedParams {
    return {
        scale: parseString(scale, Scale),
        gridType: parseGridType(gridType),
        speed: parseString(speed, Speed),
        origin: [parseFloat(originX), parseFloat(originY)],
        cells: cells === '-' ? [] : JSON.parse(cells.replaceAll('][', '],[')),
    };
}

function stringifyNumber(n: number, constraint: NumberConstraint): string {
    if (n < constraint.Min)
        return constraint.Min.toString();
    if (n > constraint.Max)
        return constraint.Max.toString();
    return n.toString();
}

function stringifyCoordinate(n: number): string {
    if (Number.isNaN(stringifyCoordinate)) {
        return '0';
    }
    return n.toString();
}

export function stringifyParams({scale, gridType, speed, origin, cells}: ParsedParams): OriginalParams {
    return {
        scale: stringifyNumber(scale, Scale),
        gridType: GridTypes.indexOf(gridType).toString(),
        speed: stringifyNumber(speed, Speed),
        originX: stringifyCoordinate(origin[0]),
        originY: stringifyCoordinate(origin[1]),
        cells: cells ? JSON.stringify(cells).replaceAll('],[', '][') : '-',
    };
}

export function combinePathToURL(params: OriginalParams): string {
    return `/${paramsSegments.map(segment => params[segment]).join('/')}`;
}

export function routerPath(): string {
    return `/${paramsSegments.map(segment => `:${segment}`).join('/')}`;
}

function isTouchEvent(event: DragEvent): event is TouchEvent {
    return window.TouchEvent && event instanceof TouchEvent;
}

export function getClient(event: DragEvent): Coordinate {
    const {clientX, clientY} = isTouchEvent(event) ? event.changedTouches[0] : event;
    return [clientX, clientY];
}


export function rotateCells(cells: Coordinate[], clockwise = true): Coordinate[] {
    return clockwise ?
        cells.map(([x, y]) => [-y, x]) :
        cells.map(([x, y]) => [y, -x]);
}
