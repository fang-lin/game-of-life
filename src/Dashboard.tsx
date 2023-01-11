import React from 'react';
import {DashboardWrapper} from './Dashboard.styles';
import {ParsedParams} from './App.functions';
import {Coordinate} from './Canvas';
import PatternsPanel, {Pattern} from './PatternsPanel';

interface DashboardProps {
    frameIndex: number;
    cellsCount: number;
    hoveringCell: Coordinate | null;
    setSelectedPattern: (pattern: Pattern | null, cb?: () => void) => void;
    selectedPattern: Pattern | null;
    params: ParsedParams;
}

function Dashboard({frameIndex, cellsCount, params: {speed, scale}, hoveringCell, setSelectedPattern, selectedPattern}: DashboardProps) {

    return <DashboardWrapper>
        <p>Frame:{frameIndex} Cells:{cellsCount}</p>
        <p>Speed:{speed} Size:{scale}</p>
        <p>{hoveringCell ? `X:${hoveringCell[0]} Y:${hoveringCell[1]}` : 'X:-,Y:-'}</p>
        <PatternsPanel {...{setSelectedPattern, selectedPattern}}/>
    </DashboardWrapper>;
}

export default Dashboard;
