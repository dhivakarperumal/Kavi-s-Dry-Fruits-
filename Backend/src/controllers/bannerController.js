const db = require('../config/db');

const parseJson = (value, fallback) => {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (_error) {
    return fallback;
  }
};

const normalizeBanner = (row) => ({
  ...row,
  active: row.active === 1 || row.active === true || row.active === '1',
});

const uploadedFileUrl = (req, filename) => `${req.protocol}://${req.get('host')}/uploads/banners/${filename}`;

exports.getBanners = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM banners ORDER BY created_at DESC');
    res.json(rows.map(normalizeBanner));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getBannerById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM banners WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Banner not found' });
    }
    res.json(normalizeBanner(rows[0]));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.uploadBannerImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const url = uploadedFileUrl(req, req.file.filename);
    res.status(201).json({ url, fileName: req.file.filename });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addBanner = async (req, res) => {
  try {
    const {
      title = '',
      subtitle = '',
      description = '',
      image = '',
      mobile_image = '',
      link = '',
      type = 'hero',
      active = true,
      user_id = null,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO banners (title, subtitle, description, image, mobile_image, link, type, active, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        subtitle,
        description,
        image,
        mobile_image,
        link,
        type,
        active ? 1 : 0,
        user_id,
      ]
    );

    res.status(201).json({ id: result.insertId, message: 'Banner added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title = '',
      subtitle = '',
      description = '',
      image = '',
      mobile_image = '',
      link = '',
      type = 'hero',
      active = true,
      user_id = null,
    } = req.body;

    await db.query(
      `UPDATE banners SET title = ?, subtitle = ?, description = ?, image = ?, mobile_image = ?, link = ?, type = ?, active = ?, user_id = ? WHERE id = ?`,
      [
        title,
        subtitle,
        description,
        image,
        mobile_image,
        link,
        type,
        active ? 1 : 0,
        user_id,
        id,
      ]
    );

    res.json({ message: 'Banner updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM banners WHERE id = ?', [id]);
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
