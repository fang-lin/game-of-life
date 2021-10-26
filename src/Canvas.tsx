import React, {useEffect, useRef} from 'react';
import {CanvasWrapper} from "./Canvas.styles";
import {CellsMap} from "./CellsMap";
import {clean, drawDeadLife, drawGrid, drawLife, drawNewLife} from "./drawer";
import {pixelRatio} from "./const";

const initLifeMap: Array<[number, number]> = [
    [21, 22],
    [22, 21],
    [22, 22],
    [22, 23],
    [23, 22]
]

// const initLifeMap: Array<[number, number]> = [
//     [20, 20],
//     [20, 21],
//     [20, 22],
//     [21, 19],
//     [21, 20],
//     [21, 21],
// ]

// const initLifeMap: Array<[number, number]> = [
//     [20, 20],
//     [21, 21],
//     [22, 19],
//     [22, 20],
//     [22, 21],
// ]

// const initLifeMap: Array<[number, number]> = [
//     [20, 20],
//     [20, 21],
//     [20, 22],
//     [20, 23],
//     [21, 19],
//     [21, 23],
//     [22, 23],
//     [23, 19],
//     [23, 22]
// ]

const lifeMap = new CellsMap(initLifeMap);

const duration = 300;

export type Size = [number, number]

function frame(context: CanvasRenderingContext2D, size: Size) {
    return function () {
        clean(context, size);
        drawGrid(context, size);
        lifeMap.grow();
        drawLife(context, lifeMap.cells);
        setTimeout(() => {
            drawDeadLife(context, lifeMap.dying);
            drawNewLife(context, lifeMap.newborn);
            setTimeout(() => {
                lifeMap.clean();
            }, duration);
        }, duration);

    }
}

function play(context: CanvasRenderingContext2D, size: Size) {
    setInterval(frame(context, size), duration * 3);
}

interface CanvasProps {
    size: [number, number];
}

function Canvas(props: CanvasProps) {
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const element = canvas.current;
        const [width, height] = props.size;
        if (element) {
            element.width = width * pixelRatio;
            element.height = height * pixelRatio;
            const context = element.getContext('2d');
            if (context) {
                play(context, [width, height]);
            }
        }
    });

    return (<CanvasWrapper ref={canvas}/>);
}

export default Canvas;
