import React, {useEffect, useRef} from 'react';
import {AppWrapper, Canvas} from "./App.styles";
import {CellsMap} from "./CellsMap";
import {clean, drawDeadLife, drawGrid, drawLife, drawNewLife} from "./drawer";
import {pixelRatio} from "./const";

// const initLifeMap: Array<[number, number]> = [
//     [21, 22],
//     [22, 21],
//     [22, 22],
//     [22, 23],
//     [23, 22]
// ]

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

const initLifeMap: Array<[number, number]> = [
    [20, 20],
    [20, 21],
    [20, 22],
    [20, 23],
    [21, 19],
    [21, 23],
    [22, 23],
    [23, 19],
    [23, 22]
]

const lifeMap = new CellsMap(initLifeMap);

const duration = 50;

function frame(context: CanvasRenderingContext2D, rect: DOMRect) {
    return function () {
        clean(context, rect);
        drawGrid(context, rect);
        lifeMap.grow();
        drawLife(context, rect, lifeMap.cells);
        setTimeout(() => {
            drawDeadLife(context, rect, lifeMap.dying);
            drawNewLife(context, rect, lifeMap.newborn);
            setTimeout(() => {
                lifeMap.clean();
            }, duration);
        }, duration);

    }
}

function play(context: CanvasRenderingContext2D, rect: DOMRect) {
    setInterval(frame(context, rect), duration * 3);
}

function App() {
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const element = canvas.current;
        if (element) {
            const rect = element.getBoundingClientRect();
            const width = rect.width * pixelRatio;
            const height = rect.height * pixelRatio;
            element.width = width
            element.height = height;
            const context = element.getContext('2d');
            if (context) {
                play(context, rect);
            }
        }
    });

    return (
        <AppWrapper>
            <Canvas ref={canvas}/>
        </AppWrapper>
    );
}

export default App;
