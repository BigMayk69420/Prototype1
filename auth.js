const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

// Initialize SendGrid API key
sgMail.setApiKey('YOUR_SENDGRID_API_KEY');

// Function to sign up a new user
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Create the user using Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    // Send welcome email to the newly signed up user
    await sendWelcomeEmail(email);

    res.status(201).json({ message: 'User created successfully', user: userRecord.toJSON() });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Unable to create user' });
  }
};

// Function to log in an existing user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Sign in the user using Firebase Authentication
    const userCredential = await admin.auth().signInWithEmailAndPassword(email, password);

    res.status(200).json({ message: 'User logged in successfully', user: userCredential.user.toJSON() });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

// Function to log out a user (not typically needed with Firebase Auth)
exports.logout = async (req, res) => {
  try {
    // Perform any necessary logout logic (if applicable)

    res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error('Error logging out user:', error);
    res.status(500).json({ error: 'Unable to log out user' });
  }
};

// Function to reset a user's password
exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Send a password reset email to the user
    await admin.auth().sendPasswordResetEmail(email);

    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    res.status(500).json({ error: 'Unable to send password reset email' });
  }
};

// Function to send a welcome email to the newly signed up user
async function sendWelcomeEmail(email) {
  try {
    const msg = {
      to: email,
      from: 'your@example.com', // Replace with your own email address
      subject: 'Welcome to Task Tracker!',
      text: `Welcome to Task Tracker! We're excited to have you on board.`,
      html: `<p>Welcome to Task Tracker! We're excited to have you on board.</p>`,
    };

    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}
