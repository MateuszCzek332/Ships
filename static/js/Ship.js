class Ship extends THREE.Mesh {
    a = 40
    constructor(dl) {
        super() // wywołanie konstruktora Mesha
        this.dlugosc = dl
        this.geometry = new THREE.BoxGeometry(this.a * dl, this.a, this.a)
        this.position.x += (this.a*dl)/2
        this.material =  new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0x0000ff, 
            transparent: true, 
        })
    }

}