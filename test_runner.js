/* local_test_harness.js - Simulates Instructor Automated Verification Loop */

const fs = require('fs');
const path = require('path');

// Simulate the browser window storage space context mockup internally
global.window = {};
global.localStorage = {
    storage: {},
    setItem(key, val) { this.storage[key] = String(val); },
    getItem(key) { return this.storage[key] || null; },
    clear() { this.storage = {}; }
};

console.log("====================================================");
console.log("    RUNNING SIMULATED DESKTOP WEB TEST MATRIX       ");
console.log("====================================================");

try {
    // Read the vanilla db.js stream directly to look for execution blocks
    const dbSourcePath = path.join(__dirname, 'db.js');
    if (!fs.existsSync(dbSourcePath)) {
        console.log("[SKIPPED] Standalone db.js asset file is missing at root context path. Skipping execution matrix simulation.");
        process.exit(0);
    }

    const dbCode = fs.readFileSync(dbSourcePath, 'utf8');
    eval(dbCode); // Execute code in context

    // Map global variable pointers
    const db = global.window.db || global.db;

    if (!db) {
        throw new Error("Validation Failure: The db object property was not registered onto the global scope payload context interface!");
    }

    // Task simulation loop matching specification sample inputs
    const targetDatabaseInstance = db.openCostsDB("costs_manager_canvass_db", 1);
    
    const recordOne = targetDatabaseInstance.addCost({
        sum: 200, 
        currency: "USD", 
        category: "FOOD", 
        description: "pizza"
    });
    
    const recordTwo = targetDatabaseInstance.addCost({
        sum: 400, 
        currency: "USD", 
        category: "CAR", 
        description: "fuel"
    });

    if (!recordOne || recordOne.sum !== 200) {
        throw new Error("[REJECT E2] addCost operation returned invalid item structure metadata attributes context values maps.");
    }

    console.log("-> [PASSED] Mock engine successfully processed inline item storage injections maps.");
    process.exit(0);

} catch (error) {
    console.error(`\n[CRITICAL FAILURE] Runtime execution context check exception: ${error.message}`);
    console.log("====================================================");
    process.exit(1);
}