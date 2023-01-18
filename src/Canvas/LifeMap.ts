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

    addCell = (coords: Coordinate) => this.cells.set(`${coords}`, coords);

    addCells = (cells: Coordinate[]) => cells.forEach(this.addCell);

    removeCell = (cell: Coordinate) => this.cells.delete(cell.toString());

    removeCells = (cells: Coordinate[]) => cells.forEach(this.removeCell);

    toggleCell = (cell: Coordinate) => this.cells.get(`${cell}`) ? this.removeCell(cell) : this.addCell(cell);

    toggleCells = (cells: Coordinate[]) => cells.forEach(this.toggleCell);

    getCells(): Coordinate[] {
        return Array.from(this.cells.values());
    }

    getNeighborsNum(cell: Coordinate): number {
        return LifeMap.adjacentCoordinates(cell)
            .reduce((num, cell) => this.cells.get(`${cell}`) ? num + 1 : num, 0);
    }

    evolve() {
        this.bornList = new Map();
        this.deadList = new Map();
        this.cells.forEach(cell => {
            const neighborsNum = this.getNeighborsNum(cell);
            if (neighborsNum < 2 || neighborsNum > 3) {
                this.deadList.set(`${cell}`, cell);
            }

            LifeMap.adjacentCoordinates(cell).forEach(born => {
                if (!this.cells.get(`${born}`) && !this.bornList.get(`${born}`) && this.getNeighborsNum(born) === 3) {
                    this.bornList.set(`${born}`, born);
                }
            });
        });
        this.deadList.forEach(dead => this.removeCell(dead));
        this.bornList.forEach(born => this.addCell(born));
    }

    reset() {
        this.cells = new Map();
    }
}
