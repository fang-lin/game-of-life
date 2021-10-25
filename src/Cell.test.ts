import {Cell, Position, Positions} from "./Cell";
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
        expect(cell.neighbors).toEqual(Cell.EmptyNeighbors());
    });

    describe('if add a neighbor on the top left', () => {
        let addedIndex: Positions;
        beforeEach(() => {
            addedIndex = cell.addNeighbor(new Cell([1, 0]));
        });

        test('addNeighbor should return correct index', () => {
            expect(addedIndex).toBe(Position.TopLeft);
        });

        test('neighborsLength should be 1', () => {
            expect(cell.neighborsLength).toBe(1);
        });

        test('the added neighbor should exist with index 0', () => {
            expect(cell.neighbors[Position.TopLeft]?.toTuple()).toEqual([1, 0]);
        });

        test('the added neighbor should have this cell as neighbor with correct index', () => {
            expect(cell.neighbors[Position.TopLeft]?.neighbors[Position.BottomRight]?.toTuple()).toEqual([2, 1]);
        });

        describe('then remove the added neighbor', () => {
            let removedIndex: Positions;
            beforeEach(() => {
                removedIndex = cell.removeNeighbor(cell.neighbors[Position.TopLeft]);
            });

            test('removeNeighbor should return correct index', () => {
                expect(removedIndex).toBe(Position.TopLeft);
            });

            test('neighborsLength should be 0', function () {
                expect(cell.neighborsLength).toBe(0);
            });

            test('the neighbors should be empty', function () {
                expect(cell.neighbors).toEqual(Cell.EmptyNeighbors());
            });
        });
    });

    describe('if add 2 neighbors on the top left and top', () => {
        let firstAddedIndex: Positions, secondAddedIndex: Positions;
        beforeEach(() => {
            firstAddedIndex = cell.addNeighbor(new Cell([1, 0]));
            secondAddedIndex = cell.addNeighbor(new Cell([2, 0]));
        });

        test('addNeighbor should return correct index', () => {
            expect(firstAddedIndex).toBe(Position.TopLeft);
            expect(secondAddedIndex).toBe(Position.Left);
        });

        test('neighborsLength should be 2', () => {
            expect(cell.neighborsLength).toBe(2);
        });

        test('the added neighbor should exist with index 3', () => {
            expect(objectify(cell.neighbors[Position.Left])).toEqual([2, 0]);
        });

        test('the first added cell should be the neighbor of the second added cell', () => {
            expect(objectify(cell.neighbors[Position.Left]?.neighbors[Position.Top])).toEqual([1, 0]);
        });

        test('the second added cell should be the neighbor of the first added cell', () => {
            expect(objectify(cell.neighbors[Position.TopLeft]?.neighbors[Position.Bottom])).toEqual([2, 0]);
        });

        describe('then remove the first added neighbor', () => {
            let removedIndex: Positions;
            beforeEach(() => {
                removedIndex = cell.removeNeighbor(cell.neighbors[Position.TopLeft]);
            });

            test('removeNeighbor should return correct index', () => {
                expect(removedIndex).toBe(Position.TopLeft);
            });

            test('neighborsLength should be 1', () => {
                expect(cell.neighborsLength).toBe(1);
            });

            test('the neighbors should be the second added', () => {
                expect(objectify(cell.neighbors[Position.Left])).toEqual([2, 0])
            });

            test('the neighborsLength of the second added neighbor should be 1', () => {
                expect(cell.neighbors[Position.Left]?.neighborsLength).toBe(1);
            });

            test('the second added neighbor should only have one neighbor which is this cell', () => {
                expect(objectify(cell.neighbors[Position.Left]?.neighbors[Position.Right])).toEqual([2, 1]);
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
                [Position.TopLeft]: [1, 0],
                [Position.Top]: [1, 1],
                [Position.TopRight]: [1, 2],
                [Position.Left]: [2, 0],
                [Position.Right]: [2, 2],
                [Position.BottomLeft]: [3, 0],
                [Position.Bottom]: [3, 1],
                [Position.BottomRight]: [3, 2]
            });
        });

        describe('then destroy the cell', () => {
            let others: Array<Cell | null>;
            beforeEach(() => {
                others = Object.values(cell.neighbors);
                cell.destructor();
            });

            test('the neighbors of the cell should be empty', () => {
                expect(cell.neighbors).toEqual(Cell.EmptyNeighbors());
            });

            test('All other cells should not treat this cell as neighbors', () => {
                others.forEach(other => {
                    expect(Object.values(other!.neighbors)).not.toContain(cell);
                });
            });

        });
    });

    describe('if add a cell which is not a neighbor', () => {
        let firstAddedPosition: Positions, secondAddedPosition: Positions, thirdAddedPosition: Positions;
        beforeEach(() => {
            firstAddedPosition = cell.addNeighbor(new Cell([3, 3]));
            secondAddedPosition = cell.addNeighbor(new Cell([2, 3]));
            thirdAddedPosition = cell.addNeighbor(new Cell([2, -1]));
        });

        test('addNeighbor should return null', () => {
            expect(firstAddedPosition).toBe(null);
            expect(secondAddedPosition).toBe(null);
            expect(thirdAddedPosition).toBe(null);
        });

        test('neighborsLength should be 0', () => {
            expect(cell.neighborsLength).toBe(0);
        });

        test('the neighbors should be empty', () => {
            expect(cell.neighbors).toEqual(Cell.EmptyNeighbors());
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
            expect(cell.neighbors).toEqual(Cell.EmptyNeighbors());
        });
    })
});