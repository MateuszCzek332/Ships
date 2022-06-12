class EnemyField extends THREE.Mesh {

    a = 50;
    constructor(x, z) {
        super() // wywołanie konstruktora Mesha
        this.geometry = new THREE.BoxGeometry(this.a, this.a, this.a)
        this.material =  new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0xffff00, 
            transparent: true, 
        })
        this.position.set(x*this.a, 0, z*this.a)
        this.x = x
        this.z = z
        this.canShoot = true
    }
}