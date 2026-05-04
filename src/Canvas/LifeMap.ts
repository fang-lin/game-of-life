import {Coordinate} from './Canvas';
import {Node, NodePool} from './HashLife';

export type CellsMap = Map<string, Coordinate>;

export class LifeMap {
    cells: CellsMap = new Map();
    deadList: CellsMap = new Map();
    bornList: CellsMap = new Map();
    private pool: NodePool;
    private tree: Node;
    private treeDirty = true; // true when cells map was modified directly

    constructor(cells?: Coordinate[]) {
        this.pool = new NodePool();
        this.tree = this.pool.emptyTree(3);
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

    addCell = (coords: Coordinate) => {
        this.cells.set(`${coords}`, coords);
        this.treeDirty = true;
    };

    addCells = (cells: Coordinate[]) => cells.forEach(this.addCell);

    removeCell = (cell: Coordinate) => {
        this.cells.delete(cell.toString());
        this.treeDirty = true;
    };

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
        // Sync tree from cells map if it was modified directly
        if (this.treeDirty) {
            this.rebuildTree();
        }

        const oldCells = this.getCells();

        // Expand to ensure enough room, then step
        this.tree = this.pool.expand(this.tree);
        this.tree = this.pool.expand(this.tree);
        this.tree = this.pool.stepOne(this.tree);
        this.treeDirty = false;

        // Collect new cells from tree
        const newCells: [number, number][] = [];
        this.pool.collectCells(this.tree, 0, 0, newCells);

        // Compute deadList and bornList
        const oldSet = new Set(oldCells.map(c => `${c}`));
        const newSet = new Set(newCells.map(c => `${c}`));

        this.deadList = new Map();
        this.bornList = new Map();

        for (const cell of oldCells) {
            if (!newSet.has(`${cell}`)) {
                this.deadList.set(`${cell}`, cell);
            }
        }

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
        this.pool = new NodePool();
        this.tree = this.pool.emptyTree(3);
        this.treeDirty = true;
    }

    private rebuildTree() {
        const cells = this.getCells() as [number, number][];
        this.pool = new NodePool();
        this.tree = this.pool.fromCells(cells);
        this.treeDirty = false;
    }
}
