const express = require('express')
const userRoutes = require("./routes/user")
const connect = require("./db")
const cookieSession = require('cookie-session')
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

const app = express()
const port = 3001



connect()
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use("/api", userRoutes)


app.use(
  cookieSession({
    name: "bezkoder-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true
  })
)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
