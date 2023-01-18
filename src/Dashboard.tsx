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
            <tbody>
                <tr>
                    <td><span>Age: <pre>{evolutionIndex}</pre></span></td>
                    <td><span>Cells: <pre>{cellsCount}</pre></span></td>
                </tr>
                <tr>
                    <td><span>Velocity: <pre>{speed}</pre></span></td>
                    <td><span>Size: <pre>{scale}</pre></span></td>
                </tr>
                <tr>
                    <td><span>X: <pre>{hoveringCell ? hoveringCell[0] : '-'}</pre></span></td>
                    <td><span>Y: <pre>{hoveringCell ? hoveringCell[1] : '-'}</pre></span></td>
                </tr>
            </tbody>
        </table>
    </DashboardWrapper>;
};

export default Dashboard;
