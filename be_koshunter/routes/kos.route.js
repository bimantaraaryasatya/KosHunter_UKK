const express = require('express')
const kosController = require(`../controller/kos.controller`)
const { authenticateToken, authorizeRoles } = require(`../middleware/auth.middleware`)
const app = express()

app.get("/", authenticateToken, kosController.getAllKos)
app.post("/find", authenticateToken, kosController.findKos)
app.post("/", authenticateToken, authorizeRoles('owner', 'admin'), kosController.createKos)
app.post("/:id", authenticateToken, authorizeRoles('owner', 'admin'), kosController.updateKos)
app.delete("/:id", authenticateToken, authorizeRoles('owner', 'admin'), kosController.deleteKos)

module.exports = app