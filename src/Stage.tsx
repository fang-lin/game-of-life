import React, {FunctionComponent} from 'react';
import Canvas, {Coordinate} from './Canvas';
import MaskCanvas from './MaskCanvas';
import {StageWrapper} from './Stage.styles';
import {isTouchscreenDevices, ParsedParams, pixelRatio} from './App.functions';
import {Attributes, PlayState} from './App';

interface StageProps {
    size: [number, number];
    playState: PlayState;
    setPlayState: (playState: PlayState) => void;
    frameIndex: number;
    setFrameIndex: (op: (index: number) => number) => void;
    clickedCell: Coordinate | null;
    hoveringCell: Coordinate | null;
    origin: Coordinate;
    params: ParsedParams;
    setCellsCount: (cellsCount: number) => void;
    setClickedCell: (xy: Coordinate | null, cb?: () => void) => void;
}

export const Stage: FunctionComponent<StageProps> = (props) => {

    const {
        setFrameIndex,
        setClickedCell,
        setPlayState,
        setCellsCount,
        size,
        playState,
        clickedCell,
        hoveringCell,
        frameIndex,
        params,
        origin
    } = props;

    const attributes: Attributes = {
        width: size[0] * pixelRatio,
        height: size[1] * pixelRatio
    };

    return <StageWrapper>
        <Canvas {...{
            size,
            playState,
            setPlayState,
            clickedCell,
            params,
            attributes,
            frameIndex,
            setFrameIndex,
            setCellsCount,
            origin,
        }}/>
        {isTouchscreenDevices ||
        <MaskCanvas {...{size, playState, setClickedCell, hoveringCell, params, attributes, origin}} />}
    </StageWrapper>;
};
