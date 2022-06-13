class Net {
    constructor(){
        this.a = 1
    }

    startQueue = (tab) =>{ 

        let data = {
            userName: user,
            userTab: tab
        }

        const options = {
            method: "POST",
            body: JSON.stringify(data)
        };

        fetch("/queue/join", options)
            .then(response => response.json())
            .then(this.checkQueue())
            .catch(error => console.log(error));

    }


    checkQueue = () => { 

        let checking = setInterval(async () => {

            let w = await this.checkFetchPostAsync()
            if(w.status){
                clearInterval(checking)
                ui.start(w)
                game.start(w.lastMove)
            }


        },1000)
    }

    checkFetchPostAsync = async () => {

        let data = {
            userName: user,
        }

        const options = {
            method: "POST",
            body: JSON.stringify(data)
        };

        let response = await fetch("/queue/check", options)

        if (!response.ok)
            return response.status
        else
            return await response.json()
    }

    shootFetchPostAsync = async (data) => {

        const options = {
            method: "POST",
            body: JSON.stringify(data)
        };

        let response = await fetch("/game/shoot", options)

        if (!response.ok)
            return response.status
        else
            return await response.json()
    }

    checkLastMove = () => { 

        let checking = setInterval(async () => {

            let w = await this.checkLastMoveFetchPostAsync()
            if(w.userName != user){
                game.enemyMove(w)
                clearInterval(checking)
            }

        },1000)
    }

    surender = async () => {

        let data = {
            userName: user,
            surender: true
        }

        const options = {
            method: "POST",
            body: JSON.stringify(data)
        };

        let response = await fetch("/game/surender", options)

        if (!response.ok)
            return response.status
        else
            return await response.json()
    }

    checkLastMoveFetchPostAsync = async () => {

        let data = {
            userName: user,
        }

        const options = {
            method: "POST",
            body: JSON.stringify(data)
        };

        let response = await fetch("/game/lastMove", options)

        if (!response.ok)
            return response.status
        else
            return await response.json()
    }
    
    win = async () => {

        const data = {
            winner: user,
            loser: enemy,
            winnerPkt: game.myPkt,
            loserPkt: game.enemyPkt
        } 

        const options = {
            method: "POST",
            body: JSON.stringify(data)
        };

        setTimeout( async() => {
            await fetch("/game/end", options)
        }, 1000)


    }

}