import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const canvasElement = document.getElementById("3js-canvas-head");

const canvasRect = canvasElement.getBoundingClientRect();
if (canvasRect.y > window.innerHeight) canvasRect.y %= window.innerHeight;

const w = canvasElement.offsetWidth;
const h = canvasElement.offsetWidth;

const scene = new THREE.Scene();
const pointer = new THREE.Vector2();
const loader = new GLTFLoader();

const cameraX = 5;
const gazeDirectionMultiplier = 2*cameraX;
let head;
document.addEventListener('pointermove', onPointerMove);

loader.load(
        "/assets/media/about/Head.glb",
        function (gltf) {
            head = gltf.scene;
            head.rotation.set( 0, 2*Math.PI, 0 );
            head.position.set(head.position.x, head.position.y - 0.2 , head.position.z);
            head.children[0].traverse(obj => obj.material = new THREE.MeshToonMaterial({color: obj.material.color}));
            head.children[1].material = new THREE.MeshBasicMaterial({map: head.children[1].material.map, transparent: true});

            scene.add(head);
            renderer.setAnimationLoop(render);
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );

const camera = new THREE.PerspectiveCamera( 40, w/h, 0.01, 10000 );
    camera.position.set( cameraX, 0, 0 );
    camera.lookAt( 0, 0, 0 );
    camera.updateMatrix();

const renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    renderer.setSize(w, h);
canvasElement.appendChild( renderer.domElement );

scene.add(camera);
const light = new THREE.DirectionalLight(0xffffff, 5)
    light.position.set(cameraX, cameraX/2, 0);
    light.castShadow = false;
    scene.add(light)

function onPointerMove( event ) {
    pointer.x = -( (event.clientX - canvasRect.x - w/2)/ window.innerWidth ) * 2;
    pointer.y = -( (event.clientY - canvasRect.y - h/2) / window.innerHeight ) * 2;
}

function render() {
    head.lookAt(cameraX, gazeDirectionMultiplier * pointer.y , gazeDirectionMultiplier * pointer.x);
    renderer.render( scene, camera );
}