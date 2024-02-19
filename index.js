const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Import other modules/files containing your Firebase Functions
const authFunctions = require('./auth');
const taskFunctions = require('./tasks');
const userFunctions = require('./users');
const teamFunctions = require('./teams');
const deadlineFunctions = require('./deadlines');

// Define Cloud Functions
// Example: HTTPS function
exports.helloWorld = functions.https.onRequest((request, response) => {
  try {
    // Example of error handling
    if (!request.query.name) {
      throw new Error('Name parameter is required');
    }
    const name = request.query.name;
    response.send(`Hello, ${name}!`);
  } catch (error) {
    // Example of logging errors
    console.error('Error:', error.message);
    response.status(400).send(error.message);
  }
});

// Authentication Functions
exports.signup = functions.https.onCall(async (data, context) => {
  try {
    // Example of input validation
    if (!data.email || !data.password) {
      throw new Error('Email and password are required');
    }
    // Call the signup function from auth module
    const result = await authFunctions.signup(data.email, data.password);
    return { success: true, userId: result.uid };
  } catch (error) {
    console.error('Error:', error.message);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Task Functions
exports.createTask = functions.https.onCall(async (data, context) => {
  try {
    // Example of authorization check
    if (!context.auth) {
      throw new Error('Authentication required');
    }
    // Example of input validation
    if (!data.title || !data.description) {
      throw new Error('Title and description are required');
    }
    // Call the createTask function from tasks module
    const taskId = await taskFunctions.createTask(data.title, data.description);
    return { success: true, taskId: taskId };
  } catch (error) {
    console.error('Error:', error.message);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Add other Cloud Functions with error handling, input validation, and logging as needed

// Export your Cloud Functions
module.exports = exports;
