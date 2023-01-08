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
  font-size: 16px;
  font-weight: 500;
  margin: 0;
`;

export const Anchor = styled.a`
  color: #333;
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;

  :hover {
    text-decoration: underline;
  }
`;
