import styled from 'styled-components';

export const HeaderWrapper = styled.header`
  font-family: 'Fira Sans', sans-serif;
  font-size: 14px;
  text-shadow: 0 0 5px white, 0 0 5px white, 0 0 5px white, 0 0 5px white, 0 0 5px white;
  font-weight: 700;
  position: absolute;
  top: 20px;
  left: 20px;
`;

export const Anchor = styled.a`
  color: #333;
  text-shadow: 0 1px 1px rgba(255, 255, 255, .7);
  text-decoration: none;

  :hover {
    text-decoration: underline;
  }
`;
