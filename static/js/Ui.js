class Ui {
 
    constructor() {
        this.queueButton = document.getElementById("enterQueue")
    }

    enterQueue = (tab) => {
        this.queueButton.style.display = "block"
        this.queueButton.onclick = () => {
            net.startQueue(tab)
        }
        document.onclick = null
        document.onmousemove = null

    }

}