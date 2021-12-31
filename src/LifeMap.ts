import {Coordinate} from './Canvas';

export enum CellState {
    Born,
    Alive,
    Dead
}

export interface Cell {
    coordinate: Coordinate;
    state: CellState;
}

export type CellsMap = Map<string, Cell>;

export class LifeMap {
    cells: CellsMap = new Map();

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

    addCell(coords: Coordinate, state: CellState = CellState.Alive) {
        return this.cells.set(coords.toString(), {
            coordinate: coords, state
        });
    }

    addCells(cells: Coordinate[], state: CellState = CellState.Alive) {
        return cells.forEach(cell => this.addCell(cell, state));
    }

    removeCell(cell: Coordinate) {
        return this.cells.delete(cell.toString());
    }

    removeCells(cells: Coordinate[]) {
        return cells.forEach(cell => this.removeCell(cell));
    }

    hasCell(cell: Coordinate): boolean {
        const item = this.cells.get(cell.toString());
        return !!item && item.state !== CellState.Born;
    }

    toggleCell(cell: Coordinate) {
        this.hasCell(cell) ? this.removeCell(cell) : this.addCell(cell);
    }

    getNeighborsNum(coords: Coordinate): number {
        return LifeMap.adjacentCoordinates(coords)
            .reduce(
                (neighbors, coords) => this.hasCell(coords) ? neighbors + 1 : neighbors,
                0
            );
    }

    evolve() {
        const newCells: Coordinate[] = [];
        this.cells.forEach(cell => {
            if (cell.state === CellState.Dead) {
                this.removeCell(cell.coordinate);
            } else if (cell.state === CellState.Born) {
                cell.state = CellState.Alive;
            } else {
                const neighborsNum = this.getNeighborsNum(cell.coordinate);
                if (neighborsNum < 2 || neighborsNum > 3) {
                    cell.state = CellState.Dead;
                }

                LifeMap.adjacentCoordinates(cell.coordinate).forEach(adjacentCoordinate => {
                    if (!this.hasCell(adjacentCoordinate) && this.getNeighborsNum(adjacentCoordinate) === 3) {
                        newCells.push(adjacentCoordinate);
                    }
                });
            }
        });
        this.addCells(newCells, CellState.Born);
    }

    toString() {
        return JSON.stringify([...this.cells]);
    }


    reset() {
        this.cells = new Map();
    }
}