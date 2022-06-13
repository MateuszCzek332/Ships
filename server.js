const express = require("express")
const Room = require("./application/Room")
const Datastore = require('nedb');
const Profil = require("./application/Profil");
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
    odp = {
        status: false,
    }

    for(let i = 0; i<rooms.length; i++){
        if(rooms[i].isHere(data.userName) && !rooms[i].canJoin){
            odp.status = true
            odp.lastMove = rooms[i].lastMove 
            odp.player1 = rooms[i].player1
            odp.player2 = rooms[i].player2
            break
        }
    }

    res.send(odp)

})

app.post("/game/shoot", function (req, res) {

    let data = JSON.parse(req.body)

    let odp = {
        shooted: false
    }

    for(let i = 0; i<rooms.length; i++){
        if(rooms[i].isHere(data.userName)){
            if(rooms[i].player1 == data.userName && rooms[i].player2Tab[data.x][data.z] ==2 )
                odp.shooted = true;
            else if(rooms[i].player2 == data.userName && rooms[i].player1Tab[data.x][data.z] ==2 )
                odp.shooted = true;

            rooms[i].lastMove = data
        }
    }
    res.send(odp)

})

app.post("/game/lastMove", function (req, res) {

    let data = JSON.parse(req.body)

    let odp

    for(let i = 0; i<rooms.length; i++){
        if(rooms[i].isHere(data.userName)){
            odp = rooms[i].lastMove
            break
        }
    }

    res.send(odp)

})

app.post("/game/end", function (req, res) {

    let data = JSON.parse(req.body)

    console.log(data)

    for(let i = 0; i<rooms.length; i++){
        if(rooms[i].isHere(data.winner)){
            rooms.splice(i, 1);
            break
        }
    }

    profiles.findOne({userName: data.winner},function(e,doc){
        profiles.update({userName: data.winner},{$set:{"wins":doc.wins +1}, $pop: { history: data } },function(err,sonuc){
            if(err)
                console.log(err)
        });

    });

    profiles.findOne({userName: data.loser},function(e,doc){
        profiles.update({userName: data.loser},{$set:{"loses":doc.loses +1}, $pop: { history: data }},function(err,sonuc){
            if(err)
                console.log(err)
        });

    })


    res.send(data)

})

app.post("/game/lastMove", function (req, res) {

    let data = JSON.parse(req.body)

    let odp

    for(let i = 0; i<rooms.length; i++){
        if(rooms[i].isHere(data.userName)){
            odp = rooms[i].lastMove
            break
        }
    }

    res.send(odp)

})

app.post("/user/profile", function (req, res) {

    let data = JSON.parse(req.body)

    profiles.findOne({userName: data.profile},function(e,doc){
        res.send(doc)
    });

})

app.use(express.static('static'))

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})