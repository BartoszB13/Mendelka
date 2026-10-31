const PORT = 3000
const console = require('console');
const express = require('express')
const app = express()
const path = require('path')


app.use(express.urlencoded({
    extended: true

}));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index02.html'))
})

// app.post('/handleform', function(req,res){
//     let html = `<h1 style='color:white;'>${req.body.color}`
//     let css = `<style>body{background-color:${req.body.color}</style>` 
//     html += css
//     console.log(html)
//     res.send(html)
// })

app.post('/handleform', function (req, res) {
    let ball_size = req.body.size
    let ball_count = req.body.ball_count
    let ball_color = req.body.color
    let ball_font_size = req.body.ball_font_size
    div_html_list = ""
    for (let i = 0; i < ball_count; i++) {
        let div_html = `<div><code>${i}</div>`
        div_html_list += div_html
    }
    let div_css = `<style>div{height:${ball_size}em;width:${ball_size}em; background:${ball_color};font-size:${ball_font_size}px;border-radius:100%;display:flex;justify-content:center;}</style>`
    div_html_list += div_css
    res.send(div_html_list)
})

app.listen(PORT, function () {
    console.log("start serwera na porcie : " + PORT)
})