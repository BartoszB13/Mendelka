const PORT = 3000
const console = require('console');
const express = require('express')
const app = express()
const path = require('path')


app.use(express.urlencoded({
    extended: true

}));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '04 - formularz danych użytkownika.html'))
})


let newsletter_users = []

app.post('/handleform', function (req, res) {
    let user_emal = req.body.email
    newsletter_users.push(user_emal)
    res.send(newsletter_users)
})

app.post('/select', function (req, res) {
    let user_select = '<form method=><select>'
    for (let user_in_list = 0; user_in_list < newsletter_users.length; user_in_list++) {
        let user_option = `<option value='${newsletter_users[user_in_list]}'>${newsletter_users[user_in_list]}</otpion>`
        user_select += user_option
    }
    
})


app.listen(PORT, function () {
    console.log("start serwera na porcie : " + PORT)
})