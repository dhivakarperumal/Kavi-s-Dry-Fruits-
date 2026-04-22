const db = require('../config/db');

const getHealthBenefits = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM health_benefits ORDER BY createdAt DESC');
    res.json(rows.map(row => ({
      ...row,
      benefits: JSON.parse(row.benefits || '[]'),
      images: JSON.parse(row.images || '[]'),
      videos: JSON.parse(row.videos || '[]')
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createHealthBenefit = async (req, res) => {
  try {
    const { productId, productName, category, shortDescription, detailedDescription, benefits, images, videos, howToEat, howToStore } = req.body;
    const [result] = await db.query(
      'INSERT INTO health_benefits (productId, productName, category, shortDescription, detailedDescription, benefits, images, videos, howToEat, howToStore) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [productId, productName, category, shortDescription, detailedDescription, JSON.stringify(benefits), JSON.stringify(images), JSON.stringify(videos), howToEat, howToStore]
    );
    res.json({ id: result.insertId, message: 'Health benefit created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateHealthBenefit = async (req, res) => {
  try {
    const { productId, productName, category, shortDescription, detailedDescription, benefits, images, videos, howToEat, howToStore } = req.body;
    await db.query(
      'UPDATE health_benefits SET productId=?, productName=?, category=?, shortDescription=?, detailedDescription=?, benefits=?, images=?, videos=?, howToEat=?, howToStore=? WHERE id=?',
      [productId, productName, category, shortDescription, detailedDescription, JSON.stringify(benefits), JSON.stringify(images), JSON.stringify(videos), howToEat, howToStore, req.params.id]
    );
    res.json({ message: 'Health benefit updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteHealthBenefit = async (req, res) => {
  try {
    await db.query('DELETE FROM health_benefits WHERE id = ?', [req.params.id]);
    res.json({ message: 'Health benefit deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getHealthBenefits, createHealthBenefit, updateHealthBenefit, deleteHealthBenefit };
