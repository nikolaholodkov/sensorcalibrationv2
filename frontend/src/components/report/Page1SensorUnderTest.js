import React, { useEffect } from 'react';
import { sensorsAPI } from '../../services/api';

function Page1SensorUnderTest({ reportData, updateReportData, sensors, personnel, viewMode = false }) {
  const selectedSensor = sensors.find(s => s.id === reportData.sensor_id);

  const handleAuthorToggle = (authorName) => {
    const authors = reportData.authors || [];
    if (authors.includes(authorName)) {
      updateReportData('authors', authors.filter(a => a !== authorName));
    } else {
      updateReportData('authors', [...authors, authorName]);
    }
  };

  // Load previous calibration coefficients when sensor is selected
  useEffect(() => {
    if (reportData.sensor_id && !reportData.page3_as_received_g) {
      loadPreviousCalibration();
    }
  }, [reportData.sensor_id]);

  const loadPreviousCalibration = async () => {
    try {
      const response = await sensorsAPI.getLastCalibration(reportData.sensor_id);
      const lastCal = response.data;
      
      // Load previous "new" coefficients as "as received" for this report
      updateReportData('page3_as_received_g', lastCal.page4_new_g || '');
      updateReportData('page3_as_received_h', lastCal.page4_new_h || '');
      updateReportData('page3_as_received_i', lastCal.page4_new_i || '');
      updateReportData('page3_as_received_j', lastCal.page4_new_j || '');
      updateReportData('page3_as_received_cpcor', lastCal.page4_new_cpcor || '');
      updateReportData('page3_as_received_ctcor', lastCal.page4_new_ctcor || '');
    } catch (err) {
      // No previous calibration found, that's okay
      console.log('No previous calibration found');
    }
  };

  return (
    <div>
      <h3>Page 1: Sensor Under Test</h3>
      
      <div className="form-group">
        <label>Report Number</label>
        <input
          type="text"
          value={reportData.report_number}
          onChange={(e) => updateReportData('report_number', e.target.value)}
          placeholder="e.g., 2024/67"
          disabled={viewMode}
        />
      </div>

      <div className="form-group">
        <label>Select Sensor *</label>
        <select
          value={reportData.sensor_id}
          onChange={(e) => updateReportData('sensor_id', parseInt(e.target.value))}
          required
          disabled={viewMode}
        >
          <option value="">-- Select a sensor --</option>
          {sensors.map(sensor => (
            <option key={sensor.id} value={sensor.id}>
              {sensor.sensor_name} (S/N: {sensor.serial_number})
            </option>
          ))}
        </select>
      </div>

      {selectedSensor && (
        <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '4px', marginBottom: '1rem' }}>
          <h4>Selected Sensor Details</h4>
          <p><strong>Sensor Name:</strong> {selectedSensor.sensor_name}</p>
          <p><strong>Serial Number:</strong> {selectedSensor.serial_number}</p>
          <p><strong>Model:</strong> {selectedSensor.model}</p>
          <p><strong>Property Of:</strong> {selectedSensor.property_of}</p>
        </div>
      )}

      <div className="form-group">
        <label>Test Date *</label>
        <input
          type="date"
          value={reportData.test_date}
          onChange={(e) => updateReportData('test_date', e.target.value)}
          required
          disabled={viewMode}
        />
      </div>

      <div className="form-group">
        <label>Authors (Select one or more) *</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
          {personnel.map(person => (
            <label key={person.id} style={{ display: 'flex', alignItems: 'center', padding: '0.5rem', background: '#f8f9fa', borderRadius: '4px', cursor: viewMode ? 'default' : 'pointer' }}>
              <input
                type="checkbox"
                checked={(reportData.authors || []).includes(person.name)}
                onChange={() => handleAuthorToggle(person.name)}
                style={{ marginRight: '0.5rem' }}
                disabled={viewMode}
              />
              <span>{person.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Lab Unit</label>
        <input
          type="text"
          value={reportData.lab_unit}
          onChange={(e) => updateReportData('lab_unit', e.target.value)}
          disabled={viewMode}
        />
      </div>

      <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Footnotes</h4>
      <div className="form-group">
        <textarea
          value={reportData.page1_footnotes || ''}
          onChange={(e) => updateReportData('page1_footnotes', e.target.value)}
          rows="3"
          placeholder="Optional footnotes for this page..."
          disabled={viewMode}
        />
      </div>
    </div>
  );
}

export default Page1SensorUnderTest;
