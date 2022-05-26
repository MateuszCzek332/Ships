class EnemyField extends THREE.Mesh {

    a = 50;
    constructor(x, z) {
        super() // wywołanie konstruktora Mesha
        this.geometry = new THREE.BoxGeometry(this.a, this.a, this.a)
        this.x = x
        this.z = z
        this.position.x = x * this.a
        this.position.z = z * this.a
        this.canShoot = true
        this.material =  new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0xffff00, 
            transparent: true, 
        })
    }

}