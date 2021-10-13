import {cell, pixelRatio} from "./const";

export function drawGrid(context: CanvasRenderingContext2D, rect: DOMRect) {

    const {width, height} = rect;
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

export function drawLife(context: CanvasRenderingContext2D, rect: DOMRect, lifeMap: Array<[number, number]>) {
    lifeMap.forEach(([x, y]) => {
        context.rect(x * cell * pixelRatio, y * cell * pixelRatio, cell * pixelRatio, cell * pixelRatio);
        context.fillStyle = '#000';
        context.fill();
    })
}

export function clean(context: CanvasRenderingContext2D, rect: DOMRect) {
    context.rect(0, 0, rect.width * pixelRatio, rect.height * pixelRatio);
    context.fillStyle = '#fff';
    context.fill();
}