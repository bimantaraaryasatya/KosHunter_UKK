const express = require(`express`)
const reviewController = require(`../controller/review.controller`)
const { authenticateToken, authorizeRoles } = require(`../middleware/auth.middleware`)
const app = express()
const multer = require("multer")
const upload = multer()

app.get('/my', authenticateToken, authorizeRoles('owner'), reviewController.getMyReview)
app.get('/', authenticateToken, authorizeRoles('admin'), reviewController.getAllReview)
app.post('/', authenticateToken, authorizeRoles('society', 'admin'), upload.none(), reviewController.createReview)
app.post('/reply', authenticateToken, authorizeRoles('owner', 'admin'), upload.none(), reviewController.replyReview)
app.get('/:kos_id', authenticateToken, authorizeRoles('society', 'owner', 'admin'), reviewController.getReviewsWithReplies)
app.delete('/:id', authenticateToken, authorizeRoles('admin', 'society'), reviewController.deleteReview)

module.exports = app