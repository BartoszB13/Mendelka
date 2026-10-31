const PORT = 3000
const express = require('express')
const app = express()
const path = require('path')


app.use(express.json())

app.use(express.urlencoded({
    extended: true
}));

let logowania = []

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index02.html"))
})

app.post("/login", function (req, res) {
    const name = req.body.name
    const lastname = req.body.lastname
    const wpis = {
        message: "logowanie osoby",
        name: name,
        lastname: lastname,
        logtime: Date.now()
    }
    logowania.push(wpis)
    console.log(JSON.stringify(logowania, null, 5))
    res.header("content-type", "application/json")
    res.send(JSON.stringify(logowania, null, 5))
})


app.listen(PORT, function () {
    console.log("start serwera na porcie : " + PORT)
})