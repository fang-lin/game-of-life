import React, {FunctionComponent} from 'react';
import {DashboardWrapper} from './Dashboard.styles';
import {ParsedParams} from './App.functions';
import {Coordinate} from './Canvas/Canvas';

interface DashboardProps {
    evolutionIndex: number;
    cellsCount: number;
    hoveringCell: Coordinate | null;
    params: ParsedParams;
}

const Dashboard: FunctionComponent<DashboardProps> = ({
    evolutionIndex,
    cellsCount,
    params: {speed, scale},
    hoveringCell
}) => {

    return <DashboardWrapper>
        <p>Age:{evolutionIndex} Cells:{cellsCount}</p>
        <p>Speed:{speed} Size:{scale}</p>
        <p>{hoveringCell ? `X:${hoveringCell[0]} Y:${hoveringCell[1]}` : 'X:-,Y:-'}</p>
    </DashboardWrapper>;
};

export default Dashboard;
