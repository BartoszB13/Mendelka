const PORT = 3000
const console = require('console');
const express = require('express')
const app = express()
const path = require('path')
const formidable = require('formidable')


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/handleform', function (req, res) {

    let form = formidable({});
    form.keepExtensions = true   // zapis z rozszerzeniem pliku
    form.uploadDir = __dirname + '/upload'
    console.log(form.uploadDir)       // folder do zapisu zdjęcia
    form.parse(req, function (err, fields, files) {

        console.log("----- przesłane pola z formularza ------");

        console.log(fields);
        let uploadDate = new Date()
        console.log("----- przesłane formularzem pliki ------");
        const results = {
            message: "File uploaded",
            data: {
                "name": files.imagetoupload.name,
                "size": files.imagetoupload.size,
                "date": uploadDate
            }
        }
        console.log(files);
        res.header("content-type", "application/json")
        res.send(JSON.stringify(results, null, null))
    })
})




app.listen(PORT, function () {
    console.log("start serwera na porcie : " + PORT)
})



