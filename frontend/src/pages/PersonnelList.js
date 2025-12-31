import React, { useState, useEffect } from 'react';
import { personnelAPI } from '../services/api';

function PersonnelList() {
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    lab_unit: 'Marine Calibrations & Metrology Unit'
  });

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const fetchPersonnel = async () => {
    try {
      setLoading(true);
      const response = await personnelAPI.getAll();
      setPersonnel(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch personnel');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await personnelAPI.update(editingId, formData);
      } else {
        await personnelAPI.create(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: '', role: '', email: '', lab_unit: 'Marine Calibrations & Metrology Unit' });
      fetchPersonnel();
    } catch (err) {
      setError('Failed to save personnel');
      console.error(err);
    }
  };

  const handleEdit = (person) => {
    setEditingId(person.id);
    setFormData({
      name: person.name,
      role: person.role || '',
      email: person.email || '',
      lab_unit: person.lab_unit || 'Marine Calibrations & Metrology Unit'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this person?')) {
      try {
        await personnelAPI.delete(id);
        fetchPersonnel();
      } catch (err) {
        setError('Failed to delete personnel');
        console.error(err);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', role: '', email: '', lab_unit: 'Marine Calibrations & Metrology Unit' });
  };

  if (loading) return <div className="container"><div className="loading">Loading...</div></div>;

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Personnel Management</h2>
          {!showForm && (
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              Add New Person
            </button>
          )}
        </div>

        {error && <div className="error">{error}</div>}

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h3>{editingId ? 'Edit Person' : 'Add New Person'}</h3>
            
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g., Researcher, Technician"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Lab Unit</label>
              <input
                type="text"
                value={formData.lab_unit}
                onChange={(e) => setFormData({ ...formData, lab_unit: e.target.value })}
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
                <th>Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Lab Unit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {personnel.map((person) => (
                <tr key={person.id}>
                  <td>{person.name}</td>
                  <td>{person.role}</td>
                  <td>{person.email}</td>
                  <td>{person.lab_unit}</td>
                  <td>
                    <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', marginRight: '0.5rem' }} onClick={() => handleEdit(person)}>
                      Edit
                    </button>
                    <button className="btn btn-danger" style={{ padding: '0.5rem 1rem' }} onClick={() => handleDelete(person.id)}>
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

export default PersonnelList;
