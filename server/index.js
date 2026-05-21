/* server/index.js - Express server for Cost Manager API */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

/* Middleware - Enable CORS and JSON parsing */
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/* In-memory exchange rates (can be updated via POST request) */
let exchangeRates = {
    "USD": 1,
    "GBP": 0.73,
    "EURO": 0.92,
    "ILS": 3.65
};

/* Route: GET /api/exchange-rates
   Returns current exchange rates in JSON format */
app.get('/api/exchange-rates', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(exchangeRates);
});

/* Route: GET /exchange-rates
   Serves the static exchange rates JSON file */
app.get('/exchange-rates', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json(exchangeRates);
});

/* Route: POST /api/exchange-rates
   Allows updating exchange rates (admin only in production) */
app.post('/api/exchange-rates', (req, res) => {
    // Extract rates from request body
    const { USD, GBP, EURO, ILS } = req.body;
    
    /* Validate that all required rates are provided */
    if (USD && GBP && EURO && ILS) {
        // Update in-memory rates
        exchangeRates = { USD, GBP, EURO, ILS };
        res.json({ success: true, rates: exchangeRates });
    } else {
        // Return error if rates are invalid
        res.status(400).json({ error: 'Invalid rates format. Required: USD, GBP, EURO, ILS' });
    }
});

/* Route: GET /health
   Health check endpoint for monitoring */
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

/* Start server and log endpoints */
app.listen(PORT, () => {
    console.log(`Cost Manager API Server running on port ${PORT}`);
    console.log(`Exchange Rates API: http://localhost:${PORT}/api/exchange-rates`);
    console.log(`Static Rates: http://localhost:${PORT}/exchange-rates`);
});
