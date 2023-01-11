import styled from 'styled-components';
import {Button} from './Panel.styles';

export const PatternsPanelWrapper = styled.div`
  position: absolute;
  bottom: 42px;
  right: 0;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
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
