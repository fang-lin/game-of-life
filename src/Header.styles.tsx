import styled from 'styled-components';

export const HeaderWrapper = styled.header`
  font-family: 'Fira Sans', sans-serif;
  position: absolute;
  top: 8px;
  left: 8px;
`;

export const H1 = styled.h1`
  font-family: 'Fira Sans', sans-serif;
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
  color: #333;
  span {
    background-color: rgba(255,255,255,.6);
    padding: 0 4px;
    display: inline-block;
  }
  margin: 0 -4px;
`;

export const Anchor = styled.a`
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;

  :hover span{
    text-decoration: underline;
  }
`;
