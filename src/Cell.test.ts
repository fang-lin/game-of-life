import {Cell} from "./Cell";
import {objectify} from "./utils";

describe('Cell', () => {
    let cell: Cell;
    beforeEach(() => {
        cell = new Cell([2, 1]);
    });

    test('this cell should have correct x and y', () => {
        expect(cell[0]).toBe(2)
        expect(cell[1]).toBe(1)
    });

    test('the equals function should return true with [2, 1]', () => {
        expect(cell.equals([2, 1])).toBe(true);
    });

    test('the equals function should return false with [2, 2]', () => {
        expect(cell.equals([2, 2])).toBe(false);
    });

    test('neighborsLength should be 0', () => {
        expect(cell.neighborsLength).toBe(0);
    });

    test('the neighbors should be empty', () => {
        expect(cell.neighbors).toEqual({});
    });

    describe('if add a neighbor on the top left', () => {
        beforeEach(() => {
            cell.addNeighbor(new Cell([1, 0]));
        });

        test('neighborsLength should be 1', () => {
            expect(cell.neighborsLength).toBe(1);
        });

        test('the added neighbor should exist with index 0', () => {
            expect(cell.neighbors[0].equals([1, 0])).toBeTruthy();
        });

        test('the added neighbor should have this cell as neighbor with correct index', () => {
            expect(cell.neighbors[0].neighbors[8].equals([2, 1])).toBeTruthy();
        });

        describe('then remove the added neighbor', () => {
            beforeEach(() => {
                cell.removeNeighbor(cell.neighbors[0]);
            });

            test('neighborsLength should be 0', function () {
                expect(cell.neighborsLength).toBe(0);
            });

            test('the neighbors should be empty', function () {
                expect(cell.neighbors).toEqual({});
            });
        });
    });

    describe('if add 2 neighbors on the top left and top', () => {
        beforeEach(() => {
            cell.addNeighbor(new Cell([1, 0]));
            cell.addNeighbor(new Cell([2, 0]));
        });

        test('neighborsLength should be 2', () => {
            expect(cell.neighborsLength).toBe(2);
        });

        test('the added neighbor should exist with index 3', () => {
            expect(objectify(cell.neighbors[3])).toEqual([2, 0]);
        });

        test('the first added cell should be the neighbor of the second added cell', () => {
            expect(objectify(cell.neighbors[3].neighbors[1])).toEqual([1, 0]);
        });

        test('the second added cell should be the neighbor of the first added cell', () => {
            expect(objectify(cell.neighbors[0].neighbors[7])).toEqual([2, 0]);
        });

        describe('then remove the first added neighbor', () => {
            beforeEach(() => {
                cell.removeNeighbor(cell.neighbors[0]);
            });

            test('neighborsLength should be 1', () => {
                expect(cell.neighborsLength).toBe(1);
            });

            test('the neighbors should be the second added', () => {
                expect(objectify(cell.neighbors[3])).toEqual([2, 0])
            });

            test('the neighborsLength of the second added neighbor should be 1', () => {
                expect(cell.neighbors[3].neighborsLength).toBe(1);
            });

            test('the second added neighbor should only have one neighbor which is this cell', () => {
                expect(objectify(cell.neighbors[3].neighbors[5])).toEqual([2, 1]);
            });
        });

    });

    describe('if add all neighbors', () => {
        beforeEach(() => {
            cell.addNeighbor(new Cell([1, 0]));
            cell.addNeighbor(new Cell([1, 1]));
            cell.addNeighbor(new Cell([1, 2]));
            cell.addNeighbor(new Cell([2, 0]));
            cell.addNeighbor(new Cell([2, 2]));
            cell.addNeighbor(new Cell([3, 0]));
            cell.addNeighbor(new Cell([3, 1]));
            cell.addNeighbor(new Cell([3, 2]));
        });

        test('neighborsLength should be 8', () => {
            expect(cell.neighborsLength).toBe(8);
        });

        test('the added neighbors should exist with correct indexes', () => {
            expect(objectify(cell.neighbors)).toEqual({
                '0': [1, 0],
                '1': [1, 1],
                '2': [1, 2],
                '3': [2, 0],
                '5': [2, 2],
                '6': [3, 0],
                '7': [3, 1],
                '8': [3, 2]
            });
        });

        describe('then destroy the cell', () => {
            let others: Array<Cell>;
            beforeEach(() => {
                others = Object.values(cell.neighbors);
                cell.destructor();
            });

            test('the neighbors of the cell should be empty', () => {
                expect({}).toEqual({});
            });

            test('All other cells should not treat this cell as neighbors', () => {
                expect(Object.values(others[0].neighbors).includes(cell)).toBeFalsy();
                expect(Object.values(others[1].neighbors).includes(cell)).toBeFalsy();
                expect(Object.values(others[2].neighbors).includes(cell)).toBeFalsy();
                expect(Object.values(others[3].neighbors).includes(cell)).toBeFalsy();
                expect(Object.values(others[4].neighbors).includes(cell)).toBeFalsy();
                expect(Object.values(others[5].neighbors).includes(cell)).toBeFalsy();
                expect(Object.values(others[6].neighbors).includes(cell)).toBeFalsy();
                expect(Object.values(others[7].neighbors).includes(cell)).toBeFalsy();
            });

        });
    });

    describe('if add a cell which is not a neighbor', () => {
        beforeEach(() => {
            cell.addNeighbor(new Cell([3, 3]));
            cell.addNeighbor(new Cell([2, 3]));
            cell.addNeighbor(new Cell([2, -1]));
        });

        test('neighborsLength should be 0', () => {
            expect(cell.neighborsLength).toBe(0);
        });

        test('the neighbors should be empty', () => {
            expect(cell.neighbors).toEqual({});
        });
    })

    describe('if add a cell which equals this cell', () => {
        beforeEach(() => {
            cell.addNeighbor(new Cell([2, 1]));
        });

        test('neighborsLength should be 0', () => {
            expect(cell.neighborsLength).toBe(0);
        });

        test('the neighbors should be empty', () => {
            expect(cell.neighbors).toEqual({});
        });
    })
});