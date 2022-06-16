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
        this.camera.position.set(0, 800, 700)
        this.camera.lookAt(this.scene.position)
        this.camera.position.set(-170, 800, 700)

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
        this.hlField = null // akualnie podswietlane pola
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
                else if (this.highlighted == null || intersects[0].object.position.x != this.highlighted.position.x || intersects[0].object.position.z != this.highlighted.position.z)
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
            let x = intersects[0].object.position.x / 50
            let z = intersects[0].object.position.z / 50
            if (this.checkShip(x, z)) {
                if (this.orientation) {
                    if (x <= 10 - this.selected.dlugosc) {
                        for (let i = x - 1; i <= x + this.selected.dlugosc; i++)
                            for (let j = z - 1; j <= z + 1; j++)
                                if (i >= 0 && j >= 0 && i < 10 & j < 10) {
                                    if (i >= x && i < x + this.selected.dlugosc && j == z)
                                        this.myTab[i][j] = 2
                                    else
                                        this.myTab[i][j] = 1
                                }
                    }
                    else {
                        for (let i = 9; i >= 9 - this.selected.dlugosc; i--)
                            for (let j = z - 1; j <= z + 1; j++)
                                if (i >= 0 && j >= 0 && i < 10 & j < 10) {
                                    if (i <= 9 && i > 9 - this.selected.dlugosc && j == z)
                                        this.myTab[i][j] = 2
                                    else
                                        this.myTab[i][j] = 1
                                }
                    }
                }
                else {
                    if (z <= 10 - this.selected.dlugosc) {
                        for (let i = x - 1; i <= x + 1; i++)
                            for (let j = z - 1; j <= z + this.selected.dlugosc; j++)
                                if (i >= 0 && j >= 0 && i < 10 & j < 10)
                                    if (j >= z && j < z + this.selected.dlugosc && i == x)
                                        this.myTab[i][j] = 2
                                    else
                                        this.myTab[i][j] = 1

                    }
                    else {
                        for (let i = z - 1; i <= z + 1; i++)
                            for (let j = 9; j >= 9 - this.selected.dlugosc; j--)
                                if (i >= 0 && j >= 0 && i < 10 & j < 10)
                                    if (j <= 9 && j > 9 - this.selected.dlugosc && i == z)
                                        this.myTab[i][j] = 2
                                    else
                                        this.myTab[i][j] = 1
                    }
                }
                this.unhiglightField()
                this.shipsToSet.remove(this.selected)
                this.checkBoard()
                this.selected = null
                this.hlShip = null
            }

        }
    }

    checkShip = (x, z) => {
        if (this.orientation) {
            if (x <= 10 - this.selected.dlugosc) {

                for (let i = x; i < x + this.selected.dlugosc; i++)
                    if (this.myTab[i][z] == 1)
                        return false

            }
            else {
                for (let i = 9; i > 9 - this.selected.dlugosc; i--)
                    if (this.myTab[i][z] == 1)
                        return false

            }
        } else {
            if (z <= 10 - this.selected.dlugosc) {

                for (let i = z; i < z + this.selected.dlugosc; i++)
                    if (this.myTab[x][i] == 1)
                        return false

            }
            else {
                for (let i = 9; i > 9 - this.selected.dlugosc; i--)
                    if (this.myTab[x][z] == 1)
                        return false

            }
        }
        return true
    }

    checkBoard = () => {
        if (this.shipsToSet.children.length == 0) {

            this.scene.remove(this.shipsToSet)
            ui.enterQueue(this.myTab)
        }
    }

    selectShip = (ship) => {
        if (this.selected != null)
            this.unselectShip()

        ship.material.color = { r: 255, g: 0, b: 0 }
        this.selected = ship
    }

    unselectShip = () => {
        this.selected.material.color = { r: 0, g: 0, b: 255 }
        this.selected = null
    }

    higlight = (field) => {
        if (this.hlShip == null)
            this.respownShip(field)
        else
            this.moveShip(field)
        //console.log(field)
        this.unhiglightField()
        field.material.color.set(0xff0000) //= { r: 255, g: 0, b: 0 } //Ustawic kolory
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
        this.moveShip(this.hlField)
    }

    unhiglightField = () => {
        if (this.hlField != null)
            this.hlField.material.color.set(0xffffff) //= { r: 255, g: 255, b: 255 }

        this.hlField = null;
    }

    unhiglightShip = () => {
        this.scene.remove(this.hlShip)
        this.hlShip = null;
    }

    shoot = async (event) => {
        if (this.move) {
            this.mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouseVector, this.camera);

            const intersects = this.raycaster.intersectObjects(this.enemyBoard.children);

            if (intersects.length > 0 && intersects[0].object.canShoot) {

                let m = {
                    userName: user,
                    x: intersects[0].object.x,
                    z: intersects[0].object.z
                }

                let w = await net.shootFetchPostAsync(m)
                this.move = false

                if (w.shooted) {
                    intersects[0].object.material.color = { r: 255, g: 0, b: 0 }
                    this.myPkt++
                    this.checkWin()
                } else
                    intersects[0].object.material.color = { r: 0, g: 255, b: 0 }
                intersects[0].object.canShoot = false

                net.checkLastMove()
            }
        }
    }

    enemyMove = (w) => {

        if (this.myTab[w.x][w.z] == 2) {
            this.myFields[w.x][w.z].material.color = { r: 255, g: 0, b: 0 }
            this.enemyPkt++
            this.checkWin()
        }
        else
            this.myFields[w.x][w.z].material.color = { r: 0, g: 255, b: 0 }

        this.move = true
    }

    start = (w) => {
        new TWEEN.Tween(this.camera.position)
            .to({
                x: 180,
                y: 1000,
                z: 900
            }, 2000)
            .easing(TWEEN.Easing.Linear.None)
            .start();

        this.createEnemyBoard()
        document.onclick = (e) => {
            this.shoot(e)
        }
        if (w.userName != user)
            this.move = true
        else
            net.checkLastMove()
    }

    createEnemyBoard = () => {
        this.enemyBoard = new THREE.Object3D();
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                let field = new EnemyField(i, j)
                this.enemyBoard.add(field)
            }
        }
        this.enemyBoard.position.x = 270
        this.enemyBoard.position.z = -200
        this.scene.add(this.enemyBoard)
    }

    checkWin = () => {
        if (this.myPkt == 3)
            this.win()
        else if (this.enemyPkt == 3)
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
        ui.lose()
    }

    createMyBoard = () => {
        this.myBoard = new THREE.Object3D();
        this.myFields = [];
        this.myTab = []
        for (let i = 0; i < 10; i++) {
            this.myFields[i] = []
            this.myTab[i] = []
            for (let j = 0; j < 10; j++) {
                this.myTab[i][j] = 0
                let field = new MyField()
                field.getCube().position.set(i * field.a, 0, j * field.a)
                this.myFields[i][j] = field.getCube()
                this.myBoard.add(this.myFields[i][j])
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