import {Coordinate} from './Canvas';
import {NodePool} from './HashLife';

export type CellsMap = Map<string, Coordinate>;

export class LifeMap {
    cells: CellsMap = new Map();
    deadList: CellsMap = new Map();
    bornList: CellsMap = new Map();
    private pool: NodePool = new NodePool();
    private generation = 0;

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
        const currentCells = this.getCells() as [number, number][];

        // Build tree, expand, step, collect — all in one pass with fresh coordinates
        let tree = this.pool.fromCells(currentCells);
        tree = this.pool.expand(tree);
        tree = this.pool.expand(tree);
        tree = this.pool.stepOne(tree);

        const newCells: [number, number][] = [];
        this.pool.collectCells(tree, 0, 0, newCells);

        // Diff for deadList / bornList
        const oldSet = new Set(currentCells.map(c => `${c[0]},${c[1]}`));
        const newSet = new Set(newCells.map(c => `${c[0]},${c[1]}`));

        this.deadList = new Map();
        this.bornList = new Map();

        for (const cell of currentCells) {
            if (!newSet.has(`${cell[0]},${cell[1]}`)) {
                this.deadList.set(`${cell}`, cell);
            }
        }

        this.cells = new Map();
        for (const cell of newCells) {
            const coord: Coordinate = [cell[0], cell[1]];
            this.cells.set(`${coord}`, coord);
            if (!oldSet.has(`${cell[0]},${cell[1]}`)) {
                this.bornList.set(`${coord}`, coord);
            }
        }

        // Periodically create fresh pool to prevent unbounded cache growth
        this.generation++;
        if (this.generation % 100 === 0) {
            this.pool = new NodePool();
        }
    }

    reset() {
        this.cells = new Map();
        this.pool = new NodePool();
        this.generation = 0;
    }
}
