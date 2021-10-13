


export class LifeMap {
    cells: Array<[number, number]>;
    xToYIndex: { [key: number]: { [key: number]: true } } = {};
    yToXIndex: { [key: number]: { [key: number]: true } } = {};

    constructor(cells: Array<[number, number]>) {
        this.cells = cells;
        this.reIndex();
    }

    deadOrAlive() {
        const newLife = [];

        this.cells.forEach(([x, y]) => {
            const [nx, ny] = [x - 1, y - 1];
            if (this.xToYIndex[nx][ny]) {
                const neighbors = this.neighbors([nx, ny]);
                if (neighbors < 2 || neighbors > 3) {

                }

            } else {

            }


            // if(neighbors === 3){
            //     newLife.push([x - 1, y - 1]);
            // }else if(neighbors < 2 || neighbors > 3)
        })
    }

    neighbors([x, y]: [number, number]): number {
        let num = 0;
        this.xToYIndex[x - 1][y - 1] && num++;
        this.xToYIndex[x - 1][y] && num++;
        this.xToYIndex[x - 1][y + 1] && num++;

        this.xToYIndex[x][y - 1] && num++;
        this.xToYIndex[x][y + 1] && num++;

        this.xToYIndex[x + 1][y - 1] && num++;
        this.xToYIndex[x + 1][y] && num++;
        this.xToYIndex[x + 1][y + 1] && num++;
        return num;
    }

    isDead(neighbors: number): boolean {
        return neighbors < 2 || neighbors > 3;
    }

    isAlive(neighbors: number): boolean {
        return neighbors === 3;
    }

    print() {
        console.log('Cells:', this.cells);
        console.log('X to Y:', this.xToYIndex);
        console.log('Y to X:', this.yToXIndex);
    }

    private reIndex() {
        this.xToYIndex = {};
        this.cells.forEach(([x, y]) => {
            this.xToYIndex[x] ? this.xToYIndex[x][y] = true : this.xToYIndex[x] = {[y]: true};
            this.yToXIndex[y] ? this.yToXIndex[y][x] = true : this.yToXIndex[y] = {[x]: true};
        })
    }
}