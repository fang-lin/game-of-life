import styled from 'styled-components';

export const DashboardWrapper = styled.div`
  font-family: 'Fira Sans', sans-serif;
  font-size: 12px;
  text-align: right;
  line-height: 18px;
  font-weight: 600;
  color: #333;
  position: absolute;
  top: 8px;
  right: 8px;
  margin: 0 -4px;
  table, tr, td {
    margin: 0;
    padding: 0;
    border: medium none;
    border-collapse: collapse;
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
  td:first-child {
    padding-right: 6px;
  }
`;
