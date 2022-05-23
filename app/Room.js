module.exports = class Room {
    constructor(player1, player1Tab){
        this.player1 = player1
        this.player2 = null
        this.player1Tab = player1Tab
        this.player2Tab = null
        this.lastMove = null
        this.canJoin = true
    }

    join = (player2, tab2) => {
        this.player2 = player2
        this.player2Tab = tab2
        this.canJoin = false

        this.lastMove  = {
            userName: player2,
            x: null,
            z: null
        }
    }

    isHere = (user) => {
        if(this.player1 == user || this.player2 == user)
            return true
        return false
    }
}