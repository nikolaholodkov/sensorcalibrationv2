import React, { useState, useEffect } from 'react';
import { equipmentAPI } from '../services/api';

function EquipmentList() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    instrument: '',
    model: '',
    serial_number: '',
    notes: '',
    equipment_type: ''
  });

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await equipmentAPI.getAll();
      setEquipment(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch equipment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await equipmentAPI.update(editingId, formData);
      } else {
        await equipmentAPI.create(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ instrument: '', model: '', serial_number: '', notes: '', equipment_type: '' });
      fetchEquipment();
    } catch (err) {
      setError('Failed to save equipment');
      console.error(err);
    }
  };

  const handleEdit = (equip) => {
    setEditingId(equip.id);
    setFormData({
      instrument: equip.instrument,
      model: equip.model || '',
      serial_number: equip.serial_number || '',
      notes: equip.notes || '',
      equipment_type: equip.equipment_type || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await equipmentAPI.delete(id);
        fetchEquipment();
      } catch (err) {
        setError('Failed to delete equipment');
        console.error(err);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ instrument: '', model: '', serial_number: '', notes: '', equipment_type: '' });
  };

  if (loading) return <div className="container"><div className="loading">Loading...</div></div>;

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Test Equipment Management</h2>
          {!showForm && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              Add New Equipment
            </button>
          )}
        </div>

        {error && <div className="error">{error}</div>}

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h3>{editingId ? 'Edit Equipment' : 'Add New Equipment'}</h3>
            
            <div className="form-group">
              <label>Instrument *</label>
              <input
                type="text"
                required
                value={formData.instrument}
                onChange={(e) => setFormData({ ...formData, instrument: e.target.value })}
                placeholder="e.g., Seawater Calibration Bath"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Model</label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  placeholder="e.g., Fluke Hart Scientific 7052"
                />
              </div>

              <div className="form-group">
                <label>Serial Number</label>
                <input
                  type="text"
                  value={formData.serial_number}
                  onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                  placeholder="e.g., C2A012"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Equipment Type</label>
              <input
                type="text"
                value={formData.equipment_type}
                onChange={(e) => setFormData({ ...formData, equipment_type: e.target.value })}
                placeholder="e.g., Bath, Thermometer, Counter"
              />
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="4"
                placeholder="Additional information about calibration, specifications, etc."
              />
            </div>

            <div className="btn-group">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Create'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Instrument</th>
                <th>Model</th>
                <th>Serial Number</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((equip) => (
                <tr key={equip.id}>
                  <td>{equip.instrument}</td>
                  <td>{equip.model}</td>
                  <td>{equip.serial_number}</td>
                  <td>{equip.equipment_type}</td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', marginRight: '0.5rem' }} onClick={() => handleEdit(equip)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" style={{ padding: '0.5rem 1rem' }} onClick={() => handleDelete(equip.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EquipmentList;
