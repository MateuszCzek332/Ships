const express = require("express")
const Datastore = require('nedb')
const app = express()
const PORT = 3000;

const users = new Datastore({
    filename: 'users.db',
    autoload: true
});

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
            res.send({status: true})  
        }
    });

})

app.use(express.static('static'))

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})