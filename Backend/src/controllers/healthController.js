const db = require('../config/db');

const parseArray = (value) => {
  if (Array.isArray(value)) return value;
  try { return JSON.parse(value || '[]'); } catch (error) { return []; }
};

const uploadedUrl = (req, folder, filename) => `${req.protocol}://${req.get('host')}/uploads/health-benefits/${folder}/${filename}`;

const getMediaFromRequest = (req, fieldName, folder) => (req.files?.[fieldName] || []).map(file => uploadedUrl(req, folder, file.filename));

const mergeUploadedMedia = (req, images, videos) => {
  const uploadedImages = getMediaFromRequest(req, 'images', 'images');
  const uploadedVideos = getMediaFromRequest(req, 'videoFiles', 'videos');
  const mergedVideos = videos.map(video => {
    if (video.fileIndex !== undefined && uploadedVideos[video.fileIndex]) {
      return { ...video, value: uploadedVideos[video.fileIndex], fileIndex: undefined };
    }
    const { fileIndex, ...videoWithoutFileIndex } = video;
    return videoWithoutFileIndex;
  });
  return { images: [...images, ...uploadedImages], videos: mergedVideos };
};

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
    const { 
      productId, productName, category, 
      shortDescription = '', detailedDescription = '', 
      benefits = [], images = [], videos = [],
      howToEat = '', howToStore = '' 
    } = req.body;

    const media = mergeUploadedMedia(req, parseArray(images), parseArray(videos));
    const [result] = await db.query(
      'INSERT INTO health_benefits (productId, productName, category, shortDescription, detailedDescription, benefits, images, videos, howToEat, howToStore) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        productId, productName, category, 
        shortDescription, detailedDescription, 
        typeof benefits === 'string' ? benefits : JSON.stringify(benefits),
        JSON.stringify(media.images),
        JSON.stringify(media.videos),
        howToEat, howToStore
      ]
    );
    res.json({ id: result.insertId, message: 'Health benefit created successfully' });
  } catch (error) {
    console.error("Create Health Benefit Error DETAILS:", {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({ error: error.message });
  }
};

const updateHealthBenefit = async (req, res) => {
  try {
    const { 
      productId, productName, category, 
      shortDescription = '', detailedDescription = '', 
      benefits = [], images = [], videos = [],
      howToEat = '', howToStore = '' 
    } = req.body;

    const media = mergeUploadedMedia(req, parseArray(images), parseArray(videos));
    const [result] = await db.query(
      'UPDATE health_benefits SET productId=?, productName=?, category=?, shortDescription=?, detailedDescription=?, benefits=?, images=?, videos=?, howToEat=?, howToStore=? WHERE id=?',
      [
        productId, productName, category, 
        shortDescription, detailedDescription, 
        typeof benefits === 'string' ? benefits : JSON.stringify(benefits),
        JSON.stringify(media.images),
        JSON.stringify(media.videos),
        howToEat, howToStore, 
        req.params.id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Health benefit not found' });
    }

    res.json({ message: 'Health benefit updated successfully' });
  } catch (error) {
    console.error("Update Health Benefit Error DETAILS:", {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage
    });
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
