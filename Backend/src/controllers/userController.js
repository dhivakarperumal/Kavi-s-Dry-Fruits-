const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, user_id, username as fullName, email, phone, role, status, created_at as createdAt FROM users'
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
  const { fullName, email, phone, role, password, status } = req.body;

  try {
    let query = 'UPDATE users SET username = ?, email = ?, phone = ?, role = ?';
    const normalizedRole = String(role || '').trim().toLowerCase();
    if (!['admin', 'user'].includes(normalizedRole)) {
      return res.status(400).json({ success: false, message: 'Role must be Admin or User.' });
    }
    let params = [fullName, email, phone, normalizedRole === 'admin' ? 'Admin' : 'User'];

    if (password) {
      if (typeof password !== 'string' || password.length < 8) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
      }
      const passwordHash = await bcrypt.hash(password, 10);
      query += ', password = NULL, password_hash = ?';
      params.push(passwordHash);
    }
    
    if (status) {
      if (!['active', 'inactive'].includes(String(status).toLowerCase())) {
        return res.status(400).json({ success: false, message: 'Status must be active or inactive.' });
      }
      query += ', status = ?';
      params.push(String(status).toLowerCase());
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

// Delete profile by UUID (marks as inactive)
const deleteProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    await db.query('UPDATE users SET status = "inactive" WHERE user_id = ?', [userId]);
    res.json({ success: true, message: 'Account marked as inactive' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update password by UUID
const updatePassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters.' });
    }

    const [users] = await db.query('SELECT password_hash FROM users WHERE user_id = ?', [userId]);
    if (users.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = users[0];
    if (user.password_hash) {
      if (!currentPassword) return res.status(400).json({ message: 'Current password is required.' });
      const isValid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isValid) return res.status(401).json({ message: 'Incorrect current password' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = NULL, password_hash = ? WHERE user_id = ?', [passwordHash, userId]);
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser,
  getUserProfile,
  updateProfile,
  deleteProfile,
  updatePassword
};
