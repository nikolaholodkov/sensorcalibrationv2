import React, { useState } from 'react';

function Page2TestEquipment({ reportData, updateReportData, equipment, viewMode = false }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedEquipId, setSelectedEquipId] = useState('');
  const [equipmentNote, setEquipmentNote] = useState('');

  const selectedEquipment = reportData.selected_equipment || [];

  const addEquipment = () => {
    if (!selectedEquipId) return;

    const equip = equipment.find(e => e.id === parseInt(selectedEquipId));
    if (!equip) return;

    const newEquipment = {
      id: equip.id,
      instrument: equip.instrument,
      model: equip.model,
      serial_number: equip.serial_number,
      notes: equipmentNote
    };

    updateReportData('selected_equipment', [...selectedEquipment, newEquipment]);
    updateReportData('equipment_ids', [...(reportData.equipment_ids || []), equip.id]);

    // Reset form
    setSelectedEquipId('');
    setEquipmentNote('');
    setShowAddForm(false);
  };

  const removeEquipment = (index) => {
    const newSelectedEquipment = selectedEquipment.filter((_, i) => i !== index);
    const newEquipmentIds = newSelectedEquipment.map(e => e.id);
    updateReportData('selected_equipment', newSelectedEquipment);
    updateReportData('equipment_ids', newEquipmentIds);
  };

  const updateEquipmentNote = (index, note) => {
    const newSelectedEquipment = [...selectedEquipment];
    newSelectedEquipment[index].notes = note;
    updateReportData('selected_equipment', newSelectedEquipment);
  };

  return (
    <div>
      <h3>Page 2: Test Equipment</h3>
      
      <div className="form-group">
        <label>Test Equipment Used *</label>
        
        {selectedEquipment.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <table>
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Model</th>
                  <th>Serial Number</th>
                  <th>Notes (for this report)</th>
                  {!viewMode && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {selectedEquipment.map((equip, index) => (
                  <tr key={index}>
                    <td>{equip.instrument}</td>
                    <td>{equip.model || 'N/A'}</td>
                    <td>{equip.serial_number || 'N/A'}</td>
                    <td>
                      <textarea
                        value={equip.notes || ''}
                        onChange={(e) => updateEquipmentNote(index, e.target.value)}
                        rows="2"
                        style={{ width: '100%', padding: '0.5rem' }}
                        placeholder="Optional notes for this equipment in this report"
                        disabled={viewMode}
                      />
                    </td>
                    {!viewMode && (
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger"
                          style={{ padding: '0.5rem 1rem' }}
                          onClick={() => removeEquipment(index)}
                        >
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!showAddForm && !viewMode ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
            style={{ marginTop: '1rem' }}
          >
            Add Equipment
          </button>
        ) : showAddForm ? (
          <div style={{ marginTop: '1rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h4>Add Equipment</h4>
            
            <div className="form-group">
              <label>Select Equipment</label>
              <select
                value={selectedEquipId}
                onChange={(e) => setSelectedEquipId(e.target.value)}
              >
                <option value="">-- Choose equipment --</option>
                {equipment
                  .filter(e => !selectedEquipment.find(se => se.id === e.id))
                  .map(equip => (
                    <option key={equip.id} value={equip.id}>
                      {equip.instrument} - {equip.model} ({equip.serial_number})
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label>Notes (Optional - specific to this report)</label>
              <textarea
                value={equipmentNote}
                onChange={(e) => setEquipmentNote(e.target.value)}
                rows="3"
                placeholder="e.g., Calibration bath filled with 50 L of natural seawater..."
              />
            </div>

            <div className="btn-group">
              <button
                type="button"
                className="btn btn-primary"
                onClick={addEquipment}
                disabled={!selectedEquipId}
              >
                Add
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedEquipId('');
                  setEquipmentNote('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="form-group" style={{ marginTop: '2rem' }}>
        <label>Conductivity Testing Level</label>
        <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
          Editable text box (default is "1")
        </p>
        <input
          type="text"
          value={reportData.conductivity_testing_level}
          onChange={(e) => updateReportData('conductivity_testing_level', e.target.value)}
          disabled={viewMode}
        />
      </div>

      <div className="form-group">
        <label>Uncertainty</label>
        <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
          Editable text box with default value
        </p>
        <textarea
          value={reportData.uncertainty}
          onChange={(e) => updateReportData('uncertainty', e.target.value)}
          rows="3"
          disabled={viewMode}
        />
      </div>

      {selectedEquipment.length === 0 && !viewMode && (
        <div style={{ padding: '1rem', background: '#fff3cd', borderRadius: '4px', marginTop: '1rem' }}>
          <strong>Note:</strong> Please add at least one piece of test equipment.
        </div>
      )}

      <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Footnotes</h4>
      <div className="form-group">
        <textarea
          value={reportData.page2_footnotes || ''}
          onChange={(e) => updateReportData('page2_footnotes', e.target.value)}
          rows="3"
          placeholder="Optional footnotes for this page..."
          disabled={viewMode}
        />
      </div>
    </div>
  );
}

export default Page2TestEquipment;
