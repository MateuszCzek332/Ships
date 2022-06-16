const Profil = require("./Profil");
const dataBases = require("./dataBases")

module.exports = {
    register: (data) => {
        dataBases.users.find({ userName: data.userName }, function (err, docs) {
            if (docs.length > 0) // spprawdzenie czy istnieje taki urzytkownik jezeli nie dodanie go do bazy 
                return { status: false }
            else {
                dataBases.users.insert(data, function (err, newDoc) {
                    //console.log(newDoc)
                });
                dataBases.profiles.insert(new Profil(data.userName), function (err, newDoc) {
                    //console.log(newDoc)
                });
                return { status: false }
            }
        });
    },
    login: (data) => {
        users.find({ userName: data.userName, pass: data.pass }, function (err, docs) {
            if (docs.length > 0) // spprawdzenie czy w bazie istnieje user z takim loginem i haslem
                return { status: true }
            else
                return { status: false }
        });
    },
    getProfile: async (data) => {
        dataBases.profiles.findOne({ userName: data.profile }, async function (e, doc) {
            return await doc
        });
    }
}