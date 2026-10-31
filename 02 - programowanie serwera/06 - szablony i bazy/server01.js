const express = require("express")
const app = express()
const PORT = 3000;
const path = require("path")
const { create } = require('express-handlebars');
const Datastore = require('@seald-io/nedb')


app.use(express.urlencoded({ extended: true }))

const hbs = create({
    defaultLayout: 'main.hbs', // Domyślny layout: views/layouts/main.hbs
    extname: '.hbs' // rozszerzenie plików szablonów
});

const db_file = path.join(__dirname, 'db/kolekcja.db')

const db = new Datastore({
 filename: db_file, //Plik kolekcji
 autoload: true
});


app.get("/", function (req, res) {
    res.render('index01.hbs');   // nie podajemy ścieżki tylko nazwę pliku
})


app.post('/UserReg', async function(req,res){
    let imie = req.body.username
    let nazwisko = req.body.usersurname
    
    if (!imie || !nazwisko){return}
    
    const lp = await db.countAsync({}) + 1

    const UserData = {
        lp : lp,
        imie: imie,
        nazwisko: nazwisko
    }


    const insertedDocument = await db.insertAsync(UserData)
    const docs = await db.findAsync({}).sort({ lp: 1 })
    

    const table_template = {
        table_header: [{title:'lp'}, {title:'imie'}, {title:'naziwsko'}],
        table_users: docs
    }

    res.render('index01.hbs', table_template)
})



// e) jeśli nie chcemy żadnego layoutu dla danego widoku (nietypowa sytuacja)
// app.get("/", function(req, res){
//    res.render('view.hbs', { layout: null });
// });link href="stylesheet.css" rel="stylesheet">



app.engine('.hbs', hbs.engine); // określenie silnika szablonów
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views')); // ustalamy katalog views


app.use(express.static('static'))

app.listen(PORT, function (error) {
    if (error) {
        console.log("Server failed to start:", error)
        return
    }
    console.log("start serwera na porcie : " + PORT)
})