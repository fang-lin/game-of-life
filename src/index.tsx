import React from 'react';
import { createRoot } from 'react-dom/client';
import {GlobalStyle} from './index.styles';
import {App} from './App';
import {HashRouter, Routes, Navigate, Route} from 'react-router-dom';
import {combinePathToURL, defaultParams, routerPath, stringifyParams} from './App.functions';

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <HashRouter>
            <Routes>
                <Route path={routerPath()} element={<App/>}/>
                <Route path="*" element={<Navigate to={combinePathToURL(stringifyParams(defaultParams))} replace={true}/>}/>
            </Routes>
        </HashRouter>
        <GlobalStyle/>
    </React.StrictMode>,
);
