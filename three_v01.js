import * as THREE from './Modules/three.module.js';
import { GLTFLoader } from './Modules/GLTFLoader.js';
import { OBJLoader } from './Modules/OBJLoader.js'
import { OrbitControls } from './Modules/OrbitControls.js';
import { GUI } from './Modules/dat.gui.module.js'


//INIT
const canvas = document.querySelector('#main');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setClearColor("#000000");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xE5E5E5);

//CAMERA
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 100;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update;

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = canvas.clientWidth * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize =
        canvas.width !== document.getElementById('main').offsetWidth ||
        canvas.height !== document.getElementById('main').offsetHeight;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

//LIGHTS
class ColorGUIHelper {
    constructor(object, prop) {
        this.object = object;
        this.prop = prop;
    }
    get value() {
        return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
        this.object[this.prop].set(hexString);
    }
}

const colorAmbi = 0xFFFFFF;
const intensityAmbient = 1;
const lightAmbi = new THREE.AmbientLight(colorAmbi, intensityAmbient);
scene.add(lightAmbi);


const colorDirectional = 0xFFFFFF;
const intensityDirectional = 1;
const lightDirectional = new THREE.DirectionalLight(colorDirectional, intensityDirectional);
lightDirectional.position.set(0, 10, 0);
lightDirectional.target.position.set(-5, 0, 0);
scene.add(lightDirectional);
scene.add(lightDirectional.target);

const gui = new GUI();
gui.addColor(new ColorGUIHelper(lightAmbi, 'color'), 'value').name('Ambient Color');
gui.add(lightAmbi, 'intensity', 0, 2, 0.01);

gui.addColor(new ColorGUIHelper(lightDirectional, 'color'), 'value').name('Directional Color');
gui.add(lightDirectional, 'intensity', 0, 2, 0.01);
gui.add(lightDirectional.target.position, 'x', -10, 10);
gui.add(lightDirectional.target.position, 'z', -10, 10);
gui.add(lightDirectional.target.position, 'y', 0, 10);

//SCENE
const loaderTex = new THREE.TextureLoader();
const loaderGLTF = new GLTFLoader();
const loaderJson = new THREE.ObjectLoader();
const loaderObj = new OBJLoader();

const geoChip = new THREE.BoxGeometry(1.99, 0.1, 4.97);

const material = new THREE.MeshPhongMaterial({ color: 0xF1FA98 });
const matChipBump = new THREE.MeshStandardMaterial({
    color: 0xF1FA98,
    bumpMap: loaderTex.load('./Assets/Chip_v2.jpg'),
    roughness: 0.8,
    metalness: 0.2,
});
const matChip = new THREE.MeshStandardMaterial({
    color: 0xF1FA98,
    roughness: 0.8,
    metalness: 0.2,
})
const matFaces = [
    matChip,
    matChip,
    matChipBump,
    matChip,
    matChip,
    matChip
]

const cube = new THREE.Mesh(geoChip, matFaces);
cube.rotation.x = Math.PI * 0.5;

scene.add(cube);

//HELPERS
const helperAxes = new THREE.AxesHelper();
helperAxes.material.depthTest = false;
helperAxes.renderOrder = 1;
cube.add(helperAxes);

const helperGrid = new THREE.GridHelper(20, 10);
scene.add(helperGrid);

//RENDERING
function render(time) {
    time *= 0.0005;

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    // cube.rotation.x = time;
    // cube.rotation.y = time;


    renderer.render(scene, camera);

    requestAnimationFrame(render);
}
requestAnimationFrame(render);