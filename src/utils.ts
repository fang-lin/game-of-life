import {Coordinate, Size} from './Canvas';

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
    speed: Speed.Default,
    origin: [0, 0]
};

export interface ParsedParams {
    cellSize: number;
    gridOn: boolean;
    speed: number;
    origin: Coordinate;
}

export type OriginalParams = {
    cellSize: string;
    gridOn: string;
    speed: string;
    originX: string;
    originY: string;
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

const paramsSegments: Array<keyof OriginalParams> = ['cellSize', 'speed', 'gridOn', 'originX', 'originY'];

function parseString(s: string, constraint: NumberConstraint): number {
    const n = parseInt(s);
    return n >= constraint.Min && n <= constraint.Max ? n : constraint.Default;
}

export function parseParams({cellSize, gridOn, speed, originX, originY}: OriginalParams): ParsedParams {
    return {
        cellSize: parseString(cellSize, CellSize),
        gridOn: gridOn === '1',
        speed: parseString(speed, Speed),
        origin: [parseInt(originX), parseInt(originY)]
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

export function stringifyParams({cellSize, gridOn, speed, origin}: ParsedParams): OriginalParams {
    return {
        cellSize: stringifyNumber(cellSize, CellSize),
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
