const express = require('express')
const userController = require(`../controller/user.controller`)
const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware')
const multer = require("multer")
const upload = multer()
const app = express()

app.get("/", authenticateToken, userController.getAllUser)
app.post("/find", authenticateToken, userController.findUser)
app.post("/", authenticateToken, authorizeRoles('admin'), upload.none(), userController.createUser)
app.put("/:id", authenticateToken, authorizeRoles('owner', 'admin'), upload.none(), userController.updateUser)
app.delete("/:id", authenticateToken, authorizeRoles('society', 'admin'), userController.deleteUser)

module.exports = app