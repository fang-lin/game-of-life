import React from 'react';
import {DashboardWrapper} from './Dashboard.styles';
import {ParsedParams} from './utils';

interface DashboardProps {
    frameIndex: number;
    cellsCount: number;
    params: ParsedParams;
}

function Dashboard({frameIndex, cellsCount, params}: DashboardProps) {
    return <DashboardWrapper>
        <p>Frame:{frameIndex}</p>
        <p>Cells:{cellsCount}</p>
        <p>Speed:{params.speed}</p>
        <p>Size:{params.cellSize}</p>
    </DashboardWrapper>;
}

export default Dashboard;
