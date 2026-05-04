// @vitest-environment jsdom
import {describe, it, expect} from 'vitest';
import {
    parseParams,
    stringifyParams,
    combinePathToURL,
    routerPath,
    rotateCells,
    Scale,
    Speed,
    GridTypes,
    defaultParams,
    ParsedParams,
    OriginalParams,
} from '../App.functions';
import {Coordinate} from '../Canvas/Canvas';

describe('parseParams', () => {
    it('should parse valid params', () => {
        const original: OriginalParams = {
            scale: '15',
            gridType: '0',
            showDeadCells: '1',
            speed: '3',
            originX: '10.5',
            originY: '-20.3',
            cells: '1.2:3.4:-5.6',
        };
        const result = parseParams(original);
        expect(result.scale).toBe(15);
        expect(result.gridType).toBe('Dark');
        expect(result.showDeadCells).toBe(true);
        expect(result.speed).toBe(3);
        expect(result.origin).toEqual([10.5, -20.3]);
        expect(result.cells).toEqual([[1, 2], [3, 4], [-5, 6]]);
    });

    it('should use defaults for out-of-range scale', () => {
        const original: OriginalParams = {
            scale: '100',
            gridType: '0',
            showDeadCells: '0',
            speed: '3',
            originX: '0',
            originY: '0',
            cells: '-',
        };
        expect(parseParams(original).scale).toBe(Scale.Default);
    });

    it('should use defaults for negative scale', () => {
        const original: OriginalParams = {
            scale: '-1',
            gridType: '0',
            showDeadCells: '0',
            speed: '3',
            originX: '0',
            originY: '0',
            cells: '-',
        };
        expect(parseParams(original).scale).toBe(Scale.Default);
    });

    it('should use defaults for NaN scale', () => {
        const original: OriginalParams = {
            scale: 'abc',
            gridType: '0',
            showDeadCells: '0',
            speed: '3',
            originX: '0',
            originY: '0',
            cells: '-',
        };
        expect(parseParams(original).scale).toBe(Scale.Default);
    });

    it('should accept boundary scale values', () => {
        const minParams: OriginalParams = {
            scale: String(Scale.Min),
            gridType: '0',
            showDeadCells: '0',
            speed: '3',
            originX: '0',
            originY: '0',
            cells: '-',
        };
        expect(parseParams(minParams).scale).toBe(Scale.Min);

        const maxParams: OriginalParams = {
            ...minParams,
            scale: String(Scale.Max),
        };
        expect(parseParams(maxParams).scale).toBe(Scale.Max);
    });

    it('should parse gridType correctly', () => {
        const base: OriginalParams = {
            scale: '20',
            gridType: '0',
            showDeadCells: '0',
            speed: '3',
            originX: '0',
            originY: '0',
            cells: '-',
        };
        expect(parseParams({...base, gridType: '0'}).gridType).toBe('Dark');
        expect(parseParams({...base, gridType: '1'}).gridType).toBe('Blank');
        expect(parseParams({...base, gridType: '2'}).gridType).toBe('None');
    });

    it('should default gridType for invalid values', () => {
        const base: OriginalParams = {
            scale: '20',
            gridType: '99',
            showDeadCells: '0',
            speed: '3',
            originX: '0',
            originY: '0',
            cells: '-',
        };
        expect(parseParams(base).gridType).toBe('Dark');
    });

    it('should parse showDeadCells as boolean', () => {
        const base: OriginalParams = {
            scale: '20',
            gridType: '0',
            showDeadCells: '1',
            speed: '3',
            originX: '0',
            originY: '0',
            cells: '-',
        };
        expect(parseParams(base).showDeadCells).toBe(true);
        expect(parseParams({...base, showDeadCells: '0'}).showDeadCells).toBe(false);
        expect(parseParams({...base, showDeadCells: 'anything'}).showDeadCells).toBe(false);
    });

    it('should use defaults for out-of-range speed', () => {
        const base: OriginalParams = {
            scale: '20',
            gridType: '0',
            showDeadCells: '0',
            speed: '99',
            originX: '0',
            originY: '0',
            cells: '-',
        };
        expect(parseParams(base).speed).toBe(Speed.Default);
    });

    it('should parse empty cells as empty array', () => {
        const base: OriginalParams = {
            scale: '20',
            gridType: '0',
            showDeadCells: '0',
            speed: '3',
            originX: '0',
            originY: '0',
            cells: '-',
        };
        expect(parseParams(base).cells).toEqual([]);
    });

    it('should parse single cell', () => {
        const base: OriginalParams = {
            scale: '20',
            gridType: '0',
            showDeadCells: '0',
            speed: '3',
            originX: '0',
            originY: '0',
            cells: '5.10',
        };
        expect(parseParams(base).cells).toEqual([[5, 10]]);
    });

    it('should parse origin with float values', () => {
        const base: OriginalParams = {
            scale: '20',
            gridType: '0',
            showDeadCells: '0',
            speed: '3',
            originX: '3.14',
            originY: '-2.71',
            cells: '-',
        };
        const result = parseParams(base);
        expect(result.origin[0]).toBeCloseTo(3.14);
        expect(result.origin[1]).toBeCloseTo(-2.71);
    });
});

