import React from 'react';
import { createRoot } from 'react-dom/client';
import {GlobalStyle} from './index.styles';
import {App} from './App';
// import reportWebVitals from './reportWebVitals';
import {HashRouter, Routes, Navigate, Route} from 'react-router-dom';
import {combinePathToURL, defaultParams, routerPath, stringifyParams} from './App.functions';

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <HashRouter>
            <Routes>
                <Route path={routerPath()} element={<App/>}/>
                <Route path="*" element={<Navigate to={combinePathToURL(stringifyParams(defaultParams))} replace={true}/>}/>
                {/*<Navigate to={combinePathToURL(stringifyParams(defaultParams))}/>*/}
            </Routes>
        </HashRouter>
        <GlobalStyle/>
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
