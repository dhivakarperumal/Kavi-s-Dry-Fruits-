const db = require('../config/db');

const normalizeKeyword = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim();
};

const parseLegacyKeywords = async (row) => {
  const raw = (row.keywords || '').trim();
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => normalizeKeyword(item)).filter(Boolean);
    }
  } catch (_) {
    // Not JSON, fall through
  }

  return [raw];
};

exports.getSEOKeywords = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM seo_keywords ORDER BY created_at ASC');
    let migrated = false;

    for (const row of rows) {
      const raw = (row.keywords || '').trim();
      if (raw.startsWith('[') && raw.endsWith(']')) {
        const parsed = await parseLegacyKeywords(row);
        for (const keyword of parsed) {
          if (!keyword) continue;
          const [exists] = await db.query('SELECT id FROM seo_keywords WHERE keywords = ? LIMIT 1', [keyword]);
          if (exists.length === 0) {
            await db.query('INSERT INTO seo_keywords (keywords) VALUES (?)', [keyword]);
          }
        }
        await db.query('DELETE FROM seo_keywords WHERE id = ?', [row.id]);
        migrated = true;
      }
    }

    const [cleanRows] = migrated
      ? await db.query('SELECT * FROM seo_keywords ORDER BY created_at ASC')
      : [rows];

    const keywords = cleanRows.map((row) => ({ id: row.id, keyword: row.keywords }));
    res.json({ keywords });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSEOKeywordById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM seo_keywords WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Keyword not found' });
    }
    res.json({ id: rows[0].id, keyword: rows[0].keywords });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const parseKeywordList = (keywords) =>
  keywords
    .flatMap((keyword) => String(keyword).split(","))
    .map((keyword) => normalizeKeyword(keyword))
    .filter(Boolean);

exports.addSEOKeywords = async (req, res) => {
  try {
    const { keywords } = req.body;
    if (!Array.isArray(keywords)) {
      return res.status(400).json({ message: 'Keywords must be an array' });
    }

    const cleanedKeywords = [...new Set(parseKeywordList(keywords))];
    if (cleanedKeywords.length === 0) {
      return res.status(400).json({ message: 'No valid keywords provided' });
    }

    const placeholders = cleanedKeywords.map(() => '?').join(',');
    const [existingRows] = await db.query(
      `SELECT keywords FROM seo_keywords WHERE keywords IN (${placeholders})`,
      cleanedKeywords
    );

    const existingSet = new Set(existingRows.map((row) => row.keywords));
    const newKeywords = cleanedKeywords.filter((keyword) => !existingSet.has(keyword));

    if (newKeywords.length > 0) {
      const insertPlaceholders = newKeywords.map(() => '(?)').join(',');
      await db.query(
        `INSERT INTO seo_keywords (keywords) VALUES ${insertPlaceholders}`,
        newKeywords
      );
    }

    res.status(201).json({
      message: 'Keywords saved successfully',
      inserted: newKeywords.length,
      keywords: cleanedKeywords,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

exports.updateSEOKeyword = async (req, res) => {
  try {
    const { id } = req.params;
    const { keyword } = req.body;
    const cleaned = normalizeKeyword(keyword);

    if (!cleaned) {
      return res.status(400).json({ message: 'Keyword cannot be empty' });
    }

    const [rows] = await db.query('SELECT id FROM seo_keywords WHERE id = ? LIMIT 1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Keyword not found' });
    }

    await db.query(
      'UPDATE seo_keywords SET keywords = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [cleaned, id]
    );

    res.json({ message: 'Keyword updated successfully', id: Number(id), keyword: cleaned });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

exports.deleteSEOKeyword = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM seo_keywords WHERE id = ?', [id]);
    res.json({ message: 'Keyword deleted successfully', id: Number(id) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};