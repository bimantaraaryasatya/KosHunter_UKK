const express = require('express')
const bookController = require(`../controller/book.controller`)
const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware')
const app = express()
const multer = require("multer")
const upload = multer()

app.get("/", authenticateToken, authorizeRoles('society', 'owner', 'admin'), bookController.getAllBook)
app.get("/history", authenticateToken, authorizeRoles('society', 'owner', 'admin'), bookController.getMyBookingHistory)
app.get("/my", authenticateToken, authorizeRoles('owner'), bookController.getMyBook)
app.get("/transaction", authenticateToken, authorizeRoles('owner', 'admin'), bookController.getOwnerTransactionHistory)
app.post("/", authenticateToken, authorizeRoles('society', 'admin'), upload.none(), bookController.createBook)
app.post("/find", authenticateToken, authorizeRoles('society', 'owner', 'admin'), bookController.findBook)
app.put("/:id", authenticateToken, authorizeRoles('society', 'admin'), upload.none(), bookController.updateBook)
app.put("/status/:id", authenticateToken, authorizeRoles('owner', 'admin'), upload.none(), bookController.updateStatusBook)
app.delete("/:id", authenticateToken, authorizeRoles('society', 'owner', 'admin'), bookController.deleteBook)

module.exports = app