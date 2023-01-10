import React, {FunctionComponent} from 'react';
import Canvas, {Coordinate} from './Canvas';
import MaskCanvas from './MaskCanvas';
import {StageWrapper} from './Stage.styles';
import {Attributes, isTouchscreenDevices, ParsedParams, pixelRatio, PlayState} from './App.functions';

interface StageProps {
    size: [number, number];
    playState: PlayState;
    setPlayState: (playState: PlayState) => void;
    frameIndex: number;
    setFrameIndex: (op: (index: number) => number) => void;
    hoveringCell: Coordinate | null;
    selectedCells: Coordinate[];
    addedCells: Coordinate[];
    origin: Coordinate;
    params: ParsedParams;
    setCellsCount: (cellsCount: number) => void;
}

export const Stage: FunctionComponent<StageProps> = (props) => {

    const {
        setFrameIndex,
        setPlayState,
        setCellsCount,
        size,
        playState,
        hoveringCell,
        frameIndex,
        params,
        origin,
        addedCells,
        selectedCells
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
            params,
            attributes,
            frameIndex,
            setFrameIndex,
            setCellsCount,
            addedCells,
            origin,
        }}/>
        {isTouchscreenDevices ||
        <MaskCanvas {...{size, playState, hoveringCell, params, attributes, origin, selectedCells}} />}
    </StageWrapper>;
};
