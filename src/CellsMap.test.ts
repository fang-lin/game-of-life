import {CellsMap} from "./CellsMap";
import {objectify} from "./utils";
import {Position} from "./Cell";


describe('CellsMap', () => {
    describe('construct a simple cells map', () => {
        let cellsMap: CellsMap;
        beforeEach(() => {
            const cells: Array<[number, number]> = [
                [0, 1],
                [1, 0],
                [1, 1],
                [1, 2],
                [2, 1]
            ]
            cellsMap = new CellsMap(cells);
        });

        test('the property cells should be set', () => {
            expect(objectify(cellsMap.cells)).toEqual([
                [0, 1],
                [1, 0],
                [1, 1],
                [1, 2],
                [2, 1]
            ]);
        });

        test('the 1st cell should have correct neighbors', () => {
            expect(objectify(cellsMap.cells[0].neighbors)).toEqual({
                [Position.TopLeft]: null,
                [Position.Top]: null,
                [Position.TopRight]: null,
                [Position.Left]: null,
                [Position.Right]: null,
                [Position.BottomLeft]: [1, 0],
                [Position.Bottom]: [1, 1],
                [Position.BottomRight]: [1, 2],
            });
        });

        test('the 2nd cell should have correct neighbors', () => {
            expect(objectify(cellsMap.cells[1].neighbors)).toEqual({
                [Position.TopLeft]: null,
                [Position.Top]: null,
                [Position.TopRight]: [0, 1],
                [Position.Left]: null,
                [Position.Right]: [1, 1],
                [Position.BottomLeft]: null,
                [Position.Bottom]: null,
                [Position.BottomRight]: [2, 1],
            });
        });

        test('the 3rd cell should have correct neighbors', () => {
            expect(objectify(cellsMap.cells[2].neighbors)).toEqual({
                [Position.TopLeft]: null,
                [Position.Top]: [0, 1],
                [Position.TopRight]: null,
                [Position.Left]: [1, 0],
                [Position.Right]: [1, 2],
                [Position.BottomLeft]: null,
                [Position.Bottom]: [2, 1],
                [Position.BottomRight]: null,
            });
        });

        test('the 4th cell should have correct neighbors', () => {
            expect(objectify(cellsMap.cells[3].neighbors)).toEqual({
                [Position.TopLeft]: [0, 1],
                [Position.Top]: null,
                [Position.TopRight]: null,
                [Position.Left]: [1, 1],
                [Position.Right]: null,
                [Position.BottomLeft]: [2, 1],
                [Position.Bottom]: null,
                [Position.BottomRight]: null,
            });
        });

        test('the 5th cell should have correct neighbors', () => {
            expect(objectify(cellsMap.cells[4].neighbors)).toEqual({
                [Position.TopLeft]: [1, 0],
                [Position.Top]: [1, 1],
                [Position.TopRight]: [1, 2],
                [Position.Left]: null,
                [Position.Right]: null,
                [Position.BottomLeft]: null,
                [Position.Bottom]: null,
                [Position.BottomRight]: null,
            });
        });

        describe('when the step is called', () => {
            beforeEach(() => {
                cellsMap.step();
            });

            xtest('the cells should be updated to correct value', () => {
                expect(objectify(cellsMap.cells)).toEqual([
                    [0, 1],
                    [1, 0],
                    [1, 2],
                    [2, 1],
                    [0, 0],
                    [0, 2],
                    [2, 0],
                    [2, 2],
                ])
            });
        });
    })
});