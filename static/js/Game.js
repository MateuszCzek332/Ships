class Game {

    constructor() {

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 10000);
        this.renderer = new THREE.WebGLRenderer();
        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector2()
        this.renderer.setClearColor(0xffffff);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.lookAt(this.scene.position)
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.render()
    }

    render = () => {
        requestAnimationFrame(this.render);
        this.renderer.render(this.scene, this.camera);
        console.log("render leci")
    }
}