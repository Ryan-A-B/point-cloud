import * as THREE from 'three';

function render(canvas: HTMLCanvasElement) {
    const nPoints = 1E8;
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

    const points = new THREE.Points(geometry, material)

    const aspectRatio = canvas.clientWidth / canvas.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    camera.position.z = 10; // Set camera position

    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    scene.add(points);
    console.log('rendering...')
    renderer.render(scene, camera);
}

export default render;
