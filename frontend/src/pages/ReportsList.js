import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportsAPI } from '../services/api';

function ReportsList() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await reportsAPI.getAll();
      setReports(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await reportsAPI.delete(id);
        fetchReports();
      } catch (err) {
        setError('Failed to delete report');
        console.error(err);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  if (loading) return <div className="container"><div className="loading">Loading...</div></div>;

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Calibration Reports</h2>
          <Link to="/reports/new" className="btn btn-primary">
            Create New Report
          </Link>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Report Number</th>
                <th>Sensor</th>
                <th>Serial Number</th>
                <th>Test Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                    No reports found. Create your first report!
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.report_number || '-'}</td>
                    <td>{report.sensor_name}</td>
                    <td>{report.serial_number}</td>
                    <td>{formatDate(report.test_date)}</td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '4px',
                        fontSize: '0.875rem',
                        background: report.status === 'draft' ? '#ffc107' : '#28a745',
                        color: 'white'
                      }}>
                        {report.status || 'draft'}
                      </span>
                    </td>
                    <td>
                      <Link to={`/reports/edit/${report.id}`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', marginRight: '0.5rem' }}>
                        View/Edit
                      </Link>
                      <button className="btn btn-danger" style={{ padding: '0.5rem 1rem' }} onClick={() => handleDelete(report.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReportsList;
