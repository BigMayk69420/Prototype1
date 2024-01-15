// models/Request.js
const admin = require('firebase-admin');
const db = admin.firestore();

// Define the Firestore collection name
const collectionName = 'requests';

// Create a function to add a request to Firestore
const addRequestToFirestore = async (requestData) => {
  try {
    const docRef = await db.collection(collectionName).add(requestData);
    console.log('Request added with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding request to Firestore: ', error);
    throw error;
  }
};

// Function to get a request from Firestore by ID
const getRequestFromFirestore = async (requestId) => {
  try {
    const docRef = await db.collection(collectionName).doc(requestId).get();
    if (docRef.exists) {
      return docRef.data();
    } else {
      console.log('No such document');
      return null;
    }
  } catch (error) {
    console.error('Error getting request from Firestore: ', error);
    throw error;
  }
};

// Export the functions for adding and getting a request from Firestore
module.exports = { addRequestToFirestore, getRequestFromFirestore };
