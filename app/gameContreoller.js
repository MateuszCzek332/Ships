const dataBases = require("./dataBases")

module.exports = {
    shoot: (data)  => {
        
        for(let i = 0; i<dataBases.rooms.length; i++){
            if(dataBases.rooms[i].isHere(data.userName)){
                dataBases.rooms[i].lastMove = data
                if(dataBases.rooms[i].player1 == data.userName && dataBases.rooms[i].player2Tab[data.x][data.z] == 2 )
                    return {shooted: true};
                else if(dataBases.rooms[i].player2 == data.userName && dataBases.rooms[i].player1Tab[data.x][data.z] == 2 )
                    return {shooted: true};
                else
                    return {shooted: false};
            }
        }
    },
    checkLastMohe: (data) => {
        for(let i = 0; i<dataBases.rooms.length; i++)
            if(dataBases.rooms[i].isHere(data.userName))
                return dataBases.rooms[i].lastMove
    },
    surender: (data)  => {
        for(let i = 0; i<dataBases.rooms.length; i++)
            if(dataBases.rooms[i].isHere(data.userName))
                dataBases.rooms[i].lastMove = data
    },
    end: (data) => {
        console.log(data)
        for(let i = 0; i<dataBases.rooms.length; i++)
            if(dataBases.rooms[i].isHere(data.winner)){
                dataBases.rooms.splice(i, 1);
                break
            }
        
        dataBases.profiles.findOne({userName: data.winner},function(e,doc){
            dataBases.profiles.update({userName: data.winner},{$set:{"wins":doc.wins +1}, $push: { history: data } },function(err,sonuc){
                if(err)
                    console.log(err)
            });
    
        });
        dataBases.profiles.findOne({userName: data.loser},function(e,doc){
            dataBases.profiles.update({userName: data.loser},{$set:{"loses":doc.loses +1}, $push: { history: data }},function(err,sonuc){
                if(err)
                    console.log(err)
            });
    
        })
    }
}