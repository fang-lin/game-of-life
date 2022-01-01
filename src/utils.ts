import {Size} from './Canvas';

export function objectify(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}

export const pixelRatio = window.devicePixelRatio;

export interface ParsedParams {
    cellSize: number;
    gridOn: boolean;
}

export type OriginalParams = {
    cellSize: string;
    gridOn: string;
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

const paramsSegments: Array<keyof OriginalParams> = ['cellSize', 'gridOn'];

export function parseParams({cellSize, gridOn}: OriginalParams): ParsedParams {
    return {
        cellSize: parseInt(cellSize),
        gridOn: gridOn === '1'
    };
}

function normalizeCellSize(cellSize: number) {
    if (cellSize < 5)
        return '5';
    if (cellSize > 30)
        return '30';
    return cellSize.toString();
}

export function stringifyParams({cellSize, gridOn}: ParsedParams): OriginalParams {
    return {
        cellSize: normalizeCellSize(cellSize),
        gridOn: gridOn ? '1' : '0'
    };
}

export function combinePathToURL(params: OriginalParams): string {
    return `/${paramsSegments.map(segment => params[segment]).join('/')}`;
}

export const defaultParams: OriginalParams = {
    cellSize: '20',
    gridOn: '1'
};

export function routerPath(): string {
    return `/${paramsSegments.map(segment => `:${segment}`).join('/')}`;
}