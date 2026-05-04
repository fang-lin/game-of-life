import {Coordinate} from './Canvas';
import {NodePool} from './HashLife';

export type CellsMap = Map<string, Coordinate>;

const pool = new NodePool();

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
        // Build HashLife tree from current cells
        const currentCells = this.getCells() as [number, number][];
        let tree = pool.fromCells(currentCells);

        // Expand to ensure enough room for stepOne
        tree = pool.expand(tree);
        tree = pool.expand(tree);

        // Advance one generation
        tree = pool.stepOne(tree);

        // Collect new cells
        const newCells: [number, number][] = [];
        pool.collectCells(tree, 0, 0, newCells);

        // Compute deadList and bornList by diffing old and new
        const oldSet = new Set(currentCells.map(c => `${c}`));
        const newSet = new Set(newCells.map(c => `${c}`));

        this.deadList = new Map();
        this.bornList = new Map();

        for (const cell of currentCells) {
            if (!newSet.has(`${cell}`)) {
                this.deadList.set(`${cell}`, cell);
            }
        }

        // Update cells map
        this.cells = new Map();
        for (const cell of newCells) {
            const coord: Coordinate = [cell[0], cell[1]];
            this.cells.set(`${coord}`, coord);
            if (!oldSet.has(`${coord}`)) {
                this.bornList.set(`${coord}`, coord);
            }
        }
    }

    reset() {
        this.cells = new Map();
    }
}
