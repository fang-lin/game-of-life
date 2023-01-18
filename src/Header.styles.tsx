import styled from 'styled-components';

export const HeaderWrapper = styled.header`
  font-family: 'Fira Sans', sans-serif;
  position: absolute;
  top: 8px;
  left: 8px;
  text-shadow: 0 1px 3px white;
`;

export const H1 = styled.h1`
  font-family: 'Fira Sans', sans-serif;
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
  color: #333;
  background-color: rgba(255,255,255,.6);
  padding: 0 5px;
  margin: 0 -5px;
`;

export const Anchor = styled.a`
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;

  :hover {
    text-decoration: underline;
  }
`;
