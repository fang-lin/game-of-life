import styled from 'styled-components';
import {device} from './App.styles';

export const FooterWrapper = styled.footer`
  font-size: 12px;
  line-height: 18px;
  text-align: right;
  color: #333;
  background-color: rgba(255,255,255,.6);
  padding: 0 4px;
  margin: 0 -4px;
  
  @media ${device.laptop} {
    text-align: left;
  }
`;

export const Anchor = styled.a`
  color: #333;
  text-decoration: none;
  white-space: nowrap;
  font-weight: 500;
  :hover {
    text-decoration: underline;
  }
`;
