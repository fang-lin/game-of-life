import styled from 'styled-components';
import {ComponentType} from 'react';
import {ReactComponent as Rabbit} from '../images/rabbit.svg';
import {ReactComponent as Snail} from '../images/snail.svg';
import {ReactComponent as ZoomIn} from '../images/zoom-in.svg';
import {ReactComponent as ZoomOut} from '../images/zoom-out.svg';
import {ReactComponent as Glider} from '../images/glider.svg';
import {ReactComponent as Share} from '../images/share.svg';
import {ReactComponent as Play} from '../images/play.svg';
import {ReactComponent as Pause} from '../images/pause.svg';
import {ReactComponent as Next} from '../images/next.svg';
import {ReactComponent as Stop} from '../images/stop.svg';
import {ReactComponent as Write} from '../images/write.svg';
import {CGBlue, Theme} from '../Theme';
import {Size} from '../Canvas/Canvas';

// https://coolors.co/d9ed92-b5e48c-99d98c-76c893-52b69a-34a0a4-168aad-1a759f-1e6091-184e77
// https://coolors.co/f94144-f3722c-f8961e-f9844a-f9c74f-90be6d-43aa8b-4d908e-577590-277da1

const defaultTheme = CGBlue;

export const PanelWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap-reverse;
  justify-content: flex-end;
  padding: 0 0 6px 0;
`;

export const ButtonWrapper = styled.div`
  position: relative;
`;

export const Button = styled.button<{ pressed?: boolean, theme: Theme, size?: Size }>`
  border: medium none;
  padding: 0 0 6px 0;
  margin: 0;
  position: relative;
  cursor: pointer;
  background: transparent;
  user-select: none;
  width: 36px;

  span {
    font-family: 'Fira Sans', sans-serif;
    font-size: 14px;
    font-weight: 700;
    background: linear-gradient(${({theme}) => theme.MainDark || defaultTheme.MainDark}, ${({theme}) => theme.MainLight || defaultTheme.MainLight});
    border: medium none;
    box-shadow: inset 0 0 0 1px ${({theme}) => theme.MainDark || defaultTheme.MainDark}, inset 0 0 7px 3px ${({theme}) => theme.MainLight || defaultTheme.MainLight};
    border-radius: 5px;
    cursor: pointer;
    color: white;
    padding: 0 6px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    top: ${({pressed}) => pressed ? '4px' : 0};
  }

  &:before {
    content: '';
    position: absolute;
    height: 11px;
    right: 0;
    bottom: 0;
    left: 0;
    background: ${({theme}) => theme.Main || defaultTheme.Main};
    box-shadow: inset 0 0 3px 1px ${({theme}) => theme.MainDark || defaultTheme.MainDark};
    border-radius: 0 0 5px 5px;
  }

  &[disabled] {
    span {
      color: #999;
      background: #666;
      box-shadow: inset 0 0 0 1px #444;
      cursor: unset;
    }
  }

  &[disabled]:before {
    background: #666;
    box-shadow: inset 0 0 3px 1px #444;
  }

  &:not([disabled]):hover {
    span {
      box-shadow: inset 0 0 0 1px ${({theme}) => theme.MainDark || defaultTheme.MainDark}, inset 0 0 1px 2px white, inset 0 0 15px 5px ${({theme}) => theme.MainLight || defaultTheme.MainLight};
    }
  }

  &:not([disabled]):active {
    span {
      top: 6px;
    }

    &:before {
      bottom: 0;
    }
  }
`;

export const Tag = styled.div<{theme: Theme }>`
  position: relative;
  padding: 0 0 6px 0;

  span {
    font-family: 'Fira Sans', sans-serif;
    font-size: 14px;
    font-weight: 700;
    background: linear-gradient(${({theme}) => theme.MainDark || defaultTheme.MainDark}, ${({theme}) => theme.MainLight || defaultTheme.MainLight});
    border: medium none;
    box-shadow: inset 0 0 0 1px ${({theme}) => theme.MainDark || defaultTheme.MainDark}, inset 0 0 7px 3px ${({theme}) => theme.MainLight || defaultTheme.MainLight};
    border-radius: 5px;
    cursor: pointer;
    color: white;
    padding: 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    top: 0;
  }

  &:before {
    content: '';
    position: absolute;
    height: 10px;
    right: 0;
    bottom: 0;
    left: 0;
    background: ${({theme}) => theme.Main || defaultTheme.Main};
    box-shadow: inset 0 0 3px 1px ${({theme}) => theme.MainDark || defaultTheme.MainDark};
    border-radius: 0 0 5px 5px;
  }
`;

export const ButtonGroup = styled.div`
  position: relative;
  display: flex;

  ${Button}, ${Tag} {
    span {
      border-radius: 0;
      margin: 0 -.5px;
    }

    &:before {
      border-radius: 0;
    }
  }

  ${Button}:first-child, ${Tag}:first-child {
    span {
      border-radius: 4px 0 0 4px;
      margin: 0 -.5px 0 0;
    }

    &:before {
      border-radius: 0 0 0 4px;
    }
  }

  ${Button}:last-child, ${Tag}:last-child {
    span {
      border-radius: 0 4px 4px 0;
      margin: 0 0 0 -.5px;
    }

    &:before {
      border-radius: 0 0 4px 0;
    }
  }
`;

function Icon(Component: ComponentType) {
    return styled(Component)`
      display: block;
      height: 18px;
      width: 18px;
      fill: white;
    `;
}

export const ZoomInIcon = Icon(ZoomIn);
export const ZoomOutIcon = Icon(ZoomOut);
export const FasterIcon = Icon(Rabbit);
export const SlowerIcon = Icon(Snail);
export const GliderIcon = Icon(Glider);
export const ShareIcon = Icon(Share);
export const PlayIcon = Icon(Play);
export const PauseIcon = Icon(Pause);
export const NextIcon = Icon(Next);
export const StopIcon = Icon(Stop);
export const WriteIcon = Icon(Write);
