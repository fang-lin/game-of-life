import React, {FunctionComponent, MouseEvent} from 'react';
import {
    PanelWrapper,
    ButtonGroup,
    ZoomInIcon,
    ZoomOutIcon,
    Button,
    FasterIcon,
    SlowerIcon,
    ButtonWrapper, GliderIcon, ShareIcon
} from './Panel.styles';
import {Scale, ParsedParams, Speed, PlayState, GridTypes} from '../App.functions';
import {AntiqueRuby, BlazeOrange, BottleGreen, CGBlue} from '../Theme';
import PatternsPanel, {Pattern} from './PatternsPanel';

interface PanelProps {
    playState: PlayState,
    pushToHistory: (parsedParams: Partial<ParsedParams>) => void;
    showPatternPanel: boolean;
    togglePatternPanel: (showPatternPanel: boolean) => void;
    params: ParsedParams;
    selectedPattern: Pattern | null;
    setSelectedPattern: (pattern: Pattern | null) => void;
    reset: () => void;
    next: () => void;
    pause: () => void;
    play: () => void;
    edit: () => void;
    createSharedLink: () => void;
    rotateHoveringCells: (clockwise: boolean) => void;
}

const Panel: FunctionComponent<PanelProps> = ({
    playState,
    pushToHistory,
    params: {scale, gridType, speed, showDeadCells},
    showPatternPanel,
    togglePatternPanel,
    selectedPattern,
    setSelectedPattern,
    reset,
    next,
    pause,
    play,
    edit,
    createSharedLink,
    rotateHoveringCells,
}) => {
    const onClickPlay = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        play();
    };
    const onClickPaused = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        pause();
    };
    const onClickEdit = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        edit();
    };
    const onClickReset = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        reset();
    };
    const onClickNext = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        next();
    };
    const onClickScale = (offset: number) => (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        pushToHistory({scale: scale + offset});
    };
    const onClickToggleGrid = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        pushToHistory({gridType: GridTypes[GridTypes.indexOf(gridType) + 1] || GridTypes[0]});
    };
    const onClickSlowerFaster = (offset: number) => (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        pushToHistory({speed: speed + offset});
    };
    const onClickAdd = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        togglePatternPanel(!showPatternPanel);
    };
    const onClickShare = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        createSharedLink();
    };
    const onClickToggleDeadAndBorn = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        pushToHistory({showDeadCells: !showDeadCells});
    };
    return (<PanelWrapper>
        {
            (playState === PlayState.Paused || playState === PlayState.Editing) &&
            <Button style={{width: '72px'}} onClick={onClickPlay} theme={BottleGreen}><span>PLAY</span></Button>
        }
        {
            playState === PlayState.Playing &&
            <Button style={{width: '72px'}} pressed onClick={onClickPaused}
                theme={BottleGreen}><span>PAUSED</span></Button>
        }
        <Button style={{width: '48px'}} onClick={onClickEdit} disabled={playState !== PlayState.Paused}
            theme={BlazeOrange}><span>EDIT</span></Button>
        <Button style={{width: '48px'}} onClick={onClickNext} disabled={playState !== PlayState.Paused}
            theme={BlazeOrange}><span>NEXT</span></Button>
        <Button style={{width: '64px'}} onClick={onClickReset} theme={AntiqueRuby}><span>RESET</span></Button>
        <ButtonGroup>
            <Button style={{width: '36px'}} onClick={onClickScale(-1)} disabled={scale === Scale.Min} theme={CGBlue}
                title="Zoom Out"><span><ZoomOutIcon/></span></Button>
            <Button style={{width: '36px'}} onClick={onClickScale(1)} disabled={scale === Scale.Max} theme={CGBlue}
                title="Zoom In"><span><ZoomInIcon/></span></Button>
        </ButtonGroup>
        <ButtonGroup>
            <Button style={{width: '36px'}} onClick={onClickSlowerFaster(-1)} disabled={speed === Speed.Min}
                theme={CGBlue}
                title="Slower"><span><SlowerIcon/></span></Button>
            <Button style={{width: '36px'}} onClick={onClickSlowerFaster(1)} disabled={speed === Speed.Max}
                theme={CGBlue}
                title="Faster"><span><FasterIcon/></span></Button>
        </ButtonGroup>
        <Button style={{width: '36px'}} onClick={onClickToggleGrid}
            theme={CGBlue}><span style={{fontSize: '10px'}}>{gridType} Grid</span></Button>
        <Button style={{width: '36px'}} onClick={onClickToggleDeadAndBorn} pressed={showDeadCells}
            theme={CGBlue}><span style={{fontSize: '10px'}}>Show Dead</span></Button>
        <Button style={{width: '36px'}} theme={BlazeOrange} onClick={onClickShare}><span><ShareIcon/></span></Button>
        <ButtonWrapper>
            <Button style={{width: '36px'}} onClick={onClickAdd}
                pressed={showPatternPanel}
                theme={selectedPattern ? BottleGreen : CGBlue}><span><GliderIcon/></span></Button>
            {showPatternPanel && <PatternsPanel {...{setSelectedPattern, selectedPattern, rotateHoveringCells}}/>}
        </ButtonWrapper>

    </PanelWrapper>);
};

export default Panel;
