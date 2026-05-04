import React, {FunctionComponent, MouseEvent} from 'react';
import {
    PanelWrapper,
    ButtonGroup,
    ZoomInIcon,
    ZoomOutIcon,
    Button,
    FasterIcon,
    SlowerIcon,
    ButtonWrapper, GliderIcon, ShareIcon, PauseIcon, WriteIcon, PlayIcon, NextIcon, StopIcon
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
        <ButtonGroup>
            {
                (playState === PlayState.Paused || playState === PlayState.Editing) &&
                <Button onClick={onClickPlay} theme={BottleGreen} aria-label="Play"><span><PlayIcon/></span></Button>
            }
            {
                playState === PlayState.Playing &&
                <Button pressed onClick={onClickPaused}
                    theme={BottleGreen} aria-label="Pause"><span><PauseIcon/></span></Button>
            }
            <Button onClick={onClickEdit} disabled={playState !== PlayState.Paused}
                theme={BlazeOrange} aria-label="Edit"><span><WriteIcon/></span></Button>
            <Button onClick={onClickNext} disabled={playState !== PlayState.Paused}
                theme={BlazeOrange} aria-label="Next Generation"><span><NextIcon/></span></Button>
            <Button onClick={onClickReset} theme={AntiqueRuby} aria-label="Reset"><span><StopIcon/></span></Button>
        </ButtonGroup>
        <ButtonGroup>
            <Button onClick={onClickScale(-1)} disabled={scale === Scale.Min} theme={CGBlue}
                aria-label="Zoom Out"><span><ZoomOutIcon/></span></Button>
            <Button onClick={onClickScale(1)} disabled={scale === Scale.Max} theme={CGBlue}
                aria-label="Zoom In"><span><ZoomInIcon/></span></Button>
        </ButtonGroup>
        <ButtonGroup>
            <Button onClick={onClickSlowerFaster(-1)} disabled={speed === Speed.Min}
                theme={CGBlue}
                aria-label="Slower"><span><SlowerIcon/></span></Button>
            <Button onClick={onClickSlowerFaster(1)} disabled={speed === Speed.Max}
                theme={CGBlue}
                aria-label="Faster"><span><FasterIcon/></span></Button>
        </ButtonGroup>
        <ButtonGroup>
            <Button onClick={onClickToggleGrid}
                theme={CGBlue} aria-label={`Toggle Grid: ${gridType}`}><span style={{fontSize: '10px'}}>{gridType} Grid</span></Button>
            <Button onClick={onClickToggleDeadAndBorn} pressed={showDeadCells}
                theme={CGBlue} aria-label="Toggle Dead Cells"><span style={{fontSize: '10px'}}>Show Dead</span></Button>
        </ButtonGroup>
        <Button theme={BlazeOrange} onClick={onClickShare} aria-label="Share"><span><ShareIcon/></span></Button>
        <ButtonWrapper>
            <Button onClick={onClickAdd}
                pressed={showPatternPanel}
                theme={selectedPattern ? BottleGreen : CGBlue} aria-label="Patterns"><span><GliderIcon/></span></Button>
            {showPatternPanel && <PatternsPanel {...{setSelectedPattern, selectedPattern, rotateHoveringCells}}/>}
        </ButtonWrapper>
    </PanelWrapper>);
};

export default Panel;
