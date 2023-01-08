import React from 'react';
import {DashboardWrapper} from './Dashboard.styles';

interface DashboardProps {
    frameIndex: number;
    cellsCount: number;
}

function Dashboard({frameIndex, cellsCount}: DashboardProps) {
    return <DashboardWrapper>
        <p>Frame:{frameIndex}</p>
        <p>Cells:{cellsCount}</p>
    </DashboardWrapper>;
}

export default Dashboard;
