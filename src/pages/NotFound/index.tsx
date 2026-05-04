import React from 'react';
import {Link} from 'react-router-dom';
import styled, {createGlobalStyle} from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    margin: 0;
    padding: 0;
    height: 100%;
    background: #999;
    font-family: 'Fira Sans', sans-serif;
  }
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
`;

const Code = styled.h1`
    font-size: 120px;
    margin: 0;
    color: #333;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const Message = styled.p`
    font-size: 18px;
    color: #666;
    margin: 0 0 30px;
`;

const HomeLink = styled(Link)`
    font-size: 14px;
    color: #333;
    text-decoration: none;
    padding: 10px 20px;
    border: 1px solid #666;
    border-radius: 4px;
    transition: all 0.2s;

    &:hover {
        background: #333;
        color: #fff;
    }
`;

export const NotFound: React.FC = () => {
    return (
        <>
            <GlobalStyle />
            <Wrapper>
                <Code>404</Code>
                <Message>Page not found</Message>
                <HomeLink to="/">Back to Home</HomeLink>
            </Wrapper>
        </>
    );
};
