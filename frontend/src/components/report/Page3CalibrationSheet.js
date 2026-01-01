import React, { useState } from 'react';

function Page3CalibrationSheet({ reportData, updateReportData }) {
  const measurements = reportData.page3_measurements || [];
  const [showPasteArea, setShowPasteArea] = useState(false);
  const [pasteText, setPasteText] = useState('');

  const addMeasurementRow = () => {
    const newMeasurements = [...measurements, {
      inst_temp: '',
      reference_conductivity: '',
      inst_freq: '',
      predicted_conductivity: '',
      residual: ''
    }];
    updateReportData('page3_measurements', newMeasurements);
  };

  const removeMeasurementRow = (index) => {
    const newMeasurements = measurements.filter((_, i) => i !== index);
    updateReportData('page3_measurements', newMeasurements);
  };

  const updateMeasurement = (index, field, value) => {
    const newMeasurements = [...measurements];
    newMeasurements[index][field] = value;
    updateReportData('page3_measurements', newMeasurements);
  };

  const handlePasteFromExcel = () => {
    if (!pasteText.trim()) return;
    
    const rows = pasteText.trim().split('\n');
    const newMeasurements = rows.map(row => {
      // Split by tab first (Excel), then by multiple spaces (PDF)
      const cols = row.includes('\t') ? row.split('\t') : row.split(/\s+/);
      return {
        inst_temp: cols[0]?.trim() || '',
        reference_conductivity: cols[1]?.trim() || '',
        inst_freq: cols[2]?.trim() || '',
        predicted_conductivity: cols[3]?.trim() || '',
        residual: cols[4]?.trim() || ''
      };
    });
    
    updateReportData('page3_measurements', newMeasurements);
    setPasteText('');
    setShowPasteArea(false);
  };

  return (
    <div>
      <h3>Page 3: Sensor Calibration Sheet (As Received)</h3>
      
      <div className="form-row">
        <div className="form-group">
          <label>Test Date</label>
          <input
            type="date"
            value={reportData.page3_test_date}
            onChange={(e) => updateReportData('page3_test_date', e.target.value)}
          />
        </div>
      </div>

      <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Ambient Conditions</h4>
      <div className="form-row">
        <div className="form-group">
          <label>Temperature (°C)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="number"
              step="0.01"
              value={reportData.page3_ambient_temp}
              onChange={(e) => updateReportData('page3_ambient_temp', e.target.value)}
              placeholder="e.g., 24.00"
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: '0.9rem' }}>±</span>
            <input
              type="number"
              step="0.01"
              value={reportData.page3_ambient_temp_uncertainty || ''}
              onChange={(e) => updateReportData('page3_ambient_temp_uncertainty', e.target.value)}
              placeholder="0.5"
              style={{ width: '80px' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Relative Humidity (%)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="number"
              step="0.01"
              value={reportData.page3_relative_humidity}
              onChange={(e) => updateReportData('page3_relative_humidity', e.target.value)}
              placeholder="e.g., 51.00"
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: '0.9rem' }}>±</span>
            <input
              type="number"
              step="0.01"
              value={reportData.page3_relative_humidity_uncertainty || ''}
              onChange={(e) => updateReportData('page3_relative_humidity_uncertainty', e.target.value)}
              placeholder="2.0"
              style={{ width: '80px' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Atmospheric Pressure (hPa)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="number"
              step="0.1"
              value={reportData.page3_atmospheric_pressure}
              onChange={(e) => updateReportData('page3_atmospheric_pressure', e.target.value)}
              placeholder="e.g., 980.5"
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: '0.9rem' }}>±</span>
            <input
              type="number"
              step="0.1"
              value={reportData.page3_atmospheric_pressure_uncertainty || ''}
              onChange={(e) => updateReportData('page3_atmospheric_pressure_uncertainty', e.target.value)}
              placeholder="1.0"
              style={{ width: '80px' }}
            />
          </div>
        </div>
      </div>

      <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>"As Received" Conductivity Calibration Coefficients</h4>
      <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1rem' }}>
        These values are automatically loaded from the previous calibration report
      </p>
      
      <div className="form-row">
        <div className="form-group">
          <label>g</label>
          <input
            type="text"
            value={reportData.page3_as_received_g}
            onChange={(e) => updateReportData('page3_as_received_g', e.target.value)}
            placeholder="e.g., -1.00736605e+01"
          />
        </div>

        <div className="form-group">
          <label>h</label>
          <input
            type="text"
            value={reportData.page3_as_received_h}
            onChange={(e) => updateReportData('page3_as_received_h', e.target.value)}
            placeholder="e.g., 1.65890031e+00"
          />
        </div>

        <div className="form-group">
          <label>i</label>
          <input
            type="text"
            value={reportData.page3_as_received_i}
            onChange={(e) => updateReportData('page3_as_received_i', e.target.value)}
            placeholder="e.g., -1.36088992e-03"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>j</label>
          <input
            type="text"
            value={reportData.page3_as_received_j}
            onChange={(e) => updateReportData('page3_as_received_j', e.target.value)}
            placeholder="e.g., 1.92261776e-04"
          />
        </div>

        <div className="form-group">
          <label>CPcor</label>
          <input
            type="text"
            value={reportData.page3_as_received_cpcor}
            onChange={(e) => updateReportData('page3_as_received_cpcor', e.target.value)}
            placeholder="e.g., -9.57e-08"
          />
        </div>

        <div className="form-group">
          <label>CTcor</label>
          <input
            type="text"
            value={reportData.page3_as_received_ctcor}
            onChange={(e) => updateReportData('page3_as_received_ctcor', e.target.value)}
            placeholder="e.g., 3.25e-06"
          />
        </div>
      </div>

      <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Formula (Editable)</h4>
      <div className="form-group">
        <textarea
          value={reportData.page3_formula_text}
          onChange={(e) => updateReportData('page3_formula_text', e.target.value)}
          rows="4"
          style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
        />
      </div>

      <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Measurement Data Table</h4>
      
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button 
          onClick={addMeasurementRow} 
          style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          + Add Row
        </button>
        <button 
          onClick={() => setShowPasteArea(!showPasteArea)} 
          style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          📋 Paste from Excel/PDF
        </button>
      </div>

      {showPasteArea && (
        <div style={{ marginBottom: '1rem', padding: '15px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '4px' }}>
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
            Paste your data here:
          </p>
          <p style={{ margin: '0 0 10px 0', fontSize: '0.875rem', color: '#666' }}>
            Copy 5 columns from Excel/PDF: Inst Temp, Reference Conductivity, Inst Freq, Predicted Conductivity, Residual
          </p>
          <textarea
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Paste your table data here..."
            style={{ width: '100%', minHeight: '120px', padding: '10px', fontFamily: 'monospace', fontSize: '0.9rem', border: '1px solid #ced4da', borderRadius: '4px' }}
          />
          <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
            <button 
              onClick={handlePasteFromExcel} 
              style={{ padding: '6px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Apply
            </button>
            <button 
              onClick={() => { setPasteText(''); setShowPasteArea(false); }} 
              style={{ padding: '6px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Inst Temp (°C)</th>
              <th>Reference (S/m)</th>
              <th>Inst Freq (Hz)</th>
              <th>Predicted (S/m)</th>
              <th>Residual (S/m)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {measurements.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>
                  No measurements yet. Click "Add Row" or paste from Excel.
                </td>
              </tr>
            ) : (
              measurements.map((m, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={m.inst_temp}
                      onChange={(e) => updateMeasurement(index, 'inst_temp', e.target.value)}
                      style={{ width: '100%', padding: '0.25rem' }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={m.reference_conductivity}
                      onChange={(e) => updateMeasurement(index, 'reference_conductivity', e.target.value)}
                      style={{ width: '100%', padding: '0.25rem' }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={m.inst_freq}
                      onChange={(e) => updateMeasurement(index, 'inst_freq', e.target.value)}
                      style={{ width: '100%', padding: '0.25rem' }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={m.predicted_conductivity}
                      onChange={(e) => updateMeasurement(index, 'predicted_conductivity', e.target.value)}
                      style={{ width: '100%', padding: '0.25rem' }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={m.residual}
                      onChange={(e) => updateMeasurement(index, 'residual', e.target.value)}
                      style={{ width: '100%', padding: '0.25rem' }}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger"
                      style={{ padding: '0.25rem 0.5rem' }}
                      onClick={() => removeMeasurementRow(index)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        className="btn btn-primary"
        onClick={addMeasurementRow}
        style={{ marginTop: '1rem' }}
      >
        Add Row
      </button>

      <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Accuracy Note (Editable)</h4>
      <div className="form-group">
        <textarea
          value={reportData.page3_accuracy_note}
          onChange={(e) => updateReportData('page3_accuracy_note', e.target.value)}
          rows="2"
        />
      </div>

      <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Table Legend (Editable)</h4>
      <div className="form-group">
        <textarea
          value={reportData.page3_table_legend}
          onChange={(e) => updateReportData('page3_table_legend', e.target.value)}
          rows="8"
        />
      </div>
    </div>
  );
}

export default Page3CalibrationSheet;
