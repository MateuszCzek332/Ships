class MyField {
    a = 50;

    constructor() {
        this.init()
    }

    init() {
        const geometry = new THREE.BoxGeometry(this.a, 10, this.a);
        const material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load("../img/water.jpg"),
            color: 0xffffff,
            transparent: true,
        })

        this.cube = new THREE.Mesh(geometry, material);
        this.cube.name = "myField"
    }

    getCube() {
        return this.cube;
    }
}