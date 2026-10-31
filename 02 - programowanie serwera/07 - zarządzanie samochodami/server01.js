const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
const { create } = require("express-handlebars");
const Datastore = require("@seald-io/nedb");

app.use(
  express.urlencoded({
    extended: true,
  }),
);

const hbs = create({
  defaultLayout: "main.hbs", // Domyślny layout: views/layouts/main.hbs
  extname: ".hbs", // rozszerzenie plików szablonów
});

const db = path.join(__dirname, "db/kolekcja.db");

const data = new Datastore({
  filename: db, //Plik kolekcji
  autoload: true,
});

app.get("/", function (req, res) {
  res.render("index.hbs"); // nie podajemy ścieżki tylko nazwę pliku
});

const auta = ["Skoda", "Merolek", "Citroen C4", "Pegout"];

app.get("/add", function (rez, res) {
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

app.get("/list", function (req, res) {
  data.find({}, function (err, carList) {
    let carsObjTable = { context: carList };

    res.render("list.hbs", carsObjTable);
  });
});

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

  // No checkboxes → undefined; one → string; several → array.
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

app.get("/deleteAll", function (req, res) {
  data.remove({}, { multi: true }, function (err, numRemoved) {
    if (err) return next(err);

    return res.redirect("/del");
  });
});

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
  data.find({ cena: { $exists: true } }, function (err, carList) {
    let carsObjTable = { context: carList };
    res.render("advancedsearch.hbs", carsObjTable);
  });
});
// app.get('/login', function (req, res) {
//     res.render('view2.hbs')
// })

const obj = {
  a: 1,
  b: 2,
  c: 3,
};

console.log(Object.keys(obj));

for (let key in obj) console.log(key, obj[key]);

// e) jeśli nie chcemy żadnego layoutu dla danego widoku (nietypowa sytuacja)
// app.get("/", function(req, res){
//    res.render('view.hbs', { layout: null });
// });link href="stylesheet.css" rel="stylesheet">

app.engine(".hbs", hbs.engine); // określenie silnika szablonów
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views")); // ustalamy katalog views

app.use(express.static("static"));

app.listen(PORT, function () {
  console.log("start serwera na porcie : " + PORT);
});
