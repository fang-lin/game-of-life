import {Cell} from "./Cell";

describe('Cell', () => {
    let cell: Cell;
    beforeEach(() => {
        cell = new Cell([2, 1]);
    });

    test('this cell should have correct x and y', function () {
        expect(cell[0]).toBe(2)
        expect(cell[1]).toBe(1)
    });

    test('the equals function should return true with [2, 1]', function () {
        expect(cell.equals([2, 1])).toBe(true);
    });

    test('the equals function should return false with [2, 2]', function () {
        expect(cell.equals([2, 2])).toBe(false);
    });

    test('neighborsLength should be 0', function () {
        expect(cell.neighborsLength).toBe(0);
    });

    test('the neighbors should be empty', function () {
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

        test('the added neighbor should exist with index 1', () => {
            expect(cell.neighbors[1].equals([2, 0])).toBeTruthy();
        });

        test('the first added cell should be the neighbor of the second added cell', () => {
            expect(cell.neighbors[1].neighbors[3].equals([1, 0])).toBeTruthy();
        });

        test('the second added cell should be the neighbor of the first added cell', () => {
            expect(cell.neighbors[0].neighbors[5].equals([2, 0])).toBeTruthy();
        });

        describe('then remove the first added neighbor', () => {
            beforeEach(() => {
                cell.removeNeighbor(cell.neighbors[0]);
            });

            test('neighborsLength should be 1', function () {
                expect(cell.neighborsLength).toBe(1);
            });

            test('the neighbors should be the second added', function () {
                expect(cell.neighbors[1].equals([2, 0])).toBeTruthy();
            });

            test('the neighborsLength of the second added neighbor should be 1', function () {
                expect(cell.neighbors[1].neighborsLength).toBe(1);
            });

            test('the second added neighbor should only have one neighbor which is this cell', function () {
                expect(cell.neighbors[1].neighbors[7].equals([2, 1])).toBeTruthy();
            });
        });

    });

    describe('if add all neighbors', () => {
        beforeEach(() => {
            cell.addNeighbor(new Cell([1, 0]));
            cell.addNeighbor(new Cell([2, 0]));
            cell.addNeighbor(new Cell([3, 0]));
            cell.addNeighbor(new Cell([1, 1]));
            cell.addNeighbor(new Cell([3, 1]));
            cell.addNeighbor(new Cell([1, 2]));
            cell.addNeighbor(new Cell([2, 2]));
            cell.addNeighbor(new Cell([3, 2]));
        });

        test('neighborsLength should be 8', () => {
            expect(cell.neighborsLength).toBe(8);
        });

        test('the added neighbors should exist with correct indexes', () => {
            expect(cell.neighbors[0].equals([1, 0])).toBeTruthy();
            expect(cell.neighbors[1].equals([2, 0])).toBeTruthy();
            expect(cell.neighbors[2].equals([3, 0])).toBeTruthy();
            expect(cell.neighbors[3].equals([1, 1])).toBeTruthy();
            expect(cell.neighbors[5].equals([3, 1])).toBeTruthy();
            expect(cell.neighbors[6].equals([1, 2])).toBeTruthy();
            expect(cell.neighbors[7].equals([2, 2])).toBeTruthy();
            expect(cell.neighbors[8].equals([3, 2])).toBeTruthy();
        });
    });

    describe('if add a cell which is not a neighbor', () => {
        beforeEach(() => {
            cell.addNeighbor(new Cell([3, 3]));
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