import React from 'react';
import {DashboardWrapper} from './Dashboard.styles';
import {ParsedParams} from './App.functions';
import {Coordinate} from './Canvas';

interface DashboardProps {
    frameIndex: number;
    cellsCount: number;
    hoveringCell: Coordinate | null;
    params: ParsedParams;
}

function Dashboard({frameIndex, cellsCount, params, hoveringCell}: DashboardProps) {
    return <DashboardWrapper>
        <p>Frame:{frameIndex} Cells:{cellsCount}</p>
        <p>Speed:{params.speed} Size:{params.cellSize}</p>
        <p>{hoveringCell ? `X:${hoveringCell[0]} Y:${hoveringCell[1]}` : 'X:-,Y:-'}</p>
    </DashboardWrapper>;
}

export default Dashboard;
