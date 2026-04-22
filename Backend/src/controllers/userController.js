const db = require('../config/db');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, user_id, username as fullName, email, phone, role, password, created_at as createdAt FROM users'
    );
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

// Update user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName, email, phone, role, password } = req.body;

  try {
    let query = 'UPDATE users SET username = ?, email = ?, phone = ?, role = ?';
    let params = [fullName, email, phone, role];

    if (password) {
      const passwordHash = await require('bcryptjs').hash(password, 10);
      query += ', password = ?, password_hash = ?';
      params.push(password, passwordHash);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await db.query(query, params);
    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

// Get profile by UUID
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    // Try by UUID first
    let [rows] = await db.query('SELECT user_id, username, email, phone, role FROM users WHERE user_id = ?', [userId]);
    
    // Fallback: If not found by UUID, try by email (if userId looks like an email)
    if (rows.length === 0 && userId.includes('@')) {
      [rows] = await db.query('SELECT user_id, username, email, phone, role FROM users WHERE email = ?', [userId]);
    }

    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update profile by UUID
const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, phone, email } = req.body;
    await db.query('UPDATE users SET username = ?, phone = ?, email = ? WHERE user_id = ?', [username, phone, email, userId]);
    res.json({ message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
  getUserProfile,
  updateProfile
};
