class Game {

    constructor() {

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 10000);
        this.renderer = new THREE.WebGLRenderer();
        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2()
        this.renderer.setClearColor(0xffffff);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.position.set(0, 1000, 0)
        this.camera.lookAt(this.scene.position)
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        const axes = new THREE.AxesHelper(1000)
        this.scene.add(axes)
        document.getElementById("root").append(this.renderer.domElement);
        this.render()
        this.init()
    }

    init = () => {
        this.createShipsToSet()
        this.createMyBoard()

        this.selected = null // akualnie wybrany statek, wartosc pocztkowa null
        this.hlField = null // akualnie podswietlane pola
        this.hlShip = null //podswietlany statek

        document.onclick = (event) => {

            this.mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouseVector, this.camera);

            const intersects = this.raycaster.intersectObjects(this.shipsToSet.children);
            if(intersects.length>0){
                this.selectShip(intersects[0].object)
            }
        }

        document.onmousemove = (event) => {

            if(this.selected != null){
                this.mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
                this.mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;

                this.raycaster.setFromCamera(this.mouseVector, this.camera);

                const intersects = this.raycaster.intersectObjects(this.myBoard.children);

                if(intersects.length == 0){
                    this.unhiglightShip()
                    this.unhiglightField()
                }
                else if(this.highlighted == null || intersects[0].object.position.x != this.highlighted.position.x || intersects[0].object.position.z != this.highlighted.position.z )
                    this.higlight(intersects[0].object)
                
            }
        }

    }

    selectShip = (ship) => {
        if(this.selected != null)
            this.unselectShip()  

        ship.material.color = {r:255, g:0, b:0}
        this.selected = ship
    }

    unselectShip = () => {
        this.selected.material.color = {r:0, g:0, b:255}
        this.selected = null
    }

    higlight = (field) => {
        if(this.hlShip == null){
            let ship = new Ship(this.selected.dlugosc)
            ship.position.y = 50
            ship.position.x = field.position.x -150 + (ship.a * ship.dlugosc - ship.a)/2
            ship.position.z = field.position.z -200
            this.scene.add(ship)
            this.hlShip = ship
        }
        else{
            this.hlShip.position.x = field.position.x -150 + (this.hlShip.a * this.hlShip.dlugosc -this.hlShip.a)/2 
            this.hlShip.position.z = field.position.z -200
        }

        this.unhiglightField()
        field.material.color = {r:255, g:0, b:0}
        this.highlighted = field
    }

    unhiglightField = () => {
        if(this.highlighted != null)
            this.highlighted.material.color = {r:0, g:85, b:255}
        
        this.highlighted = null;
    }

    unhiglightShip = () => {
        this.scene.remove(this.hlShip)
        this.hlShip = null;
    }

    createMyBoard = () => {
        this.myBoard = new THREE.Object3D();
        this.myFields = [];
        for(let i = 0; i < 10; i++){
            this.myFields[i] = []
            for(let j = 0; j<10; j++){
                let field =  new MyField()
                field.getCube().position.set(i*field.a, 0, j*field.a)
                this.myFields[i][j] = field.getCube()
                this.myBoard.add(this.myFields[i][j])
            }
        }
        this.myBoard.position.x = -150
        this.myBoard.position.z = -200
        //this.myBoard.position.set()
        this.scene.add(this.myBoard)
    }

    createShipsToSet = () => {
        this.shipsToSet = new THREE.Object3D();
        this.shipsToSet.position.x = -400
        let m = 4 //ilosc pol najwiekszego statku 
        let zpos = -250 //wartosc pozycji z pierwszego statku 
        for(let i = m;i>0; i--){
            for(let j = m+1-i; j>0; j-- ){
                let statek = new Ship(i)
                statek.position.z = zpos
                zpos += 60
                this.shipsToSet.add(statek) 
            }
        }
        this.scene.add(this.shipsToSet) 
    }

    render = () => {
        requestAnimationFrame(this.render);
        this.renderer.render(this.scene, this.camera);
        console.log("render leci")
    }
}