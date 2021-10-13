export class Cell extends Array<number> {
    neighbors: { [key: number]: Cell } = {};

    constructor([x, y]: [number, number]) {
        super(...[x, y]);
    }

    get neighborsLength() {
        return Object.keys(this.neighbors).length;
    }

    equals([x, y]: [number, number]) {
        return this[0] === x && this[1] === y;
    }

    addNeighbor(cell: Cell) {
        const index = this.index(cell);
        if (this.isNeighbor(index) && cell !== this.neighbors[index]) {
            for (let key in this.neighbors) {
                cell.addNeighbor(this.neighbors[key]);
            }
            this.neighbors[index] = cell;
            cell.addNeighbor(this);
        }
    }

    removeNeighbor(cell: Cell) {
        const index = this.index(cell);
        if (this.isNeighbor(index) && cell === this.neighbors[index]) {
            delete this.neighbors[index];
            for (let key in cell.neighbors) {
                cell.neighbors[key].removeNeighbor(cell);
            }
        }
    }

    private isNeighbor(index: number): boolean {
        return index !== 4 && index >= 0 && index <= 8;
    }

    private index([x, y]: Array<number>) {
        return ((x - this[0]) + (y - this[1]) + 2) * 2 + (this[0] - x) + (y - this[1]);
    }
}