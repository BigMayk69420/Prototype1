// controllers/authController.js
const admin = require('firebase-admin');
const db = admin.firestore();
const User = require('../models/User');

// Controller for user registration
exports.registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if the user is authorized to register (e.g., admin or specific role)
    if (!isAdminOrAllowedRole(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden - Unauthorized to register users' });
    }

    // Create the user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    // Create the user in Firestore
    const newUser = new User({
      userId: userRecord.uid,
      email,
      role,
    });

    await db.collection('users').doc(newUser.userId).set(newUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller for updating user profile
exports.updateProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;

    // Update the user's profile information in Firestore
    const updatedUser = await db.collection('users').doc(req.user.uid).update({
      username,
      bio,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller for updating user password
exports.updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    // Update the user's password in Firebase Authentication
    await admin.auth().updateUser(req.user.uid, {
      password: newPassword,
    });

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Helper function to check if the user has admin role or an allowed role
function isAdminOrAllowedRole(userRole) {
  return userRole === 'admin' || userRole === 'allowedRole';
}

// Controller for updating notification preferences
exports.updateNotificationPreferences = async (req, res) => {
  try {
    const { emailNotifications, pushNotifications } = req.body;

    // Update the user's notification preferences in Firestore
    const updatedUser = await db.collection('users').doc(req.user.uid).update({
      emailNotifications,
      pushNotifications,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
