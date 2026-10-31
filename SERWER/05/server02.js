const PORT = 3000
const { off } = require('cluster')
const express = require('express')
const app = express()
const path = require('path')



app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '02 - rezerwacja seansu kinowego.html'))
})

let bilety = []

app.get('/formhandle', function (req, res) {
    let sum = 0


    console.log(req.query)
    let firstname = req.query.firstname
    let surname = req.query.surname
    let seansetype = req.query.seansetype
    let popcorn = req.query.popcorn
    let drink = req.query.drink
    if (drink == 'on') {
        drink = 'drink'
        sum += 15

    }
    if (popcorn == 'on') {
        popcorn = 'popcorn'
        sum += 40
    }
    if (seansetype == '3D') { sum += 30 }
    if (seansetype == '2D') { sum += 20 }

    const summary = {
        message: "TO JEST BILET KINOWY",
        imie: firstname,
        nazwikso: surname,
        Typ_seansu: seansetype,
        Artykuly_spozywcze: [drink, popcorn],
        suma: sum,
    }
    bilety.push(summary)

    res.header("content-type", "application/json")
    res.send(JSON.stringify(bilety, null, 5))
})

app.listen(PORT, function () {
    console.log("start serwera na porcie : " + PORT)
})