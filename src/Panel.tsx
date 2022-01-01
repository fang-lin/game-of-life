import React, {MouseEvent} from 'react';
import {Button, PanelWrapper, ButtonGroup} from './Panel.styles';
import {PlayState} from './App';
import {ParsedParams} from './utils';

interface PanelProps {
    playState: PlayState,
    pushToHistory: (parsedParams: Partial<ParsedParams>) => void;
    setPlayState: (playState: PlayState, callback?: () => void) => void;
    params: ParsedParams;
}

function Panel({playState, setPlayState, pushToHistory, params}: PanelProps) {

    function onClickPlayPaused(event: MouseEvent<HTMLButtonElement>) {
        if (playState === PlayState.Playing) {
            setPlayState(PlayState.Paused);
        } else {
            setPlayState(PlayState.Playing);
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

    const onClickScale = (scale: number) => {
        return () => pushToHistory({cellSize: params.cellSize + scale});
    };

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
        <ButtonGroup>
            <Button onClick={onClickScale(-1)} disabled={playState === PlayState.Playing} className="next-button">
                -
            </Button>
            <Button onClick={onClickScale(1)} disabled={playState === PlayState.Playing} className="next-button">
                +
            </Button>
        </ButtonGroup>
    </PanelWrapper>);
}

export default Panel;
