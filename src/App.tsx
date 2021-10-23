import React, {useEffect, useRef} from 'react';
import {AppWrapper, Canvas} from "./App.styles";
import {CellMap} from "./LifeMap";
import {clean, drawGrid, drawLife} from "./drawer";
import {pixelRatio} from "./const";

const initLifeMap: Array<[number, number]> = [
    [3,2],
    [3,1],
    [4,2],
]

function frame(context: CanvasRenderingContext2D, rect: DOMRect){
    return function (){
        const lifeMap = new CellMap(initLifeMap);
        clean(context, rect);
        drawGrid(context, rect);
        lifeMap.deadOrAlive()
        lifeMap.print();
        drawLife(context, rect, lifeMap.cells);
    }
}

function play(context: CanvasRenderingContext2D, rect: DOMRect) {
    setInterval(frame(context, rect), 1000);
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
