import React, {FunctionComponent, MouseEvent} from 'react';
import {Coordinate} from '../Canvas/Canvas';
import {
    PatternsPanelWrapper,
    ButtonRow,
    ButtonTopRow,
    SmallButton,
    CapsuleButton,
    RotateLeftIcon,
    RotateRightIcon
} from './PatternsPanel.styles';
import Block from '../Patterns/Block.json';
import BeeHive from '../Patterns/BeeHive.json';
import Loaf from '../Patterns/Loaf.json';
import Boat from '../Patterns/Boat.json';
import Tub from '../Patterns/Tub.json';
import Blinker from '../Patterns/Blinker.json';
import Toad from '../Patterns/Toad.json';
import Beacon from '../Patterns/Beacon.json';
import Pulsar from '../Patterns/Pulsar.json';
import Pentadecathlon from '../Patterns/Pentadecathlon.json';
import Glider from '../Patterns/Glider.json';
import LWSS from '../Patterns/LWSS.json';
import MWSS from '../Patterns/MWSS.json';
import HWSS from '../Patterns/HWSS.json';
import RPentomino from '../Patterns/RPentomino.json';
import Diehard from '../Patterns/Diehard.json';
import Acom from '../Patterns/Acom.json';
import GosperGliderGun from '../Patterns/GosperGliderGun.json';
import SimkinGliderGun from '../Patterns/SimkinGliderGun.json';
import Infinity1 from '../Patterns/Infinity1.json';
import Infinity2 from '../Patterns/Infinity2.json';
import Infinity3 from '../Patterns/Infinity3.json';
import x66 from '../Patterns/x66.json';
import c8Diagonal from '../Patterns/C8Diagonal.json';
import c3Orthogonal from '../Patterns/C3Orthogonal.json';
import Spacefiller2 from '../Patterns/Spacefiller2.json';
import {BlazeOrange, BottleGreen, CGBlue} from '../Theme';

export interface Pattern {
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
    x66,
    c3Orthogonal,
    c8Diagonal,
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

const maxPatterns = [
    Spacefiller2,
] as Pattern[];

interface PatternsPanelProps {
    selectedPattern: Pattern | null;
    setSelectedPattern: (pattern: Pattern | null) => void;
    rotateHoveringCells: (clockwise: boolean) => void;
}

interface ButtonGroupProps {
    patterns: Pattern[];
    selectedPattern: Pattern | null;
    onClickButton: (pattern: Pattern) => (event: MouseEvent<HTMLButtonElement>) => void;
}

const Row: FunctionComponent<ButtonGroupProps> = ({patterns, onClickButton, selectedPattern}) => {
    return <ButtonRow>
        {
            patterns.map((pattern) => <SmallButton
                pressed={selectedPattern?.name === pattern.name}
                theme={selectedPattern?.name === pattern.name ? BottleGreen : CGBlue}
                onClick={onClickButton(pattern)}
                key={pattern.name}><span>{pattern.name}</span></SmallButton>)
        }
    </ButtonRow>;
};

const PatternsPanel: FunctionComponent<PatternsPanelProps> = ({setSelectedPattern, selectedPattern, rotateHoveringCells}) => {

    const onClickButton = (pattern: Pattern) => (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setSelectedPattern(pattern.name === selectedPattern?.name ? null : pattern);
    };

    const onClickRotateButton = (clockwise: boolean) => (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        rotateHoveringCells(clockwise);
    };

    const props = {onClickButton, selectedPattern};

    return <PatternsPanelWrapper>
        <ButtonTopRow>
            <CapsuleButton theme={BlazeOrange}
                onClick={onClickRotateButton(false)}><span><RotateLeftIcon/></span></CapsuleButton>
            <CapsuleButton theme={BlazeOrange}
                onClick={onClickRotateButton(true)}><span><RotateRightIcon/></span></CapsuleButton>
        </ButtonTopRow>
        <Row {...props} patterns={stillLifePatterns}/>
        <Row {...props} patterns={oscillatorsPatterns}/>
        <Row {...props} patterns={spaceshipsPatterns}/>
        <Row {...props} patterns={methuselahPatterns}/>
        <Row {...props} patterns={gliderGunPatterns}/>
        <Row {...props} patterns={infinityPatterns}/>
        <Row {...props} patterns={maxPatterns}/>
    </PatternsPanelWrapper>;
};

export default PatternsPanel;
