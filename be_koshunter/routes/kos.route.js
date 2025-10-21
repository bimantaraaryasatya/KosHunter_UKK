const express = require('express')
const kosController = require(`../controller/kos.controller`)
const { authenticateToken, authorizeRoles } = require(`../middleware/auth.middleware`)
const app = express()

app.get("/", authenticateToken, kosController.getAllKos)
app.post("/find", authenticateToken, kosController.findKos)
app.post("/", authenticateToken, kosController.createKos)
app.post("/:id", authenticateToken, kosController.updateKos)
app.delete("/:id", authenticateToken, kosController.deleteKos)

module.exports = app