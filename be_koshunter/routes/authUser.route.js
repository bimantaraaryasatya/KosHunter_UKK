const express = require('express')
const authUserController = require('../controller/authUser.controller')
const app = express()

app.post("/register/society", (request, response, next) => {
    request.role = "society"
    next()
}, authUserController.register)
app.post("/register/owner", (request, response, next) => {
    request.role = "owner"
    next()
}, authUserController.register)
app.post("/login", authUserController.login)


module.exports = app;