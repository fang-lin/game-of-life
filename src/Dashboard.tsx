import React from 'react';
import {DashboardWrapper} from './Dashboard.styles';
import {ParsedParams} from './App.functions';
import {Coordinate} from './Canvas/Canvas';

interface DashboardProps {
    frameIndex: number;
    cellsCount: number;
    hoveringCell: Coordinate | null;
    params: ParsedParams;
}

function Dashboard({frameIndex, cellsCount, params: {speed, scale}, hoveringCell}: DashboardProps) {

    return <DashboardWrapper>
        <p>Frame:{frameIndex} Cells:{cellsCount}</p>
        <p>Speed:{speed} Size:{scale}</p>
        <p>{hoveringCell ? `X:${hoveringCell[0]} Y:${hoveringCell[1]}` : 'X:-,Y:-'}</p>
    </DashboardWrapper>;
}

export default Dashboard;
