import styled from 'styled-components';
import {Button} from './Panel.styles';
import {ReactComponent as RotateLeft} from '../images/rotate-left.svg';
import {ReactComponent as RotateRight} from '../images/rotate-right.svg';
import {ComponentType} from 'react';

export const PatternsPanelWrapper = styled.div`
  position: absolute;
  bottom: 42px;
  right: 0;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 2px;
`;
export const ButtonTopRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 6px;
`;

export const SmallButton = styled(Button)`
  span {
    font-size: 12px;
    height: 24px;
  }
`;

export const CapsuleButton = styled(Button)`
  span {
    font-size: 14px;
    height: 36px;
    border-radius: 18px;
  }

  &:before {
    height: ${({pressed}) => pressed ? '20px' : '24px'};
    border-radius: 0 0 18px 18px;
  }

  &:not([disabled]):active {
    &:before {
      height: 18px;
    }
  }
`;

function Icon(Component: ComponentType) {
    return styled(Component)`
      display: block;
      height: 24px;
      width: 24px;
      fill: white;
    `;
}

export const RotateLeftIcon = Icon(RotateLeft);
export const RotateRightIcon = Icon(RotateRight);
