const express = require("express")
const path = require("path")
const { create } = require("express-handlebars")
const Datastore = require("@seald-io/nedb")
const { parse } = require("querystring")
const { DEFAULT_ECDH_CURVE } = require("tls")

const app = express()
const PORT = 3000

const handlebars = create({
    defaultLayout: "main.hbs",
    extname: ".hbs"
})

app.engine(".hbs", handlebars.engine)
app.set("view engine", ".hbs")
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }))
app.use(express.static("static"))

const database = new Datastore({
    filename: path.join(__dirname, "db/devices.db"),
    autoload: true
})


const initialDevices = [
    { lp: 1, name: "monitor", price: 1000 },
    { lp: 2, name: "kable", price: 50 },
    { lp: 3, name: "klawiatura", price: 200 },
    { lp: 4, name: "klawiatura", price: 250 },
    { lp: 5, name: "mysz", price: 100 }
]

// The table header is the same on every page
const tableHeader = [{ title: "lp" }, { title: "name" }, { title: "price" }]

// On start: if the database is empty, fill it with the original devices
database.count({}, function (error, documentCount) {
    if (documentCount === 0) {
        database.insert(initialDevices, function (error, insertedDevices) {
            console.log("database was empty, original devices added")
        })
    }
})

// Show the table
app.get("/", function (request, response) {
    database.find({}).sort({ lp: 1 }).exec(function (error, devices) {
        response.render("index02.hbs", {
            tableHeader: tableHeader,
            devices: devices,
            message: ""
        })
    })
})

// Delete the checked rows
let deleted = 0
app.post("/delete", function (request, response) {
    let selectedIds = request.body.selectedIds

    // The browser sends different things depending on how many boxes are checked:
    // nothing checked -> undefined
    // one checked     -> a single string
    // many checked    -> an array
    if (selectedIds === undefined) {
        selectedIds = []
    } else if (typeof selectedIds === "string") {
        selectedIds = [selectedIds]
    }

    if (sexlectedIds.length === 0) {
        // Nothing checked: show the table again with the warning
        database.find({}).sort({ lp: 1 }).exec(function (error, devices) {
            response.render("index02.hbs", {
                tableHeader: tableHeader,
                devices: devices,
                message: "zaznacz przynajmniej jeden checkbox!!!"
            })
        })
    } else {
        // Something checked: remove it, then load the table again
        database.remove({ _id: { $in: selectedIds } }, { multi: true }, function (error, removedCount) {
            database.find({}).sort({ lp: 1 }).exec(function (error, devices) {
                deleted += removedCount
                response.render("index02.hbs", {
                    tableHeader: tableHeader,
                    devices: devices,
                    message: `usunieto ${deleted} elementow`
                })
            })
        })
    }
})

// Restore the original data
app.get("/restore", function (request, response) {
    // 1. remove everything
    database.remove({}, { multi: true }, function (error, removedCount) {
        // 2. insert the original devices
        database.insert(initialDevices, function (error, insertedDevices) {
            // 3. load the table and show it
            deleted = 0
            database.find({}).sort({ lp: 1 }).exec(function (error, devices) {
                response.render("index02.hbs", {
                    tableHeader: tableHeader,
                    devices: devices,
                    message: "baza przywrócona"
                })
            })
        })
    })
})

app.listen(PORT, function (error) {
    if (error) {
        console.log("Server failed to start:", error)
        return
    }
    console.log("start serwera na porcie : " + PORT)
})