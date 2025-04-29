const db = require('../config/db');

// Get all categories
exports.getCategories = (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

// Create a new category
exports.createCategory = (req, res) => {
  const { name, slug } = req.body;
  db.query('INSERT INTO categories (name, slug) VALUES (?, ?)', [name, slug], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Category slug already exists' });
      }
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(201).json({ message: 'Category created', id: result.insertId });
  });
};

// Get all subcategories
exports.getSubcategories = (req, res) => {
  db.query('SELECT * FROM sub_categories', (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
};

// Create a new subcategory
exports.createSubcategory = (req, res) => {
  const { name, slug, category_id } = req.body;
  db.query(
    'INSERT INTO sub_categories (name, slug, category_id) VALUES (?, ?, ?)',
    [name, slug, category_id],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ message: 'Subcategory slug already exists' });
        }
        return res.status(500).json({ message: 'Server error' });
      }
      res.status(201).json({ message: 'Subcategory created', id: result.insertId });
    }
  );
};
