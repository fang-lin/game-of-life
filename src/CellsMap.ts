import {Age, Cell} from "./Cell";

export class CellsMap {
    cells: Array<Cell>;

    constructor(cellsMap: Array<[number, number]>) {
        this.cells = cellsMap.map(c => new Cell(c));
        this.buildNeighbors();
    }

    step() {
        const dying = [];
        this.cells.forEach(cell => {
            if (cell.neighborsLength > 3 || cell.neighborsLength < 2) {
                cell.age = Age.DYING;
                dying.push(cell);
            }
            Object.keys(cell.neighbors);

            cell.age = Age.SURVIVING;
        });

        // this.cells = filter
    }

    private buildNeighbors() {
        for (let i = 0; i < this.cells.length; i++) {
            for (let j = i + 1; j < this.cells.length; j++) {
                this.cells[i].addNeighbor(this.cells[j]);
            }
        }
    }
}