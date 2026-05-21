// services/exchangeRateService.js - Handles currency exchange rate fetching and conversion

// Default exchange rates (USD as base)
const DEFAULT_RATES = {
    'USD': 1,
    'GBP': 0.73,
    'EURO': 0.92,
    'ILS': 3.65
};

// Get stored custom exchange rate URL from localStorage
const getExchangeRateURL = () => {
    return localStorage.getItem('exchangeRateURL');
};

// Set custom exchange rate URL in localStorage
const setExchangeRateURL = (url) => {
    if (url) {
        localStorage.setItem('exchangeRateURL', url);
    } else {
        localStorage.removeItem('exchangeRateURL');
    }
};

// Fetch exchange rates from custom URL or use defaults with fallback strategy
const fetchExchangeRates = async () => {
    try {
        // Retrieve custom URL if user has configured one
        const customURL = getExchangeRateURL();
        let url = customURL;

        // If no custom URL, try default backend server first
        if (!url) {
            url = process.env.REACT_APP_EXCHANGE_RATE_API || 'https://cost-manager-0w4h.onrender.com/api/exchange-rates';
        }

        // Attempt to fetch from configured URL (custom or default)
        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                // Validate that response contains required currencies
                if (data.USD && data.GBP && data.EURO && data.ILS) {
                    // Cache rates in localStorage for offline use
                    localStorage.setItem('cachedExchangeRates', JSON.stringify(data));
                    return data;
                }
            }
        } catch (fetchError) {
            console.warn('Error fetching from server:', fetchError);
        }

        // Check if we have previously cached rates as fallback
        const cached = localStorage.getItem('cachedExchangeRates');
        if (cached) {
            return JSON.parse(cached);
        }

        // Final fallback: use hardcoded default rates
        localStorage.setItem('cachedExchangeRates', JSON.stringify(DEFAULT_RATES));
        return DEFAULT_RATES;
    } catch (error) {
        // Return cached rates or defaults
        console.warn('Error fetching exchange rates, using cached or default:', error);
        const cached = localStorage.getItem('cachedExchangeRates');
        return cached ? JSON.parse(cached) : DEFAULT_RATES;
    }
};

// Convert amount from one currency to another using fetched rates
const convertCurrency = (amount, fromCurrency, toCurrency, rates) => {
    // No conversion needed if currencies are the same
    if (fromCurrency === toCurrency) return amount;

    // Validate currencies exist in rates table
    if (!rates[fromCurrency] || !rates[toCurrency]) {
        console.error('Invalid currency:', fromCurrency, toCurrency);
        return amount;
    }

    // Convert to USD first (base currency), then to target currency
    const amountInUSD = amount / rates[fromCurrency];
    return amountInUSD * rates[toCurrency];
};

// Export service functions for use in components
export default {
    getExchangeRateURL,
    setExchangeRateURL,
    fetchExchangeRates,
    convertCurrency,
    DEFAULT_RATES
};
