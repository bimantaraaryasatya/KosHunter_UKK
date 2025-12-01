const express = require('express')
const bookController = require(`../controller/book.controller`)
const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware')
const app = express()

app.get("/", authenticateToken, bookController.getAllBook)

module.exports = app