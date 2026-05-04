import {Coordinate, Size} from './Canvas';
import {GridType, GridTypes, pixelRatio} from '../App.functions';
import {CellsMap, LifeMap} from './LifeMap';
import {RefObject} from 'react';
import {CanvasColors} from '../Theme';

function drawGrid(canvasRef: RefObject<HTMLCanvasElement>, size: Size, scale: number, origin: Coordinate, gridColor: string) {
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
        context.strokeStyle = gridColor;
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

function wipe(canvasRef: RefObject<HTMLCanvasElement>, size: Size) {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
        context.clearRect(0, 0, size[0] * pixelRatio, size[1] * pixelRatio);
    }
}

function drawCells(canvasRef: RefObject<HTMLCanvasElement>, color: string, cells: CellsMap | Coordinate[], scale: number, size: Size, origin: Coordinate, gridType: GridType) {
    const context = canvasRef.current?.getContext('2d');
    if (context) {
        context.fillStyle = color;
        cells.forEach((cell) => fillCell(context, cell, scale, size, origin, gridType));
    }
}

interface DrawParams {
    canvasRef: RefObject<HTMLCanvasElement>;
    size: Size;
    lifeMap: LifeMap;
    hoveringCells: Coordinate[];
    scale: number;
    gridType: GridType;
    origin: Coordinate;
    showDeadCells: boolean;
}

export function draw({
    canvasRef,
    size,
    lifeMap,
    scale,
    gridType,
    origin,
    hoveringCells,
    showDeadCells,
}: DrawParams) {
    wipe(canvasRef, size);
    if (gridType === GridTypes[0]) {
        drawGrid(canvasRef, size, scale, origin, CanvasColors.grid);
    }
    drawCells(canvasRef, CanvasColors.hoveringCells, hoveringCells, scale, size, origin, gridType);
    drawCells(canvasRef, CanvasColors.liveCells, lifeMap.cells, scale, size, origin, gridType);
    if (showDeadCells) {
        drawCells(canvasRef, CanvasColors.deadCells, lifeMap.deadList, scale, size, origin, gridType);
    }
}
