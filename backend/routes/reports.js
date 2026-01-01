const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all reports
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT r.*, s.sensor_name, s.serial_number 
       FROM calibration_reports r 
       LEFT JOIN sensors s ON r.sensor_id = s.id 
       ORDER BY r.test_date DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Get single report by ID with all details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get report basic info
    const reportResult = await db.query(
      `SELECT r.*, s.sensor_name, s.serial_number, s.property_of, s.model 
       FROM calibration_reports r 
       LEFT JOIN sensors s ON r.sensor_id = s.id 
       WHERE r.id = $1`,
      [id]
    );
    
    if (reportResult.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    const report = reportResult.rows[0];
    
    // Get measurements for page 3
    const page3MeasurementsResult = await db.query(
      `SELECT * FROM report_measurements 
       WHERE report_id = $1 AND page_number = 3 
       ORDER BY row_order ASC`,
      [id]
    );
    
    // Get measurements for page 4
    const page4MeasurementsResult = await db.query(
      `SELECT * FROM report_measurements 
       WHERE report_id = $1 AND page_number = 4 
       ORDER BY row_order ASC`,
      [id]
    );
    
    // Combine all data and convert equipment_details back to selected_equipment
    const fullReport = {
      ...report,
      selected_equipment: report.equipment_details || [],
      page3_measurements: page3MeasurementsResult.rows,
      page4_measurements: page4MeasurementsResult.rows
    };
    
    // Format dates as YYYY-MM-DD strings without timezone conversion
    // PostgreSQL DATE fields are already in YYYY-MM-DD format
    if (fullReport.test_date) {
      // If it's already a string in YYYY-MM-DD format, keep it
      if (typeof fullReport.test_date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(fullReport.test_date)) {
        fullReport.test_date = fullReport.test_date.split('T')[0];
      } else if (fullReport.test_date instanceof Date) {
        // If it's a Date object, format it carefully to avoid timezone issues
        const year = fullReport.test_date.getFullYear();
        const month = String(fullReport.test_date.getMonth() + 1).padStart(2, '0');
        const day = String(fullReport.test_date.getDate()).padStart(2, '0');
        fullReport.test_date = `${year}-${month}-${day}`;
      }
    }
    
    if (fullReport.page3_test_date) {
      // Same logic for page3_test_date
      if (typeof fullReport.page3_test_date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(fullReport.page3_test_date)) {
        fullReport.page3_test_date = fullReport.page3_test_date.split('T')[0];
      } else if (fullReport.page3_test_date instanceof Date) {
        const year = fullReport.page3_test_date.getFullYear();
        const month = String(fullReport.page3_test_date.getMonth() + 1).padStart(2, '0');
        const day = String(fullReport.page3_test_date.getDate()).padStart(2, '0');
        fullReport.page3_test_date = `${year}-${month}-${day}`;
      }
    }
    
    res.json(fullReport);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// Create new report
router.post('/', async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      report_number,
      sensor_id,
      test_date,
      created_by,
      authors,
      lab_unit,
      equipment_ids,
      selected_equipment,
      conductivity_testing_level,
      uncertainty,
      page3_test_date,
      page3_ambient_temp,
      page3_relative_humidity,
      page3_atmospheric_pressure,
      page3_as_received_g,
      page3_as_received_h,
      page3_as_received_i,
      page3_as_received_j,
      page3_as_received_cpcor,
      page3_as_received_ctcor,
      page3_formula_text,
      page3_accuracy_note,
      page3_table_legend,
      page3_measurements,
      page4_new_g,
      page4_new_h,
      page4_new_i,
      page4_new_j,
      page4_new_cpcor,
      page4_new_ctcor,
      page4_formula_text,
      page4_accuracy_note,
      page4_table_legend,
      page4_measurements,
      conclusions,
      references,
      status
    } = req.body;
    
    // Insert report
    const reportResult = await client.query(
      `INSERT INTO calibration_reports (
        report_number, sensor_id, test_date, created_by, authors, lab_unit,
        equipment_ids, equipment_details, conductivity_testing_level, uncertainty,
        page3_test_date, page3_ambient_temp, page3_relative_humidity, page3_atmospheric_pressure,
        page3_as_received_g, page3_as_received_h, page3_as_received_i, page3_as_received_j,
        page3_as_received_cpcor, page3_as_received_ctcor, page3_formula_text, 
        page3_accuracy_note, page3_table_legend,
        page4_new_g, page4_new_h, page4_new_i, page4_new_j,
        page4_new_cpcor, page4_new_ctcor, page4_formula_text,
        page4_accuracy_note, page4_table_legend,
        conclusions, "references", status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
        $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35
      ) RETURNING *`,
      [
        report_number, 
        sensor_id || null, 
        test_date || null, 
        created_by || null, 
        authors, 
        lab_unit,
        equipment_ids, 
        JSON.stringify(selected_equipment || []), 
        conductivity_testing_level, 
        uncertainty,
        page3_test_date || null, 
        page3_ambient_temp || null, 
        page3_relative_humidity || null, 
        page3_atmospheric_pressure || null,
        page3_as_received_g, 
        page3_as_received_h, 
        page3_as_received_i, 
        page3_as_received_j,
        page3_as_received_cpcor, 
        page3_as_received_ctcor, 
        page3_formula_text,
        page3_accuracy_note, 
        page3_table_legend,
        page4_new_g, 
        page4_new_h, 
        page4_new_i, 
        page4_new_j,
        page4_new_cpcor, 
        page4_new_ctcor, 
        page4_formula_text,
        page4_accuracy_note, 
        page4_table_legend,
        conclusions, 
        references, 
        status || 'draft'
      ]
    );
    
    const reportId = reportResult.rows[0].id;
    
    // Insert page 3 measurements
    if (page3_measurements && page3_measurements.length > 0) {
      for (let i = 0; i < page3_measurements.length; i++) {
        const m = page3_measurements[i];
        await client.query(
          `INSERT INTO report_measurements (
            report_id, page_number, row_order, inst_temp, reference_conductivity,
            inst_freq, predicted_conductivity, residual
          ) VALUES ($1, 3, $2, $3, $4, $5, $6, $7)`,
          [reportId, i + 1, m.inst_temp, m.reference_conductivity, 
           m.inst_freq, m.predicted_conductivity, m.residual]
        );
      }
    }
    
    // Insert page 4 measurements
    if (page4_measurements && page4_measurements.length > 0) {
      for (let i = 0; i < page4_measurements.length; i++) {
        const m = page4_measurements[i];
        await client.query(
          `INSERT INTO report_measurements (
            report_id, page_number, row_order, inst_temp, reference_conductivity,
            inst_freq, predicted_conductivity, residual
          ) VALUES ($1, 4, $2, $3, $4, $5, $6, $7)`,
          [reportId, i + 1, m.inst_temp, m.reference_conductivity,
           m.inst_freq, m.predicted_conductivity, m.residual]
        );
      }
    }
    
    await client.query('COMMIT');
    
    res.status(201).json(reportResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to create report', details: err.message });
  } finally {
    client.release();
  }
});

