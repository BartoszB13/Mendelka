// ==========================================
// 1. IMPORTY I KONFIGURACJA MODUŁÓW
// ==========================================
const express = require("express");
const path = require("path");
const { create } = require("express-handlebars");
const Datastore = require("@seald-io/nedb");

const app = express();
const PORT = 3000;

// Odczytywanie danych z formularzy
app.use(express.urlencoded({ extended: true }));

// Pliki statyczne, np. CSS i zdjęcia
app.use(express.static(path.join(__dirname, "static")));

// Konfiguracja Handlebars
const hbs = create({
  defaultLayout: "main",
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "views/layouts"),
  partialsDir: path.join(__dirname, "views/partials"),
});

// Rejestracja silnika — tego brakowało
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Baza danych NeDB
const datas = new Datastore({
  filename: path.join(__dirname, "db/kolekcja.db"),
  autoload: true,
});

// Strona główna
app.get("/", function (req, res) {
  // documents = records read from NeDB

  const wojewodztwa = [...new Set(datas.map((item) => item.wojewodztwo))];

  const miasta = datas.filter(
    (item) => item.wojewodztwo === wybraneWojewodztwo,
  );
  console.log(wojewodztwa, miasta);
  res.render("index01.hbs");
});

app.listen(PORT, function () {
  console.log("start serwera na porcie : " + PORT);
});

// Baza danych NeDB
const db = path.join(__dirname, "db/kolekcja.db");
const data = new Datastore({
  filename: db, // Plik kolekcji
  autoload: true,
});

app.get("/", function (req, res) {
  res.render("index01.hbs");
});

app.listen(PORT, function () {
  console.log("start serwera na porcie : " + PORT);
});
