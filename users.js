const admin = require('firebase-admin');
const functions = require('firebase-functions');

// Initialize Firestore
const db = admin.firestore();

// Function to create a new user profile
exports.createUserProfile = functions.https.onCall(async (data, context) => {
  try {
    // Check if user is authenticated
    if (!context.auth) {
      throw new Error('Unauthorized access');
    }

    // Extract user profile data from request
    const { displayName, email } = data;

    // Create the user profile document in Firestore
    await db.collection('users').doc(context.auth.uid).set({
      displayName: displayName,
      email: email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Return success message
    return { message: 'User profile created successfully' };
  } catch (error) {
    console.error('Error creating user profile:', error);
    // Throw an HTTP error for the client to handle
    throw new functions.https.HttpsError('internal', 'Unable to create user profile');
  }
});

// Function to get details of a user profile
exports.getUserProfile = functions.https.onCall(async (data, context) => {
  try {
    // Check if user is authenticated
    if (!context.auth) {
      throw new Error('Unauthorized access');
    }

    // Retrieve the user profile document from Firestore
    const userProfileSnapshot = await db.collection('users').doc(context.auth.uid).get();
    if (!userProfileSnapshot.exists) {
      throw new Error('User profile not found');
    }

    // Extract user profile data from the snapshot
    const userProfileData = userProfileSnapshot.data();

    // Return success message and user profile data
    return { message: 'User profile retrieved successfully', userProfile: userProfileData };
  } catch (error) {
    console.error('Error getting user profile:', error);
    // Throw an HTTP error for the client to handle
    throw new functions.https.HttpsError('internal', 'Unable to get user profile');
  }
});
