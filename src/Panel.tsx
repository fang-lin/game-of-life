import React from 'react';
import {Button, PanelWrapper, ButtonGroup, GirdOnIcon, GirdOffIcon} from './Panel.styles';
import {PlayState} from './App';
import {ParsedParams} from './utils';

interface PanelProps {
    playState: PlayState,
    pushToHistory: (parsedParams: Partial<ParsedParams>) => void;
    setPlayState: (playState: PlayState, cb?: () => void) => void;
    params: ParsedParams;
}

function Panel({playState, pushToHistory, params, setPlayState}: PanelProps) {

    function onClickPlay() {
        setPlayState(PlayState.Playing);
    }

    function onClickPaused() {
        setPlayState(PlayState.Paused);
    }

    function onClickEdit() {
        setPlayState(PlayState.Editing);
    }

    function onClickReset() {
        setPlayState(PlayState.Reset);
    }

    function onClickNext() {
        console.log('onClickNext');
        setPlayState(PlayState.Playing, () => setPlayState(PlayState.Paused));
    }

    const onClickScale = (scale: number) => {
        return () => pushToHistory({cellSize: params.cellSize + scale});
    };

    const onClickToggleGrid = () => {
        pushToHistory({gridOn: !params.gridOn});
    };

    const onClickSlower = () => {
        pushToHistory({speed: params.speed + 50});
    };

    const onClickFaster = () => {
        pushToHistory({speed: params.speed - 50});
    };

    return (<PanelWrapper>
        {
            (playState === PlayState.Paused || playState === PlayState.Editing) &&
            <Button onClick={onClickPlay} className="play-button">Play</Button>
        }
        {
            playState === PlayState.Playing &&
            <Button onClick={onClickPaused} className="pause-button">Paused</Button>
        }
        <Button onClick={onClickEdit} className="stop-button" disabled={playState !== PlayState.Paused}>Edit</Button>
        <Button onClick={onClickNext} className="next-button" disabled={playState !== PlayState.Paused}>Next</Button>
        <Button onClick={onClickReset} className="clean-button">Reset</Button>
        <Button onClick={onClickToggleGrid}>
            {params.gridOn ? <GirdOnIcon/> : <GirdOffIcon/>}
        </Button>
        <ButtonGroup>
            <Button onClick={onClickScale(-1)} title="Zoom Out">
                <span className="material-icons">zoom_out</span>
            </Button>
            <Button onClick={onClickScale(1)} title="Zoom In">
                <span className="material-icons">zoom_in</span>
            </Button>
        </ButtonGroup>
        <ButtonGroup>
            <Button onClick={onClickSlower}>
                Slower
            </Button>
            <Button onClick={onClickFaster}>
                Faster
            </Button>
        </ButtonGroup>
    </PanelWrapper>);
}

export default Panel;
