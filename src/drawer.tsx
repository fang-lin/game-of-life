import {Size} from './Canvas';
import {pixelRatio} from './utils';
import {CellsMap} from './LifeMap';
import {RefObject} from 'react';

export function drawGrid(canvasRef: RefObject<HTMLCanvasElement>, size: Size, cellSize: number) {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
        const [width, height] = size;
        const rows = Math.ceil(height / cellSize);
        const columns = Math.ceil(width / cellSize);
        context.beginPath();
        for (let i = 0; i < rows; i++) {
            const y = i * cellSize * pixelRatio + pixelRatio / 2;
            context.moveTo(0, y);
            context.lineTo(width * pixelRatio, y);
        }
        for (let j = 0; j < columns; j++) {
            const x = j * cellSize * pixelRatio + pixelRatio / 2;
            context.moveTo(x, 0);
            context.lineTo(x, height * pixelRatio);
        }
        context.lineWidth = pixelRatio;
        context.strokeStyle = 'rgba(0,0,0,.3)';
        context.stroke();
    }
}

export function drawCell(canvasRef: RefObject<HTMLCanvasElement>, color: string, x: number, y: number, w: number, h: number) {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
        context.fillStyle = color;
        context.fillRect(x, y, w, h);
    }
}

// export function drawCells(context: CanvasRenderingContext2D, color: string, cells: Coordinate[]) {
//     context.fillStyle = color;
//     cells.forEach(([x, y]) => {
//         context.fillRect((y * cell + 1) * pixelRatio, (x * cell + 1) * pixelRatio, (cell - 1) * pixelRatio, (cell - 1) * pixelRatio);
//     });
// }

export function drawLife(canvasRef: RefObject<HTMLCanvasElement>, cells: CellsMap, cellSize: number) {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
        context.fillStyle = '#000';
        cells.forEach(([x, y]) => {
            context.fillRect((y * cellSize + 1) * pixelRatio, (x * cellSize + 1) * pixelRatio, (cellSize - 1) * pixelRatio, (cellSize - 1) * pixelRatio);
        });
    }
}

// export function drawNewLife(context: CanvasRenderingContext2D, lifeMap: Coordinate[]) {
//     context.fillStyle = '#676';
//     lifeMap.forEach(([x, y]) => {
//         context.fillRect((y * cell + 1) * pixelRatio, (x * cell + 1) * pixelRatio, (cell - 1) * pixelRatio, (cell - 1) * pixelRatio);
//     });
// }

// export function drawDeadLife(context: CanvasRenderingContext2D, lifeMap: Coordinate[]) {
//     context.fillStyle = '#dcc';
//     lifeMap.forEach(([x, y]) => {
//         context.fillRect((y * cell + 1) * pixelRatio, (x * cell + 1) * pixelRatio, (cell - 1) * pixelRatio, (cell - 1) * pixelRatio);
//     });
// }

export function wipe(canvasRef: RefObject<HTMLCanvasElement>, size: Size) {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
        context.clearRect(0, 0, size[0] * pixelRatio, size[1] * pixelRatio);
    }

}

export function draw(canvasRef: RefObject<HTMLCanvasElement>, size: Size, cells: CellsMap, cellSize: number, gridOn: boolean) {
    wipe(canvasRef, size);
    gridOn && drawGrid(canvasRef, size, cellSize);
    drawLife(canvasRef, cells, cellSize);
}
