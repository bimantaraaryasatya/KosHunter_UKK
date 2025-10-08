const express = require(`express`)
const app = express()
const PORT = 8000
const cors = require('cors') 
const path = require('path')
require('dotenv').config();
app.use(cors())
app.use(express.json()) 
// app.use(express.urlencoded({ extended: true })) 

const authUser = require('./routes/authUser.route')
app.use(`/authUser`, authUser)

const user = require('./routes/user.route')
app.use(`/user`, user)

app.listen(PORT, () => {
    console.log(`Server of Kos Hunter runs on port ${PORT}`)
})
