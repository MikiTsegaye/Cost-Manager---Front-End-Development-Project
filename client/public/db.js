/*
 * db.js - Cost Manager LocalStorage Library (Vanilla JavaScript Version)
 * This library wraps localStorage to manage cost items and generate financial reports.
 */

// Initialize the global db namespace
window.db = {};

/* 
 * Database instance object prototype
 */
window.db.Database = function(databaseName) {
    // Store the database name for localStorage key management
    this.databaseName = databaseName;
    this.storageKey = 'db_' + databaseName;
};

/*
 * Initialize or open an existing database
 * @param {string} databaseName - Name of the database
 * @param {number} databaseVersion - Version number of the database
 * @return {object} Database instance with addCost and getReport methods
 */
window.db.openCostsDB = function(databaseName, databaseVersion) {
    // Create database instance
    const dbInstance = new window.db.Database(databaseName);
    
    // Initialize storage if it doesn't exist
    if (!localStorage.getItem(dbInstance.storageKey)) {
        localStorage.setItem(dbInstance.storageKey, JSON.stringify({
            version: databaseVersion,
            costs: []
        }));
    }
    
    /*
     * Add a new cost item to the database
     * @param {object} cost - Object with sum, currency, category, description
     * @return {object} The newly added cost item with date
    */
    dbInstance.addCost = function(cost) {
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
    };
    
    /*
     * Generate a report for a specific month and year in a selected currency
     * @param {string} currency - Currency code (USD, GBP, EURO, ILS)
     * @param {number} year - Year (optional, defaults to current year)
     * @param {number} month - Month 1-12 (optional, defaults to current month)
     * @return {object} Report object with costs array and total
     */
    dbInstance.getReport = function(currency, year, month) {
        // Use current date if year and month not provided
        const now = new Date();
        const reportYear = year || now.getFullYear();
        const reportMonth = month || (now.getMonth() + 1);
        
        // Retrieve all costs from storage
        const dbData = JSON.parse(localStorage.getItem(this.storageKey));
        const allCosts = dbData.costs || [];
        
        // Filter costs by target month and year
        const filteredCosts = allCosts.filter(function(cost) {
            const costDate = new Date(cost.date);
            return costDate.getFullYear() === reportYear && 
                   (costDate.getMonth() + 1) === reportMonth;
        });
        
        // Format costs for report output (include original currency, day only)
        const reportCosts = filteredCosts.map(function(cost) {
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
    };
    
    return dbInstance;
};

/*
 * Global reference to the last opened database instance
 * This allows getReport to be called on window.db directly
 */
window.db._currentInstance = null;

/*
 * Get report from the current/last opened database
 * This static method allows calling db.getReport() directly
 * @param {string} currency - Currency code (USD, GBP, EURO, ILS)
 * @param {number} year - Year (optional, defaults to current year)
 * @param {number} month - Month 1-12 (optional, defaults to current month)
 * @return {object} Report object with costs array and total
 */
window.db.getReport = function(currency, year, month) {
    // Use the last opened database instance
    if (window.db._currentInstance && window.db._currentInstance.getReport) {
        return window.db._currentInstance.getReport(currency, year, month);
    }
    
    // Return empty report if no database opened
    const now = new Date();
    return {
        year: year || now.getFullYear(),
        month: month || (now.getMonth() + 1),
        costs: [],
        total: { currency: currency, sum: 0 }
    };
};

// Update openCostsDB to store reference to current instance
window.db._originalOpenCostsDB = window.db.openCostsDB;
window.db.openCostsDB = function(databaseName, databaseVersion) {
    const instance = window.db._originalOpenCostsDB(databaseName, databaseVersion);
    window.db._currentInstance = instance;
    return instance;
};
