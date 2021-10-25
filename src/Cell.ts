export enum Age {
    Newborn,
    Surviving,
    Dying
}

export enum Position {
    TopLeft = 0,
    Top = 1,
    TopRight = 2,
    Left = 3,
    Right = 5,
    BottomLeft = 6,
    Bottom = 7,
    BottomRight = 8,
}

export const PositionNaN = -1;

export type Positions = Position | typeof PositionNaN;

class Pair extends Array<number> {
    constructor([x, y]: [number, number]) {
        super(...[x, y]);
        this[0] = x;
        this[1] = y;
    }
}

export class Cell extends Pair {
    neighbors: { [key in Position]: Cell | null } = Cell.EmptyNeighbors();
    age: Age = Age.Newborn;

    get neighborsLength() {
        return Object.values(this.neighbors).filter(_ => !!_).length;
    }

    static EmptyNeighbors(): { [key in Position]: null } {
        return {
            [Position.TopLeft]: null,
            [Position.Top]: null,
            [Position.TopRight]: null,
            [Position.Left]: null,
            [Position.Right]: null,
            [Position.BottomLeft]: null,
            [Position.Bottom]: null,
            [Position.BottomRight]: null,
        };
    }

    equals([x, y]: [number, number]) {
        return this[0] === x && this[1] === y;
    }

    addNeighbor(cell?: Cell): Positions {
        if (cell) {
            const index = this.index(cell);
            if (index !== PositionNaN && cell !== this.neighbors[index]) {
                Object.values(this.neighbors).forEach(neighbor => neighbor && cell.addNeighbor(neighbor));
                this.neighbors[index] = cell;
                cell.addNeighbor(this);
                return index;
            }
        }
        return PositionNaN;
    }

    removeNeighbor(cell?: Cell | null): Positions {
        if (cell) {
            const index = this.index(cell.toTuple());
            if (index !== PositionNaN && cell === this.neighbors[index]) {
                this.neighbors[index] = null;
                Object.values(cell.neighbors).forEach(neighbor => neighbor?.removeNeighbor(cell));
                cell.neighbors = Cell.EmptyNeighbors();
                return index;
            }
        }
        return PositionNaN;
    }

    toTuple(): [number, number] {
        return [this[0], this[1]];
    }

    destructor() {
        Object.values(this.neighbors).forEach(neighbor => neighbor?.removeNeighbor(this));
    }

    private isNeighbor([x, y]: Pair): boolean {
        return Math.abs(x - this[0]) <= 1 && Math.abs(y - this[1]) <= 1 && !(this[0] === x && this[1] === y);
    }

    private index([x, y]: Pair): Position | typeof PositionNaN {
        if (this.isNeighbor([x, y])) {
            return ((x - this[0] + 2) + (y - this[1])) * 2 + (x - this[0]) + (this[1] - y);
        }
        return PositionNaN;
    }
}