const PORT = 3000
const console = require('console');
const express = require('express')
const app = express()
const path = require('path')


app.use(express.urlencoded({
    extended: true

}));
app.get('/', function(req,res){
    res.sendFile(path.join(__dirname, 'index01.html'))
})

app.post('/handleform', function(req,res){
    let html = `<h1 style='color:white;'>${req.body.color}`
    let css = `<style>body{background-color:${req.body.color}</style>` 
    html += css
    console.log(html)
    res.send(html)
})

app.listen(PORT, function () {
    console.log("start serwera na porcie : " + PORT)
})