# OGS Sensor Calibration Portal

A comprehensive web application for managing sensor calibration reports at the Marine Calibrations & Metrology Unit of OGS (Istituto Nazionale di Oceanografia e di Geofiscia Sperimentale).

## Features

- **5-Page Report Wizard**: Mimics the structure of standard calibration reports
- **Master Data Management**: Manage sensors, test equipment, and personnel
- **Automatic Data Loading**: Previous calibration coefficients automatically populate new reports
- **Excel Integration**: Paste measurement data directly from Excel spreadsheets
- **Editable Templates**: Pre-filled text fields with customization options
- **Draft & Complete**: Save reports as drafts or mark them as completed

## Technology Stack

- **Backend**: Node.js with Express
- **Frontend**: React
- **Database**: PostgreSQL
- **API**: RESTful API with JSON

## Project Structure

```
sensor_calibration_v2/
├── backend/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── routes/
│   │   ├── personnel.js         # Personnel CRUD endpoints
│   │   ├── sensors.js           # Sensors CRUD endpoints
│   │   ├── equipment.js         # Equipment CRUD endpoints
│   │   └── reports.js           # Reports CRUD endpoints
│   ├── .env.example             # Environment variables template
│   ├── package.json
│   └── server.js                # Express server
├── database/
│   └── schema.sql               # PostgreSQL database schema
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── report/
│   │   │       ├── Page1SensorUnderTest.js
│   │   │       ├── Page2TestEquipment.js
│   │   │       ├── Page3CalibrationSheet.js
│   │   │       ├── Page4NewCoefficients.js
│   │   │       └── Page5Conclusions.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── PersonnelList.js
│   │   │   ├── SensorsList.js
│   │   │   ├── EquipmentList.js
│   │   │   ├── ReportsList.js
│   │   │   └── ReportWizard.js
│   │   ├── services/
│   │   │   └── api.js           # API client
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Database Setup

1. Create a PostgreSQL database:
```powershell
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE sensor_calibration;

# Exit psql
\q
```

2. Import the database schema:
```powershell
psql -U postgres -d sensor_calibration -f database/schema.sql
```

### 2. Backend Setup

1. Navigate to the backend directory:
```powershell
cd backend
```

2. Install dependencies:
```powershell
npm install
```

3. Create environment file:
```powershell
cp .env.example .env
```

4. Edit `.env` file with your database credentials:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sensor_calibration
DB_USER=postgres
DB_PASSWORD=your_password_here

PORT=5000
NODE_ENV=development

FRONTEND_URL=http://localhost:3000
```

5. Start the backend server:
```powershell
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

1. Navigate to the frontend directory:
```powershell
cd frontend
```

2. Install dependencies:
```powershell
npm install
```

3. Start the React development server:
```powershell
npm start
```

The frontend will run on `http://localhost:3000`

## Usage Guide

### Managing Master Data

Before creating reports, populate the master data:

1. **Personnel**: Add lab staff and authors who will appear on reports
2. **Sensors**: Add sensors that will be calibrated
3. **Test Equipment**: Add calibration equipment used in the process

### Creating a Calibration Report

1. Click "Create New Report" from the home page or reports list
2. Navigate through the 5-page wizard:

   **Page 1: Sensor Under Test**
   - Select sensor from dropdown
   - Choose test date
   - Select authors
   - Specify lab unit

   **Page 2: Test Equipment**
   - Select equipment used (multiple selection)
   - Edit conductivity testing level (default: "1")
   - Edit uncertainty text

   **Page 3: As Received Calibration**
   - Enter ambient conditions (temp, humidity, pressure)
   - View/edit "as received" coefficients (auto-loaded from previous calibration)
   - Edit formula text
   - Add measurement data:
     - Paste directly from Excel (Ctrl+V on table)
     - Or add rows manually
   - Edit table legend and accuracy note

   **Page 4: New Coefficients**
   - Enter new calibration coefficients (g, h, i, j, CPcor, CTcor)
   - Edit formula text
   - Add measurement data for new coefficients
   - Edit table legend and accuracy note

   **Page 5: Conclusions**
   - Write conclusions about the calibration
   - Edit references
   - Review report summary

3. Save as draft or complete the report

### Pasting Data from Excel

When on Page 3 or Page 4:
1. Copy data from Excel (select cells with 5 columns: Inst Temp, Reference, Inst Freq, Predicted, Residual)
2. Click in the measurement table area
3. Press Ctrl+V to paste
4. Data will automatically populate the table rows

## API Endpoints

### Personnel
- `GET /api/personnel` - Get all personnel
- `GET /api/personnel/:id` - Get single person
- `POST /api/personnel` - Create new person
- `PUT /api/personnel/:id` - Update person
- `DELETE /api/personnel/:id` - Delete person

### Sensors
- `GET /api/sensors` - Get all sensors
- `GET /api/sensors/:id` - Get single sensor
- `GET /api/sensors/:id/last-calibration` - Get last calibration coefficients
- `POST /api/sensors` - Create new sensor
- `PUT /api/sensors/:id` - Update sensor
- `DELETE /api/sensors/:id` - Delete sensor

### Equipment
- `GET /api/equipment` - Get all equipment
- `GET /api/equipment/:id` - Get single equipment
- `POST /api/equipment/batch` - Get multiple equipment by IDs
- `POST /api/equipment` - Create new equipment
- `PUT /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment

### Reports
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get single report with all details
- `POST /api/reports` - Create new report
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report

## Database Schema

The database consists of 5 main tables:

1. **personnel**: Lab staff and report authors
2. **sensors**: Sensors being calibrated
3. **test_equipment**: Calibration equipment
4. **calibration_reports**: Main report data (all 5 pages)
5. **report_measurements**: Measurement data for pages 3 and 4

## Development

### Running in Development Mode

Backend (with auto-reload):
```powershell
cd backend
npm run dev
```

Frontend (with hot-reload):
```powershell
cd frontend
npm start
```

### Building for Production

Frontend:
```powershell
cd frontend
npm run build
```

This creates an optimized production build in the `build/` directory.

## Notes

- Default values are pre-populated for common fields (testing level, uncertainty, references)
- All editable text boxes allow customization while maintaining defaults
- Previous calibration coefficients automatically load when selecting a sensor
- Reports can be saved as drafts and edited later
- Excel paste functionality supports tab-delimited data

## Support

For issues or questions, contact the Marine Calibrations & Metrology Unit at OGS.

## License

Internal use only - OGS (Istituto Nazionale di Oceanografia e di Geofisica Sperimentale)
