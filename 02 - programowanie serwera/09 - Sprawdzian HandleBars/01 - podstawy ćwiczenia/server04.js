const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
const { create } = require("express-handlebars");
const Datastore = require("@seald-io/nedb");
const { fileHash } = require("graphifyy");
const context = require("./data/data03.json");
const { text } = require("stream/consumers");
console.log(context);

app.use(express.urlencoded({ extended: true }));

const hbs = create({
  defaultLayout: "main.hbs",
  extname: ".hbs",
  helpers: {
    shortTitle: function (title) {
      return title.substring(0, 10) + "...";
    },
    TextToPause: function (text) {
      return text.split("").join("-");
    },
    FirstLetterToUpper: function (text) {
      return text
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
  },
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
  let text = req.query.textInput;
  res.render("index04.hbs", { text: text }); // nie podajemy ścieżki tylko nazwę pliku
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
