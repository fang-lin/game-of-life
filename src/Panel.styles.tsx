import styled from 'styled-components';
import {ComponentType} from 'react';
import {ReactComponent as Rabbit} from './images/rabbit.svg';
import {ReactComponent as Snail} from './images/snail.svg';
import {ReactComponent as ZoomIn} from './images/zoom-in.svg';
import {ReactComponent as ZoomOut} from './images/zoom-out.svg';

// https://coolors.co/d9ed92-b5e48c-99d98c-76c893-52b69a-34a0a4-168aad-1a759f-1e6091-184e77
// https://coolors.co/f94144-f3722c-f8961e-f9844a-f9c74f-90be6d-43aa8b-4d908e-577590-277da1

interface Theme {
    Main: string;
    MainDark: string;
    MainLight: string;
    Grey: string
    DarkGrey: string;
    LightGrey: string;
}

export const AntiqueRuby: Theme = {
    DarkGrey: '#444',
    Grey: '#666',
    LightGrey: '#999',
    Main: '#85182A',
    MainDark: '#6E1423',
    MainLight: '#B21E35'
};

export const BottleGreen: Theme = {
    DarkGrey: '#444',
    Grey: '#666',
    LightGrey: '#999',
    Main: '#2D6A4F',
    MainDark: '#1B4332',
    MainLight: '#52B788'
};

export const BlazeOrange: Theme = {
    DarkGrey: '#444',
    Grey: '#666',
    LightGrey: '#999',
    Main: '#CA6702',
    MainDark: '#BB3E03',
    MainLight: '#EE9B00'
};

export const CGBlue: Theme = {
    DarkGrey: '#444',
    Grey: '#666',
    LightGrey: '#999',
    Main: '#1A759F',
    MainDark: '#184E77',
    MainLight: '#168AAD'
};

export const PanelWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  row-gap: 13px;
  column-gap: 8px;
  z-index: 10;
  max-width: calc(100% - 20px * 2);
  flex-wrap: wrap;
  justify-content: flex-end;
`;

export const Button = styled.button<{ height?: string; width?: string, pressed?: boolean, theme: Theme }>`
  font-family: 'Fira Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;
  background: linear-gradient(${({theme}) => theme.MainDark}, ${({theme}) => theme.MainLight});
  border: medium none;
  box-shadow: inset 0 0 0 1px ${({theme}) => theme.MainDark}, inset 0 0 7px 3px ${({theme}) => theme.MainLight};
  border-radius: 5px;
  cursor: pointer;
  color: white;
  padding: 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${({height}) => height || '36px'};
  width: ${({width}) => width || '80px'};
  top: ${({pressed}) => pressed ? '4px' : 0};

  &[disabled] {
    color: #999;
    background: #666;
    box-shadow: inset 0 0 0 1px #444;
    cursor: unset;
  }

  &[disabled]:after {
    background: #666;
    box-shadow: inset 0 0 3px 1px #444;
  }

  &:not([disabled]):hover {
    box-shadow: inset 0 0 0 1px ${({theme}) => theme.MainDark}, inset 0 0 1px 2px white, inset 0 0 15px 5px ${({theme}) => theme.MainLight};
  }

  &:not([disabled]):active {
    top: 6px;

    &:after {
      bottom: 0;
    }
  }

  &:after {
    content: '';
    position: absolute;
    height: 10px;
    right: 0;
    bottom: ${({pressed}) => pressed ? '-2px' : '-6px'};
    left: 0;
    background: ${({theme}) => theme.Main};
    box-shadow: inset 0 0 3px 1px ${({theme}) => theme.MainDark};
    z-index: -1;
    border-radius: 0 0 5px 5px;
  }
`;

export const ButtonGroup = styled.div`
  position: relative;
  display: flex;

  & > ${Button} {
    border-radius: 0;
    margin: 0 -1px 0 0;
  }

  & > ${Button}:first-child {
    border-radius: 4px 0 0 4px;

    &:after {
      border-radius: 0 0 0 4px;
    }
  }

  & > ${Button}:last-child {
    border-radius: 0 4px 4px 0;
    margin: 0;

    &:after {
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
