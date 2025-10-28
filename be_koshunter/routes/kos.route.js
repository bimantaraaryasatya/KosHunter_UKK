const express = require('express')
const kosController = require(`../controller/kos.controller`)
const kosFasilitieController = require(`../controller/kosFasilitie.controller`)
const { authenticateToken, authorizeRoles } = require(`../middleware/auth.middleware`)
const app = express()

app.get("/", authenticateToken, kosController.getAllKos)
app.post("/find", authenticateToken, kosController.findKos)
app.post("/", authenticateToken, authorizeRoles('owner', 'admin'), kosController.createKos)
app.put("/:id", authenticateToken, authorizeRoles('owner', 'admin'), kosController.updateKos)
app.delete("/:id", authenticateToken, authorizeRoles('owner', 'admin'), kosController.deleteKos)

app.post("/facility", authenticateToken, authorizeRoles('owner', 'admin'), kosFasilitieController.createFacilitiy)
app.put("/facility/:id", authenticateToken, authorizeRoles('owner', 'admin'), kosFasilitieController.updateFacility)
app.delete("/facility/:id", authenticateToken, authorizeRoles('owner', 'admin'), kosFasilitieController.deleteFacility)

module.exports = app