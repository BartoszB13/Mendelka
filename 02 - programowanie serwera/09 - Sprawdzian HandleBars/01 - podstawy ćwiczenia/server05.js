const express = require("express");
const path = require("path");
const { create } = require("express-handlebars");
const Datastore = require("@seald-io/nedb");
const context = require("./data/data04.json");

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "static")));

const hbs = create({
  defaultLayout: "main",
  extname: ".hbs",
  partialsDir: path.join(__dirname, "views/partials"),

  helpers: {
    shortTitle: function (text) {
      return String(text ?? "").substring(0, 10) + "...";
    },

    TextToPause: function (text) {
      return String(text ?? "")
        .split("")
        .join("-");
    },

    FirstLetterToUpper: function (text) {
      return String(text ?? "")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
  },
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

const db = new Datastore({
  filename: path.join(__dirname, "db/kolekcja.db"),
  autoload: true,
});

app.get("/", function (req, res) {
  res.render("index05.hbs", context);
});

app.listen(PORT, function () {
  console.log("start serwera na porcie : " + PORT);
});
