import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import PersonnelList from './pages/PersonnelList';
import SensorsList from './pages/SensorsList';
import EquipmentList from './pages/EquipmentList';
import ReportsList from './pages/ReportsList';
import ReportWizard from './pages/ReportWizard';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="navbar-content">
            <h1>OGS Sensor Calibration Portal</h1>
            <nav>
              <Link to="/">Home</Link>
              <Link to="/sensors">Sensors</Link>
              <Link to="/equipment">Equipment</Link>
              <Link to="/personnel">Personnel</Link>
              <Link to="/reports">Reports</Link>
            </nav>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/personnel" element={<PersonnelList />} />
          <Route path="/sensors" element={<SensorsList />} />
          <Route path="/equipment" element={<EquipmentList />} />
          <Route path="/reports" element={<ReportsList />} />
          <Route path="/reports/new" element={<ReportWizard />} />
          <Route path="/reports/edit/:id" element={<ReportWizard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
