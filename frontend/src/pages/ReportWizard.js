import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { reportsAPI, sensorsAPI, equipmentAPI, personnelAPI } from '../services/api';
import Page1SensorUnderTest from '../components/report/Page1SensorUnderTest';
import Page2TestEquipment from '../components/report/Page2TestEquipment';
import Page3CalibrationSheet from '../components/report/Page3CalibrationSheet';
import Page4NewCoefficients from '../components/report/Page4NewCoefficients';
import Page5Conclusions from '../components/report/Page5Conclusions';

function ReportWizard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showCalibrationPrompt, setShowCalibrationPrompt] = useState(false);
  const [needsCalibration, setNeedsCalibration] = useState(true);

  // Master data
  const [sensors, setSensors] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [personnel, setPersonnel] = useState([]);

  // Report data
  const [reportData, setReportData] = useState({
    report_number: '',
    sensor_id: '',
    test_date: new Date().toISOString().split('T')[0],
    created_by: '',
    authors: [],
    lab_unit: 'Marine Calibrations & Metrology Unit',
    
    // Page 2
    equipment_ids: [],
    selected_equipment: [], // Array of equipment objects with notes for this report
    conductivity_testing_level: '1',
    uncertainty: 'Expanded Measurement Uncertainty (95% level of confidence; k = 2) for conductivity: 0.00033 S/m (Gerin and Savonitto, 2024).',
    
    // Page 3
    page3_test_date: new Date().toISOString().split('T')[0],
    page3_ambient_temp: '',
    page3_relative_humidity: '',
    page3_atmospheric_pressure: '',
    page3_as_received_g: '',
    page3_as_received_h: '',
    page3_as_received_i: '',
    page3_as_received_j: '',
    page3_as_received_cpcor: '',
    page3_as_received_ctcor: '',
    page3_formula_text: `f = Inst Freq [kHz]
t = ITS-90 Temperature [°C]; p = pressure [decibars] = 0; α = CTcor; β = CPcor
Conductivity = (g + hf² + if³ + jf⁴) / [10(1 + αt + βp)] [S/m]`,
    page3_accuracy_note: '§Accuracy declared by the Manufacturer = ±0.0003 S/m.',
    page3_table_legend: `where:
Inst Temp = the temperature (°C, ITS-90) of the seawater filling the bath as read by the instrument's temperature sensor at the reference set-point conductivity;
Reference = the set-point conductivity (S/m) of the bath seawater, measured using the laboratory salinometer;
Inst Freq = the instrument output frequency (Hz) at the reference set-point conductivity;
Predicted = the bath set-point conductivity (S/m), as computed by the instrument using the new calibration coefficients;
Predicted-Reference = the conductivity residual (S/m), i.e. the difference between the "Predicted" and "Reference" set-point conductivities`,
    page3_measurements: [],
    
    // Page 4
    page4_new_g: '',
    page4_new_h: '',
    page4_new_i: '',
    page4_new_j: '',
    page4_new_cpcor: '',
    page4_new_ctcor: '',
    page4_formula_text: `f = Inst Freq [kHz]
t = ITS-90 Temperature [°C]; p = pressure [decibars] = 0; α = CTcor; β = CPcor
Conductivity = (g + hf² + if³ + jf⁴) / [10(1 + αt + βp)] [S/m]`,
    page4_accuracy_note: '§Accuracy declared by the Manufacturer = ±0.0003 S/m.',
    page4_table_legend: `where:
Inst Temp = the temperature (°C, ITS-90) of the seawater filling the bath as read by the instrument's temperature sensor at the reference set-point conductivity;
Reference = the set-point conductivity (S/m) of the bath seawater, measured using the laboratory salinometer;
Inst Freq = the instrument output frequency (Hz) at the reference set-point conductivity;
Predicted = the bath set-point conductivity (S/m), as computed by the instrument using the new calibration coefficients;
Predicted-Reference = the conductivity residual (S/m), i.e. the difference between the "Predicted" and "Reference" set-point conductivities`,
    page4_measurements: [],
    
    // Page 5
    conclusions: '',
    references: 'Gerin R. and Savonitto G. (2024). Uncertainty estimate associated with the measurement of ITS-90 temperature and conductivity at the Oceanographic Calibration and Metrology Center (CTMO) of OGS Rel. OGS 2024, Trieste, Italy, 7 pp.',
    status: 'draft'
  });

  useEffect(() => {
    fetchMasterData();
    if (isEditMode) {
      fetchReport();
    }
  }, [id]);

  const fetchMasterData = async () => {
    try {
      const [sensorsRes, equipmentRes, personnelRes] = await Promise.all([
        sensorsAPI.getAll(),
        equipmentAPI.getAll(),
        personnelAPI.getAll()
      ]);
      setSensors(sensorsRes.data);
      setEquipment(equipmentRes.data);
      setPersonnel(personnelRes.data);
    } catch (err) {
      setError('Failed to fetch master data');
      console.error(err);
    }
  };

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await reportsAPI.getById(id);
      setReportData(response.data);
    } catch (err) {
      setError('Failed to fetch report');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    // Show calibration prompt when moving from page 3 to page 4
    if (currentPage === 3) {
      setShowCalibrationPrompt(true);
      return;
    }
    
    if (currentPage < 5) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleCalibrationResponse = (needsNewCalibration) => {
    setNeedsCalibration(needsNewCalibration);
    setShowCalibrationPrompt(false);
    
    if (needsNewCalibration) {
      // Go to page 4 for new coefficients
      setCurrentPage(4);
    } else {
      // Skip to page 5, keeping old coefficients
      // Copy page 3 coefficients to page 4
      updateReportData('page4_new_g', reportData.page3_as_received_g);
      updateReportData('page4_new_h', reportData.page3_as_received_h);
      updateReportData('page4_new_i', reportData.page3_as_received_i);
      updateReportData('page4_new_j', reportData.page3_as_received_j);
      updateReportData('page4_new_cpcor', reportData.page3_as_received_cpcor);
      updateReportData('page4_new_ctcor', reportData.page3_as_received_ctcor);
      updateReportData('page4_measurements', reportData.page3_measurements);
      setCurrentPage(5);
    }
    window.scrollTo(0, 0);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSave = async (isDraft = true) => {
    try {
      setLoading(true);
      setError(null);
      const dataToSave = { ...reportData, status: isDraft ? 'draft' : 'completed' };
      
      if (isEditMode) {
        await reportsAPI.update(id, dataToSave);
        setSuccess('Report updated successfully!');
      } else {
        await reportsAPI.create(dataToSave);
        setSuccess('Report created successfully!');
      }
      
      setTimeout(() => {
        navigate('/reports');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save report');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateReportData = (field, value) => {
    setReportData(prev => ({ ...prev, [field]: value }));
  };

  const pages = [
    { number: 1, label: 'Sensor Under Test' },
    { number: 2, label: 'Test Equipment' },
    { number: 3, label: 'As Received Data' },
    { number: 4, label: 'New Coefficients', skip: !needsCalibration },
    { number: 5, label: 'Conclusions' }
  ];

  if (loading && isEditMode) {
    return <div className="container"><div className="loading">Loading report...</div></div>;
  }

  return (
    <div className="container">
      <div className="wizard-container">
        <h2>{isEditMode ? 'Edit Calibration Report' : 'New Calibration Report'}</h2>
        
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {/* Calibration Needed Prompt */}
        {showCalibrationPrompt && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '8px',
              maxWidth: '500px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '1rem', color: '#003366' }}>Calibration Needed?</h3>
              <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
                Does this sensor need new calibration coefficients, or should we keep the existing ones from the previous calibration?
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleCalibrationResponse(false)}
                >
                  No - Keep Existing Coefficients
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleCalibrationResponse(true)}
                >
                  Yes - Enter New Coefficients
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        <div className="wizard-progress">
          {pages.map((page) => (
            <div
              key={page.number}
              className={`wizard-step ${currentPage === page.number ? 'active' : ''} ${currentPage > page.number ? 'completed' : ''}`}
            >
              <div className="wizard-step-number">{page.number}</div>
              <div className="wizard-step-label">{page.label}</div>
            </div>
          ))}
        </div>

        {/* Page content */}
        <div className="wizard-content">
          {currentPage === 1 && (
            <Page1SensorUnderTest
              reportData={reportData}
              updateReportData={updateReportData}
              sensors={sensors}
              personnel={personnel}
            />
          )}
          
          {currentPage === 2 && (
            <Page2TestEquipment
              reportData={reportData}
              updateReportData={updateReportData}
              equipment={equipment}
            />
          )}
          
          {currentPage === 3 && (
            <Page3CalibrationSheet
              reportData={reportData}
              updateReportData={updateReportData}
              sensors={sensors}
            />
          )}
          
          {currentPage === 4 && (
            <Page4NewCoefficients
              reportData={reportData}
              updateReportData={updateReportData}
            />
          )}
          
          {currentPage === 5 && (
            <Page5Conclusions
              reportData={reportData}
              updateReportData={updateReportData}
            />
          )}
        </div>

        {/* Navigation buttons */}
        <div className="wizard-buttons">
          <div>
            {currentPage > 1 && (
              <button className="btn btn-secondary" onClick={handlePrevious} disabled={loading}>
                Previous
              </button>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => handleSave(true)} disabled={loading}>
              Save as Draft
            </button>
            
            {currentPage < 5 ? (
              <button className="btn btn-primary" onClick={handleNext} disabled={loading}>
                Next
              </button>
            ) : (
              <button className="btn btn-success" onClick={() => handleSave(false)} disabled={loading}>
                Complete Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportWizard;
