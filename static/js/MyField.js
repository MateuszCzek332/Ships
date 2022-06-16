class MyField extends THREE.Mesh {

    a = 50;
    constructor(x, z) {
        super() // wywołanie konstruktora Mesha
        this.geometry = new THREE.BoxGeometry(this.a, 10, this.a)
        this.material =  new THREE.MeshBasicMaterial({
                    map: new THREE.TextureLoader().load("../img/water.jpg"),
                    side: THREE.DoubleSide,
                    color: 0x00ffff, 
                    transparent: true, 
        })
        this.position.set(x*this.a, 0, z*this.a)
        this.x = x
        this.z = z
    }

}