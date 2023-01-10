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
import {Scale, ParsedParams, Speed, PlayState, GridTypes} from './App.functions';
import {AntiqueRuby, BlazeOrange, BottleGreen, CGBlue} from './Theme';

interface PanelProps {
    playState: PlayState,
    pushToHistory: (parsedParams: Partial<ParsedParams>) => void;
    setPlayState: (playState: PlayState, cb?: () => void) => void;
    params: ParsedParams;
}

function Panel({playState, pushToHistory, params: {scale, gridType, speed}, setPlayState}: PanelProps) {
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
        pushToHistory({origin: [0, 0]});
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
        pushToHistory({gridType: GridTypes[GridTypes.indexOf(gridType) + 1] || GridTypes[0]});
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
        <Button width="96px" onClick={onClickToggleGrid}
            theme={CGBlue}><span>Grid: {gridType}</span></Button>
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
