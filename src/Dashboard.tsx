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
        <table>
            <tr>
                <td>Age: <span>{evolutionIndex}</span></td>
                <td>Cells: <span>{cellsCount}</span></td>
            </tr>
            <tr>
                <td>Velocity: <span>{speed}</span></td>
                <td>Size: <span>{scale}</span></td>
            </tr>
            <tr>
                <td>X: <span>{hoveringCell ? hoveringCell[0] : '-'}</span></td>
                <td>Y: <span>{hoveringCell ? hoveringCell[1] : '-'}</span></td>
            </tr>
        </table>
    </DashboardWrapper>;
};

export default Dashboard;
