import React, {MouseEvent} from 'react';
import {
    PanelWrapper,
    ButtonGroup,
    ZoomInIcon,
    ZoomOutIcon,
    Button,
    FasterIcon,
    SlowerIcon,
    ButtonWrapper, GliderIcon
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
}

function Panel({
    playState,
    pushToHistory,
    params: {scale, gridType, speed},
    showPatternPanel,
    togglePatternPanel,
    selectedPattern,
    setSelectedPattern,
    reset,
    next,
    pause,
    play,
    edit,
}: PanelProps) {
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
    };
    return (<PanelWrapper>
        <Button onClick={onClickShare}><span>Share</span></Button>
        {
            (playState === PlayState.Paused || playState === PlayState.Editing) &&
            <Button style={{width: '72px'}} onClick={onClickPlay} theme={BottleGreen}><span>Play</span></Button>
        }
        {
            playState === PlayState.Playing &&
            <Button style={{width: '72px'}} pressed onClick={onClickPaused}
                theme={BottleGreen}><span>Paused</span></Button>
        }
        <Button style={{width: '48px'}} onClick={onClickEdit} disabled={playState !== PlayState.Paused}
            theme={BlazeOrange}><span>Edit</span></Button>
        <Button style={{width: '48px'}} onClick={onClickNext} disabled={playState !== PlayState.Paused}
            theme={BlazeOrange}><span>Next</span></Button>
        <Button style={{width: '64px'}} onClick={onClickReset} theme={AntiqueRuby}><span>Reset</span></Button>
        <Button style={{width: '96px'}} onClick={onClickToggleGrid}
            theme={CGBlue}><span>Grid: {gridType}</span></Button>
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
        <ButtonWrapper>
            <Button style={{width: '36px'}} onClick={onClickAdd}
                pressed={showPatternPanel}
                theme={selectedPattern ? BottleGreen : CGBlue}><span><GliderIcon/></span></Button>
            {showPatternPanel && <PatternsPanel {...{setSelectedPattern, selectedPattern, togglePatternPanel}}/>}
        </ButtonWrapper>

    </PanelWrapper>);
}

export default Panel;
