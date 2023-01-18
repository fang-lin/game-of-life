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
  background-color: rgba(255,255,255,.6);
  padding: 0 5px;
  margin: 0 -5px;
  table, tr, td {
    margin: 0;
    padding: 0;
    border: medium none;
    border-collapse: collapse;
    span {
      font-family: 'Fira Code', sans-serif;
    }
  }
  td:first-child {
    padding-right: 10px;
  }
`;
