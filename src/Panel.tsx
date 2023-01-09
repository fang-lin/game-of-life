import React, {MouseEvent} from 'react';
import {
    PanelWrapper,
    ButtonGroup,
    ZoomInIcon,
    ZoomOutIcon,
    Button,
    FasterIcon,
    SlowerIcon,
} from './Panel.styles';
import {PlayState} from './App';
import {Scale, ParsedParams, Speed} from './App.functions';
import {AntiqueRuby, BlazeOrange, BottleGreen, CGBlue} from './Theme';

interface PanelProps {
    playState: PlayState,
    pushToHistory: (parsedParams: Partial<ParsedParams>) => void;
    setPlayState: (playState: PlayState, cb?: () => void) => void;
    params: ParsedParams;
}

function Panel({playState, pushToHistory, params: {scale, gridOn, speed}, setPlayState}: PanelProps) {
    const onClickPlay = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setPlayState(PlayState.Playing);
    };
    const onClickPaused = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setPlayState(PlayState.Paused);
    };
    const onClickEdit = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setPlayState(PlayState.Editing);
    };
    const onClickReset = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setPlayState(PlayState.Reset);
    };
    const onClickNext = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setPlayState(PlayState.Next);
    };
    const onClickScale = (offset: number) => (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        pushToHistory({scale: scale + offset});
    };
    const onClickToggleGrid = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        pushToHistory({gridOn: !gridOn});
    };
    const onClickSlowerFaster = (offset: number) => (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        pushToHistory({speed: speed + offset});
    };
    return (<PanelWrapper>
        {
            (playState === PlayState.Paused || playState === PlayState.Editing) &&
            <Button width="72px" onClick={onClickPlay} theme={BottleGreen}><span>Play</span></Button>
        }
        {
            playState === PlayState.Playing &&
            <Button width="72px" pressed onClick={onClickPaused} theme={BottleGreen}><span>Paused</span></Button>
        }
        <Button width="48px" onClick={onClickEdit} disabled={playState !== PlayState.Paused}
            theme={BlazeOrange}><span>Edit</span></Button>
        <Button width="48px" onClick={onClickNext} disabled={playState !== PlayState.Paused}
            theme={BlazeOrange}><span>Next</span></Button>
        <Button width="64px" onClick={onClickReset} theme={AntiqueRuby}><span>Reset</span></Button>
        <Button width="84px" onClick={onClickToggleGrid} pressed={gridOn}
            theme={CGBlue}><span>Grid: {gridOn ? 'ON' : 'OFF'}</span></Button>
        <ButtonGroup>
            <Button width="36px" onClick={onClickScale(-1)} disabled={scale === Scale.Min} theme={CGBlue}
                title="Zoom Out"><span><ZoomOutIcon/></span></Button>
            <Button width="36px" onClick={onClickScale(1)} disabled={scale === Scale.Max} theme={CGBlue}
                title="Zoom In"><span><ZoomInIcon/></span></Button>
        </ButtonGroup>
        <ButtonGroup>
            <Button width="36px" onClick={onClickSlowerFaster(-1)} disabled={speed === Speed.Min} theme={CGBlue}
                title="Slower"><span><SlowerIcon/></span></Button>
            <Button width="36px" onClick={onClickSlowerFaster(1)} disabled={speed === Speed.Max} theme={CGBlue}
                title="Faster"><span><FasterIcon/></span></Button>
        </ButtonGroup>
    </PanelWrapper>);
}

export default Panel;
