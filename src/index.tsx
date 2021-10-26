import React from 'react';
import ReactDOM from 'react-dom';
import {GlobalStyle} from './index.styles';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Switch>
                <Route path="/:themeKey/:algorithmKey/:speedKey" component={App}></Route>
                <Redirect to={`/a/b/100`}/>
            </Switch>
        </BrowserRouter>
        <GlobalStyle/>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
