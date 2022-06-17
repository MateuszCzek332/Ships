class EnemyField extends THREE.Mesh {
    a = 50

    constructor(x, z) {
        super() // wywołanie konstruktora Mesha
        this.geometry = new THREE.BoxGeometry(this.a, 10, this.a)
        this.x = x
        this.z = z
        this.position.x = x * this.a
        this.position.z = z * this.a
        this.canShoot = true
        this.material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("../img/water.jpg"),
            color: 0x8C8A93,
            transparent: true,
        })
    }
}