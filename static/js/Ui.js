class Ui {

    constructor() {
        this.queueButton = document.getElementById("enterQueue")
        this.endGameScrean = document.getElementById("endGame")
        this.endGameMess = document.getElementById("endMess")
        this.endGameButton = document.getElementById("endButton")
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

    start = (mess) => {
        if (mess.player1 == user)
            enemy = mess.player2
        else
            enemy = mess.player1

        console.log("enemy to: " + enemy)

    }

    win = () => {
        console.log("XD")
        this.endGameMess.innerText = "WYGRAŁEŚ"
        this.endGameScrean.style.display = "block"
        this.endGameButton.onclick = () => {
            window.location.href = "profile.html?user=" + user
        }
    }

    lose = () => {
        this.endGameMess.innerText = "PRZEGRAŁEŚ"
        this.endGameScrean.style.display = "block"
        this.endGameButton.onclick = () => {
            window.location.href = "profile.html?user=" + user
        }
    }

}