import styled from 'styled-components';

export const HeaderWrapper = styled.header`
  font-family: 'Fira Sans', sans-serif;
  font-size: 16px;
  font-weight: 500;
  position: absolute;
  top: 8px;
  left: 8px;
  text-shadow: 0 1px 3px white;
`;

export const Anchor = styled.a`
  color: #333;
  text-decoration: none;

  :hover {
    text-decoration: underline;
  }
`;
