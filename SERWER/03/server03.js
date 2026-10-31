const PORT = 3000
const express = require('express')
const app = express()
const path = require('path')


app.use(express.json())

app.use(express.urlencoded({
    extended: true
}));


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "03 - przesyłanie wartości suwaka.html"))
})

app.post("/range", function (req, res) {
    const range1value = req.body.r1val
    res.header("content-type", "application/json")
    console.log(JSON.parse(range1value, null, null))
    res.send(JSON.parse(range1value, null, null))
})


app.listen(PORT, function () {
    console.log("start serwera na porcie : " + PORT)
})