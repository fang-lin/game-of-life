import styled from 'styled-components';

// https://coolors.co/d9ed92-b5e48c-99d98c-76c893-52b69a-34a0a4-168aad-1a759f-1e6091-184e77
// https://coolors.co/f94144-f3722c-f8961e-f9844a-f9c74f-90be6d-43aa8b-4d908e-577590-277da1

export const PanelWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  margin: 0 -5px;
  display: flex;
  gap: 8px;
  z-index: 10;
`;

export const Button = styled.button`
  font-family: 'Fira Sans', sans-serif;
  font-size: 16px;
  font-weight: 700;
  background: #1e6091;
  border: medium none;
  box-shadow: inset 0 0 0 1px #184e77;
  border-radius: 5px;
  cursor: pointer;
  color: white;
  padding: 8px;
  position: relative;

  &[disabled] {
    color: #999;
    background: #666;
    box-shadow: inset 0 0 0 1px #444;
    cursor: unset;
  }

  &[disabled]:hover {
    background: #666;
  }

  &[disabled]:after {
    background: linear-gradient(#444 50%, #666);
  }

  &:hover {
    background: #168aad;
  }

  &:after {
    content: '';
    position: absolute;
    height: 10px;
    right: 0;
    bottom: -5px;
    left: 0;
    background: linear-gradient(#184e77 50%, #1a759f);
    z-index: -1;
    border-radius: 0 0 4px 4px;
  }
`;

export const ButtonGroup = styled.div`
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    height: 10px;
    right: 0;
    bottom: -5px;
    left: 0;
    background: linear-gradient(#184e77 50%, #1a759f);
    z-index: -1;
    border-radius: 0 0 4px 4px;
  }

  & > ${Button} {
    border-radius: 0;
    margin: 0 -1px 0 0;
    &:after {
      display: none;
    }
  }

  & > ${Button}:first-child {
    border-radius: 4px 0 0 4px;
  }

  & > ${Button}:last-child {
    border-radius: 0 4px 4px 0;
    margin: 0;
  }
`;
