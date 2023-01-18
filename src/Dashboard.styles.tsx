import styled from 'styled-components';

export const DashboardWrapper = styled.div`
  font-family: 'Fira Sans', sans-serif;
  font-size: 12px;
  text-align: right;
  line-height: 18px;
  font-weight: 500;
  color: #333;
  position: absolute;
  top: 10px;
  right: 10px;
  table {
    margin: -4px -4px 0 -4px;
    border-collapse: collapse;
  }
  tr, td {
    margin: 0;
    padding: 0;
    border: medium none;
    span {
      display: inline-block;
      padding: 0 4px;
      background-color: rgba(255,255,255,.6);
      pre {
        display: inline;
        font-family: 'Fira Code', sans-serif;
      }
    }
  }
`;
