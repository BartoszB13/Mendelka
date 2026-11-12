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

// ==========================================
// 2. STAŁE I FUNKCJE POMOCNICZE
// ==========================================
const auta = ["Skoda", "Merolek", "Citroen C4", "Pegout"];
const CarStateOptions = ["tak", "nie", "BRAK"];

function GenerateRnadomInt(min, max) {
  if (isNaN(min) || isNaN(max)) {
    return;
  }
  const RandomInt = Math.floor(Math.random() * (max - min) + min);
  return RandomInt;
}

// Przykładowy obiekt testowy i pętla (logowanie w konsoli)
const obj = {
  a: 1,
  b: 2,
  c: 3,
};
console.log(Object.keys(obj));
for (let key in obj) {
  console.log(key, obj[key]);
}

// ==========================================
// 3. REJESTRACJA SILNIKA SZABLONÓW I STATYKI
// ==========================================
app.engine(".hbs", hbs.engine); // Określenie silnika szablonów
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views")); // Ustalamy katalog views

app.use(express.static("static"));

// ==========================================
// 4. TRASY (ROUTES) - STRONA GŁÓWNA
// ==========================================
app.get("/", function (req, res) {
  res.render("index.hbs"); // Nie podajemy ścieżki tylko nazwę pliku
});

// ==========================================
// 5. TRASY (ROUTES) - DODAWANIE POJAZDÓW
// ==========================================
app.get("/add", function (req, res) {
  res.render("add.hbs");
});

app.post("/addCar", function (req, res) {
  let randomCarIndex = Math.floor(Math.random() * 3);
  const car = {
    Ubezpieczony: req.body.Ubezpieczony == "on" ? "tak" : "nie",
    Benzyzna: req.body.Benzyzna == "on" ? "tak" : "nie",
    Uszkodozny: req.body.Uszkodozny == "on" ? "tak" : "nie",
    naped4: req.body.naped4 == "on" ? "tak" : "nie",
    model: auta[randomCarIndex],
  };

  data.insert(car, function (err, newcar) {
    res.render("add.hbs", newcar);
  });
});

app.post("/AddMultipleCars", function (req, res) {
  let carCount = Number(req.body.addCarCount);

  for (let carIndex = 0; carIndex < carCount; carIndex++) {
    let car = {
      model: auta[GenerateRnadomInt(0, 4)],
      Benzyzna: CarStateOptions[GenerateRnadomInt(0, 3)],
      Uszkodozny: CarStateOptions[GenerateRnadomInt(0, 3)],
      naped4: CarStateOptions[GenerateRnadomInt(0, 3)],
      Ubezpieczony: CarStateOptions[GenerateRnadomInt(0, 3)],
      Cena: GenerateRnadomInt(46000, 106000),
      Rocznik: GenerateRnadomInt(2011, 2027),
    };
    data.insert(car, function (err, newcar) {
      console.log(newcar);
    });
  }
  res.redirect("/AdvancedSearch");
});

// ==========================================
// 6. TRASY (ROUTES) - WYŚWIETLANIE LISTY
// ==========================================
app.get("/list", function (req, res) {
  data.find({}, function (err, carList) {
    let carsObjTable = { context: carList };
    res.render("list.hbs", carsObjTable);
  });
});

// ==========================================
// 7. TRASY (ROUTES) - USUWANIE POJAZDÓW
// ==========================================
app.get("/del", function (req, res) {
  data.find({}, function (err, carList) {
    let carsObjTable = { context: carList };
    res.render("del.hbs", carsObjTable);
  });
});

app.get("/delone", function (req, res) {
  let getSingleCarid = req.query.delButton;

  data.remove({ _id: getSingleCarid }, {}, function (err, numRemoved) {});
  return res.redirect("/del");
});

app.get("/deleteSelected", function (req, res, next) {
  const selected = req.query.checkbox;

  // Brak checkboxów → undefined; jeden → string; kilka → array.
  const ids = Array.isArray(selected) ? selected : selected ? [selected] : [];

  if (ids.length === 0) {
    return res.redirect("/del");
  }

  data.remove(
    { _id: { $in: ids } },
    { multi: true },
    function (err, numRemoved) {
      if (err) return next(err);

      console.log(numRemoved);
      data.find({}, function (err, carList) {
        if (err) return next(err);

        res.render("del.hbs", { context: carList, numRemoved: numRemoved });
      });
    },
  );
});

app.get("/deleteAll", function (req, res, next) {
  data.remove({}, { multi: true }, function (err, numRemoved) {
    if (err) return next(err);

    return res.redirect("/del");
  });
});

// ==========================================
// 8. TRASY (ROUTES) - EDYCJA POJAZDÓW
// ==========================================
app.get("/edit", function (req, res) {
  data.find({}, function (err, carList) {
    let carsObjTable = { context: carList };
    res.render("edit.hbs", carsObjTable);
  });
});

app.get("/editCarsId", function (req, res, next) {
  const buttonEditId = req.query.editbutton;

  data.find({}, function (err, carList) {
    const cars = carList.map((car) => ({
      ...car,
      isEditing: car._id === buttonEditId,
    }));

    res.render("edit.hbs", { context: cars });
  });
});

app.get("/saveCar", function (req, res, next) {
  const selectedCarID = req.query.id;
  const anyObj = {
    model: req.query.model,
    Benzyzna: req.query.Benzyzna,
    Uszkodozny: req.query.Uszkodozny,
    naped4: req.query.naped4,
    Ubezpieczony: req.query.Ubezpieczony,
  };

  data.update(
    { _id: selectedCarID },
    { $set: anyObj },
    {},
    function (err, numUpdated) {
      if (err) return next(err);

      data.find({}, function (err, carList) {
        res.render("edit.hbs", { context: carList });
      });
    },
  );
});

// ==========================================
// 9. TRASY (ROUTES) - WYSZUKIWANIE
// ==========================================
app.get("/search", function (req, res, next) {
  data.find({}, function (err, carList) {
    let carsObjTable = { context: carList };
    res.render("search.hbs", carsObjTable);
  });
});

app.get("/searchCar", function (req, res, next) {
  let charakteristics = req.query.charakteristics;
  let value = req.query.value;

  if (!value || !charakteristics) {
    return res.redirect("/search");
  }

  console.log(charakteristics);
  console.log(value);

  data.find({ [charakteristics]: value }, function (err, docs) {
    res.render("search.hbs", { context: docs });
  });
});

app.get("/AdvancedSearch", function (req, res, next) {
  data.find({ Cena: { $exists: true } }, function (err, carList) {
    let carsObjTable = { context: carList };
    res.render("advancedsearch.hbs", carsObjTable);
  });
});

app.get("/AdvancedCarFilter", function (req, res) {
  const MinCarProductionYear = Number(req.query.MinCarProductionYear);
  const MaxCarProductionYear = Number(req.query.MaxCarProductionYear);
  const MinCarPrice = Number(req.query.MinCarPrice);
  const MaxCarPrice = Number(req.query.MaxCarPrice);

  console.log(req.query);

  const filterRules = {
    Cena: { $gte: MinCarPrice, $lte: MaxCarPrice },
    Rocznik: { $gte: MinCarProductionYear, $lte: MaxCarProductionYear },
  };
  console.log(filterRules);

  data.find(filterRules, function (err, docs) {
    console.log(docs, err);
    res.render("advancedsearch.hbs", { context: docs });
  });
});

// ==========================================
// 10. URUCHOMIENIE SERWERA
// ==========================================
app.listen(PORT, function () {
  console.log("start serwera na porcie : " + PORT);
});
