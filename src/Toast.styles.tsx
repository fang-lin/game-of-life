import styled from 'styled-components';

export const ToastBackground = styled.div`
  width: 100%;
  position: fixed;
  top: 30px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;
export const ToastWrapper = styled.div<{hide: boolean}>`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  text-align: right;
  border: solid 1px #555;
  color: white;
  box-shadow: 0 3px 8px 0 rgba(0,0,0,.5);
  border-radius: 5px;
  padding: 10px;
  background: linear-gradient(#888, #666);
  opacity: ${({hide}) => hide ? '0': '1'};
  transition: opacity .5s;
`;
