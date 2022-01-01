import {Size} from './Canvas';

export function objectify(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}

export function getSize(size: Size): Size {
    return [size[0] * pixelRatio, size[1] * pixelRatio];
}

export const pixelRatio = window.devicePixelRatio;

export interface ParsedParams {
    cellSize: number;
}

export type OriginalParams = {
    cellSize: string
}

interface Props {
    size: Size;
    params: ParsedParams;
}

export function shouldUpdateCanvas(prevProps: Props, currentProps: Props): boolean {
    return prevProps.size[0] !== currentProps.size[0] ||
        prevProps.size[1] !== currentProps.size[1] ||
        prevProps.params.cellSize !== currentProps.params.cellSize;
}

const paramsSegments: Array<keyof OriginalParams> = ['cellSize'];

export function parseParams({cellSize}: OriginalParams): ParsedParams {
    return {
        cellSize: parseInt(cellSize),
    };
}

function normalizeCellSize(cellSize: number) {
    if (cellSize < 5)
        return '5';
    if (cellSize > 30)
        return '30';
    return cellSize.toString();
}

export function stringifyParams({cellSize}: ParsedParams): OriginalParams {
    return {
        cellSize: normalizeCellSize(cellSize),
    };
}

export function combinePathToURL(params: OriginalParams): string {
    return `/${paramsSegments.map(segment => params[segment]).join('/')}`;
}

export const defaultParams: OriginalParams = {
    cellSize: '20',
};

export function routerPath(): string {
    return `/${paramsSegments.map(segment => `:${segment}`).join('/')}`;
}