const admin = require('firebase-admin');
const functions = require('firebase-functions');

// Initialize Firestore
const db = admin.firestore();

// Function to create a new task
exports.createTask = functions.https.onCall(async (data, context) => {
  try {
    // Check if user is authenticated
    if (!context.auth) {
      throw new Error('Unauthorized access');
    }

    // Extract title and description from request data
    const { title, description } = data;

    // Additional validation if needed

    // Create the task document in Firestore
    const taskRef = await db.collection('tasks').add({
      title: title,
      description: description,
      status: 'pending',
      assignedTo: context.auth.uid, // Assign task to the currently authenticated user
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Return success message and task ID
    return { message: 'Task created successfully', taskId: taskRef.id };
  } catch (error) {
    console.error('Error creating task:', error);
    // Throw an HTTP error for the client to handle
    throw new functions.https.HttpsError('internal', 'Unable to create task');
  }
});

// Function to get details of a task
exports.getTask = functions.https.onCall(async (data, context) => {
  try {
    // Check if user is authenticated
    if (!context.auth) {
      throw new Error('Unauthorized access');
    }

    // Extract task ID from request data
    const taskId = data.taskId;

    // Retrieve the task document from Firestore
    const taskSnapshot = await db.collection('tasks').doc(taskId).get();
    if (!taskSnapshot.exists) {
      throw new Error('Task not found');
    }

    // Extract task data from the snapshot
    const taskData = taskSnapshot.data();

    // Additional logic if needed something like Formatting the task data in a specific way before returning it to the client. Checking certain conditions or properties of the task data and performing actions based on those conditions.

    // Return success message and task data
    return { message: 'Task retrieved successfully', task: taskData };
  } catch (error) {
    console.error('Error getting task:', error);
    // Throw an HTTP error for the client to handle
    throw new functions.https.HttpsError('internal', 'Unable to get task');
  }
});
