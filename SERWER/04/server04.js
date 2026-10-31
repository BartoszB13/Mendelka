const PORT = 3000
const console = require('console');
const express = require('express')
const app = express()
const path = require('path')
const formidable = require('formidable');
const { pathToFileURL } = require('url');
const fs = require("fs")


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index04.html'))
})



if (!fs.existsSync(__dirname + '/upload')) {
    fs.mkdirSync(__dirname + '/upload')
}

app.use('/upload', express.static(__dirname + '/upload'))

let uploadProgress = { received: 0, expected: 0 }

app.get('/Getstatus', function (req, res) {
    let precent = uploadProgress.expected
        ? Math.round((uploadProgress.received / uploadProgress.expected) * 100) : 0
    res.json({ precent })

})

app.post('/uploadFile', function (req, res) {

    let form = formidable({});
    form.keepExtensions = true
    form.uploadDir = __dirname + '/upload'
    uploadProgress = { received: 0, expected: 0 }
    form.on("progress", function (bytesReceived, bytesExpected) {
        uploadProgress.expected = bytesExpected
        uploadProgress.received = bytesReceived
        console.log(`progres ${bytesExpected} / ${bytesReceived}`)
    })

    form.on('fileBegin', function (name, value) {
        console.log("fileBegin" + new Date().getTime())
    })

    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log(err)
            res.status(500).json({ message: "upload failed" })
            return
        }
        const uploadedFile = files.fileinput
        const Filepath = uploadedFile.path
        const extenction = path.extname(Filepath).slice(1)
        const uploadDate = new Date().getTime()
        const results = {
            message: "Przesył danych zakocznony powodzeniem",
            data: {
                name: uploadedFile.name,
                size: uploadedFile.size,
                path: '/upload/' + path.basename(Filepath),
                extenction: extenction
            }
        }

        res.header("content-type", "application/json")
        res.send(JSON.stringify(results, null, null))


    });
});

app.listen(PORT, function () {
    console.log("start serwera na porcie : " + PORT)
})



