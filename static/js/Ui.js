class Ui {
 
    constructor() {
        this.queueButton = document.getElementById("enterQueue")
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
        if(mess.player1 == user)
            console.log("enemy to: " + mess.player2)
        else
            console.log("enemy to: " + mess.player1)
    }

}