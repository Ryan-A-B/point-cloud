import * as THREE from 'three';
import { Set } from 'immutable';

const getPoints = (nPoints: number) => {
    const vertices = [];
    const colors = [];
    console.log('generating points...')
    for (let i = 0; i < nPoints; i++) {
        const x = THREE.MathUtils.randFloatSpread(2000);
        const y = THREE.MathUtils.randFloatSpread(2000);
        const z = THREE.MathUtils.randFloatSpread(2000);
        vertices.push(x, y, z);
        colors.push(Math.random(), Math.random(), Math.random());
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({ vertexColors: true });
    return new THREE.Points(geometry, material);
};

class View {
    private canvas: HTMLCanvasElement;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private points: THREE.Points;
    private lock: boolean = false;

    public mouseSensitivity: number = 0.002;
    public movementSpeed: number = 0.01;

    private keys = Set<string>()

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const aspectRatio = canvas.clientWidth / canvas.clientHeight;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas });
        this.points = getPoints(1E5);
        this.scene.add(this.points);
        this.renderer.render(this.scene, this.camera);

        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
        canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        canvas.addEventListener('contextmenu', this.onContextMenu.bind(this));
        canvas.addEventListener('click', this.onClick.bind(this));
    }

    onKeyDown(event: KeyboardEvent) {
        this.keys = this.keys.add(event.key);
    }

    onKeyUp(event: KeyboardEvent) {
        this.keys = this.keys.delete(event.key);
    }

    onMouseMove(event: MouseEvent) {
        if (!this.lock) return;
        this.camera.rotateY(-event.movementX * this.mouseSensitivity);
        this.camera.rotateX(-event.movementY * this.mouseSensitivity);
    }

    onMouseDown(event: MouseEvent) {
        if (event.button !== 2) return;
        event.preventDefault();
        this.lock = true;
    }

    onMouseUp(event: MouseEvent) {
        if (event.button !== 2) return;
        event.preventDefault();
        this.lock = false;
    }

    onContextMenu(event: MouseEvent) {
        event.preventDefault();
    }

    onClick(event: MouseEvent) {
        event.preventDefault();
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / this.canvas.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / this.canvas.clientHeight) * 2 + 1;
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        const intersects = raycaster.intersectObject(this.points);
        if (intersects.length === 0) return;
        if (intersects[0].object !== this.points) return;
        const index = intersects[0].index;
        if (index === undefined) throw new Error('index is undefined');
        this.setColor(index, new THREE.Color(1, 0, 0));
        this.renderer.render(this.scene, this.camera);
    }

    getPosition(index:number) {
        const geometry = this.points.geometry as THREE.BufferGeometry;
        const positionAttribute = geometry.getAttribute('position') as THREE.BufferAttribute;
        const positionArray = positionAttribute.array as Float32Array;
        const position = positionArray.slice(index * 3, index * 3 + 3);
        return new THREE.Vector3(position[0], position[1], position[2]);
    }

    getColor(index:number) {
        const geometry = this.points.geometry as THREE.BufferGeometry;
        const colorAttribute = geometry.getAttribute('color') as THREE.BufferAttribute;
        const colorArray = colorAttribute.array as Float32Array;
        const color = colorArray.slice(index * 3, index * 3 + 3);
        return new THREE.Color(color[0], color[1], color[2]);
    }

    setColor(index:number, color:THREE.Color) {
        const geometry = this.points.geometry as THREE.BufferGeometry;
        const colorAttribute = geometry.getAttribute('color') as THREE.BufferAttribute;
        const colorArray = colorAttribute.array as Float32Array;
        colorArray[index * 3] = color.r;
        colorArray[index * 3 + 1] = color.g;
        colorArray[index * 3 + 2] = color.b;
        colorAttribute.needsUpdate = true;
    }

    update(deltaT: number) {
        if (this.keys.has('w')) {
            this.camera.translateZ(-this.movementSpeed * deltaT);
        }
        if (this.keys.has('s')) {
            this.camera.translateZ(this.movementSpeed * deltaT);
        }
        if (this.keys.has('a')) {
            this.camera.translateX(-this.movementSpeed * deltaT);
        }
        if (this.keys.has('d')) {
            this.camera.translateX(this.movementSpeed * deltaT);
        }
    }

    private lastTime: number = performance.now();
    animate() {
        const currentTime = performance.now();
        const deltaT = currentTime - this.lastTime;
        const updateRequired = this.lock || this.keys.size > 0;
        if (updateRequired) {
            this.update(deltaT);
            this.renderer.render(this.scene, this.camera);
        }
        this.lastTime = currentTime;
        requestAnimationFrame(this.animate.bind(this));
    }
}

export default View;