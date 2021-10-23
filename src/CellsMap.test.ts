import {CellsMap} from "./CellsMap";
import {objectify} from "./utils";


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
                '6': [1, 0],
                '7': [1, 1],
                '8': [1, 2],
            });
        });

        test('the 2nd cell should have correct neighbors', () => {
            expect(objectify(cellsMap.cells[1].neighbors)).toEqual({
                '2': [0, 1],
                '5': [1, 1],
                '8': [2, 1],
            });
        });

        test('the 3rd cell should have correct neighbors', () => {
            expect(objectify(cellsMap.cells[2].neighbors)).toEqual({
                '1': [0, 1],
                '3': [1, 0],
                '5': [1, 2],
                '7': [2, 1],
            });
        });

        test('the 4th cell should have correct neighbors', () => {
            expect(objectify(cellsMap.cells[3].neighbors)).toEqual({
                '0': [0, 1],
                '3': [1, 1],
                '6': [2, 1],
            });
        });

        test('the 5th cell should have correct neighbors', () => {
            expect(objectify(cellsMap.cells[4].neighbors)).toEqual({
                '0': [1, 0],
                '1': [1, 1],
                '2': [1, 2],
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