describe('stringifyParams', () => {
    it('should stringify default params', () => {
        const result = stringifyParams(defaultParams);
        expect(result.scale).toBe('20');
        expect(result.gridType).toBe('0');
        expect(result.showDeadCells).toBe('0');
        expect(result.speed).toBe('3');
        expect(result.originX).toBe('0');
        expect(result.originY).toBe('0');
        expect(result.cells).toBe('-');
    });

    it('should stringify cells correctly', () => {
        const params: ParsedParams = {
            ...defaultParams,
            cells: [[1, 2], [3, 4], [-5, 6]],
        };
        expect(stringifyParams(params).cells).toBe('1.2:3.4:-5.6');
    });

    it('should clamp scale to min', () => {
        const params: ParsedParams = {
            ...defaultParams,
            scale: 0,
        };
        expect(stringifyParams(params).scale).toBe(String(Scale.Min));
    });

    it('should clamp scale to max', () => {
        const params: ParsedParams = {
            ...defaultParams,
            scale: 999,
        };
        expect(stringifyParams(params).scale).toBe(String(Scale.Max));
    });

    it('should stringify NaN origin as 0', () => {
        const params: ParsedParams = {
            ...defaultParams,
            origin: [NaN, NaN],
        };
        const result = stringifyParams(params);
        expect(result.originX).toBe('0');
        expect(result.originY).toBe('0');
    });

    it('should stringify showDeadCells correctly', () => {
        expect(stringifyParams({...defaultParams, showDeadCells: true}).showDeadCells).toBe('1');
        expect(stringifyParams({...defaultParams, showDeadCells: false}).showDeadCells).toBe('0');
    });

    it('should stringify gridType by index', () => {
        expect(stringifyParams({...defaultParams, gridType: 'Dark'}).gridType).toBe('0');
        expect(stringifyParams({...defaultParams, gridType: 'Blank'}).gridType).toBe('1');
        expect(stringifyParams({...defaultParams, gridType: 'None'}).gridType).toBe('2');
    });
});

describe('parseParams and stringifyParams roundtrip', () => {
    it('should roundtrip default params', () => {
        const stringified = stringifyParams(defaultParams);
        const parsed = parseParams(stringified);
        expect(parsed.scale).toBe(defaultParams.scale);
        expect(parsed.gridType).toBe(defaultParams.gridType);
        expect(parsed.showDeadCells).toBe(defaultParams.showDeadCells);
        expect(parsed.speed).toBe(defaultParams.speed);
        expect(parsed.cells).toEqual(defaultParams.cells);
    });

    it('should roundtrip params with cells', () => {
        const params: ParsedParams = {
            scale: 15,
            gridType: 'Blank',
            showDeadCells: true,
            speed: 4,
            origin: [10, -20],
            cells: [[0, 0], [1, 1], [-3, 5]],
        };
        const roundtripped = parseParams(stringifyParams(params));
        expect(roundtripped.scale).toBe(params.scale);
        expect(roundtripped.gridType).toBe(params.gridType);
        expect(roundtripped.showDeadCells).toBe(params.showDeadCells);
        expect(roundtripped.speed).toBe(params.speed);
        expect(roundtripped.cells).toEqual(params.cells);
    });
});

describe('combinePathToURL', () => {
    it('should combine params into URL path', () => {
        const original = stringifyParams(defaultParams);
        const url = combinePathToURL(original);
        expect(url).toBe('/game/20/3/0/0/0/0/-');
    });

    it('should include cells in URL path', () => {
        const params: ParsedParams = {
            ...defaultParams,
            cells: [[1, 2], [3, 4]],
        };
        const url = combinePathToURL(stringifyParams(params));
        expect(url).toBe('/game/20/3/0/0/0/0/1.2:3.4');
    });
});

describe('routerPath', () => {
    it('should return parameterized path', () => {
        expect(routerPath()).toBe('/game/:scale/:speed/:gridType/:showDeadCells/:originX/:originY/:cells');
    });
});

describe('rotateCells', () => {
    it('should rotate clockwise by default', () => {
        const cells: Coordinate[] = [[1, 0], [0, 1]];
        const rotated = rotateCells(cells);
        expect(rotated).toEqual([[-0, 1], [-1, 0]]);
    });

    it('should rotate counter-clockwise', () => {
        const cells: Coordinate[] = [[1, 0], [0, 1]];
        const rotated = rotateCells(cells, false);
        expect(rotated).toEqual([[0, -1], [1, -0]]);
    });

    it('should return to original after 4 clockwise rotations', () => {
        const cells: Coordinate[] = [[1, 2], [-3, 4]];
        let rotated = cells;
        for (let i = 0; i < 4; i++) {
            rotated = rotateCells(rotated);
        }
        expect(rotated).toEqual(cells);
    });

    it('should return to original after 4 counter-clockwise rotations', () => {
        const cells: Coordinate[] = [[1, 2], [-3, 4]];
        let rotated = cells;
        for (let i = 0; i < 4; i++) {
            rotated = rotateCells(rotated, false);
        }
        expect(rotated).toEqual(cells);
    });

    it('should handle empty cells', () => {
        expect(rotateCells([])).toEqual([]);
    });

    it('clockwise then counter-clockwise should be identity', () => {
        const cells: Coordinate[] = [[5, -3], [0, 0], [-1, 7]];
        const result = rotateCells(rotateCells(cells, true), false);
        expect(result).toEqual(cells);
    });
});
