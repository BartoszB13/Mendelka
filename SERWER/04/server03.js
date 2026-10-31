const PORT = 3000
const console = require('console');
const express = require('express')
const app = express()
const path = require('path')
const formidable = require('formidable');
const { pathToFileURL } = require('url');
const fs = require("fs")


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '03 - przesyłanie różnych plików.html'))
})

app.use('/upload', express.static(__dirname + '/upload'))

app.post('/handleform', function (req, res) {

    let form = formidable({});
    form.keepExtensions = true   // zapis z rozszerzeniem pliku
    form.uploadDir = __dirname + '/upload'
    console.log(form.uploadDir)       // folder do zapisu zdjęcia



    form.parse(req, function (err, fields, files) {
        const uploadedfile = files.imagetoupload
        const filepath = uploadedfile.path
        const uploadDate = new Date()
        const extension = path.extname(filepath).slice(1)

        const results = {
            message: "File uploaded",
            data: {
                "name": files.imagetoupload.name,
                "size": files.imagetoupload.size,
                "date": uploadDate,
                "path": '/upload/' + (path.basename(files.imagetoupload.path)),
                "filetype": extension
            }
        }

        switch (extension) {
            case 'png':
            case 'jpeg':
                console.log("pomyslnie zaladowano zdjecie")
                res.header("content-type", "application/json")
                res.send(JSON.stringify(results, null, null))
                break

            case 'txt':
            case 'html':
                fs.readFile(filepath, 'utf-8', function (err, data) {

                    results.data.filecontent = data



                    res.header("content-type", "application/json")
                    res.send(JSON.stringify(results, null, null))
                })
                break
        }

    })
})




app.listen(PORT, function () {
    console.log("start serwera na porcie : " + PORT)
})



