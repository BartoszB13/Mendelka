const express = require('express')
const console = require('console')
const path = require('path')
const app = express()
const PORT = 3000




// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, '01 - strona serwera lokalnego.html'))
//     let BlueDivCount = req.query.p1
//     let html = ''


//     for (let DivIndex = 0; DivIndex < BlueDivCount; DivIndex++) {
//         let div = `<div class='bluediv'><code>${DivIndex}</code></div>`
//         html += div
//     }
//     res.send(html)
// })

// app.get('/:value/:degtorad', function (req, res) {
//     let value = req.params.value
//     let iftorad = req.params.degtorad
//     let result

//     if (iftorad == true) {
//         result = value * (180 / (Math.PI))
//         res.send(`z ${value} stopni na ${result} radianow`)
//     } else {
//         result = value * 57.3
//         res.send(`z ${value} radianow na ${result} stopni`)
//     }

// })


// app.get('/produkt/:index', function (req, res) {
//     let index = req.params.index
//     let filename

//     if (index == 1) {
//         filename = '03 - strona o psach'
//     }


//     res.sendFile(path.join(__dirname, `${filename}.html`))
// })


app.get('/', function (req, res) {
    let html = ''
    for (let i = 0; i < 50; i++) {
        let random_number = Math.floor(Math.random() * 100)
        let a = `<a href='${random_number}'>Twoj przypadkowy produkt to ${random_number}`
        html += a
    }
    res.send(html)
})

app.get('/:produkt', function (req, res) {
    let prouct_index = req.params.produkt
    res.send(`To jest podstrona produktu : ${prouct_index}`)

})

app.listen(PORT, function () {
    console.log("start serwera na porcie : " + PORT)
})


