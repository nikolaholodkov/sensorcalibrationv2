import React, { useState, useEffect } from 'react';
import { sensorsAPI } from '../services/api';

function SensorsList() {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    sensor_name: '',
    serial_number: '',
    property_of: 'Istituto Nazionale di Oceanografia e di Geofisica Sperimentale – OGS, Trieste',
    model: '',
    sensor_type: 'Conductivity'
  });

  useEffect(() => {
    fetchSensors();
  }, []);

  const fetchSensors = async () => {
    try {
      setLoading(true);
      const response = await sensorsAPI.getAll();
      setSensors(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch sensors');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await sensorsAPI.update(editingId, formData);
      } else {
        await sensorsAPI.create(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        sensor_name: '',
        serial_number: '',
        property_of: 'Istituto Nazionale di Oceanografia e di Geofisica Sperimentale – OGS, Trieste',
        model: '',
        sensor_type: 'Conductivity'
      });
      fetchSensors();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save sensor');
      console.error(err);
    }
  };

  const handleEdit = (sensor) => {
    setEditingId(sensor.id);
    setFormData({
      sensor_name: sensor.sensor_name,
      serial_number: sensor.serial_number,
      property_of: sensor.property_of || '',
      model: sensor.model || '',
      sensor_type: sensor.sensor_type || 'Conductivity'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this sensor?')) {
      try {
        await sensorsAPI.delete(id);
        fetchSensors();
      } catch (err) {
        setError('Failed to delete sensor');
        console.error(err);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      sensor_name: '',
      serial_number: '',
      property_of: 'Istituto Nazionale di Oceanografia e di Geofisica Sperimentale – OGS, Trieste',
      model: '',
      sensor_type: 'Conductivity'
    });
  };

  if (loading) return <div className="container"><div className="loading">Loading...</div></div>;

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Sensors Management</h2>
          {!showForm && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              Add New Sensor
            </button>
          )}
        </div>

        {error && <div className="error">{error}</div>}

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h3>{editingId ? 'Edit Sensor' : 'Add New Sensor'}</h3>
            
            <div className="form-group">
              <label>Sensor Name *</label>
              <input
                type="text"
                required
                value={formData.sensor_name}
                onChange={(e) => setFormData({ ...formData, sensor_name: e.target.value })}
                placeholder="e.g., SBE 4 CTMO Conductivity Transfer Standard"
              />
            </div>

            <div className="form-group">
              <label>Serial Number *</label>
              <input
                type="text"
                required
                value={formData.serial_number}
                onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                placeholder="e.g., 6227"
              />
            </div>

            <div className="form-group">
              <label>Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g., SBE 4"
              />
            </div>

            <div className="form-group">
              <label>Sensor Type</label>
              <input
                type="text"
                value={formData.sensor_type}
                onChange={(e) => setFormData({ ...formData, sensor_type: e.target.value })}
                placeholder="e.g., Conductivity, Temperature"
              />
            </div>

            <div className="form-group">
              <label>Property Of</label>
              <textarea
                value={formData.property_of}
                onChange={(e) => setFormData({ ...formData, property_of: e.target.value })}
                rows="3"
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
                <th>Sensor Name</th>
                <th>Serial Number</th>
                <th>Model</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sensors.map((sensor) => (
                <tr key={sensor.id}>
                  <td>{sensor.sensor_name}</td>
                  <td>{sensor.serial_number}</td>
                  <td>{sensor.model}</td>
                  <td>{sensor.sensor_type}</td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', marginRight: '0.5rem' }} onClick={() => handleEdit(sensor)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" style={{ padding: '0.5rem 1rem' }} onClick={() => handleDelete(sensor.id)}>
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

export default SensorsList;
