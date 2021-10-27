import React, {MouseEvent} from 'react';
import {Button, PanelWrapper} from "./Panel.styles";
import {PlayState} from "./App";

interface PanelProps {
    playState: PlayState,
    setPlayState: (playState: PlayState, callback?: () => void) => void;
}

function Panel({playState, setPlayState}: PanelProps) {

    function onClickPlayPaused(event: MouseEvent<HTMLButtonElement>) {
        if (playState === PlayState.Playing) {
            setPlayState(PlayState.Paused)
        } else {
            setPlayState(PlayState.Playing)
        }

    }

    function onClickResetClean(event: MouseEvent<HTMLButtonElement>) {
        if (playState === PlayState.Reset) {
            setPlayState(PlayState.Cleaned);
        } else {
            setPlayState(PlayState.Reset);
        }
    }

    function onClickNext(event: MouseEvent<HTMLButtonElement>) {
        setPlayState(PlayState.Playing, () => setPlayState(PlayState.Paused));
    }

    return (<PanelWrapper>
        <Button onClick={onClickPlayPaused} className="play-button">
            {playState === PlayState.Playing ? 'Paused' : 'Play'}
        </Button>
        <Button onClick={onClickResetClean} disabled={playState === PlayState.Cleaned} className="stop-button">
            {playState === PlayState.Reset ? 'Clean' : 'Reset'}
        </Button>
        <Button onClick={onClickNext} disabled={playState === PlayState.Playing} className="next-button">
            Next
        </Button>
    </PanelWrapper>);
}

export default Panel;
