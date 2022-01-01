import styled from 'styled-components';

// https://coolors.co/d9ed92-b5e48c-99d98c-76c893-52b69a-34a0a4-168aad-1a759f-1e6091-184e77
// https://coolors.co/f94144-f3722c-f8961e-f9844a-f9c74f-90be6d-43aa8b-4d908e-577590-277da1
export const PanelWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  margin: 0 -5px;
  display: flex;
`;

export const Button = styled.button`
  font-family: 'Fira Sans', sans-serif;
  font-weight: 700;
  margin: 0 5px;
  background: #577590;
  border: medium none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
  padding: 6px 10px;
  box-shadow: 0 1px 5px rgba(87, 114, 144, .7);

  &:hover {
    background: #277DA1;
  }
`;

export const ButtonGroup = styled.div`
  margin: 0 5px;

  & > ${Button} {
    border-radius: 0;
    margin: 0 1px 0 0;
  }

  & > ${Button}:first-child {
    border-radius: 4px 0 0 4px;
  }

  & > ${Button}:last-child {
    border-radius: 0 4px 4px 0;
    margin: 0;
  }
`;