import React from 'react';
import {
    PanelWrapper,
    ButtonGroup,
    ZoomInIcon,
    ZoomOutIcon,
    Button, FasterIcon, SlowerIcon, AntiqueRuby, CGBlue, BottleGreen, BlazeOrange,
} from './Panel.styles';
import {PlayState} from './App';
import {CellSize, ParsedParams, Speed} from './utils';

interface PanelProps {
    playState: PlayState,
    pushToHistory: (parsedParams: Partial<ParsedParams>) => void;
    setPlayState: (playState: PlayState, cb?: () => void) => void;
    params: ParsedParams;
}

function Panel({playState, pushToHistory, params: {cellSize, gridOn, speed}, setPlayState}: PanelProps) {
    const onClickPlay = () => setPlayState(PlayState.Playing);

    const onClickPaused = () => setPlayState(PlayState.Paused);

    const onClickEdit = () => setPlayState(PlayState.Editing);

    const onClickReset = () => setPlayState(PlayState.Reset);

    const onClickNext = () => setPlayState(PlayState.Playing, () => setPlayState(PlayState.Paused));

    const onClickScale = (scale: number) => () => pushToHistory({cellSize: cellSize + scale});

    const onClickToggleGrid = () => pushToHistory({gridOn: !gridOn});

    const onClickSlowerFaster = (offset: number) => () => pushToHistory({speed: speed + offset});

    return (<PanelWrapper>
        {
            (playState === PlayState.Paused || playState === PlayState.Editing) &&
            <Button width="72px" onClick={onClickPlay} theme={BottleGreen}>Play</Button>
        }
        {
            playState === PlayState.Playing &&
            <Button width="72px" pressed onClick={onClickPaused} theme={BottleGreen}>Paused</Button>
        }
        <Button width="48px" onClick={onClickEdit} disabled={playState !== PlayState.Paused} theme={BlazeOrange}>Edit</Button>
        <Button width="48px" onClick={onClickNext} disabled={playState !== PlayState.Paused} theme={BlazeOrange}>Next</Button>
        <Button width="64px" onClick={onClickReset} theme={AntiqueRuby}>Reset</Button>
        <Button width="84px" onClick={onClickToggleGrid} pressed={gridOn} theme={CGBlue}>Grid: {gridOn ? 'ON' : 'OFF'}</Button>
        <ButtonGroup>
            <Button width="36px" onClick={onClickScale(-1)} disabled={cellSize === CellSize.Min} theme={CGBlue} title="Zoom Out"><ZoomOutIcon/></Button>
            <Button width="36px" onClick={onClickScale(1)} disabled={cellSize === CellSize.Max} theme={CGBlue} title="Zoom In"><ZoomInIcon/></Button>
        </ButtonGroup>
        <ButtonGroup>
            <Button width="36px" onClick={onClickSlowerFaster(-1)} disabled={speed === Speed.Min} theme={CGBlue} title="Slower"><SlowerIcon/></Button>
            <Button width="36px" onClick={onClickSlowerFaster(1)} disabled={speed === Speed.Max} theme={CGBlue} title="Faster"><FasterIcon/></Button>
        </ButtonGroup>
    </PanelWrapper>);
}

export default Panel;
