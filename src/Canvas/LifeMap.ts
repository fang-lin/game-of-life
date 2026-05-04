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

    /**
     * Neighbor counting algorithm: O(8N) per generation.
     *
     * 1. For each alive cell, increment a counter for all 8 neighbors → 8N ops
     * 2. Scan the counter map:
     *    - count = 3 → alive (birth or survival)
     *    - count = 2 and currently alive → survival
     *    - otherwise → dead
     */
    evolve() {
        const neighborCount = new Map<string, number>();

        // Count neighbors: 8 increments per alive cell
        this.cells.forEach(([x, y]) => {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    const key = `${x + dx},${y + dy}`;
                    neighborCount.set(key, (neighborCount.get(key) || 0) + 1);
                }
            }
        });

        // Determine next generation
        this.deadList = new Map();
        this.bornList = new Map();
        const nextCells: CellsMap = new Map();

        neighborCount.forEach((count, key) => {
            const [x, y] = key.split(',').map(Number) as Coordinate;
            const wasAlive = this.cells.has(key);

            if (count === 3 || (count === 2 && wasAlive)) {
                nextCells.set(key, [x, y]);
                if (!wasAlive) {
                    this.bornList.set(key, [x, y]);
                }
            }
        });

        // Find dead cells (were alive, now not)
        this.cells.forEach((cell, key) => {
            if (!nextCells.has(key)) {
                this.deadList.set(key, cell);
            }
        });

        this.cells = nextCells;
    }

    reset() {
        this.cells = new Map();
    }
}
