# Cost Manager - Front End Development Project

A full-stack cost management application built with React and Node.js, allowing users to track expenses, view reports, and analyze spending with currency conversion support.

## 🚀 Features

- **Add Cost Items** - Record expenses with amount, currency, category, and description
- **Monthly Reports** - View detailed cost breakdowns for any month and year
- **Visual Charts** - 
  - Pie chart showing costs by category
  - Bar chart showing monthly cost trends
- **Multi-Currency Support** - USD, GBP, EURO, ILS with real-time conversion
- **Exchange Rate Management** - Use default rates or set custom exchange rate API
- **Data Persistence** - All data stored in browser's localStorage
- **Responsive UI** - Desktop-compatible interface built with React and Material-UI

## 📋 Project Structure

```
Cost Manager/
├── client/                      # React Frontend
│   ├── src/
│   │   ├── App.js              # Main component with navigation
│   │   ├── pages/
│   │   │   ├── AddCost.js       # Cost entry form
│   │   │   ├── Reports.js       # Report display with charts
│   │   │   └── Settings.js      # Exchange rate configuration
│   │   ├── components/
│   │   │   └── Charts/
│   │   │       ├── PieChart.js  # Category breakdown visualization
│   │   │       └── BarChart.js  # Monthly costs visualization
│   │   └── services/
│   │       ├── db.js            # React-compatible database wrapper
│   │       └── exchangeRateService.js  # Currency conversion logic
│   ├── public/
│   │   ├── db.js                # Vanilla JS database library
│   │   ├── test-db.html         # db.js test file
│   │   └── index.html           # HTML template
│   ├── build/                   # Production build (generated)
│   └── package.json
│
├── server/                      # Node.js Backend
│   ├── index.js                 # Express API server
│   ├── public/
│   │   └── exchange-rates.json  # Static exchange rates
│   └── package.json
│
├── .gitignore                   # Git ignore rules
├── README.md                    # This file
```

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.5 - UI library
- **Material-UI** 9.0.0 - Component library
- **D3.js** 7.9.0 - Data visualization
- **JavaScript (ES6)** - Vanilla & modules

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **CORS** - Cross-origin support

### Database
- **localStorage** - Client-side persistence (no backend DB needed)

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Cost Manager"
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

3. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

## 🚀 Running Locally

### Start Backend Server
```bash
cd server
npm start
```
Backend runs on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd client
npm start
```
Frontend runs on `http://localhost:3001`

### Run Tests
```bash
cd client
npm test
```

Or open `client/public/test-db.html` in browser to test db.js library.

## 📖 Usage

### Adding Costs
1. Click "Add Cost" tab
2. Enter amount, select currency, choose category
3. Add description and click "Add Item"
4. Cost is automatically saved with today's date

### Viewing Reports
1. Click "Reports" tab
2. Select month, year, and currency
3. View pie chart (costs by category) and bar chart (monthly trends)
4. Charts automatically update with currency conversion

### Configuring Exchange Rates
1. Click "Settings" tab
2. Enter custom exchange rate URL (optional)
3. URL should return JSON: `{"USD":1, "GBP":0.74, "EURO":0.86, "ILS":2.91}`
4. Click "Save & Verify" to test the URL
5. Leave empty to use default rates

## 🏗️ Building for Production

### Build Frontend
```bash
cd client
npm run build
```
Creates optimized bundle in `client/build/`

### Build Backend
No build needed - runs directly with Node.js

## 🌐 Deployment

### Quick Deploy to Render.com

**Backend:**
1. Go to [render.com](https://render.com)
2. Create new "Web Service"
3. Upload `server/` folder
4. Set start command: `npm start`
5. Get your backend URL

**Frontend:**
1. Create new "Static Site"
2. Upload `client/build/` folder
3. Get your frontend URL


## 📚 API Reference

### db.js Library Functions

#### `openCostsDB(databaseName, databaseVersion)`
Opens or creates a cost database.
```javascript
const db = window.db.openCostsDB("costsdb", 1);
```

#### `addCost(cost)`
Adds a new cost item.
```javascript
db.addCost({
  sum: 150,
  currency: "USD",
  category: "Food",
  description: "Lunch"
});
```

#### `getReport(currency, year, month)`
Returns costs for specified period in selected currency.
```javascript
const report = db.getReport("USD", 2026, 5);
// Returns:
// {
//   year: 2026,
//   month: 5,
//   costs: [...],
//   total: { currency: "USD", sum: 1500 }
// }
```

### Exchange Rate API

**GET** `/api/exchange-rates`
```json
{
  "USD": 1,
  "GBP": 0.74,
  "EURO": 0.86,
  "ILS": 2.92
}
```

## 🧪 Testing

All tests pass successfully:
- ✅ Database creation
- ✅ Cost addition
- ✅ Report generation
- ✅ Currency conversion

Run test page: Open `client/public/test-db.html` in browser

## 📝 Code Style

- **Comments**: C-style (`/* */`) and C++ style (`//`)
- **Naming**: camelCase for variables and functions
- **Indentation**: 4 spaces
- **Format**: Follows Professional JavaScript Style Guide

## 🔒 Security Notes

- No sensitive data stored (all in localStorage)
- CORS enabled for development (`*`)
- No authentication/authorization (suitable for personal use)
- Exchange rates fetched over HTTP (consider HTTPS for production)

## 📄 License

This project is developed as a final project for front-end development course.

## 👥 Team Information

- **Team Manager**: [Name]
- **Team Members**: [Names]

## 🚀 Getting Started

```bash
# Clone repo
git clone <repository-url>
cd "Cost Manager"

# Install dependencies
cd client && npm install && cd ..
cd server && npm install && cd ..

# Run locally
# Terminal 1: Backend
cd server && npm start

# Terminal 2: Frontend
cd client && npm start

# Visit http://localhost:3001
```

Enjoy managing your costs! 💰
