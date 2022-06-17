class Game {
    constructor() {
        //this.frames = 0
        //this.test_time = 0;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 10000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2()

        this.renderer.setClearColor(0xffffff);
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.camera.position.set(0, 750, 580)
        this.camera.lookAt(this.scene.position)
        this.camera.position.set(-175, 750, 580)

        document.getElementById("root").append(this.renderer.domElement);
        this.render()
        this.init()
    }

    init = async () => {
        await new Promise((resolve) => {
            const loader = new OBJLoader();

            loader.load(
                // resource URL
                "../img/model.obj",

                // onLoad callback
                // Here the loaded data is assumed to be an object
                (obj) => {
                    // Add the loaded object to the scene
                    console.log(obj)
                    window.shipmodel = obj.children[0]
                    resolve()
                },

                // onProgress callback
                function (xhr) {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },

                // onError callback
                function (err) {
                    console.error('An error happened');
                }
            );
        })

        this.createShipsToSet()
        this.createMyBoard()

        this.myPkt = 0
        this.enemyPkt = 0
        this.orientation = true; // orientacja statku do postawienia - true poziomy, false pionowy
        this.selected = null // akualnie wybrany statek, wartosc pocztkowa null
        this.hlField = null // pole na ktorym jestem 
        this.hlFields = [] // pola ktore są podswietlane
        this.hlShip = null //podswietlany statek
        this.move = false //czy kolej gracza na strzelanie 

        document.getElementById("root").oncontextmenu = (e) => {
            e.preventDefault();
            if (this.hlShip != null)
                this.rotateShip()
        }

        document.onclick = (event) => {

            this.mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouseVector, this.camera);

            this.clickToSelect()
            if (this.selected != null)
                this.clickToPlaceShip()
        }

        document.onmousemove = (event) => {
            if (this.selected != null) {
                //this.test_time = Date.now()
                this.mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
                this.mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;

                this.raycaster.setFromCamera(this.mouseVector, this.camera);

                const intersects = this.raycaster.intersectObjects(this.myBoard.children);
                if (intersects.length == 0) {
                    this.unhiglightShip()
                    this.unhiglightField()
                }

                else if (this.hlField == null || intersects[0].object.position.x != this.hlField.position.x || intersects[0].object.position.z != this.hlField.position.z)
                    this.higlight(intersects[0].object)

            }
        }
        // setInterval(()=>{
        //     console.log(this.frames)
        //     this.frames = 0
        // }, 1000)
    }

    clickToSelect = () => {
        const intersects = this.raycaster.intersectObjects(this.shipsToSet.children);
        if (intersects.length > 0) {
            this.selectShip(intersects[0].object)
        }
    }

    clickToPlaceShip = () => {
        const intersects = this.raycaster.intersectObjects(this.myBoard.children);
        if (intersects.length > 0) {
            let x = intersects[0].object.x
            let z = intersects[0].object.z
            if (this.checkShip(x, z)) {
                switch (true) {
                    case this.orientation && x < 10 - this.selected.dlugosc:
                        for (let i = x - 1; i <= x + this.selected.dlugosc; i++)
                            for (let j = z - 1; j <= z + 1; j++)
                                if (i >= 0 && j >= 0 && j < 10) {
                                    if (i >= x && i < x + this.selected.dlugosc && j == z)
                                        this.myTab[i][j] = 2
                                    else
                                        this.myTab[i][j] = 1
                                }
                        break
                    case this.orientation && x >= 10 - this.selected.dlugosc:
                        for (let i = 9; i >= 9 - this.selected.dlugosc; i--)
                            for (let j = z - 1; j <= z + 1; j++)
                                if (j >= 0 && j < 10) {
                                    if (i > 9 - this.selected.dlugosc && j == z)
                                        this.myTab[i][j] = 2
                                    else
                                        this.myTab[i][j] = 1
                                }
                        break
                    case !this.orientation && z <= 10 - this.selected.dlugosc:
                        for (let i = x - 1; i <= x + 1; i++)
                            for (let j = z - 1; j <= z + this.selected.dlugosc; j++)
                                if (i >= 0 && j >= 0 && i < 10) {
                                    if (j >= z && j < z + this.selected.dlugosc && i == x)
                                        this.myTab[i][j] = 2
                                    else
                                        this.myTab[i][j] = 1
                                }
                        break
                    case !this.orientation && z > 10 - this.selected.dlugosc:
                        for (let i = x - 1; i <= x + 1; i++)
                            for (let j = 9; j >= 9 - this.selected.dlugosc; j--)
                                if (i >= 0 && i < 10) {
                                    if (j > 9 - this.selected.dlugosc && i == x)
                                        this.myTab[i][j] = 2
                                    else
                                        this.myTab[i][j] = 1
                                }
                        break
                }
                this.hlShip = null
                this.unhiglightField()
                this.shipsToSet.remove(this.selected)
                this.checkBoard()
            }
        }
    }

    checkShip = (x, z) => {
        switch (true) {
            case this.orientation && x <= 10 - this.selected.dlugosc:
                for (let i = x; i < x + this.selected.dlugosc; i++)
                    if (this.myTab[i][z] == 1 || this.myTab[i][z] == 2)
                        return false
                break
            case this.orientation && x > 10 - this.selected.dlugosc:
                for (let i = 9; i >= 10 - this.selected.dlugosc; i--)
                    if (this.myTab[i][z] == 1 || this.myTab[i][z] == 2)
                        return false
                break
            case !this.orientation && z <= 10 - this.selected.dlugosc:
                for (let i = z; i < z + this.selected.dlugosc; i++)
                    if (this.myTab[x][i] == 1 || this.myTab[x][i] == 2)
                        return false
                break
            case !this.orientation && z > 10 - this.selected.dlugosc:
                for (let i = 9; i >= 10 - this.selected.dlugosc; i--)
                    if (this.myTab[x][i] == 1 || this.myTab[x][i] == 2)
                        return false
                break
        }
        return true
    }

    checkBoard = () => {

        if (this.shipsToSet.children.length == 0) {
            this.selected = null
            this.hlShip = null
            this.scene.remove(this.shipsToSet)
            ui.enterQueue(this.myTab)
        }
        else
            this.selectShip(this.shipsToSet.children[0])

    }
 
    selectShip = (ship) => {
        if (this.selected != null)
            this.unselectShip()

        ship.material.color.set(0xff0000)
        this.selected = ship
    }

    unselectShip = () => {
        this.selected.material.color.set(0x0000ff)
        this.selected = null
    }

    higlight = (field) => {
        if (this.hlShip == null)
            this.respownShip(field)
        else
            this.moveShip(field)

        this.unhiglightField()

        let color
        if (this.checkShip(field.x, field.z))
            color = 0x00ff00
        else
            color = 0xff0000

        switch (true) {
            case this.orientation && field.x <= 10 - this.selected.dlugosc:
                for (let i = field.x; i < field.x + this.selected.dlugosc; i++) {
                    this.myFields[i][field.z].material.color.set(color)
                    this.hlFields.push(this.myFields[i][field.z])
                }
                break
            case this.orientation && field.x > 10 - this.selected.dlugosc && field.position.z != this.hlShip.position.z:
                for (let i = 9; i >= 10 - this.selected.dlugosc; i--) {
                    this.myFields[i][field.z].material.color.set(color)
                    this.hlFields.push(this.myFields[i][field.z])
                }
                break
            case !this.orientation && field.z <= 10 - this.selected.dlugosc:
                for (let i = field.z; i < field.z + this.selected.dlugosc; i++) {
                    this.myFields[field.x][i].material.color.set(color)
                    this.hlFields.push(this.myFields[field.x][i])
                }
                break
            case !this.orientation && field.z > 10 - this.selected.dlugosc && field.position.x != this.hlShip.position.x:
                for (let i = 9; i >= 10 - this.selected.dlugosc; i--) {
                    this.myFields[field.x][i].material.color.set(color)
                    this.hlFields.push(this.myFields[field.x][i])
                }
                break
        }

        this.hlField = field
        //console.log(Date.now() - this.test_time)
    }

    respownShip = (field) => {
        let ship = new Ship(this.selected.dlugosc)
        ship.position.y = 50
        if (this.orientation) {
            if (field.position.x / 50 > 10 - this.selected.dlugosc) {
                let x = 10 - this.selected.dlugosc
                let z = field.position.z / 50
                ship.position.x = this.myFields[x][z].position.x - 400 + (ship.a * ship.dlugosc - ship.a) / 2
                ship.position.z = this.myFields[x][z].position.z - 200
            }
            else {
                ship.position.x = field.position.x - 400 + (ship.a * ship.dlugosc - ship.a) / 2
                ship.position.z = field.position.z - 200
            }
        }
        else {
            ship.rotate(!this.orientation)
            if (field.position.z / 50 > 10 - this.selected.dlugosc) {
                let x = field.position.z / 50
                let z = 10 - this.selected.dlugosc
                ship.position.x = this.myFields[x][z].position.x - 400
                ship.position.z = this.myFields[x][z].position.z - 200 + (ship.a * ship.dlugosc - ship.a) / 2
            }
        }
        this.scene.add(ship)
        this.hlShip = ship
    }

    moveShip = (field) => {
        switch (true) {
            case this.orientation && field.position.x / 50 <= 10 - this.selected.dlugosc:
                this.hlShip.position.x = field.position.x - 400 + (this.hlShip.a * this.hlShip.dlugosc - this.hlShip.a) / 2
                this.hlShip.position.z = field.position.z - 200
                break
            case this.orientation && field.position.x / 50 > 10 - this.selected.dlugosc && field.position.z != this.hlShip.position.z:
                let x1 = 10 - this.selected.dlugosc
                let z1 = field.position.z / 50
                this.hlShip.position.x = this.myFields[x1][z1].position.x - 400 + (this.hlShip.a * this.hlShip.dlugosc - this.hlShip.a) / 2
                this.hlShip.position.z = field.position.z - 200
                break
            case !this.orientation && field.position.z / 50 <= 10 - this.selected.dlugosc:
                this.hlShip.position.x = field.position.x - 400
                this.hlShip.position.z = field.position.z - 200 + (this.hlShip.a * this.hlShip.dlugosc - this.hlShip.a) / 2
                break
            case !this.orientation && field.position.z / 50 > 10 - this.selected.dlugosc && field.position.x != this.hlShip.position.x:
                let x2 = field.position.z / 50
                let z2 = 10 - this.selected.dlugosc
                this.hlShip.position.z = this.myFields[x2][z2].position.z - 200 + (this.hlShip.a * this.hlShip.dlugosc - this.hlShip.a) / 2
                this.hlShip.position.x = field.position.x - 400
                break
        }
    }

    rotateShip = () => {

        if (this.orientation) {
            this.hlShip.rotate(this.orientation)
            this.orientation = false
        }
        else {
            this.hlShip.rotate(this.orientation)
            this.orientation = true
        }
        this.higlight(this.hlField)
    }

    higlight = (field) => {
        if (this.hlShip == null)
            this.respownShip(field)
        else
            this.moveShip(field)

        this.unhiglightField()

        let color
        if (this.checkShip(field.x, field.z))
            color = 0x00ff00
        else
            color = 0xff0000

        switch (true) {
            case this.orientation && field.x <= 10 - this.selected.dlugosc:
                for (let i = field.x; i < field.x + this.selected.dlugosc; i++) {
                    this.myFields[i][field.z].material.color.set(color)
                    this.hlFields.push(this.myFields[i][field.z])
                }
                break
            case this.orientation && field.x > 10 - this.selected.dlugosc && field.position.z != this.hlShip.position.z:
                for (let i = 9; i >= 10 - this.selected.dlugosc; i--) {
                    this.myFields[i][field.z].material.color.set(color)
                    this.hlFields.push(this.myFields[i][field.z])
                }
                break
            case !this.orientation && field.z <= 10 - this.selected.dlugosc:
                for (let i = field.z; i < field.z + this.selected.dlugosc; i++) {
                    this.myFields[field.x][i].material.color.set(color)
                    this.hlFields.push(this.myFields[field.x][i])
                }
                break
            case !this.orientation && field.z > 10 - this.selected.dlugosc && field.position.x != this.hlShip.position.x:
                for (let i = 9; i >= 10 - this.selected.dlugosc; i--) {
                    this.myFields[field.x][i].material.color.set(color)
                    this.hlFields.push(this.myFields[field.x][i])
                }
                break
        }

        this.hlField = field
        //console.log(Date.now() - this.test_time)
    }

    unhiglightField = () => {
        if (this.hlFields.length > 0)
            for (let i = 0; i < this.hlFields.length; i++)
                this.hlFields[i].material.color.set(0xffffff)

        this.hlField = null;
        this.hlFields.length = 0;
    }

    unhiglightShip = () => {
        this.scene.remove(this.hlShip)
        this.hlShip = null;
    }

    shoot = async (event) => {
        if(this.move){
            this.mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
            this.raycaster.setFromCamera(this.mouseVector, this.camera);
            const intersects = this.raycaster.intersectObjects(this.enemyBoard.children);

            if(intersects.length>0 && intersects[0].object.canShoot){

                clearInterval(this.timer)
                this.move = false
                ui.enemyMove()

                clearInterval(this.timer)
                this.move = false
                ui.enemyMove()

                let m = {
                    userName: user,
                    surender: false,
                    x: intersects[0].object.x,
                    z: intersects[0].object.z
                }

                let w = await net.shootFetchPostAsync(m)

                if (w.shooted) {
                    intersects[0].object.material.color.set(0xff0000)
                    this.myPkt++
                    this.checkWin()
                } else {
                    intersects[0].object.material.color.set(0x00ff00)
                    net.checkLastMove()
                }
                intersects[0].object.canShoot = false

            }
        }
    }

    enemyMove = (w) => {
        if (w.surender)
            this.win()

        if (this.myTab[w.x][w.z] == 2) {
            this.myFields[w.x][w.z].material.color.set(0xff0000)
            this.enemyPkt++
            this.checkLose()
        }
        else
            this.myFields[w.x][w.z].material.color.set(0x00ff00)

        this.myTimer()
        this.move = true
    }

    start = (w) => {
        new TWEEN.Tween(this.camera.position)
            .to({
                x: 175,
                y: 800,
                z: 650
            }, 2000)
            .easing(TWEEN.Easing.Linear.None)
            .start();

        this.createEnemyBoard()
        document.onclick = (e) => {
            this.shoot(e)
        }

        if(w.userName != user){
            this.move = true
            this.myTimer()
        }
        else{
            net.checkLastMove()
            ui.enemyMove()
        }
    }

    myTimer = () => {

        ui.myMove()
        this.time = 30;
        this.timer = setInterval(async () => {
            ui.time.innerText = this.time
            this.time--;
            if (this.time < 0) {
                net.surender()
                this.lose()
            }

        }, 1000)
    }

    checkWin = () => {
        if (this.myPkt == 20)
            this.win()
        else
            net.checkLastMove()
    }

    checkLose = () => {
        if (this.enemyPkt == 20)
            this.lose()
    }

    win = () => {
        this.move = false
        document.onclick = null
        net.win()
        ui.win()
    }

    lose = () => {
        this.move = false
        document.onclick = null
        ui.lose();
        clearInterval(this.timer)
    }
    // Tworzenie planszy przeciwnika - w nią gracz bedzie klikal w celu oddania strzalu
    createEnemyBoard = () => {
        this.enemyBoard = new THREE.Object3D();
        for(let i = 0; i < 10; i++)
            for(let j = 0; j<10; j++)
                this.enemyBoard.add(new EnemyField(i, j))
        
        this.enemyBoard.position.x = 270
        this.enemyBoard.position.z = -200
        this.scene.add(this.enemyBoard)
    }
    //tworzenie planszy gracza do stawiania statków oraz tablicy trzymającej informacje o położeniu statków
    createMyBoard = () => {
        this.myBoard = new THREE.Object3D();
        this.myFields = [];
        this.myTab = []
        for (let i = 0; i < 10; i++) {
            this.myFields[i] = []
            this.myTab[i] = []
            for (let j = 0; j < 10; j++) {
                this.myTab[i][j] = 0
                let field = new MyField(i, j)
                this.myFields[i][j] = field
                this.myBoard.add(field)
            }
        }
        this.myBoard.position.x = -400
        this.myBoard.position.z = -200
        this.scene.add(this.myBoard)
    }
  
    createShipsToSet = () => {
        this.shipsToSet = new THREE.Object3D();
        this.shipsToSet.position.x = -700
        let m = 4 //ilosc pol najwiekszego statku 
        let zpos = -250 //wartosc pozycji z pierwszego statku 
        for (let i = m; i > 0; i--) {
            for (let j = m + 1 - i; j > 0; j--) {
                let statek = new Ship(i)
                statek.position.z = zpos
                zpos += 60
                this.shipsToSet.add(statek)
            }
        }
        this.scene.add(this.shipsToSet)
    }

    render = () => {
        // this.frames++
        TWEEN.update();
        requestAnimationFrame(this.render);
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()

        this.renderer.render(this.scene, this.camera)
    }
}