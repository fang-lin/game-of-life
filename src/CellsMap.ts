import {Age, Cell, Position} from "./Cell";

export class CellsMap {
    cells: Cell[] = [];

    constructor(cellsTuple: Array<[number, number]>) {
        cellsTuple.forEach(cellTuple => {
            const newCell = new Cell(cellTuple);
            this.cells.forEach(cell => cell.addNeighbor(newCell));
            this.cells.push(newCell);
        });
    }

    step() {
        const dying: Cell[] = [];
        const newborn: Cell[] = [];
        this.cells.forEach(cell => {
            if (this.shouldBeDead(cell)) {
                cell.age = Age.Dying;
                dying.push(cell);
            }

            const s = cell.neighbors[Position.Left];

            Object.keys(cell.neighbors).forEach(index => {
                switch (index) {
                    case Position.Left:
                        break;
                }
            });
            // Object.values(cell.neighbors).forEach(neighbor => {
            //     if (!neighbor) {
            //         cell.addNeighbor();
            //     }
            // });
            cell.age = Age.Surviving;
        });

        // this.cells = filter
    }

    shouldBeDead(cell: Cell): boolean {
        return cell.neighborsLength > 3 || cell.neighborsLength < 2;
    }

    // private buildNeighbors() {
    //     for (let i = 0; i < this.cells.length; i++) {
    //         for (let j = i + 1; j < this.cells.length; j++) {
    //             this.cells[i].addNeighbor(this.cells[j]);
    //         }
    //     }
    // }
}