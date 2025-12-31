const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all equipment
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM test_equipment ORDER BY instrument ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
});

// Get single equipment by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM test_equipment WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
});

// Get multiple equipment by IDs
router.post('/batch', async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: 'IDs array is required' });
    }
    
    const result = await db.query(
      'SELECT * FROM test_equipment WHERE id = ANY($1::int[])',
      [ids]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
});

// Create new equipment
router.post('/', async (req, res) => {
  try {
    const { instrument, model, serial_number, notes, equipment_type } = req.body;
    
    if (!instrument) {
      return res.status(400).json({ error: 'Instrument name is required' });
    }
    
    const result = await db.query(
      'INSERT INTO test_equipment (instrument, model, serial_number, notes, equipment_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [instrument, model, serial_number, notes, equipment_type]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create equipment' });
  }
});

// Update equipment
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { instrument, model, serial_number, notes, equipment_type } = req.body;
    
    const result = await db.query(
      'UPDATE test_equipment SET instrument = $1, model = $2, serial_number = $3, notes = $4, equipment_type = $5 WHERE id = $6 RETURNING *',
      [instrument, model, serial_number, notes, equipment_type, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update equipment' });
  }
});

// Delete equipment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'DELETE FROM test_equipment WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    
    res.json({ message: 'Equipment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete equipment' });
  }
});

module.exports = router;
