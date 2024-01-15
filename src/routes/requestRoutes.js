// routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const authMiddleware = require('../middleware/authMiddleware');

// Route for submitting a new request
router.post('/submit', authMiddleware, requestController.submitRequest);

// Route for getting all requests
router.get('/all', authMiddleware, requestController.getAllRequests);

// Route for getting new requests (unapproved)
router.get('/new', authMiddleware, requestController.getNewRequests);

// Route for approving or rejecting a request
router.patch('/:requestId/approve', authMiddleware, requestController.approveRequest);
router.patch('/:requestId/reject', authMiddleware, requestController.rejectRequest);

// Get details of a specific request
router.get('/:requestId', authMiddleware, requestController.getRequestDetails);

module.exports = router;
