const gameController = require("./app/gameContreoller.js")
const queueController = require("./app/queueContreoller.js")
const userController = require("./app/userContreoller.js")
const dataBases = require("./app/dataBases.js")
const Profil = require("./app/Profil")
const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.text())
app.post("/addUser", function (req, res) {

    let data = JSON.parse(req.body)

    dataBases.users.find({ userName: data.userName}, function (err, docs) {
        if(docs.length > 0 ) // spprawdzenie czy istnieje taki urzytkownik jezeli nie dodanie go do bazy 
            res.send({status: false})
        else{
            dataBases.users.insert(data, function (err, newDoc) {
                //console.log(newDoc)
            });
            dataBases.profiles.insert(new Profil(data.userName) , function (err, newDoc) {

                //console.log(newDoc)
            });
            res.send({ status: true })
        }
    });

})

app.post("/loginUser", function (req, res) {

    let data = JSON.parse(req.body)

    dataBases.users.find({ userName: data.userName, pass: data.pass}, function (err, docs) {
        if(docs.length > 0 ) // spprawdzenie czy w bazie istnieje user z takim loginem i haslem
            data.status = true
        else
            data.status = false
        res.send(data)
    });
})

app.post("/user/profile", function (req, res) {

    let data = JSON.parse(req.body)

    dataBases.profiles.findOne({ userName: data.profile }, function (e, doc) {
        res.send(doc)
    });

})

app.post("/queue/join", function (req, res) {
    let data = JSON.parse(req.body)
    let ans = queueController.join(data)
    res.send(ans)
})

app.post("/queue/check", function (req, res) {
    let data = JSON.parse(req.body)
    let ans = queueController.check(data)
    res.send(ans)
})

app.post("/game/shoot", function (req, res) {

    let data = JSON.parse(req.body)
    let ans = gameController.shoot(data)
    res.send(ans)
})

app.post("/game/lastMove", function (req, res) {
    let data = JSON.parse(req.body)
    let ans = gameController.checkLastMove(data)
    res.send(ans)

})

app.post("/game/surender", function (req, res) {
    let data = JSON.parse(req.body)
    gameController.surender(data)
    res.send(data)

})

app.post("/game/end", function (req, res) {

    let data = JSON.parse(req.body)
    gameController.end(data)
    res.send(data)

})


app.use(express.static('static'))

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})