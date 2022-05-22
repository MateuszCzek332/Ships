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

        fetch("/joinQueue", options)
            .then(response => response.json())
            .then(mess => this.checkQueue())
            .catch(error => console.log(error));

    }


    checkQueue = () => { 

        let checking = setInterval(async () => {

            let w = await this.checkFetchPostAsync()
            console.log(w)
            if(w.status){
                clearInterval(checking)
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

        let response = await fetch("/checkQueue", options)

        if (!response.ok)
            return response.status
        else
            return await response.json()
    }
    

}