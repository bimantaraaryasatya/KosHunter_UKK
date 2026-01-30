const express = require(`express`)
const reviewController = require(`../controller/review.controller`)
const { authenticateToken, authorizeRoles } = require(`../middleware/auth.middleware`)
const app = express()

app.post('/', authenticateToken, authorizeRoles('society', 'admin'), reviewController.createReview)
app.post('/reply', authenticateToken, authorizeRoles('society', 'owner', 'admin'), reviewController.replyReview)
app.get('/:kos_id', authenticateToken, authorizeRoles('society', 'owner', 'admin'), reviewController.getReviewsWithReplies)
app.get('/', authenticateToken, authorizeRoles('admin'), reviewController.getAllReview)

module.exports = app