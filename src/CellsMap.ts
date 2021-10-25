import {Age, Cell, Pair, Position} from "./Cell";

const ConvertPosition: { [key in Position]: (pair: Pair) => [number, number] } = {
    [Position.TopLeft]: ([x, y]) => [x - 1, y - 1],
    [Position.Top]: ([x, y]) => [x - 1, y],
    [Position.TopRight]: ([x, y]) => [x - 1, y + 1],
    [Position.Left]: ([x, y]) => [x, y - 1],
    [Position.Right]: ([x, y]) => [x, y + 1],
    [Position.BottomLeft]: ([x, y]) => [x + 1, y - 1],
    [Position.Bottom]: ([x, y]) => [x + 1, y],
    [Position.BottomRight]: ([x, y]) => [x + 1, y + 1],
}

export class CellsMap {
    cells: Cell[] = [];
    dying: Cell[] = [];
    newborn: Cell[] = [];
    failed: Cell[] = [];

    constructor(cellsTuple: Array<[number, number]>) {
        cellsTuple.forEach(cellTuple => {
            const newCell = new Cell(cellTuple);
            this.cells.forEach(cell => cell.addNeighbor(newCell));
            this.cells.push(newCell);
        });
    }

    grow() {
        this.cells.forEach(cell => {
            if (this.shouldBeDead(cell)) {
                cell.age = Age.Dying;
                this.dying.push(cell);
            } else {
                cell.age = Age.Surviving;
            }
            Object.keys(cell.neighbors).forEach(key => {
                const position = key as Position;
                if (!cell.neighbors[position]) {
                    const [x, y] = ConvertPosition[position](cell);
                    const newLife = new Cell([x, y]);
                    newLife.age = Age.Newborn;
                    this.cells.forEach(cell => cell.addNeighbor(newLife));
                    if (this.shouldBeBorne(newLife)) {
                        this.newborn.forEach(cell => cell.addNeighbor(newLife));
                        this.newborn.push(newLife);
                    } else {
                        this.failed.push(newLife);
                    }
                }
            });

        });
    }

    clean() {
        this.cells = this.cells.filter(cell => cell.age === Age.Surviving).concat(this.newborn);
        this.failed.forEach(cell => cell.destructor());
        this.failed = [];
        this.dying.forEach(cell => cell.destructor());
        this.dying = [];
        this.newborn.forEach(cell => cell.age = Age.Surviving);
        this.newborn = [];
    }

    shouldBeDead(cell: Cell): boolean {
        return cell.neighborsLength > 3 || cell.neighborsLength < 2;
    }

    shouldBeBorne(cell: Cell): boolean {
        return cell.neighborsLength === 3;
    }
}