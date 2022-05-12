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
        this.selected = null // akualnie wybrany statek, wartosc pocztkowa null

        document.onclick = (event) => {

            this.mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouseVector, this.camera);

            const intersects = this.raycaster.intersectObjects(this.shipsToSet.children);
            if(intersects.length>0){
                this.selectShip(intersects[0].object.parent)
            }
        }

    }

    selectShip = (ship) => {
        if(this.selected != null)
            this.unselectShip()  

        this.selected = ship
        for(let i = 0; i<ship.children.length; i++)
            ship.children[i].material.color = {r:255, g:0, b:0}
    }

    unselectShip = () => {
        for(let i = 0; i< this.selected.children.length; i++)
            this.selected.children[i].material.color = {r:0, g:0, b:255}
    }

    createShipsToSet = () => {
        this.shipsToSet = new THREE.Object3D();
        this.shipsToSet.position.x = -400
        let m = 4 //ilosc pol najwiekszego statku 
        let zpos = -250 //wartosc pozycji z pierwszego statku 
        for(let i = m;i>0; i--){
            for(let j = m+1-i; j>0; j-- ){
                let statek = new Ship(i)
                statek.getShip().position.z = zpos
                zpos += 60
                this.shipsToSet.add(statek.getShip()) 
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