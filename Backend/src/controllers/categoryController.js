const db = require('../config/db');

const getImageUrls = (req) => (req.files || []).map(file => `${req.protocol}://${req.get('host')}/uploads/categories/${file.filename}`);
const parseImages = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
};

const getNextCategoryId = async () => {
  const [rows] = await db.query('SELECT catId FROM categories');
  const maxId = rows.reduce((highest, row) => {
    const match = String(row.catId || '').match(/^CAT(\d+)$/i);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  return `CAT${String(maxId + 1).padStart(3, '0')}`;
};

exports.getCategories = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY created_at DESC');
    // cimgs is stored as JSON string
    const categories = rows.map(row => {
      let parsedCimgs = typeof row.cimgs === 'string' ? JSON.parse(row.cimgs) : row.cimgs;
      
      if (Array.isArray(parsedCimgs)) {
        parsedCimgs = parsedCimgs.map(img => {
          if (typeof img === 'string' && img.startsWith('data:image/') && img.includes(',base64,')) {
            return img.replace(/(data:image\/[^;,]+),base64,/, '$1;base64,');
          }
          return img;
        });
      }

      return {
        ...row,
        cimgs: parsedCimgs
      };
    });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { cname, cdescription, cimgs } = req.body;
    const catId = await getNextCategoryId();
    const images = [...parseImages(cimgs), ...getImageUrls(req)];
    
    // Default format for timestamps in MySQL
    const [result] = await db.query(
      'INSERT INTO categories (catId, cname, cdescription, cimgs) VALUES (?, ?, ?, ?)',
      [catId, cname, cdescription, JSON.stringify(images)]
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
    const images = [...parseImages(cimgs), ...getImageUrls(req)];

    await db.query(
      'UPDATE categories SET catId = ?, cname = ?, cdescription = ?, cimgs = ? WHERE id = ?',
      [catId, cname, cdescription, JSON.stringify(images), id]
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
