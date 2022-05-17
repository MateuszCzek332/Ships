class MyField {

    a = 50;

    constructor() {

        this.init()
    }

    init() {

        const geometry = new THREE.BoxGeometry(this.a, this.a, this.a);

        const material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0x00ffff, 
            transparent: true, 
        })
      
        this.cube = new THREE.Mesh(geometry, material);
        this.cube.name = "myField"

    }

    getCube() {
        return this.cube;
    }  

}