import styled from 'styled-components';
import {Button} from './Panel.styles';

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

export const SmallButton = styled(Button)`
  span {
    font-size: 12px;
    height: 24px;
  }
`;

export const CapsuleButton = styled(Button)`
  span {
    font-size: 14px;
    height: 32px;
    border-radius: 16px;
  }

  &:before {
    height: ${({pressed}) => pressed ? '18px' : '22px'};
    border-radius: 0 0 16px 16px;
  }

  &:not([disabled]):active {
    &:before {
      height: 16px;
    }
  }
`;
