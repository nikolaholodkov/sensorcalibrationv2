const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all sensors
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM sensors ORDER BY sensor_name ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch sensors' });
  }
});

// Get single sensor by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM sensors WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch sensor' });
  }
});

// Get sensor by serial number
router.get('/serial/:serialNumber', async (req, res) => {
  try {
    const { serialNumber } = req.params;
    const result = await db.query(
      'SELECT * FROM sensors WHERE serial_number = $1',
      [serialNumber]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch sensor' });
  }
});

// Get last calibration report for a sensor
router.get('/:id/last-calibration', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `SELECT page4_new_g, page4_new_h, page4_new_i, page4_new_j, 
              page4_new_cpcor, page4_new_ctcor 
       FROM calibration_reports 
       WHERE sensor_id = $1 
       ORDER BY test_date DESC 
       LIMIT 1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No previous calibration found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch last calibration' });
  }
});

// Create new sensor
router.post('/', async (req, res) => {
  try {
    const { sensor_name, serial_number, property_of, model, sensor_type } = req.body;
    
    if (!sensor_name || !serial_number) {
      return res.status(400).json({ error: 'Sensor name and serial number are required' });
    }
    
    const result = await db.query(
      'INSERT INTO sensors (sensor_name, serial_number, property_of, model, sensor_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [sensor_name, serial_number, property_of, model, sensor_type]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') { // Unique violation
      res.status(400).json({ error: 'Sensor with this serial number already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create sensor' });
    }
  }
});

// Update sensor
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { sensor_name, serial_number, property_of, model, sensor_type } = req.body;
    
    const result = await db.query(
      'UPDATE sensors SET sensor_name = $1, serial_number = $2, property_of = $3, model = $4, sensor_type = $5 WHERE id = $6 RETURNING *',
      [sensor_name, serial_number, property_of, model, sensor_type, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update sensor' });
  }
});

// Delete sensor
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'DELETE FROM sensors WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sensor not found' });
    }
    
    res.json({ message: 'Sensor deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete sensor' });
  }
});

module.exports = router;
