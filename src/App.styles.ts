import styled from 'styled-components';
import {DragState, PlayState} from './App.functions';

const size = {
    mobileS: '320px',
    mobileM: '375px',
    mobileL: '425px',
    tablet: '768px',
    laptop: '1024px',
    laptopL: '1440px',
    desktop: '2560px'
};

export const device = {
    mobileS: `(min-width: ${size.mobileS})`,
    mobileM: `(min-width: ${size.mobileM})`,
    mobileL: `(min-width: ${size.mobileL})`,
    tablet: `(min-width: ${size.tablet})`,
    laptop: `(min-width: ${size.laptop})`,
    laptopL: `(min-width: ${size.laptopL})`,
    desktop: `(min-width: ${size.desktop})`,
    desktopL: `(min-width: ${size.desktop})`
};

interface AppWrapperProps {
    playState: PlayState,
    dragState: DragState
}

function cursor({playState, dragState}: AppWrapperProps): string {
    if (dragState === DragState.moving) {
        return 'grab';
    } else if (playState === PlayState.Editing) {
        return 'crosshair';
    }
    return 'default';
}

export const AppWrapper = styled.div<AppWrapperProps>`
  height: 100%;
  width: 100%;
  position: relative;
  cursor: ${cursor};
`;

export const BottomSection = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-end;
  align-items: end;
  gap: 8px;
  @media ${device.laptop} {
    text-align: left;
    flex-direction: row;
    justify-content: space-between;
  }
`;
