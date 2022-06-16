class Ship extends THREE.Mesh {
    a = 48
    constructor(dl) {
        super() // wywołanie konstruktora Mesha
        this.dlugosc = dl

        if (dl == 4)
            this.scale.set(1.65 / 4 * dl, 2, 1.65)
        if (dl == 3)
            this.scale.set(1.65 / 4 * dl, 1.9, 1.2)
        if (dl == 2)
            this.scale.set(1.65 / 4 * dl, 1.8, 1.2)
        if (dl == 1)
            this.scale.set(1.8 / 4 * dl, 1.55, 1)

        this.geometry = window.shipmodel.geometry //new THREE.BoxGeometry(this.a * dl, this.a, this.a)
        this.position.x += (this.a * dl) / 2
        this.material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0x0000ff,
            transparent: true,
        })
    }

    rotate = (pion) => {
        if (this.dlugosc > 1) {
            if (pion) {
                this.rotation.y = Math.PI / 2
            }
            else {
                this.rotation.y = 0
            }
        }
    }

}