import React, {MouseEvent} from 'react';
import {Coordinate} from './Canvas';
import {PatternsPanelWrapper} from './PatternsPanel.styles';
import Block from './Patterns/Block.json';
import BeeHive from './Patterns/BeeHive.json';
import Loaf from './Patterns/Loaf.json';
import Boat from './Patterns/Boat.json';
import Tub from './Patterns/Tub.json';
import Blinker from './Patterns/Blinker.json';
import Toad from './Patterns/Toad.json';
import Beacon from './Patterns/Beacon.json';
import Pulsar from './Patterns/Pulsar.json';
import Pentadecathlon from './Patterns/Pentadecathlon.json';
import Glider from './Patterns/Glider.json';
import LWSS from './Patterns/LWSS.json';
import MWSS from './Patterns/MWSS.json';
import HWSS from './Patterns/HWSS.json';
import RPentomino from './Patterns/RPentomino.json';
import Diehard from './Patterns/Diehard.json';
import Acom from './Patterns/Acom.json';
import GosperGliderGun from './Patterns/GosperGliderGun.json';
import SimkinGliderGun from './Patterns/SimkinGliderGun.json';
import Infinity1 from './Patterns/Infinity1.json';
import Infinity2 from './Patterns/Infinity2.json';
import Infinity3 from './Patterns/Infinity3.json';

interface Pattern {
    name: string;
    cells: Coordinate[];
}

const stillLifePatterns = [
    Block,
    BeeHive,
    Loaf,
    Boat,
    Tub,
] as Pattern[];

const oscillatorsPatterns = [
    Blinker,
    Toad,
    Beacon,
    Pulsar,
    Pentadecathlon,
] as Pattern[];


const spaceshipsPatterns = [
    Glider,
    LWSS,
    MWSS,
    HWSS,
] as Pattern[];

const methuselahPatterns = [
    RPentomino,
    Diehard,
    Acom,
] as Pattern[];

const gliderGunPatterns = [
    GosperGliderGun,
    SimkinGliderGun,
] as Pattern[];

const infinityPatterns = [
    Infinity1,
    Infinity2,
    Infinity3,
] as Pattern[];

interface PatternsPanelProps {
    setSelectedCells: (cells: Coordinate[], cb?: () => void) => void;
}

function PatternsPanel({setSelectedCells}: PatternsPanelProps) {

    const onClickButton = (cells: Coordinate[]) => (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setSelectedCells(cells);
    };

    return <PatternsPanelWrapper>
        {
            stillLifePatterns.map(({name, cells}) => <button
                onClick={onClickButton(cells)}
                key={name}><span>{name}</span></button>)
        }
        <br/>
        {
            oscillatorsPatterns.map(({name, cells}) => <button
                onClick={onClickButton(cells)}
                key={name}><span>{name}</span></button>)
        }
        <br/>
        {
            spaceshipsPatterns.map(({name, cells}) => <button
                onClick={onClickButton(cells)}
                key={name}><span>{name}</span></button>)
        }
        <br/>
        {
            methuselahPatterns.map(({name, cells}) => <button
                onClick={onClickButton(cells)}
                key={name}><span>{name}</span></button>)
        }
        <br/>
        {
            gliderGunPatterns.map(({name, cells}) => <button
                onClick={onClickButton(cells)}
                key={name}><span>{name}</span></button>)
        }
        <br/>
        {
            infinityPatterns.map(({name, cells}) => <button
                onClick={onClickButton(cells)}
                key={name}><span>{name}</span></button>)
        }
    </PatternsPanelWrapper>;
}

export default PatternsPanel;
