export enum Age {
    NEWBORN,
    SURVIVING,
    DYING
}

export enum Position {
    TL = 0,
    T = 1,
    TR = 2,
    L = 3,
    R = 5,
    BL = 6,
    B = 7,
    BR = 8,
    NaN = -1
}

export class Cell extends Array<number> {
    neighbors: { [key: number]: Cell } = {};
    age: Age = Age.NEWBORN;

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
        const index = this.index([cell[0], cell[1]]);
        if (index !== Position.NaN && cell !== this.neighbors[index]) {
            Object.values(this.neighbors).forEach(neighbor => cell.addNeighbor(neighbor));
            this.neighbors[index] = cell;
            cell.addNeighbor(this);
        }
    }

    removeNeighbor(cell: Cell) {
        const index = this.index(cell.toTuple());
        if (index !== Position.NaN && cell === this.neighbors[index]) {
            delete this.neighbors[index];
            Object.values(cell.neighbors).forEach(neighbor => neighbor.removeNeighbor(cell));
            cell.neighbors = {};
        }
    }

    toTuple(): [number, number] {
        return [this[0], this[1]];
    }

    destructor() {
        Object.values(this.neighbors).forEach(neighbor => neighbor.removeNeighbor(this));
    }

    private isNeighbor([x, y]: [number, number]): boolean {
        return Math.abs(x - this[0]) <= 1 && Math.abs(y - this[1]) <= 1 && !(this[0] === x && this[1] === y);
    }

    private index([x, y]: [number, number]): Position {
        if (this.isNeighbor([x, y])) {
            return ((x - this[0] + 2) + (y - this[1])) * 2 + (x - this[0]) + (this[1] - y);
        }
        return Position.NaN;
    }
}