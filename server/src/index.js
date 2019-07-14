const express = require('express')

const apiRoute = require('./api')
const app = express()
const port = 3001

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoute)

app.listen(port, (err) => {
    if (err) throw err
    console.log(`Server started on port ${port}`)
})

module.exports = app; // for testing