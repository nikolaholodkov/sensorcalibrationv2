import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container">
      <div className="card">
        <h2>Welcome to OGS Sensor Calibration Portal</h2>
        <p>Manage sensor calibration reports for the Marine Calibrations & Metrology Unit</p>
      </div>
      
      <div className="home-grid">
        <Link to="/reports/new" className="home-card">
          <h3>Create New Report</h3>
          <p>Start a new sensor calibration report with the 5-page wizard</p>
        </Link>
        
        <Link to="/reports" className="home-card">
          <h3>View Reports</h3>
          <p>Browse and manage existing calibration reports</p>
        </Link>
        
        <Link to="/sensors" className="home-card">
          <h3>Manage Sensors</h3>
          <p>Add, edit, and view sensor information</p>
        </Link>
        
        <Link to="/equipment" className="home-card">
          <h3>Test Equipment</h3>
          <p>Manage calibration test equipment database</p>
        </Link>
        
        <Link to="/personnel" className="home-card">
          <h3>Personnel</h3>
          <p>Manage laboratory staff and authors</p>
        </Link>
      </div>
    </div>
  );
}

export default Home;
