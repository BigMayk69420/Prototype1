// models/User.js
const admin = require('firebase-admin');
const db = admin.firestore();

// Define the Firestore collection name
const collectionName = 'users';

// Function to add a user to Firestore
const addUserToFirestore = async (userData) => {
  try {
    const docRef = await db.collection(collectionName).add(userData);
    console.log('User added with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding user to Firestore: ', error);
    throw error;
  }
};

// Function to get a user from Firestore by ID
const getUserFromFirestore = async (userId) => {
  try {
    const docRef = await db.collection(collectionName).doc(userId).get();
    if (docRef.exists) {
      return docRef.data();
    } else {
      console.log('No such document');
      return null;
    }
  } catch (error) {
    console.error('Error getting user from Firestore: ', error);
    throw error;
  }
};

// Export the functions for adding and getting a user from Firestore
module.exports = { addUserToFirestore, getUserFromFirestore };
