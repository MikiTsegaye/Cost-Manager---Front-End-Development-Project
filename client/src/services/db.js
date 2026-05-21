/*
 * db.js - Cost Manager LocalStorage Library (React/ES6 Module Version)
 * This library wraps localStorage to manage cost items and generate financial reports.
 * Compatible with ES6 modules for use in React applications.
 */

/*
 * Database instance class for managing costs
 */
class Database {
    constructor(databaseName) {
        // Store the database name for localStorage key management
        this.databaseName = databaseName;
        this.storageKey = 'db_' + databaseName;
    }

    /*
     * Add a new cost item to the database
     * @param {object} cost - Object with sum, currency, category, description
     * @return {object} The newly added cost item with date
     */
    addCost(cost) {
        // Retrieve current database state
        const dbData = JSON.parse(localStorage.getItem(this.storageKey));

        // Create new cost object with timestamp
        const newCost = {
            id: Date.now() + Math.random(),
            sum: cost.sum,
            currency: cost.currency,
            category: cost.category,
            description: cost.description,
            date: new Date().toISOString()
        };

        // Add cost to costs array
        dbData.costs.push(newCost);

        // Persist updated database to localStorage
        localStorage.setItem(this.storageKey, JSON.stringify(dbData));

        // Return cost object (without internal id)
        return {
            sum: newCost.sum,
            currency: newCost.currency,
            category: newCost.category,
            description: newCost.description
        };
    }

    /*
     * Generate a report for a specific month and year in a selected currency
     * @param {string} currency - Currency code (USD, GBP, EURO, ILS)
     * @param {number} year - Year (optional, defaults to current year)
     * @param {number} month - Month 1-12 (optional, defaults to current month)
     * @return {object} Report object with costs array and total
     */
    getReport(currency, year, month) {
        // Use current date if year and month not provided
        const now = new Date();
        const reportYear = year || now.getFullYear();
        const reportMonth = month || (now.getMonth() + 1);

        // Retrieve all costs from storage
        const dbData = JSON.parse(localStorage.getItem(this.storageKey));
        const allCosts = dbData.costs || [];

        // Filter costs by target month and year
        const filteredCosts = allCosts.filter((cost) => {
            const costDate = new Date(cost.date);
            return costDate.getFullYear() === reportYear &&
                   (costDate.getMonth() + 1) === reportMonth;
        });

        // Format costs for report output (include original currency, day only)
        const reportCosts = filteredCosts.map((cost) => {
            const costDate = new Date(cost.date);
            return {
                sum: cost.sum,
                currency: cost.currency,
                category: cost.category,
                description: cost.description,
                date: { day: costDate.getDate() }
            };
        });

        // Calculate total sum in original currencies
        let totalSum = 0;
        for (let i = 0; i < reportCosts.length; i++) {
            totalSum += reportCosts[i].sum;
        }

        // Return report object with target currency and totals
        return {
            year: reportYear,
            month: reportMonth,
            costs: reportCosts,
            total: {
                currency: currency,
                sum: totalSum
            }
        };
    }
}

/*
 * Initialize or open an existing database
 * @param {string} databaseName - Name of the database
 * @param {number} databaseVersion - Version number of the database
 * @return {object} Database instance with addCost and getReport methods
 */
function openCostsDB(databaseName, databaseVersion) {
    // Create database instance
    const dbInstance = new Database(databaseName);

    // Initialize storage if it doesn't exist
    if (!localStorage.getItem(dbInstance.storageKey)) {
        localStorage.setItem(dbInstance.storageKey, JSON.stringify({
            version: databaseVersion,
            costs: []
        }));
    }

    return dbInstance;
}

/*
 * Export database functions for ES6 modules
 * Can be imported as: import { openCostsDB } from './services/db';
 * Or as default: import db from './services/db'; (then use db.openCostsDB)
 */
export { openCostsDB };
export default { openCostsDB };
