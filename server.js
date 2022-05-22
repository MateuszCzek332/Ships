const express = require("express")
const Room = require("./app/Room")
const Datastore = require('nedb');
const Profil = require("./app/Profil");
const app = express()
const PORT = 3000;

const users = new Datastore({
    filename: 'users.db',
    autoload: true
});

const profiles = new Datastore({
    filename: 'profiles.db',
    autoload: true
});

let rooms = []

app.use(express.text())
app.post("/addUser", function (req, res) {

    let data = JSON.parse(req.body)

    users.find({ userName: data.userName}, function (err, docs) {
        if(docs.length > 0 ) // spprawdzenie czy istnieje taki urzytkownik jezeli nie dodanie go do bazy 
            res.send({status: false})
        else{
            users.insert(data, function (err, newDoc) {
                //console.log(newDoc)
            });
            profiles.insert(new Profil(data.userName) , function (err, newDoc) {
                //console.log(newDoc)
            });
            res.send({status: true})  
        }
    });

})

app.post("/loginUser", function (req, res) {

    let data = JSON.parse(req.body)
    users.find({ userName: data.userName, pass: data.pass}, function (err, docs) {
        if(docs.length > 0 ) // spprawdzenie czy w bazie istnieje user z takim loginem i haslem
            data.status = true
        else
            data.status = false
        res.send(data)
    });
})

app.post("/joinQueue", function (req, res) {

    let data = JSON.parse(req.body)
    if(rooms.length == 0 || !rooms[rooms.length-1].canJoin )
        rooms.push(new Room(data.userName, data.userTab))
    else
        rooms[rooms.length-1].join( data.userName, data.userTab )

    console.log(rooms.length)
    
    res.send(data)

})

app.post("/checkQueue", function (req, res) {

    let data = JSON.parse(req.body)
    console.log(data)
    odp = {
        status: false,
        user: null
    }

    for(let i = 0; i<rooms.length; i++){
        if(rooms[i].isHere(data.userName) && !rooms[i].canJoin){
            odp.status = true
            odp.user = rooms[i].lastMove 
        }
    }

    res.send(odp)

})

app.use(express.static('static'))

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})