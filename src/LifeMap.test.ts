import {LifeMap} from './LifeMap';
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
                ['0,1', [0, 1]],
            ]));
        });

        test(`should remove true when call hasCell(${formatCell})`, () => {
            expect(cellsMap.cells.get(cell.toString())).toBeTruthy();
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
                expect(cellsMap.cells.get(cell.toString())).toBeFalsy();
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
    describe(`when call addCells(${JSON.stringify(cells)})`, () => {
        beforeEach(() => {
            cellsMap.addCells(cells);
        });

        test('should have correct cells', () => {
            expect(cellsMap.cells).toEqual(new Map([
                ['0,1', [0, 1]],
                ['1,0', [1, 0]],
                ['1,1', [1, 1]],
                ['1,2', [1, 2]],
                ['2,1', [2, 1]]
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
                expect(cellsMap.cells.get('0,1')).toBeFalsy();
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
                    ['1,1', [1, 1]],
                    ['1,2', [1, 2]],
                    ['2,1', [2, 1]]
                ]));
            });

            test('should add the [0,1] when call toggleCell([0,1])', () => {
                cellsMap.toggleCell([0, 1]);
                expect(cellsMap.cells.get('0,1')).toBeTruthy();
            });
        });
    });
    describe('when call AddCells()', () => {

        function tests(cells: Coordinate[], born: Coordinate[], dead: Coordinate[]) {
            test(`the cells should become ${JSON.stringify(cells)}`, () => {
                expect(cellsMap.cells).toEqual(new Map(cells.map(cell => [cell.toString(), cell])));
            });

            test(`the bornList should be ${JSON.stringify(born)}`, () => {
                expect(cellsMap.bornList).toEqual(new Map(born.map(cell => [cell.toString(), cell])));
            });

            test(`the deadList should be ${JSON.stringify(dead)}`, () => {
                expect(cellsMap.deadList).toEqual(new Map(dead.map(cell => [cell.toString(), cell])));
            });
        }

        const cellsSequence: Coordinate[][] = [
            [[0, 1], [1, 1], [2, 1]],
            [[1, 0], [1, 1], [1, 2]]
        ];
        const bornDeadSequence: Coordinate[][] = [
            [[1, 0], [1, 2]],
            [[0, 1], [2, 1]]
        ];

        beforeEach(() => {
            cellsMap.addCells(cellsSequence[1]);
        });

        describe('when call evolve', () => {
            beforeEach(() => {
                cellsMap.evolve();
            });

            tests(cellsSequence[0], bornDeadSequence[1], bornDeadSequence[0]);

            describe('when call evolve', () => {
                beforeEach(() => {
                    cellsMap.evolve();
                });

                tests(cellsSequence[1], bornDeadSequence[0], bornDeadSequence[1]);

                describe('when call evolve', () => {
                    beforeEach(() => {
                        cellsMap.evolve();
                    });

                    tests(cellsSequence[0], bornDeadSequence[1], bornDeadSequence[0]);
                });
            });
        });
    });


});