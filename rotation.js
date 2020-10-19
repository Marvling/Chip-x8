// https://codepen.io/algcifaldi/pen/rVyRGm

var container, scene, camera, renderer, group;

var targetRotationX = 0;
var targetRotationXOnMouseDown = 0;

var targetRotationY = 0;
var targetRotationYOnMouseDown = 0;

var mouseX = 0;
var mouseXOnMouseDown = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
  container = document.createElement('div');
  document.body.appendChild(container);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 750;
  scene.add(camera);

  var light = new THREE.PointLight(0xffffff, 0.8);
  camera.add(light);

  group = new THREE.Group();
  group.position.y = 50;
  scene.add(group);

  function addShape(shape, extrudeSettings, color, x, y, z, rx, ry, rz, s) {
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    var meshMaterial = new THREE.MeshNormalMaterial();
    var mesh = new THREE.Mesh(geometry, meshMaterial);

    mesh.position.set(x, y, z);
    mesh.rotation.set(rx, ry, rz);
    mesh.scale.set(s, s, s);
    group.add(mesh);
  }

  var hexShape = new THREE.Shape();
  hexShape.moveTo(0, 0.8);
  hexShape.lineTo(0.4, 0.5);
  hexShape.lineTo(0.3, 0);
  hexShape.lineTo(-0.3, 0);
  hexShape.lineTo(-0.4, 0.5);
  hexShape.lineTo(0, 0.8);

  var numberOfCrystals = 100;
  for (i = 0; i < numberOfCrystals; i++) {
    var extrudeSettings = {
      amount: Math.random() * 200,
      bevelEnabled: true,
      bevelSegments: 1,
      steps: 1,
      bevelSize: (Math.random() * 10) + 15,
      bevelThickness: (Math.random() * 10) + 25
    };
    
    // addShape(
    //   hexShape,
    //   extrudeSettings,
    //   0xff3333, // color
    //   0, // x pos
    //   0, // y pos
    //   0, // z pos
    //   Math.random() * 2 * Math.PI, // x rotation
    //   Math.random() * 2 * Math.PI, // y rotation
    //   Math.random() * 2 * Math.PI, // z rotation
    //   1
    // );

    
    var geoBox = new THREE.BoxGeometry(100, 100, 100);
    let matNormal = new THREE.MeshNormalMaterial();
    let mesh = new THREE.Mesh(geoBox, matNormal);

    group.add(mesh);
  }

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setClearColor(0x5e5e5e);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('touchstart', onDocumentTouchStart, false);
  document.addEventListener('touchmove', onDocumentTouchMove, false);

  window.addEventListener('resize', onWindowResize, false);
}

function onDocumentMouseDown(event) {
  event.preventDefault();
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('mouseup', onDocumentMouseUp, false);
  document.addEventListener('mouseout', onDocumentMouseOut, false);
  mouseXOnMouseDown = event.clientX - windowHalfX;
  targetRotationXOnMouseDown = targetRotationX;

  mouseYOnMouseDown = event.clientY - windowHalfY;
  targetRotationYOnMouseDown = targetRotationY;
}

function onDocumentMouseMove(event) {
  mouseX = event.clientX - windowHalfX;
  targetRotationX = targetRotationXOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;

  mouseY = event.clientY - windowHalfY;
  targetRotationY = targetRotationYOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.02;
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

    mouseYOnMouseDown = event.touches[0].pageY - windowHalfY;
    targetRotationYOnMouseDown = targetRotationY;
  }
}

function onDocumentTouchMove(event) {
  if (event.touches.length == 1) {
    event.preventDefault();
    mouseX = event.touches[0].pageX - windowHalfX;
    targetRotationX = targetRotationXOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;

    mouseY = event.touches[0].pageY - windowHalfY;
    targetRotationX = targetRotationXOnMouseDown + (mouseY - mouseYOnMouseDown) * 0.05;
  }
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  group.rotation.y += ( targetRotationX - group.rotation.y ) * 0.05;
  group.rotation.x += ( targetRotationY - group.rotation.x ) * 0.05;
  renderer.render(scene, camera);
}