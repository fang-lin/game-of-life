import React from 'react';
import { createRoot } from 'react-dom/client';
import {App} from './App';
import {BrowserRouter, Routes, Navigate, Route} from 'react-router-dom';
import {combinePathToURL, defaultParams, routerPath, stringifyParams} from './App.functions';
import {NotFound} from './pages/NotFound';

const defaultURL = combinePathToURL(stringifyParams(defaultParams));

createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path={routerPath()} element={<App/>}/>
                <Route path="/" element={<Navigate to={defaultURL} replace/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
);
