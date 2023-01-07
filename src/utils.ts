import {Size} from './Canvas';

export const pixelRatio = window.devicePixelRatio;

type NumberConstraint = Record<'Max' | 'Min' | 'Default', number>;

export const CellSize: NumberConstraint = {
    Max: 30,
    Min: 5,
    Default: 20
};

export const Speed: NumberConstraint = {
    Max: 5,
    Min: 0,
    Default: 3
};

export const defaultParams: ParsedParams = {
    cellSize: CellSize.Default,
    gridOn: true,
    speed: Speed.Default
};

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

function parseString(s: string, constraint: NumberConstraint): number {
    const n = parseInt(s);
    return n >= constraint.Min && n <= constraint.Max ? n : constraint.Default;
}

export function parseParams({cellSize, gridOn, speed}: OriginalParams): ParsedParams {
    return {
        cellSize: parseString(cellSize, CellSize),
        gridOn: gridOn === '1',
        speed: parseString(speed, Speed),
    };
}

function stringifyNumber(n: number, constraint: NumberConstraint): string {
    if (n < constraint.Min)
        return constraint.Min.toString();
    if (n > constraint.Max)
        return constraint.Max.toString();
    return n.toString();
}

export function stringifyParams({cellSize, gridOn, speed}: ParsedParams): OriginalParams {
    return {
        cellSize: stringifyNumber(cellSize, CellSize),
        gridOn: gridOn ? '1' : '0',
        speed: stringifyNumber(speed, Speed),
    };
}

export function combinePathToURL(params: OriginalParams): string {
    return `/${paramsSegments.map(segment => params[segment]).join('/')}`;
}

export function routerPath(): string {
    return `/${paramsSegments.map(segment => `:${segment}`).join('/')}`;
}
