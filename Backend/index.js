const connectToMongo = require('./db');
connectToMongo();
const express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')

const app = express()
const port = process.env.PORT||5000

app.use(cors())
app.use(bodyParser())

//Avaliable Routes

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


app.listen(port, () => {
  console.log(`inotebook backend listening at http://localhost:${port}`)
})