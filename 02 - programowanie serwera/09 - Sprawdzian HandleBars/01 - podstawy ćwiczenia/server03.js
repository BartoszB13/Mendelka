const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
const { create } = require("express-handlebars");
const Datastore = require("@seald-io/nedb");
const { fileHash } = require("graphifyy");
const context = require("./data/data02.json");
console.log(context);

app.use(express.urlencoded({ extended: true }));

const hbs = create({
  defaultLayout: "main.hbs", // Domyślny layout: views/layouts/main.hbs
  extname: ".hbs", // rozszerzenie plików szablonów
});

const db_file = path.join(__dirname, "db/kolekcja.db");

const db = new Datastore({
  filename: db_file, //Plik kolekcji
  autoload: true,
});
app.engine(".hbs", hbs.engine); // określenie silnika szablonów
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views")); // ustalamy katalog views

app.use(express.static("static"));

app.get("/", function (req, res) {
  res.render("index03.hbs", context); // nie podajemy ścieżki tylko nazwę pliku
});

// e) jeśli nie chcemy żadnego layoutu dla danego widoku (nietypowa sytuacja)
// app.get("/", function(req, res){
//    res.render('view.hbs', { layout: null });
// });link href="stylesheet.css" rel="stylesheet">

app.listen(PORT, function (error) {
  if (error) {
    console.log("Server failed to start:", error);
    return;
  }
  console.log("start serwera na porcie : " + PORT);
});
