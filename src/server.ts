require('dotenv').config()

import app from './App'

const port = process.env.PORT || 3000


app.listen(port, function() {
  return console.log(`server is listening on ${port}`)
})