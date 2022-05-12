class Ship {

    a = 40;

    constructor(dl) {
        this.container = new THREE.Object3D();
        this.container.name = "ship"
        this.init(dl)
    }

    init(dl) {

        const geometry = new THREE.BoxGeometry(this.a, this.a, this.a);

        const material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0x0000ff, 
            transparent: true, 
        })

        for(let i=0; i<dl; i++){        
            let cube = new THREE.Mesh(geometry, material);
            cube.position.x = i * (this.a )
            cube.name = "shipPart"
            this.container.add(cube)
        }

    }

    getShip() {
        return this.container;
    }  

}