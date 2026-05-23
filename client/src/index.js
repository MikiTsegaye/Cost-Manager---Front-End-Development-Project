import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import App from './app';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        {/* CssBaseline helps normalize styles as per professional standards */}
        <CssBaseline />
        <app />
    </React.StrictMode>
);