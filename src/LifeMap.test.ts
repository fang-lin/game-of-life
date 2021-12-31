import {LifeMap, CellState} from './LifeMap';
import {Coordinate} from './Canvas';

describe('LifeMap', () => {
    let cellsMap: LifeMap;
    beforeEach(() => {
        cellsMap = new LifeMap();
    });

    const cell: Coordinate = [0, 1];
    const formatCell = JSON.stringify(cell);
    describe(`when call addCell(${formatCell})`, () => {
        beforeEach(() => {
            cellsMap.addCell(cell);
        });

        test('should have correct cells', () => {
            expect(cellsMap.cells).toEqual(new Map([
                ['0,1', {
                    coordinate: [0, 1],
                    state: CellState.Alive
                }],
            ]));
        });

        test(`should remove true when call hasCell(${formatCell})`, () => {
            expect(cellsMap.hasCell(cell)).toBeTruthy();
        });

        test(`cell ${formatCell} should have 0 neighbors`, () => {
            expect(cellsMap.getNeighborsNum(cell)).toBe(0);
        });

        describe(`when call removeCell(${formatCell})`, () => {
            beforeEach(() => {
                cellsMap.removeCell(cell);
            });

            test('should have correct cells', () => {
                expect(cellsMap.cells).toEqual(new Map());
            });

            test(`should remove false when call hasCell with ${formatCell}`, () => {
                expect(cellsMap.hasCell(cell)).toBeFalsy();
            });
        });
    });

    const cells: Coordinate[] = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, 2],
        [2, 1]
    ];
    const formatCells = JSON.stringify(cells);
    describe(`when call addCells(${formatCells})`, () => {
        beforeEach(() => {
            cellsMap.addCells(cells);
        });

        test('should have correct cells', () => {
            expect(cellsMap.cells).toEqual(new Map([
                ['0,1', {
                    coordinate: [0, 1],
                    state: CellState.Alive
                }],
                ['1,0', {
                    coordinate: [1, 0],
                    state: CellState.Alive
                }],
                ['1,1', {
                    coordinate: [1, 1],
                    state: CellState.Alive
                }],
                ['1,2', {
                    coordinate: [1, 2],
                    state: CellState.Alive
                }],
                ['2,1', {
                    coordinate: [2, 1],
                    state: CellState.Alive
                }]
            ]));
        });

        test('cell [1,1] should has 4 neighbours', () => {
            expect(cellsMap.getNeighborsNum([1, 1])).toBe(4);
        });

        test('cell [0,1] should has 3 neighbours', () => {
            expect(cellsMap.getNeighborsNum([0, 1])).toBe(3);
        });

        test('cell [1,2] should have 3 neighbors', () => {
            expect(cellsMap.getNeighborsNum([1, 2])).toBe(3);
        });

        test('cell [2,1] should have 3 neighbors', () => {
            expect(cellsMap.getNeighborsNum([2, 1])).toBe(3);
        });

        describe('when call toggleCell([0,1])', () => {
            beforeEach(() => {
                cellsMap.toggleCell([0, 1]);
            });

            test('[0,1] should be removed', () => {
                expect(cellsMap.hasCell([0, 1])).toBeFalsy();
            });

            test('cell [0,1] should has 3 neighbours', () => {
                expect(cellsMap.getNeighborsNum([0, 1])).toBe(3);
            });

            test('[1,1] should has 3 neighbours', () => {
                expect(cellsMap.getNeighborsNum([1, 1])).toBe(3);
            });

            test('cell [1,2] should have 2 neighbors', () => {
                expect(cellsMap.getNeighborsNum([1, 2])).toBe(2);
            });

            test('cell [2,1] should have 3 neighbors', () => {
                expect(cellsMap.getNeighborsNum([2, 1])).toBe(3);
            });
        });

        const removedCells: Coordinate[] = [
            [0, 1],
            [1, 0],
        ];
        const formatRemovedCells = JSON.stringify(removedCells);
        describe(`when call removeCells(${formatRemovedCells})`, () => {
            beforeEach(() => {
                cellsMap.removeCells(removedCells);
            });

            test('should have correct cells', () => {
                expect(cellsMap.cells).toEqual(new Map([
                    ['1,1', {
                        coordinate: [1, 1],
                        state: CellState.Alive
                    }],
                    ['1,2', {
                        coordinate: [1, 2],
                        state: CellState.Alive
                    }],
                    ['2,1', {
                        coordinate: [2, 1],
                        state: CellState.Alive
                    }]
                ]));
            });

            test('should add the [0,1] when call toggleCell([0,1])', () => {
                cellsMap.toggleCell([0, 1]);
                expect(cellsMap.hasCell([0, 1])).toBeTruthy();
            });
        });

        describe('when call evolve()', () => {
            const cells = [
                [0, 0], [0, 1], [0, 2],
                [1, 0], [1, 2],
                [2, 0], [2, 1], [2, 2]
            ];
            const formatCells = JSON.stringify(cells);

            beforeEach(() => {
                cellsMap.evolve();
            });

            test(`the cells should become ${formatCells}`, () => {
                expect(cellsMap.cells).toEqual(
                    new Map([
                        ['0,0', {
                            coordinate: [0, 0],
                            state: CellState.Born
                        }],
                        ['0,1', {
                            coordinate: [0, 1],
                            state: CellState.Alive
                        }],
                        ['0,2', {
                            coordinate: [0, 2],
                            state: CellState.Born
                        }],
                        ['1,0', {
                            coordinate: [1, 0],
                            state: CellState.Alive
                        }],
                        ['1,1', {
                            coordinate: [1, 1],
                            state: CellState.Dead
                        }],
                        ['1,2', {
                            coordinate: [1, 2],
                            state: CellState.Alive
                        }],
                        ['2,0', {
                            coordinate: [2, 0],
                            state: CellState.Born
                        }],
                        ['2,1', {
                            coordinate: [2, 1],
                            state: CellState.Alive
                        }],
                        ['2,2', {
                            coordinate: [2, 2],
                            state: CellState.Born
                        }]
                    ])
                );
            });
        });
    });
});