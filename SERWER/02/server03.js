const PORT = 3000
const console = require('console');
const express = require('express')
const app = express()
const path = require('path')


app.use(express.urlencoded({
    extended: true

}));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index03.html'))
})

app.post('/handleform', function (req, res) {
    let audi_cond = req.body.audi
    let opel_cond = req.body.opel
    let francuz_cond = req.body.francuz
    let bigfiat_cond = req.body.duzy_fiat
    let mercedes_cond = req.body.mercedes
    let smallcar_cond = req.body.male_fajne

    car_types = [audi_cond, opel_cond, bigfiat_cond, mercedes_cond, smallcar_cond, francuz_cond]

    new_count = 0
    used_count = 0
    acident_count = 0

    for (let i = 0; i <= car_types.length; i++) {
        switch (car_types[i]) {
            case ('new'):
                new_count += 1
                break
            case ('used'):
                used_count += 1
                break
            case ('acident'):
                acident_count += 1
                break
        }
    }
    car_cond_count = {
        'nowe': new_count,
        'uzywane': used_count,
        'powypadkowe': acident_count
    }
    res.send(car_cond_count)
})


app.listen(PORT, function () {
    console.log("start serwera na porcie : " + PORT)
})