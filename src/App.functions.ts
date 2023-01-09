import {Coordinate} from './Canvas';

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

export const defaultParams: ParsedParams = {
    scale: Scale.Default,
    gridOn: true,
    speed: Speed.Default,
    origin: [0, 0]
};

export interface ParsedParams {
    scale: number;
    gridOn: boolean;
    speed: number;
    origin: Coordinate;
}

export type OriginalParams = {
    scale: string;
    gridOn: string;
    speed: string;
    originX: string;
    originY: string;
}

export type DragEvent = MouseEvent | TouchEvent;

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

const paramsSegments: Array<keyof OriginalParams> = ['scale', 'speed', 'gridOn', 'originX', 'originY'];

function parseString(s: string, constraint: NumberConstraint): number {
    const n = parseInt(s);
    return n >= constraint.Min && n <= constraint.Max ? n : constraint.Default;
}

export function parseParams({scale, gridOn, speed, originX, originY}: OriginalParams): ParsedParams {
    return {
        scale: parseString(scale, Scale),
        gridOn: gridOn === '1',
        speed: parseString(speed, Speed),
        origin: [parseFloat(originX), parseFloat(originY)]
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
    if(Number.isNaN(stringifyCoordinate)){
        return '0';
    }
    return n.toString();
}

export function stringifyParams({scale, gridOn, speed, origin}: ParsedParams): OriginalParams {
    return {
        scale: stringifyNumber(scale, Scale),
        gridOn: gridOn ? '1' : '0',
        speed: stringifyNumber(speed, Speed),
        originX: stringifyCoordinate(origin[0]),
        originY: stringifyCoordinate(origin[1])
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
