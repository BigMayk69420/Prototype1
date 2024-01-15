const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Set your SendGrid API key
sgMail.setApiKey('your-sendgrid-api-key');

// Firestore reference
const db = admin.firestore();

// Controller for submitting a new request
exports.submitRequest = async (req, res) => {
  try {
    const { title, description, isHtmlEmail, category } = req.body;

    // Check if the user is authorized to submit a request
    if (req.user.role !== 'eventHead') {
      return res.status(403).json({ error: 'Forbidden - Unauthorized user role' });
    }

    // Create a new request
    const newRequest = new Request({
      userId: req.user.userId,
      title,
      description,
      isHtmlEmail,
      category,
    });

    // Save the new request to the database
    await newRequest.save();

    // If using WebSocket, send a real-time update to relevant departments
    sendRealTimeUpdateToDepartments();

    res.status(201).json({ message: 'Request submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// ... (other requestController functions)

// Controller for approving a request
exports.approveRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;

    // Update the status of the request to 'approved' in the database
    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      { status: 'approved' },
      { new: true } // Return the updated document
    );

    // If using WebSocket, send a real-time update to relevant departments
    sendRealTimeUpdateToDepartments();

    // If the request is approved, send an email to the specified category
    if (updatedRequest.status === 'approved') {
      sendApprovalEmail(updatedRequest);
    }

    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Optional: Function to send real-time updates using WebSocket
function sendRealTimeUpdateToDepartments() {
  // Implement WebSocket logic here (e.g., notify relevant departments of new requests)
}

// Function to send approval email using SendGrid
async function sendApprovalEmail(request) {
  const { userId, title } = request;

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

// controllers/requestController.js
const { addRequestToFirestore, getRequestFromFirestore } = require('../models/Request');

exports.submitRequest = async (req, res) => {
  try {
    const { title, description, isHtmlEmail, category } = req.body;

    // Check if the user is authorized to submit a request
    if (req.user.role !== 'eventHead') {
      return res.status(403).json({ error: 'Forbidden - Unauthorized user role' });
    }

    // Create a request object with additional data as needed
    const requestData = {
      userId: req.user.userId,
      title,
      description,
      isHtmlEmail,
      category,
      status: 'pending', // Default status
    };

    // Add the request to Firestore
    const requestId = await addRequestToFirestore(requestData);

    // You can perform additional logic or respond to the client as needed
    res.status(201).json({ message: 'Request submitted successfully', requestId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
