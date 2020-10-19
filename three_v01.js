import * as THREE from './Modules/three.module.js';
// import { OrbitControls } from './Modules/OrbitControls.js';
import { GUI } from './Modules/dat.gui.module.js'


//INIT
const canvas = document.querySelector('#main');

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setClearColor("#000000");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d0d0d);


// Object Rotation variables
let targetRotationX = 0;
let targetRotationXOnMouseDown = 0;

let targetRotationY = 0;
let targetRotationYOnMouseDown = 0;

let mouseX = 0;
let mouseXOnMouseDown = 0;

let mouseY = 0;
let mouseYOnMouseDown = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;


//CAMERA
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 100;

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 5;

//Orbit Controls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(0, 0, 0);
// controls.update;

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

const colorAmbi = 0xFFFFFF;
const intensityAmbient = 0.35;
const lightAmbi = new THREE.AmbientLight(colorAmbi, intensityAmbient);
scene.add(lightAmbi);


const colorDirectional = 0xFFFFFF;
const intensityDirectional = 1;
const lightDirectional = new THREE.DirectionalLight(colorDirectional, intensityDirectional);
lightDirectional.position.set(0, 1.5, 0.3);
lightDirectional.target.position.set(0, 0, 0);
scene.add(lightDirectional);
scene.add(lightDirectional.target);

//SCENE
const loaderTex = new THREE.TextureLoader();
const geoChip = new THREE.BoxGeometry(1.99, 0.1, 4.97);

const matChipBump = new THREE.MeshStandardMaterial({
    color: 0x4a4a4a,
    bumpMap: loaderTex.load('./Assets/Chip_v3.png'),
    roughness: 0.8,
    metalness: 0.2,
});
const matChip = new THREE.MeshStandardMaterial({
    color: 0x4a4a4a,
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

const meshChip = new THREE.Mesh(geoChip, matFaces);
meshChip.rotation.x = Math.PI * 0.5;

scene.add(meshChip);

//HELPERS

const helperAxes = new THREE.AxesHelper();
helperAxes.material.depthTest = false;
helperAxes.renderOrder = 1;
meshChip.add(helperAxes);

const helperGrid = new THREE.GridHelper(20, 10);
scene.add(helperGrid);

const helperLight = new THREE.DirectionalLightHelper(lightDirectional);
lightDirectional.add(helperLight);

//GUI
//mostly taken from https://threejsfundamentals.org/threejs/lessons/threejs-lights.html

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
function makeXYZGUI(gui, vector3, name, onChangeFn) { //Showing the direction of the light
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
    folder.open();
}

function updateLight() {
    lightDirectional.target.updateMatrixWorld();
    helperLight.update();
}
updateLight();


const gui = new GUI();
gui.addColor(new ColorGUIHelper(matChip, 'color'), 'value').name('Chip Color');
gui.addColor(new ColorGUIHelper(matChipBump, 'color'), 'value').name('Chip Color');


gui.addColor(new ColorGUIHelper(lightAmbi, 'color'), 'value').name('Ambient Color');
gui.add(lightAmbi, 'intensity', 0, 2, 0.01);

gui.addColor(new ColorGUIHelper(lightDirectional, 'color'), 'value').name('Directional Color');
gui.add(lightDirectional, 'intensity', 0, 2, 0.01);

makeXYZGUI(gui, lightDirectional.position, 'position', updateLight);
makeXYZGUI(gui, lightDirectional.target.position, 'target', updateLight);

//Object roation listeners
document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('touchstart', onDocumentTouchStart, false);
document.addEventListener('touchmove', onDocumentTouchMove, false);
window.addEventListener('resize', onWindowResize, false);

function onDocumentMouseDown(event) {
    event.preventDefault();
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    document.addEventListener('mouseout', onDocumentMouseOut, false);
    mouseXOnMouseDown = event.clientX - windowHalfX;
    targetRotationXOnMouseDown = targetRotationX;

    // mouseYOnMouseDown = event.clientY - windowHalfY;
    // targetRotationYOnMouseDown = targetRotationY;
}

function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    targetRotationX = targetRotationXOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;

    // mouseY = event.clientY - windowHalfY;
    // targetRotationY = targetRotationYOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.02;
}

function onDocumentMouseUp(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentMouseOut(event) {
    document.removeEventListener('mousemove', onDocumentMouseMove, false);
    document.removeEventListener('mouseup', onDocumentMouseUp, false);
    document.removeEventListener('mouseout', onDocumentMouseOut, false);
}

function onDocumentTouchStart(event) {
    if (event.touches.length == 1) {
        event.preventDefault();
        mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
        targetRotationXOnMouseDown = targetRotationX;

        // mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;
        // targetRotationYOnMouseDown = targetRotationY;
    }
}

function onDocumentTouchMove(event) {
    if (event.touches.length == 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        targetRotationX = targetRotationXOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;

        // mouseY = event.touches[0].pageY - windowHalfY;
        // targetRotationX = targetRotationXOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.05;
    }
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}


//RENDERING
function render(time) {
    time *= 0.0005;

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

    meshChip.rotation.z += (targetRotationX - meshChip.rotation.y) * 0.05;
    // meshChip.rotation.x += (targetRotationY - meshChip.rotation.x) * 0.05;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}
requestAnimationFrame(render);