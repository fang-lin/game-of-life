import {Age, Cell} from "./Cell";

export class CellsMap {
    cells: Cell[] = [];

    constructor(cellsTuple: Array<[number, number]>) {

        cellsTuple.forEach(cellTuple => {
            const newCell = new Cell(cellTuple);
            this.cells.forEach(cell => cell.addNeighbor(newCell));
            this.cells.push(newCell);
        });
        // this.cells = cellsTuple.map(c => new Cell(c));
        // this.buildNeighbors();
    }

    step() {
        const dying: Cell[] = [];
        const newborn: Cell[] = [];
        this.cells.forEach(cell => {
            if (cell.neighborsLength > 3 || cell.neighborsLength < 2) {
                cell.age = Age.Dying;
                dying.push(cell);
            }
            Object.keys(cell.neighbors);

            cell.age = Age.Surviving;
        });

        // this.cells = filter
    }

    // private buildNeighbors() {
    //     for (let i = 0; i < this.cells.length; i++) {
    //         for (let j = i + 1; j < this.cells.length; j++) {
    //             this.cells[i].addNeighbor(this.cells[j]);
    //         }
    //     }
    // }
}