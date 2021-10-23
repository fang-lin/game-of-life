import {Cell} from "./Cell";

export class CellMap {
    cells: Array<Cell>;
    // xToYIndex: { [key: number]: { [key: number]: true } } = {};
    // yToXIndex: { [key: number]: { [key: number]: true } } = {};

    constructor(cellsMap: Array<[number, number]>) {
        this.cells = cellsMap.map(c => new Cell(c));
        for (let i = 0; i < cellsMap.length; i++) {
            for (let j = i + 1; j < cellsMap.length; j++) {
                this.cells[i].addNeighbor(this.cells[j]);
            }
        }
    }

    // deadOrAlive() {
    //     this.cells.forEach((cell) => {
    //
    //     });
    // }
    //
    // neighbors([x, y]: [number, number]): number {
    //     let num = 0;
    //     this.xToYIndex[x - 1][y - 1] && num++;
    //     this.xToYIndex[x - 1][y] && num++;
    //     this.xToYIndex[x - 1][y + 1] && num++;
    //
    //     this.xToYIndex[x][y - 1] && num++;
    //     this.xToYIndex[x][y + 1] && num++;
    //
    //     this.xToYIndex[x + 1][y - 1] && num++;
    //     this.xToYIndex[x + 1][y] && num++;
    //     this.xToYIndex[x + 1][y + 1] && num++;
    //     return num;
    // }
    //
    // isDead(neighbors: number): boolean {
    //     return neighbors < 2 || neighbors > 3;
    // }
    //
    // isAlive(neighbors: number): boolean {
    //     return neighbors === 3;
    // }
    //
    // print() {
    //     console.log('Cells:', this.cells);
    //     console.log('X to Y:', this.xToYIndex);
    //     console.log('Y to X:', this.yToXIndex);
    // }
    //
    // private reIndex() {
    //     this.xToYIndex = {};
    //     this.cells.forEach(([x, y]) => {
    //         this.xToYIndex[x] ? this.xToYIndex[x][y] = true : this.xToYIndex[x] = {[y]: true};
    //         this.yToXIndex[y] ? this.yToXIndex[y][x] = true : this.yToXIndex[y] = {[x]: true};
    //     })
    // }
}