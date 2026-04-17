const db = require('../config/db');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, user_id, username as fullName, email, phone, role, created_at as createdAt FROM users'
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
  const { fullName, email, phone, role } = req.body;

  try {
    await db.query(
      'UPDATE users SET username = ?, email = ?, phone = ?, role = ? WHERE id = ?',
      [fullName, email, phone, role, id]
    );
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

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser
};
