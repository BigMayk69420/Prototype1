const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Set your SendGrid API key
sgMail.setApiKey('your-sendgrid-api-key');

// Firestore reference
const db = admin.firestore();

// Function to send approval email using SendGrid
exports.sendApprovalEmail = functions.firestore
  .document('requests/{requestId}')
  .onUpdate(async (change, context) => {
    const updatedRequest = change.after.data();
    const { userId, title, status } = updatedRequest;

    // Check if the request status is 'approved'
    if (status === 'approved') {
      try {
        // Retrieve user email based on userId from the 'users' collection
        const userDoc = await db.collection('users').doc(userId).get();
        const userEmail = userDoc.data().email;

        // Send approval email using SendGrid
        const msg = {
          to: userEmail,
          from: 'your-email@example.com', // Replace with your SendGrid verified sender email
          subject: 'Request Approved',
          text: `Your request "${title}" has been approved. Thank you!`,
          // html: '<p>Your HTML content here</p>', // Uncomment and add HTML content if needed
        };

        await sgMail.send(msg);
        console.log(`Approval email sent to: ${userEmail}`);
      } catch (error) {
        console.error('Error sending email:', error);
      }
    }
  });
