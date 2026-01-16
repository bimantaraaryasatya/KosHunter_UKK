const express = require('express')
const kosController = require(`../controller/kos.controller`)
const kosFasilitieController = require(`../controller/kosFasilitie.controller`)
const kosImageController = require(`../controller/kosImage.controller`)
const uploadFile = require('../middleware/kosImageUpload')
const { authenticateToken, authorizeRoles } = require(`../middleware/auth.middleware`)
const app = express()
const multer = require("multer")
const upload = multer()

app.get("/", authenticateToken, kosController.getAllKos)
app.post("/find", authenticateToken, kosController.findKos)
app.post("/", authenticateToken, authorizeRoles('owner', 'admin'), upload.none(), kosController.createKos)
app.put("/:id", authenticateToken, authorizeRoles('owner', 'admin'), upload.none(), kosController.updateKos)
app.delete("/:id", authenticateToken, authorizeRoles('owner', 'admin'), kosController.deleteKos)

app.post("/facility", authenticateToken, authorizeRoles('owner', 'admin'), kosFasilitieController.createFacilitiy)
app.put("/facility/:id", authenticateToken, authorizeRoles('owner', 'admin'), kosFasilitieController.updateFacility)
app.delete("/facility/:id", authenticateToken, authorizeRoles('owner', 'admin'), kosFasilitieController.deleteFacility)

app.post("/image", authenticateToken, authorizeRoles('owner', 'admin'), uploadFile.single('file'), kosImageController.createKosImage)
app.put("/image/:id", authenticateToken, authorizeRoles('owner', 'admin'), uploadFile.single('file'), kosImageController.updateKosImage)
app.get("/image", authenticateToken, kosImageController.getAllKosImage)
app.get("/image/:kos_id", authenticateToken, kosImageController.getKosImageByKosId)
app.delete("/image/:id", authenticateToken, authorizeRoles('owner', 'admin'), kosImageController.deleteKosImage)

module.exports = app