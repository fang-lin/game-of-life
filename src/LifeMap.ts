import {Coordinate} from './Canvas';

export type CellsMap = Map<string, Coordinate>;

export class LifeMap {
    cells: CellsMap = new Map();
    deadList: CellsMap = new Map();
    bornList: CellsMap = new Map();

    constructor(cells?: Coordinate[]) {
        if (cells)
            this.addCells(cells);
    }

    static adjacentCoordinates([x, y]: Coordinate): Coordinate[] {
        return [
            [x - 1, y - 1],
            [x - 1, y],
            [x - 1, y + 1],
            [x, y - 1],
            [x, y + 1],
            [x + 1, y - 1],
            [x + 1, y],
            [x + 1, y + 1]
        ];
    }

    addCell(coords: Coordinate) {
        return this.cells.set(coords.toString(), coords);
    }

    addCells(cells: Coordinate[]) {
        return cells.forEach(cell => this.addCell(cell));
    }

    removeCell(cell: Coordinate) {
        return this.cells.delete(cell.toString());
    }

    removeCells(cells: Coordinate[]) {
        return cells.forEach(cell => this.removeCell(cell));
    }

    toggleCell(cell: Coordinate) {
        this.cells.get(cell.toString()) ? this.removeCell(cell) : this.addCell(cell);
    }

    getNeighborsNum(coords: Coordinate): number {
        return LifeMap.adjacentCoordinates(coords)
            .reduce(
                (neighbors, coords) => this.cells.get(coords.toString()) ? neighbors + 1 : neighbors,
                0
            );
    }

    evolve() {
        this.bornList = new Map();
        this.deadList = new Map();
        this.cells.forEach(cell => {
            const neighborsNum = this.getNeighborsNum(cell);
            if (neighborsNum < 2 || neighborsNum > 3) {
                this.deadList.set(cell.toString(), cell);
            }

            LifeMap.adjacentCoordinates(cell).forEach(born => {
                if (!this.cells.get(born.toString()) && !this.bornList.get(born.toString()) && this.getNeighborsNum(born) === 3) {
                    this.bornList.set(born.toString(), born);
                }
            });
        });
        this.deadList.forEach(dead => this.removeCell(dead));
        this.bornList.forEach(born => this.addCell(born));
    }

    toString() {
        return JSON.stringify([...this.cells]);
    }


    reset() {
        this.cells = new Map();
    }
}