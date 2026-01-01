# 🎓 SENSOR CALIBRATION PORTAL - COMPLETE BEGINNER'S GUIDE

## 📚 TABLE OF CONTENTS
1. [Project Overview](#project-overview)
2. [File Extensions Explained](#file-extensions-explained)
3. [Project Structure](#project-structure)
4. [Backend Explained](#backend-explained)
5. [Frontend Explained](#frontend-explained)
6. [Database Explained](#database-explained)
7. [How Everything Works Together](#how-everything-works-together)
8. [API Routes Reference](#api-routes-reference)

---

## 🎯 PROJECT OVERVIEW

### What is this project?
This is a **web application** for storing and managing sensor calibration reports. Think of it like a digital filing cabinet where scientists can create, store, and retrieve calibration reports for oceanographic sensors.

### The Three Main Parts (Like a Restaurant Analogy):

1. **Frontend (React)** = The Dining Room
   - What customers (users) see and interact with
   - Beautiful menus (web pages), buttons, forms
   - Built with React (JavaScript library)

2. **Backend (Express/Node.js)** = The Kitchen
   - Where the actual work happens
   - Receives orders (requests) from the dining room
   - Prepares data and sends it back
   - Built with Express (Node.js framework)

3. **Database (PostgreSQL)** = The Storage Room
   - Where all the ingredients (data) are stored
   - Organized in shelves (tables)
   - Keeps everything safe and organized

---

## 📝 FILE EXTENSIONS EXPLAINED

### `.js` - JavaScript Files
- **What it is**: Code that makes things interactive and dynamic
- **Used in**: Both frontend and backend
- **Example**: `server.js`, `App.js`
- **Analogy**: Like a recipe that tells the computer what to do step-by-step

### `.jsx` - JavaScript + XML (React Components)
- **What it is**: JavaScript + HTML-like syntax for building UI
- **Used in**: Frontend only (React components)
- **Example**: Component files (though we use `.js` extension for them too)
- **Analogy**: Like a recipe that also describes what the dish should look like

### `.json` - JavaScript Object Notation
- **What it is**: A format for storing and transmitting data
- **Used in**: Configuration files
- **Example**: `package.json` (lists all dependencies/libraries)
- **Analogy**: Like a shopping list - just data, no instructions

### `.sql` - Structured Query Language
- **What it is**: Language for talking to databases
- **Used in**: Database schema and queries
- **Example**: `schema.sql`
- **Analogy**: Like commands you give to a librarian to organize books

### `.css` - Cascading Style Sheets
- **What it is**: Styling rules for how things look
- **Used in**: Frontend
- **Example**: `index.css`
- **Analogy**: Like interior decoration instructions

### `.env` - Environment Variables
- **What it is**: Secret configuration (passwords, API keys)
- **Used in**: Backend
- **Not committed to Git** (security!)
- **Analogy**: Like your personal diary - private information

### `.md` - Markdown
- **What it is**: Simple text formatting for documentation
- **Used in**: Documentation files
- **Example**: `README.md`, this file!
- **Analogy**: Like a formatted text document

---

## 📂 PROJECT STRUCTURE

```
sensor_calibration_v2/
│
├── backend/                      # The "Kitchen" - Server-side code
│   ├── config/                   # Configuration files
│   │   └── database.js          # Database connection setup
│   │
│   ├── routes/                   # API endpoints (like menu items)
│   │   ├── personnel.js         # Handles personnel data
│   │   ├── sensors.js           # Handles sensor data
│   │   ├── equipment.js         # Handles equipment data
│   │   └── reports.js           # Handles calibration reports (MAIN)
│   │
│   ├── server.js                 # Main server file (starts everything)
│   ├── package.json              # Lists all libraries needed
│   └── .env                      # Secret configuration (not in Git)
│
├── frontend/                     # The "Dining Room" - User interface
│   ├── public/                   # Static files
│   │   └── index.html           # The main HTML page
│   │
│   ├── src/                      # Source code
│   │   ├── components/          # Reusable UI pieces
│   │   │   └── report/          # Report wizard pages (5 pages)
│   │   │       ├── Page1SensorUnderTest.js
│   │   │       ├── Page2TestEquipment.js
│   │   │       ├── Page3CalibrationSheet.js
│   │   │       ├── Page4NewCoefficients.js
│   │   │       └── Page5Conclusions.js
│   │   │
│   │   ├── pages/               # Full page components
│   │   │   ├── Home.js          # Home/dashboard
│   │   │   ├── ReportWizard.js  # Main wizard orchestrator
│   │   │   ├── ReportsList.js   # List all reports
│   │   │   ├── SensorsList.js   # Manage sensors
│   │   │   ├── PersonnelList.js # Manage personnel
│   │   │   └── EquipmentList.js # Manage equipment
│   │   │
│   │   ├── services/            # Communication with backend
│   │   │   └── api.js           # All API calls
│   │   │
│   │   ├── App.js               # Main app component (routing)
│   │   ├── index.js             # Entry point
│   │   └── index.css            # Styles
│   │
│   └── package.json             # Lists all libraries needed
│
├── database/                     # The "Storage Room" - Database setup
│   └── schema.sql               # Database structure definition
│
├── .gitignore                    # Files to NOT commit to GitHub
└── README.md                     # Project overview

```

---

## 🍳 BACKEND EXPLAINED

### What is Node.js?
- **JavaScript runtime** that lets you run JavaScript on the server (not just in browsers)
- **Analogy**: Like having a JavaScript interpreter installed on your computer

### What is Express?
- **Web framework** built on Node.js
- Makes it easy to create web servers and APIs
- **Analogy**: Like a toolkit for building restaurants - provides tables, menus, order systems

### Key Backend Files:

#### 1. `server.js` - The Main Server

**Purpose**: Starts the server and connects all routes

```javascript
// Simplified version with explanations

const express = require('express');  // Import Express framework
const app = express();               // Create a new app

// Middleware (like restaurant staff that processes requests)
app.use(cors());                     // Allows frontend to talk to backend
app.use(bodyParser.json());          // Understands JSON data

// Connect route handlers (like different sections of the menu)
app.use('/api/personnel', personnelRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/reports', reportsRoutes);

// Start the server on port 5000
app.listen(5000);
```

**How it works**:
1. Server starts and listens on port 5000
2. When a request comes in (e.g., `GET /api/sensors`), it matches the URL to a route
3. The appropriate route handler processes the request
4. Sends back a response (data or error)

---

#### 2. `config/database.js` - Database Connection

**Purpose**: Creates a connection pool to PostgreSQL

```javascript
// What is a connection pool?
// Instead of opening/closing database connection for every request (slow),
// we keep 10-20 connections open and reuse them (fast!)

const pool = new Pool({
  host: 'localhost',      // Where is the database? (your computer)
  port: 5432,             // Which door? (PostgreSQL default port)
  database: 'sensor_cal', // Which database?
  user: 'postgres',       // Who are you?
  password: 'secret',     // Prove it!
});

// Export so other files can use it
module.exports = { pool };
```

**Real-world analogy**: 
- Without pool: Dial a phone number, have conversation, hang up, repeat
- With pool: Keep 10 phone lines open, use whichever is free, keep them open

---

#### 3. `routes/reports.js` - Main Report Handling

This is the **MOST IMPORTANT** backend file. It handles all report operations.

##### **GET /api/reports** - Get all reports

```javascript
router.get('/', async (req, res) => {
  // Query database for all reports
  const result = await db.query('SELECT * FROM calibration_reports');
  
  // Send back the results as JSON
  res.json(result.rows);
});
```

**What happens**:
1. Frontend sends: `GET http://localhost:5000/api/reports`
2. Backend queries database
3. Database returns array of report objects
4. Backend sends JSON response to frontend

---

##### **POST /api/reports** - Create new report

```javascript
router.post('/', async (req, res) => {
  const { report_number, sensor_id, ... } = req.body;  // Extract data from request
  
  await client.query('BEGIN');  // Start a transaction (all or nothing)
  
  // Insert report into database
  const result = await client.query(
    'INSERT INTO calibration_reports (...) VALUES ($1, $2, ...)',
    [report_number, sensor_id, ...]
  );
  
  await client.query('COMMIT');  // Confirm the changes
  res.status(201).json(result.rows[0]);  // Send back the created report
});
```

**Why transactions?**
- A report has MULTIPLE parts (main data + measurements)
- If creating measurements fails, we don't want a half-saved report
- Transaction ensures: either EVERYTHING saves or NOTHING saves

**Real-world analogy**: Like buying multiple items at a store - if your card is declined, you don't leave with some items

---

##### **PUT /api/reports/:id** - Update existing report

```javascript
router.put('/:id', async (req, res) => {
  const { id } = req.params;  // Get ID from URL (/api/reports/123)
  const { report_number, ... } = req.body;  // Get new data
  
  await client.query('UPDATE calibration_reports SET ... WHERE id = $1', [..., id]);
  
  res.json(updatedReport);
});
```

---

##### **DELETE /api/reports/:id** - Delete report

```javascript
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.query('DELETE FROM calibration_reports WHERE id = $1', [id]);
  res.status(204).send();  // 204 = success, no content to return
});
```

---

#### 4. Other Route Files

**`routes/sensors.js`**: CRUD operations for sensors
**`routes/personnel.js`**: CRUD operations for personnel
**`routes/equipment.js`**: CRUD operations for test equipment

All follow the same pattern:
- GET / → List all
- GET /:id → Get one
- POST / → Create new
- PUT /:id → Update
- DELETE /:id → Delete

---

## 🎨 FRONTEND EXPLAINED

### What is React?
- **JavaScript library** for building user interfaces
- Creates reusable **components** (like Lego blocks)
- **Analogy**: Like building a house with pre-made rooms that you can rearrange

### Key Concepts:

#### **Components**
- Self-contained pieces of UI (button, form, page, etc.)
- Can be reused multiple times
- **Example**: A button component can be used everywhere

#### **State**
- Data that can change and causes re-render
- **Example**: Form inputs, loading status, error messages
- **Analogy**: Like variables that trigger updates when they change

#### **Props**
- Data passed FROM parent TO child components
- **Example**: Parent passes report data to child page
- **Analogy**: Like handing your kid their lunch box in the morning

---

### Key Frontend Files:

#### 1. `index.js` - Entry Point

```javascript
// This is the FIRST file that runs
ReactDOM.render(<App />, document.getElementById('root'));
```

**What it does**:
1. Finds the `<div id="root">` in `index.html`
2. Puts your entire React app inside it

---

#### 2. `App.js` - Main App & Routing

```javascript
function App() {
  return (
    <Router>
      <nav>...</nav>  {/* Navigation menu */}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reports" element={<ReportsList />} />
        <Route path="/reports/new" element={<ReportWizard />} />
        <Route path="/sensors" element={<SensorsList />} />
        ...
      </Routes>
    </Router>
  );
}
```

**What is routing?**
- Shows different pages based on the URL
- `/reports` → shows reports list
- `/reports/new` → shows report wizard
- **Analogy**: Like a GPS that shows different screens based on where you are

---

#### 3. `services/api.js` - Communication Layer

This file has all the functions to talk to the backend.

```javascript
// Base URL for all API calls
const API_BASE_URL = 'http://localhost:5000/api';

// Reports API - all functions for handling reports
export const reportsAPI = {
  // Get all reports
  getAll: () => axios.get(`${API_BASE_URL}/reports`),
  
  // Get one report by ID
  getById: (id) => axios.get(`${API_BASE_URL}/reports/${id}`),
  
  // Create new report
  create: (data) => axios.post(`${API_BASE_URL}/reports`, data),
  
  // Update existing report
  update: (id, data) => axios.put(`${API_BASE_URL}/reports/${id}`, data),
  
  // Delete report
  delete: (id) => axios.delete(`${API_BASE_URL}/reports/${id}`)
};
```

**What is axios?**
- Library for making HTTP requests (talking to backend)
- Returns **promises** (asynchronous operations)
- **Analogy**: Like a messenger that carries letters between frontend and backend

---

#### 4. `pages/ReportWizard.js` - The Main Orchestrator

This is the **MOST IMPORTANT** frontend file. It manages the 5-page wizard.

```javascript
function ReportWizard() {
  // STATE: Current page number (1-5)
  const [currentPage, setCurrentPage] = useState(1);
  
  // STATE: All report data collected from all pages
  const [reportData, setReportData] = useState({
    report_number: '',
    sensor_id: '',
    // ... 50+ fields
  });
  
  // FUNCTION: Save report (draft or final)
  const handleSave = async (isDraft) => {
    const dataToSave = { ...reportData, status: isDraft ? 'draft' : 'completed' };
    await reportsAPI.create(dataToSave);  // Send to backend
    navigate('/reports');  // Go back to list
  };
  
  // FUNCTION: Update a specific field in report data
  const updateReportData = (field, value) => {
    setReportData(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <div>
      {/* Show different page component based on currentPage */}
      {currentPage === 1 && <Page1 reportData={reportData} updateReportData={updateReportData} />}
      {currentPage === 2 && <Page2 reportData={reportData} updateReportData={updateReportData} />}
      {currentPage === 3 && <Page3 reportData={reportData} updateReportData={updateReportData} />}
      {currentPage === 4 && <Page4 reportData={reportData} updateReportData={updateReportData} />}
      {currentPage === 5 && <Page5 reportData={reportData} updateReportData={updateReportData} />}
      
      {/* Navigation buttons */}
      <button onClick={() => setCurrentPage(prev => prev - 1)}>Previous</button>
      <button onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
      <button onClick={() => handleSave(true)}>Save as Draft</button>
      <button onClick={() => handleSave(false)}>Complete Report</button>
    </div>
  );
}
```

**How it works**:
1. Wizard maintains ALL data in `reportData` state
2. Each page gets the data and an update function
3. When user fills a field, it calls `updateReportData('field_name', value)`
4. When user clicks "Save", it sends all data to backend at once
5. Backend saves to database

**Analogy**: Like filling out a multi-page paper form:
- You keep all pages together (reportData)
- You can flip between pages (currentPage)
- You can go back and change previous pages
- When done, you submit the whole thing at once

---

#### 5. Page Components (5 files)

Each page component receives:
- `reportData`: Current data (to show in form fields)
- `updateReportData`: Function to update data

##### **Page1SensorUnderTest.js**
- Select sensor from dropdown
- Select authors (checkboxes)
- Enter report number, test date, etc.

##### **Page2TestEquipment.js**
- Add equipment used in calibration
- Each equipment can have notes specific to this report
- Uses `selected_equipment` array

##### **Page3CalibrationSheet.js**
- "As Received" calibration data
- Ambient conditions
- Measurement table
- **Paste functionality**: Copy from Excel/PDF, paste all at once

##### **Page4NewCoefficients.js**
- New calibration coefficients (after calibration)
- New measurement table
- Same paste functionality

##### **Page5Conclusions.js**
- Final conclusions text
- References
- Summary

---

## 🗄️ DATABASE EXPLAINED

### What is PostgreSQL?
- **Relational database** - stores data in tables with relationships
- **Analogy**: Like Excel spreadsheets that can reference each other

### Key Concepts:

#### **Tables**
- Like spreadsheets with rows and columns
- Each row = one record (e.g., one sensor, one report)

#### **Columns**
- Properties of the record
- Each column has a **data type** (text, number, date, etc.)

#### **Primary Key (PK)**
- Unique identifier for each row
- Usually an auto-incrementing integer (1, 2, 3, ...)
- **Analogy**: Like a student ID number - unique to each person

#### **Foreign Key (FK)**
- Reference to another table's primary key
- Creates relationships between tables
- **Example**: A report has a `sensor_id` that points to the `sensors` table

---

### Database Schema (`database/schema.sql`)

#### Table 1: **personnel**
```sql
CREATE TABLE personnel (
    id SERIAL PRIMARY KEY,        -- Auto-incrementing ID
    name VARCHAR(200) NOT NULL,   -- Person's name (required)
    role VARCHAR(100),            -- Job role
    email VARCHAR(200),           -- Email address
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- When added
);
```

**What it stores**: Scientists, technicians who write reports

---

#### Table 2: **sensors**
```sql
CREATE TABLE sensors (
    id SERIAL PRIMARY KEY,
    instrument_type VARCHAR(100),  -- e.g., "CTD"
    serial_number VARCHAR(100) UNIQUE,  -- Unique serial number
    manufacturer VARCHAR(200),     -- Who made it
    model VARCHAR(100),            -- Model number
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**What it stores**: Sensors that get calibrated

---

#### Table 3: **test_equipment**
```sql
CREATE TABLE test_equipment (
    id SERIAL PRIMARY KEY,
    instrument VARCHAR(200),       -- Equipment name
    model VARCHAR(100),            -- Model
    serial_number VARCHAR(100),    -- Serial number
    last_calibration_date DATE,    -- When was it last calibrated
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**What it stores**: Equipment used FOR calibration (salinometer, thermometer, etc.)

---

#### Table 4: **calibration_reports** (MAIN TABLE)
```sql
CREATE TABLE calibration_reports (
    id SERIAL PRIMARY KEY,
    report_number VARCHAR(50) UNIQUE,  -- Report ID (e.g., "CAL-2024-001")
    sensor_id INTEGER REFERENCES sensors(id),  -- Which sensor (FK)
    test_date DATE,                    -- When calibrated
    created_by INTEGER REFERENCES personnel(id),  -- Who created (FK)
    authors INTEGER[],                 -- Array of personnel IDs
    lab_unit VARCHAR(200),             -- Lab name
    equipment_ids INTEGER[],           -- Array of equipment IDs used
    equipment_details JSONB,           -- Equipment with report-specific notes
    
    -- Page 3 data
    page3_test_date DATE,
    page3_ambient_temp DECIMAL(5,2),
    page3_relative_humidity DECIMAL(5,2),
    page3_atmospheric_pressure DECIMAL(6,1),
    page3_as_received_g TEXT,
    page3_as_received_h TEXT,
    page3_as_received_i TEXT,
    page3_as_received_j TEXT,
    page3_as_received_cpcor TEXT,
    page3_as_received_ctcor TEXT,
    page3_formula_text TEXT,
    page3_accuracy_note TEXT,
    page3_table_legend TEXT,
    
    -- Page 4 data
    page4_new_g TEXT,
    page4_new_h TEXT,
    page4_new_i TEXT,
    page4_new_j TEXT,
    page4_new_cpcor TEXT,
    page4_new_ctcor TEXT,
    page4_formula_text TEXT,
    page4_accuracy_note TEXT,
    page4_table_legend TEXT,
    
    -- Page 5 data
    conclusions TEXT,
    "references" TEXT,              -- Quoted because "references" is SQL keyword
    
    status VARCHAR(20) DEFAULT 'draft',  -- 'draft' or 'completed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**What it stores**: Complete calibration reports with all 5 pages of data

**Why JSONB for equipment_details?**
- JSONB = JSON stored in binary format (fast)
- Stores equipment array with notes: `[{id: 1, notes: "Used at 25°C"}, ...]`
- Flexible - can add properties without changing schema

---

#### Table 5: **report_measurements**
```sql
CREATE TABLE report_measurements (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES calibration_reports(id) ON DELETE CASCADE,
    page_number INTEGER,           -- 3 or 4
    row_order INTEGER,             -- Order in table (1, 2, 3, ...)
    inst_temp TEXT,                -- Instrument temperature
    reference_conductivity TEXT,   -- Reference conductivity
    inst_freq TEXT,                -- Instrument frequency
    predicted_conductivity TEXT,   -- Predicted conductivity
    residual TEXT                  -- Residual
);
```

**What it stores**: Measurement tables from Page 3 and Page 4

**Why separate table?**
- Reports can have variable number of measurements (10, 20, 50 rows)
- Can't store variable rows in a single column
- Separate table allows unlimited rows per report

**ON DELETE CASCADE**: If report is deleted, delete its measurements automatically

---

## 🔄 HOW EVERYTHING WORKS TOGETHER

### Complete Flow: Creating a New Report

#### Step 1: User Opens Report Wizard
```
User clicks "New Report" → Frontend navigates to /reports/new
```

#### Step 2: Wizard Loads Master Data
```javascript
// ReportWizard.js - useEffect runs when component mounts
useEffect(() => {
  // Fetch sensors from backend
  sensorsAPI.getAll().then(response => setSensors(response.data));
  
  // Fetch equipment from backend
  equipmentAPI.getAll().then(response => setEquipment(response.data));
  
  // Fetch personnel from backend
  personnelAPI.getAll().then(response => setPersonnel(response.data));
}, []);
```

**What happens**:
1. Frontend sends 3 GET requests to backend
2. Backend queries database for each
3. Backend returns data as JSON
4. Frontend stores in state variables
5. Dropdowns/lists populate with this data

---

#### Step 3: User Fills Out Page 1
```
User selects sensor → updateReportData('sensor_id', 5)
User enters report number → updateReportData('report_number', 'CAL-2024-001')
User checks author checkboxes → updateReportData('authors', [1, 3, 5])
```

**What happens**:
- Each change updates `reportData` state in `ReportWizard`
- React re-renders to show updated values
- Data stays in browser memory (not saved yet)

---

#### Step 4: User Navigates Through Pages
```
User clicks "Next" → setCurrentPage(2)
```

**What happens**:
- Current page component unmounts
- Next page component mounts
- Data persists in `ReportWizard` state

---

#### Step 5: User Pastes Measurement Data (Page 3)
```javascript
// User copies from Excel: 5 columns x 10 rows
// User clicks "Paste from Excel/PDF"
// User pastes in text area
// User clicks "Apply"

const handlePasteFromExcel = () => {
  const rows = pasteText.split('\n');  // Split by newlines (rows)
  const measurements = rows.map(row => {
    const cols = row.includes('\t') ? row.split('\t') : row.split(/\s+/);
    return {
      inst_temp: cols[0],
      reference_conductivity: cols[1],
      inst_freq: cols[2],
      predicted_conductivity: cols[3],
      residual: cols[4]
    };
  });
  updateReportData('page3_measurements', measurements);
};
```

**What happens**:
1. Splits pasted text by newlines → gets rows
2. For each row, splits by tabs or spaces → gets columns
3. Creates array of measurement objects
4. Updates reportData

---

#### Step 6: User Clicks "Save as Draft"
```javascript
const handleSave = async (isDraft = true) => {
  // Prepare data
  const dataToSave = { 
    ...reportData,  // All 50+ fields
    status: isDraft ? 'draft' : 'completed' 
  };
  
  // Send to backend
  await reportsAPI.create(dataToSave);
  
  // Navigate back to list
  navigate('/reports');
};
```

**What happens**:
1. Collects ALL data from all pages
2. Sends POST request to backend: `POST /api/reports`
3. Request body contains entire report as JSON

---

#### Step 7: Backend Receives Request
```javascript
// routes/reports.js
router.post('/', async (req, res) => {
  const { report_number, sensor_id, ... } = req.body;  // Extract 50+ fields
  
  // Convert empty strings to null for integer fields
  const sensorId = sensor_id || null;
  const createdBy = created_by || null;
  
  // Start transaction
  await client.query('BEGIN');
  
  try {
    // Insert main report
    const reportResult = await client.query(
      'INSERT INTO calibration_reports (...) VALUES ($1, $2, ..., $35)',
      [report_number, sensorId, ..., status]
    );
    
    const reportId = reportResult.rows[0].id;
    
    // Insert page 3 measurements
    for (let i = 0; i < page3_measurements.length; i++) {
      await client.query(
        'INSERT INTO report_measurements (...) VALUES ($1, 3, $2, ...)',
        [reportId, i + 1, m.inst_temp, ...]
      );
    }
    
    // Insert page 4 measurements
    for (let i = 0; i < page4_measurements.length; i++) {
      await client.query(
        'INSERT INTO report_measurements (...) VALUES ($1, 4, $2, ...)',
        [reportId, i + 1, m.inst_temp, ...]
      );
    }
    
    // Commit transaction
    await client.query('COMMIT');
    
    // Send success response
    res.status(201).json(reportResult.rows[0]);
  } catch (err) {
    // If anything fails, rollback everything
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  }
});
```

**What happens**:
1. Extracts all fields from request body
2. Starts database transaction (all-or-nothing)
3. Inserts report into `calibration_reports` table
4. Gets the new report's ID
5. Loops through page 3 measurements, inserting each
6. Loops through page 4 measurements, inserting each
7. Commits transaction (makes all changes permanent)
8. Sends back the created report

**Why transaction?**
- If measurements fail to insert, we don't want orphaned report
- Transaction ensures data consistency

---

#### Step 8: Frontend Receives Response
```javascript
// If successful (status 201)
navigate('/reports');  // Go to reports list

// If error (status 500)
setError(err.response.data.error);  // Show error message
```

---

#### Step 9: Reports List Loads
```javascript
// ReportsList.js
useEffect(() => {
  reportsAPI.getAll().then(response => {
    setReports(response.data);
  });
}, []);
```

**What happens**:
1. Frontend sends: `GET /api/reports`
2. Backend queries: `SELECT * FROM calibration_reports`
3. Backend sends array of all reports
4. Frontend displays in table

---

## 📡 API ROUTES REFERENCE

### Complete REST API Endpoints

#### **Personnel Routes** (`/api/personnel`)
| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|--------------|----------|
| GET | `/api/personnel` | Get all personnel | - | Array of personnel |
| GET | `/api/personnel/:id` | Get one person | - | Personnel object |
| POST | `/api/personnel` | Create person | `{name, role, email}` | Created personnel |
| PUT | `/api/personnel/:id` | Update person | `{name, role, email}` | Updated personnel |
| DELETE | `/api/personnel/:id` | Delete person | - | 204 No Content |

---

#### **Sensors Routes** (`/api/sensors`)
| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|--------------|----------|
| GET | `/api/sensors` | Get all sensors | - | Array of sensors |
| GET | `/api/sensors/:id` | Get one sensor | - | Sensor object |
| POST | `/api/sensors` | Create sensor | `{instrument_type, serial_number, manufacturer, model}` | Created sensor |
| PUT | `/api/sensors/:id` | Update sensor | `{instrument_type, serial_number, manufacturer, model}` | Updated sensor |
| DELETE | `/api/sensors/:id` | Delete sensor | - | 204 No Content |

---

#### **Equipment Routes** (`/api/equipment`)
| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|--------------|----------|
| GET | `/api/equipment` | Get all equipment | - | Array of equipment |
| GET | `/api/equipment/:id` | Get one equipment | - | Equipment object |
| POST | `/api/equipment` | Create equipment | `{instrument, model, serial_number, last_calibration_date}` | Created equipment |
| PUT | `/api/equipment/:id` | Update equipment | `{instrument, model, serial_number, last_calibration_date}` | Updated equipment |
| DELETE | `/api/equipment/:id` | Delete equipment | - | 204 No Content |

---

#### **Reports Routes** (`/api/reports`)
| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|--------------|----------|
| GET | `/api/reports` | Get all reports | - | Array of reports |
| GET | `/api/reports/:id` | Get one report with measurements | - | Report object + measurements |
| POST | `/api/reports` | Create report | Full report object (50+ fields) | Created report |
| PUT | `/api/reports/:id` | Update report | Full report object | Updated report |
| DELETE | `/api/reports/:id` | Delete report | - | 204 No Content |

**Report object structure**:
```json
{
  "report_number": "CAL-2024-001",
  "sensor_id": 5,
  "test_date": "2024-12-31",
  "created_by": 1,
  "authors": [1, 3, 5],
  "lab_unit": "Marine Calibrations Unit",
  "equipment_ids": [1, 2, 3],
  "selected_equipment": [
    {"id": 1, "instrument": "Salinometer", "model": "8400B", "serial_number": "123", "notes": "Used at 25°C"},
    {"id": 2, "instrument": "Thermometer", "model": "5628", "serial_number": "456", "notes": ""}
  ],
  "conductivity_testing_level": "1",
  "uncertainty": "0.00033 S/m",
  "page3_test_date": "2024-12-31",
  "page3_ambient_temp": "24.00",
  "page3_relative_humidity": "51.00",
  "page3_atmospheric_pressure": "980.5",
  "page3_as_received_g": "-1.00736605e+01",
  "page3_as_received_h": "1.65890031e+00",
  "page3_as_received_i": "-1.36088992e-03",
  "page3_as_received_j": "1.92261776e-04",
  "page3_as_received_cpcor": "-9.57e-08",
  "page3_as_received_ctcor": "3.25e-06",
  "page3_formula_text": "...",
  "page3_accuracy_note": "...",
  "page3_table_legend": "...",
  "page3_measurements": [
    {
      "inst_temp": "24.5910",
      "reference_conductivity": "0.00000",
      "inst_freq": "2465.86",
      "predicted_conductivity": "-0.00001",
      "residual": "-0.00001"
    }
  ],
  "page4_new_g": "-1.00569479e+01",
  "page4_new_h": "1.65208431e+00",
  "page4_new_i": "7.09556299e-04",
  "page4_new_j": "2.37463502e-05",
  "page4_new_cpcor": "-9.57e-08",
  "page4_new_ctcor": "3.25e-06",
  "page4_formula_text": "...",
  "page4_accuracy_note": "...",
  "page4_table_legend": "...",
  "page4_measurements": [...],
  "conclusions": "The sensor meets specifications...",
  "references": "Gerin, R. and Savonitto, G. (2024)...",
  "status": "draft"
}
```

---

## 🔍 DEBUGGING TIPS

### Frontend Issues

**React Dev Tools** (Chrome extension):
- See component tree
- Inspect props and state
- See what data each component has

**Browser Console** (F12):
- See console.log() outputs
- See JavaScript errors
- See network requests

**Network Tab** (F12):
- See all API calls
- Check request/response data
- See status codes (200 OK, 500 Error, etc.)

---

### Backend Issues

**Check Terminal Output**:
- See console.log() and console.error()
- See database errors
- See which routes are being hit

**Common Errors**:
- `invalid input syntax for type integer: ""` → Empty string sent for integer field (use `|| null`)
- `column does not exist` → Typo in column name or wrong table
- `duplicate key value` → Trying to insert duplicate in UNIQUE column
- `foreign key violation` → Referenced ID doesn't exist (e.g., sensor_id = 999 but no sensor #999)

---

## 🎓 LEARNING PATH

### If you want to learn more:

1. **JavaScript Basics**
   - Variables, functions, arrays, objects
   - Async/await, promises
   - Resource: MDN Web Docs

2. **React**
   - Components, props, state
   - Hooks (useState, useEffect)
   - Resource: React official docs

3. **Node.js & Express**
   - Creating servers
   - Routing, middleware
   - Resource: Express official docs

4. **SQL & PostgreSQL**
   - SELECT, INSERT, UPDATE, DELETE
   - Joins, foreign keys
   - Resource: PostgreSQL tutorial

5. **REST APIs**
   - HTTP methods (GET, POST, PUT, DELETE)
   - Status codes
   - JSON format

---

## 🚀 NEXT STEPS

### Features to add:
- **PDF generation**: Export reports as PDF
- **Search & filters**: Find reports by date, sensor, status
- **User authentication**: Login/logout
- **Email notifications**: When report is completed
- **Charts**: Visualize measurement data
- **File uploads**: Attach supporting documents

### Improvements:
- **Validation**: Check required fields before saving
- **Error handling**: Better error messages
- **Loading states**: Show spinners while loading
- **Responsive design**: Work on mobile devices
- **Testing**: Unit tests, integration tests

---

## 📞 SUMMARY

**The Big Picture**:
1. **Frontend (React)** displays forms and sends data
2. **Backend (Express)** receives requests and processes them
3. **Database (PostgreSQL)** stores all data permanently

**Data Flow**:
```
User fills form → React state updates → User clicks save → 
POST /api/reports → Backend receives JSON → 
Backend inserts to database → Database returns created record → 
Backend sends response → Frontend navigates to list → 
GET /api/reports → Backend queries database → 
Backend returns array → Frontend displays table
```

**Key Files**:
- Backend: `server.js`, `routes/reports.js`, `config/database.js`
- Frontend: `App.js`, `ReportWizard.js`, `services/api.js`, 5 page components
- Database: `schema.sql`

**Remember**:
- Frontend = What users see
- Backend = Business logic
- Database = Data storage
- API = Communication between frontend and backend
- REST = Standard way of designing APIs

---

Hope this helps! 🎉
