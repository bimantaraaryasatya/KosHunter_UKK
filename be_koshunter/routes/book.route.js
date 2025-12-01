const express = require('express')
const bookController = require(`../controller/book.controller`)
const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware')
const app = express()

app.get("/", authenticateToken, authorizeRoles('society', 'owner', 'admin'), bookController.getAllBook)
app.post("/", authenticateToken, authorizeRoles('society', 'admin'), bookController.createBook)
app.post("/find", authenticateToken, authorizeRoles('society', 'owner', 'admin'), bookController.findBook)
app.put("/:id", authenticateToken, authorizeRoles('society', 'admin'), bookController.updateBook)
app.put("/status/:id", authenticateToken, authorizeRoles('owner', 'admin'), bookController.updateStatusBook)
app.delete("/:id", authenticateToken, authorizeRoles('society', 'owner', 'admin'), bookController.deleteBook)

module.exports = app