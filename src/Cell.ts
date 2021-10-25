export enum Age {
    Newborn,
    Surviving,
    Dying
}

export enum Position {
    TopLeft = 'TopLeft',
    Top = 'Top',
    TopRight = 'TopRight',
    Left = 'Left',
    Right = 'Right',
    BottomLeft = 'BottomLeft',
    Bottom = 'Bottom',
    BottomRight = 'BottomRight',
}

export const PositionMap: { [key in number]: Position } = {
    0: Position.TopLeft,
    1: Position.Top,
    2: Position.TopRight,
    3: Position.Left,
    5: Position.Right,
    6: Position.BottomLeft,
    7: Position.Bottom,
    8: Position.BottomRight
}

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

    addNeighbor(cell?: Cell): Position | null {
        if (cell) {
            const key = this.getPosition(cell);
            if (key !== null && cell !== this.neighbors[key]) {
                Object.values(this.neighbors).forEach(neighbor => neighbor && cell.addNeighbor(neighbor));
                this.neighbors[key] = cell;
                cell.addNeighbor(this);
                return key;
            }
        }
        return null;
    }

    removeNeighbor(cell?: Cell | null): Position | null {
        if (cell) {
            const key = this.getPosition(cell.toTuple());
            if (key !== null && cell === this.neighbors[key]) {
                this.neighbors[key] = null;
                Object.values(cell.neighbors).forEach(neighbor => neighbor?.removeNeighbor(cell));
                cell.neighbors = Cell.EmptyNeighbors();
                return key;
            }
        }
        return null;
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

    private getPosition([x, y]: Pair): Position | null {
        if (this.isNeighbor([x, y])) {
            return PositionMap[((x - this[0] + 2) + (y - this[1])) * 2 + (x - this[0]) + (this[1] - y)];
        }
        return null;
    }
}