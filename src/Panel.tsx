import React, {MouseEvent} from 'react';
import {PanelWrapper} from "./Panel.styles";
import {PlayState} from "./App";

interface PanelProps {
    playState: PlayState,
    setPlayState: (s: PlayState) => void;
    onClickNext: () => void;
}

function Panel({playState, setPlayState, onClickNext}: PanelProps) {

    function onClickPlayPaused(event: MouseEvent<HTMLButtonElement>) {
        if (playState === PlayState.Playing) {
            setPlayState(PlayState.Paused)
        } else {
            setPlayState(PlayState.Playing)
        }

    }

    function onClickStopReset(event: MouseEvent<HTMLButtonElement>) {
        if (playState === PlayState.Stopped) {
            setPlayState(PlayState.Reset);
        } else {
            setPlayState(PlayState.Stopped);
        }
    }

    return (<PanelWrapper>
        <button onClick={onClickPlayPaused} className="play-button">
            {playState === PlayState.Playing ? 'Paused' : 'Play'}
        </button>
        <button onClick={onClickStopReset} className="stop-button">
            {playState === PlayState.Stopped ? 'Reset' : 'Stop'}
        </button>
        <button onClick={onClickNext} disabled={playState !== PlayState.Paused} className="next-button">
            Next
        </button>
    </PanelWrapper>);
}

export default Panel;
