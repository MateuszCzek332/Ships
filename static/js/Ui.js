class Ui {
 
    constructor() {
        this.queueButton = document.getElementById("enterQueue")
        this.endGameScrean = document.getElementById("endGame")
        this.endGameMess = document.getElementById("endMess")
        this.endGameButton = document.getElementById("endButton")
        this.ffButton = document.getElementById("ffButton")
        this.move = document.getElementById("move")
        this.time = document.getElementById("time")

        this.ffButton.onclick = () => {
            net.surender()
            game.lose()
            this.lose()
        }
    }

    enterQueue = (tab) => {
        this.queueButton.style.display = "block"
        this.queueButton.onclick = () => {
            this.queueButton.style.display = "none"
            net.startQueue(tab)
        }
        document.onclick = null
        document.onmousemove = null

    }

    enemyMove = () => {
        this.ffButton.style.display = "none"
        this.move.innerText = "ruch przeciwnika"
        this.time.innerText = ""
    }

    myMove = () => {
        this.move.innerText = "twoj ruch"
        this.ffButton.style.display = "block"
    }

    start = (mess) => {
        if(mess.player1 == user)
            enemy = mess.player2
        else
            enemy = mess.player1
        
        console.log("enemy to: " + enemy)
    
    }

    win = () => {
        this.endGameMess.innerText = "WYGRAŁEŚ"
        this.endGameScrean.style.display = "block"
        this.move.style.display = "none"
        this.time.style.display = "none"
        this.endGameButton.onclick = () => {
            window.location.href = "profile.html?user=" + user
        }
    }

    lose = () => {
        this.endGameMess.innerText = "PRZEGRAŁEŚ"    
        this.endGameScrean.style.display = "block"
        this.move.style.display = "none"
        this.time.style.display = "none"
        this.endGameButton.onclick = () => {
            window.location.href = "profile.html?user=" + user
        }
    }

}