// ==========================================
// 1. IMPORTY I KONFIGURACJA MODUŁÓW
// ==========================================
const express = require("express");
const path = require("path");
const { create } = require("express-handlebars");
const Datastore = require("@seald-io/nedb");
const { randomInt } = require("crypto");
const { fileURLToPath } = require("url");
const cookieParser = require("cookie-parser");
const COOKIE_SECRET = "cookie_secret_key";

const app = express();
const PORT = 3000;

// Middleware do parsowania danych z formularzy
app.use(
  express.urlencoded({
    extended: true,
  }),
);

// Konfiguracja silnika szablonów Handlebars
const hbs = create({
  defaultLayout: "main.hbs", // Domyślny layout: views/layouts/main.hbs
  extname: ".hbs", // Rozszerzenie plików szablonów
});

// Baza danych NeDB
const db = path.join(__dirname, "db/kolekcja.db");
const data = new Datastore({
  filename: db, // Plik kolekcji
  autoload: true,
});

app.get("/", function (req, res) {
  res.render("index.hbs");
});

app.listen(PORT, function () {
  console.log("start serwera na porcie : " + PORT);
});
