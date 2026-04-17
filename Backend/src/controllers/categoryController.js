const db = require('../config/db');

exports.getCategories = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY created_at DESC');
    // cimgs is stored as JSON string
    const categories = rows.map(row => ({
      ...row,
      cimgs: typeof row.cimgs === 'string' ? JSON.parse(row.cimgs) : row.cimgs
    }));
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { catId, cname, cdescription, cimgs } = req.body;
    
    // Default format for timestamps in MySQL
    const [result] = await db.query(
      'INSERT INTO categories (catId, cname, cdescription, cimgs) VALUES (?, ?, ?, ?)',
      [catId, cname, cdescription, JSON.stringify(cimgs || [])]
    );

    res.status(201).json({ id: result.insertId, message: 'Category added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { catId, cname, cdescription, cimgs } = req.body;

    await db.query(
      'UPDATE categories SET catId = ?, cname = ?, cdescription = ?, cimgs = ? WHERE id = ?',
      [catId, cname, cdescription, JSON.stringify(cimgs || []), id]
    );

    res.json({ message: 'Category updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
