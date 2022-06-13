const dataBases = require("./dataBases")
const Room = require("./Room")

module.exports = {
    join: (data)  => {
        if(dataBases.rooms.length == 0 || !dataBases.rooms[dataBases.rooms.length-1].canJoin )
            dataBases.rooms.push(new Room(data.userName, data.userTab))
        else
            dataBases.rooms[dataBases.rooms.length-1].join( data.userName, data.userTab )

        return dataBases.rooms;
    },
    check: (data) => {
        for(let i = 0; i< dataBases.rooms.length; i++)
            if(dataBases.rooms[i].isHere(data.userName) && !dataBases.rooms[i].canJoin)
                return {
                    status: true,
                    lastMove: dataBases.rooms[i].lastMove, 
                    player1: dataBases.rooms[i].player1,
                    player2: dataBases.rooms[i].player2
                }
        return {status: false}
    }
}