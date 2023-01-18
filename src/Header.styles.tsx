import styled from 'styled-components';

export const HeaderWrapper = styled.header`
  font-family: 'Fira Sans', sans-serif;
  position: absolute;
  top: 10px;
  left: 10px;
`;

export const H1 = styled.h1`
  font-family: 'Fira Sans', sans-serif;
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
  color: #333;
  margin: -4px -4px 0 -4px;
  span {
    background-color: rgba(255,255,255,.6);
    padding: 0 4px;
    display: inline-block;
  }
`;

export const Anchor = styled.a`
  font-size: 12px;
  font-weight: 500;
  text-decoration: none;

  :hover span{
    text-decoration: underline;
  }
`;