// Update report
router.put('/:id', async (req, res) => {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const { id } = req.params;
    const {
      report_number,
      sensor_id,
      test_date,
      created_by,
      authors,
      lab_unit,
      equipment_ids,
      selected_equipment,
      conductivity_testing_level,
      uncertainty,
      page3_test_date,
      page3_ambient_temp,
      page3_relative_humidity,
      page3_atmospheric_pressure,
      page3_as_received_g,
      page3_as_received_h,
      page3_as_received_i,
      page3_as_received_j,
      page3_as_received_cpcor,
      page3_as_received_ctcor,
      page3_formula_text,
      page3_accuracy_note,
      page3_table_legend,
      page3_measurements,
      page4_new_g,
      page4_new_h,
      page4_new_i,
      page4_new_j,
      page4_new_cpcor,
      page4_new_ctcor,
      page4_formula_text,
      page4_accuracy_note,
      page4_table_legend,
      page4_measurements,
      conclusions,
      references,
      status
    } = req.body;
    
    // Update report
    const reportResult = await client.query(
      `UPDATE calibration_reports SET
        report_number = $1, sensor_id = $2, test_date = $3, created_by = $4, authors = $5, lab_unit = $6,
        equipment_ids = $7, equipment_details = $8, conductivity_testing_level = $9, uncertainty = $10,
        page3_test_date = $11, page3_ambient_temp = $12, page3_relative_humidity = $13, 
        page3_atmospheric_pressure = $14, page3_as_received_g = $15, page3_as_received_h = $16,
        page3_as_received_i = $17, page3_as_received_j = $18, page3_as_received_cpcor = $19,
        page3_as_received_ctcor = $20, page3_formula_text = $21, page3_accuracy_note = $22,
        page3_table_legend = $23, page4_new_g = $24, page4_new_h = $25, page4_new_i = $26,
        page4_new_j = $27, page4_new_cpcor = $28, page4_new_ctcor = $29, page4_formula_text = $30,
        page4_accuracy_note = $31, page4_table_legend = $32, conclusions = $33, "references" = $34,
        status = $35
      WHERE id = $36 RETURNING *`,
      [
        report_number, 
        sensor_id || null, 
        test_date || null, 
        created_by || null, 
        authors, 
        lab_unit,
        equipment_ids, 
        JSON.stringify(selected_equipment || []), 
        conductivity_testing_level, 
        uncertainty,
        page3_test_date || null, 
        page3_ambient_temp || null, 
        page3_relative_humidity || null, 
        page3_atmospheric_pressure || null,
        page3_as_received_g, 
        page3_as_received_h, 
        page3_as_received_i, 
        page3_as_received_j,
        page3_as_received_cpcor, 
        page3_as_received_ctcor, 
        page3_formula_text,
        page3_accuracy_note, 
        page3_table_legend,
        page4_new_g, 
        page4_new_h, 
        page4_new_i, 
        page4_new_j,
        page4_new_cpcor, 
        page4_new_ctcor, 
        page4_formula_text,
        page4_accuracy_note, 
        page4_table_legend,
        conclusions, 
        references, 
        status,
        id
      ]
    );
    
    if (reportResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Report not found' });
    }
    
    // Delete existing measurements
    await client.query('DELETE FROM report_measurements WHERE report_id = $1', [id]);
    
    // Insert page 3 measurements
    if (page3_measurements && page3_measurements.length > 0) {
      for (let i = 0; i < page3_measurements.length; i++) {
        const m = page3_measurements[i];
        await client.query(
          `INSERT INTO report_measurements (
            report_id, page_number, row_order, inst_temp, reference_conductivity,
            inst_freq, predicted_conductivity, residual
          ) VALUES ($1, 3, $2, $3, $4, $5, $6, $7)`,
          [id, i + 1, m.inst_temp, m.reference_conductivity,
           m.inst_freq, m.predicted_conductivity, m.residual]
        );
      }
    }
    
    // Insert page 4 measurements
    if (page4_measurements && page4_measurements.length > 0) {
      for (let i = 0; i < page4_measurements.length; i++) {
        const m = page4_measurements[i];
        await client.query(
          `INSERT INTO report_measurements (
            report_id, page_number, row_order, inst_temp, reference_conductivity,
            inst_freq, predicted_conductivity, residual
          ) VALUES ($1, 4, $2, $3, $4, $5, $6, $7)`,
          [id, i + 1, m.inst_temp, m.reference_conductivity,
           m.inst_freq, m.predicted_conductivity, m.residual]
        );
      }
    }
    
    await client.query('COMMIT');
    
    res.json(reportResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to update report', details: err.message });
  } finally {
    client.release();
  }
});

// Delete report
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'DELETE FROM calibration_reports WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

module.exports = router;
