import {Pair} from "./Cell";
import {Size} from "./Canvas";
import {cell, pixelRatio} from "./utils";

export function drawGrid(context: CanvasRenderingContext2D, size: Size) {
    const [width, height] = size;
    const rows = Math.floor(height / cell);
    const columns = Math.floor(width / cell);
    context.beginPath();
    for (let i = 0; i < rows; i++) {
        const y = i * cell * pixelRatio + pixelRatio / 2;
        context.moveTo(0, y);
        context.lineTo(width * pixelRatio, y);
    }
    for (let j = 0; j < columns; j++) {
        const x = j * cell * pixelRatio + pixelRatio / 2;
        context.moveTo(x, 0);
        context.lineTo(x, height * pixelRatio);
    }
    context.lineWidth = pixelRatio;
    context.strokeStyle = 'rgba(0,0,0,.3)';
    context.stroke();
}

export function drawCell(context: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

export function drawCells(context: CanvasRenderingContext2D, color: string, cells: Pair[]) {
    context.fillStyle = color;
    cells.forEach(([x, y]) => {
        context.fillRect((y * cell + 1) * pixelRatio, (x * cell + 1) * pixelRatio, (cell - 1) * pixelRatio, (cell - 1) * pixelRatio);
    });
}

export function drawLife(context: CanvasRenderingContext2D, cells: Pair[]) {
    context.fillStyle = '#000';
    cells.forEach(([x, y]) => {
        context.fillRect((y * cell + 1) * pixelRatio, (x * cell + 1) * pixelRatio, (cell - 1) * pixelRatio, (cell - 1) * pixelRatio);
    });
}

export function drawNewLife(context: CanvasRenderingContext2D, lifeMap: Pair[]) {
    context.fillStyle = '#676';
    lifeMap.forEach(([x, y]) => {
        context.fillRect((y * cell + 1) * pixelRatio, (x * cell + 1) * pixelRatio, (cell - 1) * pixelRatio, (cell - 1) * pixelRatio);
    })
}

export function drawDeadLife(context: CanvasRenderingContext2D, lifeMap: Pair[]) {
    context.fillStyle = '#dcc';
    lifeMap.forEach(([x, y]) => {
        context.fillRect((y * cell + 1) * pixelRatio, (x * cell + 1) * pixelRatio, (cell - 1) * pixelRatio, (cell - 1) * pixelRatio);
    })
}

export function wipe(context: CanvasRenderingContext2D, size: Size) {
    context.clearRect(0, 0, size[0] * pixelRatio, size[1] * pixelRatio);
}