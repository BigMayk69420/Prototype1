const admin = require('firebase-admin');
const functions = require('firebase-functions');

// Initialize Firestore
const db = admin.firestore();

// Function to create a new team
exports.createTeam = functions.https.onCall(async (data, context) => {
  try {
    // Check if user is authenticated
    if (!context.auth) {
      throw new Error('Unauthorized access');
    }

    // Extract team data from request
    const { name, description } = data;

    // Create the team document in Firestore
    const teamRef = await db.collection('teams').add({
      name: name,
      description: description,
      createdBy: context.auth.uid, // Record the user who created the team
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Return success message and team ID
    return { message: 'Team created successfully', teamId: teamRef.id };
  } catch (error) {
    console.error('Error creating team:', error);
    // Throw an HTTP error for the client to handle
    throw new functions.https.HttpsError('internal', 'Unable to create team');
  }
});

// Function to get details of a team
exports.getTeam = functions.https.onCall(async (data, context) => {
  try {
    // Check if user is authenticated
    if (!context.auth) {
      throw new Error('Unauthorized access');
    }

    // Extract team ID from request
    const teamId = data.teamId;

    // Retrieve the team document from Firestore
    const teamSnapshot = await db.collection('teams').doc(teamId).get();
    if (!teamSnapshot.exists) {
      throw new Error('Team not found');
    }

    // Extract team data from the snapshot
    const teamData = teamSnapshot.data();

    // Return success message and team data
    return { message: 'Team retrieved successfully', team: teamData };
  } catch (error) {
    console.error('Error getting team:', error);
    // Throw an HTTP error for the client to handle
    throw new functions.https.HttpsError('internal', 'Unable to get team');
  }
});
