var express = require("express")
const fs = require("fs");
const Datastore = require('nedb')
var app = express()
const PORT = 3000;

app.use(express.text())


app.use(express.static('static'))

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})