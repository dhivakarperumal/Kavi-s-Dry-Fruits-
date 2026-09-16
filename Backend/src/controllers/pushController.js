const { saveSubscription, vapidConfigured } = require('../config/pushService');

const getVapidPublicKey = (_req, res) => {
  if (!vapidConfigured) return res.status(503).json({ message: 'Web Push is not configured' });
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
};

const subscribeAdmin = async (req, res) => {
  try {
    await saveSubscription(req.user.userId, req.body);
    res.status(201).json({ message: 'Push subscription saved' });
  } catch (error) {
    console.error('Push subscription error:', error);
    res.status(500).json({ message: 'Unable to save push subscription' });
  }
};

module.exports = { getVapidPublicKey, subscribeAdmin };
