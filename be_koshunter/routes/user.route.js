const express = require('express')
const userController = require(`../controller/user.controller`)
const app = express()

app.get("/", userController.getAllUser)
app.post("/find", userController.findUser)
app.put("/:id", userController.updateUser)
app.delete("/:id", userController.deleteUser)

module.exports = app