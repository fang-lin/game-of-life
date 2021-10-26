import {cell, pixelRatio} from "./const";
import {Pair} from "./Cell";
import {Size} from "./Canvas";

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

export function drawLife(context: CanvasRenderingContext2D, lifeMap: Pair[]) {
    lifeMap.forEach(([x, y]) => {
        context.fillStyle = '#000';
        context.fillRect(y * cell * pixelRatio, x * cell * pixelRatio, cell * pixelRatio, cell * pixelRatio);
    });
}

export function drawNewLife(context: CanvasRenderingContext2D, lifeMap: Pair[]) {
    lifeMap.forEach(([x, y]) => {
        context.fillStyle = '#666';
        context.fillRect(y * cell * pixelRatio, x * cell * pixelRatio, cell * pixelRatio, cell * pixelRatio);
    })
}

export function drawDeadLife(context: CanvasRenderingContext2D, lifeMap: Pair[]) {
    lifeMap.forEach(([x, y]) => {
        context.fillStyle = '#ccc';
        context.fillRect(y * cell * pixelRatio, x * cell * pixelRatio, cell * pixelRatio, cell * pixelRatio);
    })
}

export function clean(context: CanvasRenderingContext2D, size: Size) {
    context.fillStyle = '#fff';
    context.fillRect(0, 0, size[0] * pixelRatio, size[1] * pixelRatio);
}