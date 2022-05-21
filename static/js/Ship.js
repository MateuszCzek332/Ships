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

    rotate = (pion) => {
        if(this.dlugosc>1){
            if(pion){
                this.geometry = new THREE.BoxGeometry(this.a, this.a, this.a * this.dlugosc)
                this.position.x -= (this.a*this.dlugosc )/2 - this.a/2
                this.position.z += (this.a*this.dlugosc )/2 - this.a/2
            }
            else{
                this.geometry = new THREE.BoxGeometry(this.a * this.dlugosc, this.a, this.a)
                this.position.x += (this.a*this.dlugosc )/2 - this.a/2
                this.position.z -= (this.a*this.dlugosc )/2 - this.a/2
            }
        }
    }

}