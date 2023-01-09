import {Coordinate, Size} from './Canvas';
import {ParsedParams, pixelRatio} from './App.functions';
import {CellsMap} from './LifeMap';
import {RefObject} from 'react';

export function drawGrid(canvasRef: RefObject<HTMLCanvasElement>, size: Size, cellSize: number, offset: Coordinate) {
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
        context.strokeStyle = 'rgba(0,0,0,.1)';
        context.stroke();
    }
}

function fillRect(context: CanvasRenderingContext2D, xy: Coordinate, cellSize: number, size: Size, origin: Coordinate): void {
    context.fillRect(
        (xy[0] * cellSize + 1 + Math.floor(size[0] / 2) - origin[0]) * pixelRatio,
        (xy[1] * cellSize + 1 + Math.floor(size[1] / 2) - origin[1]) * pixelRatio,
        (cellSize - 1) * pixelRatio,
        (cellSize - 1) * pixelRatio
    );
}

export function drawCell(canvasRef: RefObject<HTMLCanvasElement>, color: string, cell: Coordinate, cellSize: number, size: Size, origin: Coordinate) {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
        context.fillStyle = color;
        fillRect(context, cell, cellSize, size, origin);
    }
}

export function drawLife(canvasRef: RefObject<HTMLCanvasElement>, color: string, cells: CellsMap, cellSize: number, size: Size, origin: Coordinate) {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
        context.fillStyle = color;
        cells.forEach((cell) => fillRect(context, cell, cellSize, size, origin));
    }
}

export function wipe(canvasRef: RefObject<HTMLCanvasElement>, size: Size) {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
        context.clearRect(0, 0, size[0] * pixelRatio, size[1] * pixelRatio);
    }
}

export function draw(canvasRef: RefObject<HTMLCanvasElement>, color: string, size: Size, cells: CellsMap, cellSize: number, gridOn: boolean, origin: Coordinate = [0, 0]) {
    wipe(canvasRef, size);
    gridOn && drawGrid(canvasRef, size, cellSize, origin);
    drawLife(canvasRef, color, cells, cellSize, size, origin);
}

interface LayoutCanvasProps {
    size: Size;
    params: ParsedParams;
}

export function shouldLayoutCanvas(prevProps: LayoutCanvasProps, currentProps: LayoutCanvasProps): boolean {
    return prevProps.size[0] !== currentProps.size[0] ||
        prevProps.size[1] !== currentProps.size[1] ||
        prevProps.params.cellSize !== currentProps.params.cellSize ||
        prevProps.params.gridOn !== currentProps.params.gridOn;
}
