const express = require('express')
const kosController = require(`../controller/kos.controller`)
const app = express()

app.get("/", kosController.getAllKos)
app.post("/find", kosController.findKos)
app.post("/", kosController.createKos)
app.delete("/:id", kosController.deleteKos)


module.exports = app