import React, { useState, useEffect } from 'react';
import { Paper, TextField, Button, Box, Typography, Alert } from '@mui/material';
import exchangeRateService from '../services/exchange_rate_service';

const Settings = () => {
    // State for exchange rate URL input
    const [exchangeRateURL, setExchangeRateURL] = useState('');
    // State for displaying success/error messages
    const [message, setMessage] = useState(null);
    // State for button loading during URL validation
    const [loading, setLoading] = useState(false);

    // Load saved URL on component mount
    useEffect(() => {
        const saved = exchangeRateService.getExchangeRateURL();
        if (saved) {
            setExchangeRateURL(saved);
        }
    }, []);

    // Handle saving and validating the custom exchange rate URL
    const handleSaveURL = async () => {
        // If URL is empty, clear custom settings and use defaults
        if (!exchangeRateURL.trim()) {
            exchangeRateService.setExchangeRateURL(null);
            setMessage({ type: 'success', text: 'Settings cleared. Using default exchange rates.' });
            return;
        }

        // Validate URL format using built-in URL constructor
        try {
            new URL(exchangeRateURL);
        } catch (err) {
            setMessage({ type: 'error', text: 'Invalid URL format. Please enter a valid URL.' });
            return;
        }

        // Attempt to fetch and validate the exchange rate data
        setLoading(true);
        try {
            const response = await fetch(exchangeRateURL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Validate response contains all required currency rates
            if (!data.USD || !data.GBP || !data.EURO || !data.ILS) {
                throw new Error('Response missing required currency rates (USD, GBP, EURO, ILS)');
            }

            // Save the URL if validation succeeds
            exchangeRateService.setExchangeRateURL(exchangeRateURL);
            setMessage({ type: 'success', text: 'Exchange rate URL saved and verified successfully!' });
        } catch (error) {
            // Show error details if validation fails
            setMessage({ type: 'error', text: `Failed to verify URL: ${error.message}` });
        } finally {
            setLoading(false);
        }
    };

    // Handle clearing the URL and reverting to defaults
    const handleClear = () => {
        setExchangeRateURL('');
        exchangeRateService.setExchangeRateURL(null);
        setMessage({ type: 'success', text: 'Settings cleared. Using default exchange rates.' });
    };

    // Render settings form UI
    return (
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto', mt: 5 }}>
        <Typography variant="h5" gutterBottom>Settings</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Configure the URL for custom currency exchange rates. Leave empty to use default rates.
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Expected Response Format:
          </Typography>
          <Typography variant="caption" sx={{ fontFamily: 'monospace', display: 'block', p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            {`{"USD":1, "GBP":0.73, "EURO":0.92, "ILS":3.65}`}
          </Typography>
        </Box>
        {message && (
          <Alert severity={message.type} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Exchange Rate URL"
            type="url"
            placeholder="https://example.com/exchange-rates"
            value={exchangeRateURL}
            onChange={(e) => setExchangeRateURL(e.target.value)}
            fullWidth
            multiline
            rows={2}
            helperText="Enter a complete URL that returns JSON with exchange rates"
          />
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button variant="contained" onClick={handleSaveURL} disabled={loading} sx={{ flex: 1 }}>
              {loading ? 'Verifying...' : 'Save & Verify'}
            </Button>
            <Button variant="outlined" onClick={handleClear} sx={{ flex: 1 }}>
              Clear
            </Button>
          </Box>
        </Box>
      </Paper>
    );
};

export default Settings;
