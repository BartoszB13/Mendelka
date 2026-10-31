const PORT = 3000
const express = require('express')
const app = express()
const path = require('path')


app.use(express.json())

app.use(express.urlencoded({
    extended: true
}));


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index04.html"))
})

app.post('/colors', function (req, res) {
    const red = req.body.r
    const green = req.body.g
    const blue = req.body.b
    const alpha = req.body.a

    const kolor = `rgba(${red},${green},${blue},${alpha / 100})`

    res.header("content-type", "application/json")
    res.send(JSON.stringify(kolor, null, null))
})



app.listen(PORT, function () {
    console.log("start serwera na porcie : " + PORT)
})