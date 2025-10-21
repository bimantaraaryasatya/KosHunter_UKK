const express = require('express')
const userController = require(`../controller/user.controller`)
const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware')
const app = express()

app.get("/", authenticateToken, userController.getAllUser)
app.post("/find", authenticateToken, userController.findUser)
app.put("/:id", authenticateToken, userController.updateUser)
app.delete("/:id", authenticateToken, authorizeRoles('society', 'admin'), userController.deleteUser)

module.exports = app