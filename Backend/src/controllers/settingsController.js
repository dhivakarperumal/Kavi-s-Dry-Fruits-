const db = require('../config/db');
const axios = require('axios');

const getSettings = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM site_settings');
    const settings = {};
    rows.forEach(row => {
      settings[row.setting_key] = row.setting_value;
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const settings = req.body; // { key: value, ... }
    for (const [key, value] of Object.entries(settings)) {
      await db.query(
        'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, String(value), String(value)]
      );
    }
    res.json({ message: 'Settings updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDistance = async (req, res) => {
  try {
    const { originLat, originLng, destLat, destLng } = req.query;
    
    // Fetch settings for Google API Key
    const [settingsRows] = await db.query('SELECT * FROM site_settings WHERE setting_key = "google_maps_api_key"');
    const googleKey = settingsRows.length > 0 ? settingsRows[0].setting_value : null;

    let distance = 0;
    let method = 'OSRM';

    if (googleKey) {
      try {
        const googleRes = await axios.get(
          `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLat},${originLng}&destinations=${destLat},${destLng}&key=${googleKey}`
        );
        if (googleRes.data.rows[0].elements[0].status === 'OK') {
          // distance is in meters
          distance = googleRes.data.rows[0].elements[0].distance.value / 1000;
          method = 'Google Maps';
        } else {
          throw new Error('Google Maps route not found');
        }
      } catch (err) {
        console.warn('Google Maps API failed, falling back to OSRM:', err.message);
      }
    }

    if (distance === 0) {
      // Fallback to OSRM
      const osrmRes = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=false`
      );
      if (osrmRes.data.routes && osrmRes.data.routes.length > 0) {
        distance = osrmRes.data.routes[0].distance / 1000;
      } else {
        throw new Error('No road route found');
      }
    }

    res.json({ distance, method });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getSettings, updateSettings, getDistance };
