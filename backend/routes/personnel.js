const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all personnel
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM personnel ORDER BY name ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch personnel' });
  }
});

// Get single personnel by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM personnel WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Personnel not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch personnel' });
  }
});

// Create new personnel
router.post('/', async (req, res) => {
  try {
    const { name, role, email, lab_unit } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const result = await db.query(
      'INSERT INTO personnel (name, role, email, lab_unit) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, role, email, lab_unit]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create personnel' });
  }
});

// Update personnel
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, email, lab_unit } = req.body;
    
    const result = await db.query(
      'UPDATE personnel SET name = $1, role = $2, email = $3, lab_unit = $4 WHERE id = $5 RETURNING *',
      [name, role, email, lab_unit, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Personnel not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update personnel' });
  }
});

// Delete personnel
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      'DELETE FROM personnel WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Personnel not found' });
    }
    
    res.json({ message: 'Personnel deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete personnel' });
  }
});

module.exports = router;
