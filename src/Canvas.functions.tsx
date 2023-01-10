import {Coordinate, Size} from './Canvas';
import {GridType, GridTypes, ParsedParams, pixelRatio} from './App.functions';
import {CellsMap} from './LifeMap';
import {RefObject} from 'react';

export function drawGrid(canvasRef: RefObject<HTMLCanvasElement>, size: Size, scale: number, origin: Coordinate) {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
        const [width, height] = size;
        const rows = Math.ceil(height / scale);
        const columns = Math.ceil(width / scale);
        context.beginPath();
        const offset = [
            (Math.floor(size[0] / 2) - origin[0] * scale) % scale,
            (Math.floor(size[1] / 2) - origin[1] * scale) % scale,
        ];
        for (let i = 0; i < rows; i++) {
            const y = (i * scale + offset[1]) * pixelRatio + pixelRatio / 2;
            context.moveTo(0, y);
            context.lineTo(width * pixelRatio, y);
        }
        for (let j = 0; j < columns; j++) {
            const x = (j * scale + offset[0]) * pixelRatio + pixelRatio / 2;
            context.moveTo(x, 0);
            context.lineTo(x, height * pixelRatio);
        }
        context.lineWidth = pixelRatio;
        context.strokeStyle = 'rgba(0,0,0,.1)';
        context.stroke();
    }
}

function fillCell(context: CanvasRenderingContext2D, xy: Coordinate, scale: number, size: Size, origin: Coordinate, gridType: GridType): void {
    const gap = gridType === GridTypes[2] ? 0 : 1;
    const wh = (scale - gap) * pixelRatio;
    context.fillRect(
        (xy[0] * scale + gap + Math.floor(size[0] / 2) - origin[0] * scale) * pixelRatio,
        (xy[1] * scale + gap + Math.floor(size[1] / 2) - origin[1] * scale) * pixelRatio,
        wh, wh
    );
}

export function drawCell(canvasRef: RefObject<HTMLCanvasElement>, color: string, cell: Coordinate, scale: number, size: Size, origin: Coordinate, gridType: GridType) {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
        context.fillStyle = color;
        fillCell(context, cell, scale, size, origin, gridType);
    }
}

export function drawCells(canvasRef: RefObject<HTMLCanvasElement>, color: string, cells: CellsMap | Coordinate[], scale: number, size: Size, origin: Coordinate, gridType: GridType) {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
        context.fillStyle = color;
        cells.forEach((cell) => fillCell(context, cell, scale, size, origin, gridType));
    }
}

export function wipe(canvasRef: RefObject<HTMLCanvasElement>, size: Size) {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
        context.clearRect(0, 0, size[0] * pixelRatio, size[1] * pixelRatio);
    }
}

export function draw(canvasRef: RefObject<HTMLCanvasElement>, color: string, size: Size, cells: CellsMap, scale: number, gridType: GridType, origin: Coordinate = [0, 0]) {
    wipe(canvasRef, size);
    if (gridType === GridTypes[0]) {
        drawGrid(canvasRef, size, scale, origin);
    }
    drawCells(canvasRef, color, cells, scale, size, origin, gridType);
}

interface LayoutCanvasProps {
    size: Size;
    params: ParsedParams;
}

export function shouldLayoutCanvas(prevProps: LayoutCanvasProps, currentProps: LayoutCanvasProps): boolean {
    return prevProps.size[0] !== currentProps.size[0] ||
        prevProps.size[1] !== currentProps.size[1] ||
        prevProps.params.scale !== currentProps.params.scale ||
        prevProps.params.gridType !== currentProps.params.gridType;
}
