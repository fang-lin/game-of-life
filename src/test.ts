// @ts-ignore
function index([x, y]: [number, number], [a, b]: [number, number]): number {
    return ((x - a + 2) + (y - b)) * 2 + (x - a) + (b - y);
}

const cells = [];

for (let i = 0; i < 10; i++) {
    const line = [];
    for (let j = 0; j < 10; j++) {
        line.push([i, j]);
    }
    cells.push(line);
}

// @ts-ignore
const arr = cells.map(line => line.map(cell => index(cell, [2, 4])));
// @ts-ignore
console.log(
    arr
);