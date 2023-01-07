import {Size} from './Canvas';

export const pixelRatio = window.devicePixelRatio;

export interface ParsedParams {
    cellSize: number;
    gridOn: boolean;
    speed: number;
}

export type OriginalParams = {
    cellSize: string;
    gridOn: string;
    speed: string;
}

interface Props {
    size: Size;
    params: ParsedParams;
}

export function shouldUpdateCanvas(prevProps: Props, currentProps: Props): boolean {
    return prevProps.size[0] !== currentProps.size[0] ||
        prevProps.size[1] !== currentProps.size[1] ||
        prevProps.params.cellSize !== currentProps.params.cellSize ||
        prevProps.params.gridOn !== currentProps.params.gridOn;
}

const paramsSegments: Array<keyof OriginalParams> = ['cellSize', 'speed', 'gridOn'];

export function parseParams({cellSize, gridOn, speed}: OriginalParams): ParsedParams {
    return {
        cellSize: parseInt(cellSize),
        gridOn: gridOn === '1',
        speed: parseInt(speed),
    };
}

function normalizeCellSize(cellSize: number): string {
    if (cellSize < 5)
        return '5';
    if (cellSize > 30)
        return '30';
    return cellSize.toString();
}

function normalizeSpeed(speed: number): string {
    return speed.toString();
}

export function stringifyParams({cellSize, gridOn, speed}: ParsedParams): OriginalParams {
    return {
        cellSize: normalizeCellSize(cellSize),
        gridOn: gridOn ? '1' : '0',
        speed: normalizeSpeed(speed),
    };
}

export function combinePathToURL(params: OriginalParams): string {
    return `/${paramsSegments.map(segment => params[segment]).join('/')}`;
}

export const defaultParams: OriginalParams = {
    cellSize: '20',
    gridOn: '1',
    speed: '100'
};

export function routerPath(): string {
    return `/${paramsSegments.map(segment => `:${segment}`).join('/')}`;
}
