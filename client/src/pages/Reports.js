import React, { useState, useEffect } from 'react';
import { Paper, Box, TextField, MenuItem, Button, Typography, Grid } from '@mui/material';
import db from '../services/db';
import exchangeRateService from '../services/exchangeRateService';
import PieChart from '../components/Charts/pieChart';
import BarChart from '../components/Charts/barChart';

// Supported currencies for reporting
const currencies = ['USD', 'ILS', 'GBP', 'EURO'];

const Reports = () => {
    // Initialize with current date values
    const currentDate = new Date();
    // State management for filters and display data
    const [month, setMonth] = useState(currentDate.getMonth() + 1);
    const [year, setYear] = useState(currentDate.getFullYear());
    const [currency, setCurrency] = useState('USD');
    // State for report data and UI feedback
    const [reportData, setReportData] = useState(null);
    const [yearlyData, setYearlyData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // State for exchange rates used in conversions
    const [exchangeRates, setExchangeRates] = useState(exchangeRateService.DEFAULT_RATES);

    // Load exchange rates on component mount
    useEffect(() => {
        const loadRates = async () => {
            const rates = await exchangeRateService.fetchExchangeRates();
            setExchangeRates(rates);
        };
        loadRates();
    }, []);

    // Helper function to convert costs to selected currency
    const convertCost = (amount, fromCurrency, toCurrency) => {
        return exchangeRateService.convertCurrency(amount, fromCurrency, toCurrency, exchangeRates);
    };

    // Fetch monthly report data and convert costs to selected currency
    const generateReport = () => {
        setLoading(true);
        setError(null);
        try {
            // Open database and fetch report for selected month/year (synchronous)
            const ob = db.openCostsDB('costsdb', 1);
            const report = ob.getReport(currency, year, month);

            // Convert all costs to selected currency and add conversion metadata
            const convertedCosts = report.costs.map(cost => ({
                ...cost,
                convertedSum: convertCost(cost.sum, cost.currency, currency),
                originalCurrency: cost.currency,
                originalSum: cost.sum
            }));

            // Calculate total in selected currency
            const totalInSelectedCurrency = convertedCosts.reduce((sum, cost) => sum + cost.convertedSum, 0);

            // Update report state with converted data
            setReportData({
                ...report,
                costs: convertedCosts,
                total: { currency, sum: totalInSelectedCurrency }
            });
        } catch (err) {
            setError('Failed to generate report: ' + err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch yearly data for bar chart (all 12 months)
    const generateYearlyReport = () => {
        setLoading(true);
        setError(null);
        try {
            // Open database connection (synchronous)
            const ob = db.openCostsDB('costsdb', 1);
            // Object to store monthly totals
            const monthlyTotals = {};

            // Fetch data for all 12 months and convert to selected currency
            for (let m = 1; m <= 12; m++) {
                const report = ob.getReport(currency, year, m);
                // Sum costs for this month, converting to selected currency
                const totalInSelectedCurrency = report.costs.reduce((sum, cost) => {
                    return sum + convertCost(cost.sum, cost.currency, currency);
                }, 0);
                monthlyTotals[m] = totalInSelectedCurrency;
            }

            setYearlyData(monthlyTotals);
        } catch (err) {
            setError('Failed to generate yearly report: ' + err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Auto-generate reports when any filter parameter changes
    useEffect(() => {
        generateReport();
        generateYearlyReport();
    }, [month, year, currency]);

    // Month names for display
    const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    // Year options for dropdown (current year +/- 2 years)
    const years = Array.from({ length: 5 }, (_, i) => currentDate.getFullYear() - 2 + i);

    // Render reports page with filters and charts
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Reports</Typography>

            {/* Filters Section for month/year/currency selection */}
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            select
                            label="Month"
                            value={month}
                            onChange={(e) => setMonth(Number(e.target.value))}
                            fullWidth
                        >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                                <MenuItem key={m} value={m}>{monthNames[m]}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            select
                            label="Year"
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            fullWidth
                        >
                            {years.map((y) => (
                                <MenuItem key={y} value={y}>{y}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            select
                            label="Currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            fullWidth
                        >
                            {currencies.map((c) => (
                                <MenuItem key={c} value={c}>{c}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>

                {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
            </Paper>

            {/* Charts Section - displays pie and bar charts */}
            {reportData && yearlyData && (
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Costs by Category - {monthNames[month]} {year}
                            </Typography>
                            <PieChart data={reportData.costs} currency={currency} />
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Monthly Costs - {year}
                            </Typography>
                            <BarChart data={yearlyData} currency={currency} year={year} />
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {/* Summary Section showing total expenses and item count */}
            {reportData && (
                <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Summary for {monthNames[month]} {year}
                    </Typography>
                    <Typography variant="body1">
                        Total Expenses: <strong>{currency} {reportData.total.sum.toFixed(2)}</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                        Items: {reportData.costs.length}
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default Reports;
