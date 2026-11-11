const jwt = require('jsonwebtoken');
const db = require('../config/db');

const isAdmin = (user) => String(user?.role || '').toLowerCase() === 'admin';
const hasUserIdentity = (user, value) =>
  [user?.userUuid, user?.userId].some((identity) => identity != null && String(identity) === String(value));

const authenticate = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not configured.');
    return res.status(500).json({ message: 'Authentication is temporarily unavailable' });
  }

  let claims;
  try {
    claims = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  try {
    const [users] = await db.query(
      'SELECT id, user_id, role, status FROM users WHERE id = ? LIMIT 1',
      [claims.userId]
    );
    const user = users[0];
    if (!user || String(user.status || '').toLowerCase() !== 'active') {
      return res.status(401).json({ message: 'Account is inactive or no longer exists' });
    }

    req.user = {
      ...claims,
      userId: user.id,
      userUuid: user.user_id,
      role: String(user.role || '').toLowerCase(),
    };
    return next();
  } catch (error) {
    console.error('Authentication account lookup failed:', error);
    return res.status(500).json({ message: 'Unable to verify account status' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!isAdmin(req.user)) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const authorizeSelfOrAdmin = (paramName = 'userId') => (req, res, next) => {
  if (isAdmin(req.user) || hasUserIdentity(req.user, req.params[paramName])) return next();
  return res.status(403).json({ message: 'You may only access your own account' });
};

const authorizeOrderOwner = async (req, res, next) => {
  if (isAdmin(req.user)) return next();

  try {
    const { id } = req.params;
    const [orders] = await db.query(
      'SELECT userId FROM orders WHERE orderId = ? OR docketNumber = ? LIMIT 1',
      [id, id]
    );
    if (orders.length > 0 && hasUserIdentity(req.user, orders[0].userId)) return next();
    return res.status(403).json({ message: 'You may only access your own orders' });
  } catch (error) {
    console.error('Order access check failed:', error);
    return res.status(500).json({ message: 'Unable to verify order access' });
  }
};

const authorizeAddressOwner = async (req, res, next) => {
  if (isAdmin(req.user)) return next();

  try {
    const [addresses] = await db.query(
      'SELECT user_id FROM user_addresses WHERE id = ? LIMIT 1',
      [req.params.id]
    );
    if (addresses.length > 0 && hasUserIdentity(req.user, addresses[0].user_id)) return next();
    return res.status(403).json({ message: 'You may only access your own addresses' });
  } catch (error) {
    console.error('Address access check failed:', error);
    return res.status(500).json({ message: 'Unable to verify address access' });
  }
};

module.exports = {
  authenticate,
  requireAdmin,
  authorizeSelfOrAdmin,
  authorizeOrderOwner,
  authorizeAddressOwner,
};
