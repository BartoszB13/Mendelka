const PORT = 3000
const express = require('express')
const path = require('path')
const fs = require('fs')
const formidable = require('formidable')
// FIX: removed `require('console')` (console is already global in Node)
// and `pathToFileURL` (imported but never used)

const app = express()

const uploadDirectory = path.join(__dirname, 'upload')

// FIX: formidable fails if the upload folder doesn't exist,
// so create it on startup. `recursive: true` means no error if it already exists.
fs.mkdirSync(uploadDirectory, { recursive: true })

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '03 - przesyłanie pojedynczego pliku.html'))
})

// Lets the browser open uploaded files, e.g. /upload/photo.jpg
app.use('/upload', express.static(uploadDirectory))

app.post('/upload', function (req, res) {
    const form = new formidable.IncomingForm()

    form.uploadDir = uploadDirectory   // folder where files are saved
    form.keepExtensions = true         // keep ".jpg", ".png", etc.

    form.parse(req, function (error, fields, files) {
        if (error) {
            console.error(error)
            return res.status(500).json({ message: 'Upload failed' })
        }

        console.log('----- fields from the form ------')
        console.log(fields)
        console.log('----- files sent by the form ------')
        console.log(files)

        const uploadedFile = files.file

        if (!uploadedFile) {
            return res.status(400).json({ message: 'No file received' })
        }

        res.json({
            message: 'plik przesłany!',
            originalName: uploadedFile.name,
            storedName: path.basename(uploadedFile.path),
        })
    })
})

app.listen(PORT, function () {
    console.log('start serwera na porcie : ' + PORT)
})