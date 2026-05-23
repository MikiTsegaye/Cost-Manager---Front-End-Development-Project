// Entry point for the React application - renders the main App component
import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import app from './app';

// Create root element and render the application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        {/* CssBaseline helps normalize styles as per professional standards */}
        <CssBaseline />
        <app />
    </React.StrictMode>
);