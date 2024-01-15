// middleware/authMiddleware.js
const admin = require('firebase-admin');
const User = require('../models/User');

// Middleware to check if the request is authenticated
exports.isAuthenticated = async (req, res, next) => {
  try {
    // Get the ID token from the request headers
    const idToken = req.headers.authorization;

    // Verify the ID token using Firebase Authentication
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Attach the decoded user information to the request object
    req.user = decodedToken;

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    // Handle authentication errors
    console.error(error);
    res.status(401).json({ error: 'Unauthorized - Invalid ID token' });
  }
};

// Middleware to check if the authenticated user has the required role
exports.hasRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      // Find the user in the database based on the UID from the decoded token
      const user = await User.findOne({ userId: req.user.uid });

      // Check if the user exists and has the required role
      if (!user || user.role !== requiredRole) {
        return res.status(403).json({ error: 'Forbidden - Insufficient privileges' });
      }

      // Move to the next middleware or route handler
      next();
    } catch (error) {
      // Handle internal server errors
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
};
