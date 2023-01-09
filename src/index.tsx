import React from 'react';
import ReactDOM from 'react-dom';
import {GlobalStyle} from './index.styles';
import {App} from './App';
import reportWebVitals from './reportWebVitals';
import {HashRouter, Switch, Redirect, Route} from 'react-router-dom';
import {combinePathToURL, defaultParams, routerPath, stringifyParams} from './App.functions';

ReactDOM.render(
    <React.StrictMode>
        <HashRouter>
            <Switch>
                <Route path={routerPath()} component={App}/>
                <Redirect to={combinePathToURL(stringifyParams(defaultParams))}/>
            </Switch>
        </HashRouter>
        <GlobalStyle/>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
