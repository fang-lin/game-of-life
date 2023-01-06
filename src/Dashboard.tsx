import React from 'react';
import {DashboardWrapper} from './Dashboard.styles';

interface DashboardProps {
    frameIndex: number;
}

function Dashboard({frameIndex}: DashboardProps) {
    return <DashboardWrapper>
        Frame:<span>{frameIndex}</span>
    </DashboardWrapper>;
}

export default Dashboard;
