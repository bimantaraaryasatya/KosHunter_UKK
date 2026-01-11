const express = require('express')
const authUserController = require('../controller/authUser.controller')
const app = express()

app.post("/register/society", authUserController.register)
app.post("/register/owner", authUserController.registerOwner)
app.post("/login", authUserController.login)

module.exports = app;