const webpush = require('web-push');
const db = require('./db');
const crypto = require('crypto');
const notifiedOrderIds = new Set();

const vapidConfigured = Boolean(
  process.env.VAPID_PUBLIC_KEY &&
  process.env.VAPID_PRIVATE_KEY &&
  process.env.VAPID_SUBJECT
);

if (vapidConfigured) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

const saveSubscription = async (userId, subscription) => {
  if (!userId || !subscription?.endpoint) return;
  const endpointHash = crypto.createHash('sha256').update(subscription.endpoint).digest('hex');
  await db.query(
    `INSERT INTO admin_push_subscriptions (user_id, endpoint, endpoint_hash, subscription, enabled)
     VALUES (?, ?, ?, ?, 1)
     ON DUPLICATE KEY UPDATE user_id = VALUES(user_id), endpoint = VALUES(endpoint), subscription = VALUES(subscription), enabled = 1`,
    [userId, subscription.endpoint, endpointHash, JSON.stringify(subscription)]
  );
};

const sendNewOrderPush = async (order) => {
  if (!vapidConfigured) return;
  if (!order?.orderId || notifiedOrderIds.has(order.orderId)) return;
  notifiedOrderIds.add(order.orderId);
  const [rows] = await db.query(
    'SELECT id, endpoint, subscription FROM admin_push_subscriptions WHERE enabled = 1'
  );
  const payload = JSON.stringify({
    type: 'new-order',
    title: '🔔 New Order Received',
    body: `Order ${order.orderId} • ${order.clientName || 'Customer'} • ₹${Number(order.totalAmount || 0).toFixed(2)}`,
    orderId: order.orderId,
  });

  await Promise.all(rows.map(async (row) => {
    try {
      await webpush.sendNotification(JSON.parse(row.subscription), payload);
    } catch (error) {
      if (error.statusCode === 404 || error.statusCode === 410) {
        await db.query('UPDATE admin_push_subscriptions SET enabled = 0 WHERE id = ?', [row.id]);
      } else {
        console.error('Admin push notification failed:', error.message);
      }
    }
  }));
};

module.exports = { saveSubscription, sendNewOrderPush, vapidConfigured };
