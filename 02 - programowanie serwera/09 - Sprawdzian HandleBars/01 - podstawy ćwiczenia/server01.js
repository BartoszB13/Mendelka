const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
const { create } = require("express-handlebars");
const Datastore = require("@seald-io/nedb");
const { fileHash } = require("graphifyy");

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
  res.render("index.hbs"); // nie podajemy ścieżki tylko nazwę pliku
});

app.get("/login", function (req, res) {
  res.render("login.hbs");
});

app.get("/context", function (req, res) {
  const context = {
    ItemPrice: [
      { id: 1, cena: 100 },
      { id: 2, cena: 1000 },
      { id: 3, cena: 12 },
    ],
  };
  res.render("context.hbs", context);
});

app.get("/footer", function (req, res) {
  const context = {
    subject: "ćwiczenie 2 - podstawowy context",
    content: "to jest lorem ipsum",
    footer: "to jest stopka na mojej stronie",
  };
  res.render("footer.hbs", context);
});

const context = {
  subject: "ćwiczenie 4 - dane z tablicy, select",
  fields: [{ name: "title" }, { name: "author" }, { name: "lang" }],
  books: [
    { title: "Lalka", author: "B Prus", lang: "PL" },
    { title: "Hamlet", author: "W Szekspir", lang: "ENG" },
    { title: "Pan Wołodyjowski", author: "H Sienkiewicz", lang: "PL" },
    { title: "Zamek", author: "F Kafka", lang: "CZ" },
  ],
};

app.get("/authors", function (req, res, next) {
  res.render("authors.hbs", { context });
});

app.get("/GetCategorySelect", function (req, res, next) {
  let filterResult = [];
  let category = req.query.category;
  switch (category) {
    case "title":
      context.books.forEach((element) => {
        filterResult.push({ name: element.title });
      });
      return res.render("authors.hbs", {
        context: context,
        filterResult: filterResult,
      });
      break;
    case "author":
      context.books.forEach((element) => {
        filterResult.push({ name: element.author });
      });
      return res.render("authors.hbs", {
        context: context,
        filterResult: filterResult,
      });
      break;
    case "lang":
      context.books.forEach((element) => {
        filterResult.push({ name: element.lang });
      });
      return res.render("authors.hbs", {
        context: context,
        filterResult: filterResult,
      });
      break;
  }
});

app.get("/GetCategoryRadios", function (req, res, next) {
  let filterResult = [];
  let category = req.query.category;
  switch (category) {
    case "title":
      context.books.forEach((element) => {
        filterResult.push({ name: element.title });
      });
      return res.render("authors.hbs", {
        context: context,
        filterResult: filterResult,
      });
      break;
    case "author":
      context.books.forEach((element) => {
        filterResult.push({ name: element.author });
      });
      return res.render("authors.hbs", {
        context: context,
        filterResult: filterResult,
      });
      break;
    case "lang":
      context.books.forEach((element) => {
        filterResult.push({ name: element.lang });
      });
      return res.render("authors.hbs", {
        context: context,
        filterResult: filterResult,
      });
      break;
  }
  return res.render("authors.hbs", {
    context: context,
    message: "Nieopwiedni wybór",
  });
});

app.get("/GetCategoryCheckBox", function (req, res, next) {
  let filterResult = [];
  let categories = req.query.category;

  if (!Array.isArray(categories)) {
    categories = [categories];
  }

  if (categories.length <= 0) {
    return res.render("author.hbs", {
      context: context,
      message: "Wybierz kategorie",
    });
  }

  const FilteredBooks = [];

  context.books.forEach((book) => {
    const bookFields = [];

    categories.forEach((field) => {
      bookFields.push({ label: field, value: book[field] });
    });

    FilteredBooks.push({ field2s: bookFields });
  });

  console.dir(FilteredBooks, { depth: null });
  return res.render("authors.hbs", {
    context,
    FilteredBooks,
  });
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
