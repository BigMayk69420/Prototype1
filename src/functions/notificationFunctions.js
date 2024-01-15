const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Cloud Function to send a notification when a request is approved
exports.sendNotificationOnApproval = functions.firestore
  .document('requests/{requestId}')
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const oldData = change.before.data();

    // Check if the request status changed to 'approved'
    if (newData.status === 'approved' && oldData.status !== 'approved') {
      try {
        // Get the user's FCM token from the database
        const userId = newData.userId;
        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        const user = userDoc.data();

        if (user && user.fcmToken) {
          // Send a notification to the user
          const payload = {
            notification: {
              title: 'Request Approved',
              body: `Your request "${newData.title}" has been approved. Thank you!`,
            },
          };

          await admin.messaging().sendToDevice(user.fcmToken, payload);
          console.log('Notification sent successfully');
        } else {
          console.log('User or FCM token not found');
        }
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }

    return null;
  });
