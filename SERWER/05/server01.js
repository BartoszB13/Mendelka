const PORT = 3000
const express = require('express')
const app = express()

app.get('/', function (req, res) {
    const columnColor = req.query.background ?? 'red'
    const columnCount = Number(req.query.count ?? 5)

    const css = `
        <style>
            body { display: flex; flex-direction: row; }
            .column { width: 50px; margin: 10px; background: ${columnColor}; }
        </style>`

    let html = css

    for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
        html += `<div class="column" style="height:${getRandomHeight()}px;"></div>`
    }

    res.send(html)
})

function getRandomHeight() {
    return Math.floor(Math.random() * 100)
}

app.listen(PORT, function () {
    console.log("start serwera na porcie : " + PORT)
})