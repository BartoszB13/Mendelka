const PORT = 3000
const console = require('console');
const express = require('express')
const app = express()
const path = require('path')


app.use(express.urlencoded({
    extended: true

}));



app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "01 - kalkulator dwóch liczb.html"))
})


function calc(n1, n2, op) {
    let message;
    let wynik;
    ;

    switch (op) {
        case "add":
            wynik = n1 + n2;
            message = "suma dwoch liczb"
            break

        case "sub":
            wynik = n1 - n2;
            message = "roznica dwoch liczb"
            break
        case "mul":
            wynik = n1 * n2
            message = "iloczyn dwoch liczb"
            break
        case "divi":
            wynik = n1 / n2;
            message = "Dzielenie dwoch liczb";

    }
    return { wynik: wynik, message: message };
}


app.post('/handleForm', function (req, res) {
    res.header("content-type", "application/json")
    const number1 = parseInt(req.body.n1)
    const number2 = parseInt(req.body.n2)
    const operation = req.body.method


    if ((req.body.method) == "all") {
        let tablica = []
        let metody = ["add", "sub", "mul", "divi"]
        for (let i = 0; i < (metody.length); i++) {
            let wynik = calc(number1, number2, metody[i])
            tablica.push(wynik)
        }

        console.log(JSON.stringify({ tablica }, null, 5))
        res.send(JSON.stringify({ tablica }, null, 5))
    }

    else {
        let wynik = calc(number1, number2, operation)
        console.log()
        res.send(JSON.stringify({ wynik }, null, 5))
    }
})



app.listen(PORT, function () {
    console.log("start serwera na porcie : " + PORT)
})


