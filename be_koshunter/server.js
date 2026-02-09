const express = require(`express`)
const app = express()
const fs = require('fs')
const PORT = 8000
const { checkConnection } = require('./connection');
const cors = require('cors') 
const path = require('path')
require('dotenv').config();
app.use(cors())
app.use(express.json()) 
app.use(express.urlencoded({ extended: true }))
// app.use(express.urlencoded({ extended: true })) 

const authUser = require('./routes/authUser.route')
app.use(`/authUser`, authUser)

const user = require('./routes/user.route')
app.use(`/user`, user)

const kos = require('./routes/kos.route')
app.use(`/kos`, kos)

const review = require(`./routes/review.route`)
app.use(`/review`, review)

const book = require(`./routes/book.route`)
app.use(`/book`, book)

app.use('/kos_images', express.static(path.join(__dirname, 'public/kos_images')));

app.get('/invoices/:file', (req, res) => {
  const filePath = path.resolve(__dirname, 'invoices', req.params.file)

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Invoice not found' })
  }

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', 'inline')

  res.sendFile(filePath)
})


checkConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server of Kos Hunter runs on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Server failed to start: database not connected.');
    process.exit(1);
  });