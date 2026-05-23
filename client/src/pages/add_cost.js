import React, { useState } from 'react';
import { TextField, Button, MenuItem, Box, Typography, Paper, Alert } from '@mui/material';
import db from '../services/db';

// Predefined categories for cost items
const categories = ['Food', 'Health', 'Housing', 'Transport', 'Education', 'Other'];
// Supported currencies for conversion
const currencies = ['USD', 'ILS', 'GBP', 'EURO'];

const AddCost = () => {
    // Form state management with default values
    const [form, setForm] = useState({ sum: '', currency: 'USD', category: 'Food', description: '' });
    // State for displaying success/error messages
    const [status, setStatus] = useState(null);

    // Handle form field changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle form submission - add cost to database
    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            // Open database (synchronous)
            const ob = db.openCostsDB("costsdb", 1);
            // Add the cost (Convert sum to a Number)
            ob.addCost({ ...form, sum: Number(form.sum) });

            // Show success message and reset form
            setStatus({ type: 'success', msg: 'Cost item added successfully!' });
            setForm({ sum: '', currency: 'USD', category: 'Food', description: '' });
        } catch (err) {
            // Show error message if submission fails
            setStatus({ type: 'error', msg: 'Failed to add cost: ' + err });
        }
    };

    // Render form UI with MUI components
    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 5 }}>
            <Typography variant="h5" gutterBottom>Add New Cost Item</Typography>
            {status && <Alert severity={status.type} sx={{ mb: 2 }}>{status.msg}</Alert>}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField label="Sum" name="sum" type="number" value={form.sum} onChange={handleChange} required fullWidth />

                <TextField select label="Currency" name="currency" value={form.currency} onChange={handleChange} fullWidth>
                    {currencies.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>

                <TextField select label="Category" name="category" value={form.category} onChange={handleChange} fullWidth>
                    {categories.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                </TextField>

                <TextField label="Description" name="description" value={form.description} onChange={handleChange} required fullWidth />

                <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }}>
                    Add Item
                </Button>
            </Box>
        </Paper>
    );
};

export default AddCost;
