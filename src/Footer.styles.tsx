import styled from 'styled-components';
import {device} from './App.styles';

export const FooterWrapper = styled.footer`
  font-size: 12px;
  text-align: right;
  color: #333;
  text-shadow: 0 0 3px white, 0 0 3px white, 0 0 3px white, 0 0 3px white, 0 0 3px white;
  position: relative;
  z-index: 10;
  
  @media ${device.laptop} {
    text-align: left;
    flex-grow: 1;
  }
`;

export const Anchor = styled.a`
  color: #333;
  text-decoration: none;
  white-space: nowrap;

  :hover {
    text-decoration: underline;
  }
`;
