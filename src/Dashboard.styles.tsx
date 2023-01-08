import styled from 'styled-components';
import {BlazeOrange} from './Theme';

export const DashboardWrapper = styled.div`
  font-family: 'Fira Code', sans-serif;
  font-size: 12px;
  font-weight: 600;
  text-align: right;
  color: ${BlazeOrange.MainDark};
  position: absolute;
  top: 8px;
  right: 8px;
  p {
    margin: 0;
  }
`;
