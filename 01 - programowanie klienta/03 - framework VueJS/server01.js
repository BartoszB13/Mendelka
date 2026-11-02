const fs = require("fs");
const express = require("express");
const app = express();
const path = require("path");
const PORT = 3001;

app.use(express.static(__dirname + "/lekcje"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/01 - spis lekcji VueJS.html"));
});

const filenames = fs.readdirSync(__dirname + "/lekcje");

let folders = [];
let files = [];
let lessons = [];

filenames.forEach((element) => {
  if (fs.statSync(path.join(__dirname, "lekcje", element)).isDirectory()) {
    folders.push(element);
    lessons.push(
      fs
        .readdirSync(path.join(__dirname, "lekcje", element))
        .filter((element) => element.endsWith(".html")),
    );
  } else {
    files.push(element);
  }
});

const seperation = { folders, files, lessons };
console.log(seperation);

app.get("/fetch", function (req, res) {
  res.send(JSON.stringify(seperation, null, 5));
});

app.get("/search", function (req, res) {
  let input_value = req.query.input_value;
  console.log(input_value);
  let search_results = [];
  files.forEach((element) => {
    if (element.indexOf(input_value) <= 1) {
      search_results.push(element);
    }
  });
  console.log(search_results);
  res.send(JSON.stringify(search_results, null, 5));
});

app.listen(PORT, function () {
  console.log("start serwera na porcie : " + PORT);
});
