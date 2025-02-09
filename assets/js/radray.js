import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const loader = new GLTFLoader();
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const canvasElement = document.getElementById(`3js-canvas-radray`)
const w = canvasElement?.offsetWidth ?? 180;
const h = canvasElement?.offsetWidth ?? 180;

let dimensions = {x: 6, y: 6, z: 6};
const maxDistance = 3;
const minDistance = 0.5;

let mixer;
let ray;

loader.load(
    "/assets/media/radray/Radray.glb",
    function (gltf) {
        const model = gltf.scene;
        ray = model.getObjectByName("Ray");
        mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach(animation => mixer.clipAction(animation).play());
        scene.add(model);
        renderer.setAnimationLoop(animate);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

// Shader
const material = new THREE.ShaderMaterial({
    uniforms: {
        alpha: {value: 0.5},
        maxDistance: {value: maxDistance},
        minDistance: {value: minDistance},
        rayPosition: {value: new THREE.Vector3(0, 0, 0)}
    },
    vertexShader: `
        precision mediump float;
        precision mediump int;

        attribute vec3 spherePosition;

        varying vec3 vPosition;
        
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            vPosition = spherePosition;
        }
        
    `,
    fragmentShader: `
        precision mediump float;
        precision mediump int;

        uniform float alpha;
        uniform float maxDistance;
        uniform float minDistance;
        uniform vec3 rayPosition;

        varying vec3 vPosition;
        
        // Thanks Sam Hocevar https://stackoverflow.com/a/17897228
        vec3 hsv2rgb(vec3 c) {
            vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
            vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
            return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }

        vec3 lerpHSV(float factor) {
            return hsv2rgb(vec3(factor * 2.0/3.0, 1.0, 1.0));
        }

        void main() {
            float distance = clamp(length(rayPosition - vPosition), minDistance, maxDistance);
            float normDistance = (distance - minDistance) / (maxDistance - minDistance);
            vec3 color = lerpHSV(normDistance);
            gl_FragColor = vec4(color.x, color.y, color.z, alpha);
        }
    `,
    transparent: true
});

// Spheres
const group = new THREE.Group();
setupSpheres(dimensions, material, group);
scene.add(group);

// Camera
const camera = new THREE.OrthographicCamera(-4, 4, 4, -4, 0.1, 1000);
camera.position.set(10, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(w, h);

scene.background = new THREE.Color(0x000);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target = new THREE.Vector3(0, 0, 0);
controls.minZoom = 0.25;
controls.enablePan = true;
controls.enableZoom = true;
controls.update();

canvasElement?.appendChild(renderer.domElement);

// GUI
const gui = new GUI({container: canvasElement, title: "Settings"}),

props = {
    get 'Alpha'() {
        return material.uniforms.alpha.value;
    },
    set 'Alpha'(v) {
        material.uniforms.alpha.value = v;
    },
    get 'Influence'() {
        return material.uniforms.maxDistance.value;
    },
    set 'Influence'(v) {
        material.uniforms.maxDistance.value = v;
    },
    get 'Side'() {
        return dimensions.x;
    },
    set 'Side'(v) {
        dimensions = {x: v, y: v, z: v};
    },
};

gui.domElement.className += " custom-lil-gui";

gui.add( props, 'Alpha', 0.0, 1.0 );
gui.add( props, 'Influence', 1.0, 5.0 );
gui.add( props, 'Side', 1, 20, 1 ).onChange( function (v) {
    group.clear();
    setupSpheres({x: v, y: v, z: v}, material, group);
});

function animate() {
    const delta = clock.getDelta();
    mixer.update(delta);
    material.uniforms.rayPosition.value = ray.position;
    renderer.render(scene, camera);
}

function setupSpheres(dimensions, material, group) {
    for (let y = 0; y < dimensions.y; y++) {
        for (let x = 0; x < dimensions.x; x++) {
            for (let z = 0; z < dimensions.z; z++) {
                const cx = -dimensions.x/2+0.5 + x;
                const cy = -dimensions.y/2+0.5 + y;
                const cz = -dimensions.z/2+0.5 + z;
                
                const sphere = new THREE.SphereGeometry(0.5, 8, 8);
                sphere.translate(cx, cy, cz);
    
                const spherePositions = Array.from(
                    {length: sphere.attributes.position.array.length},
                    (_, idx) => {
                        if (idx%3 === 0) return cx;
                        if (idx%3 === 1) return cy;
                        return cz;
                    }
                );
                const spherePositionsAttribute = new THREE.Float32BufferAttribute(spherePositions, 3);
                sphere.setAttribute("spherePosition", spherePositionsAttribute);
                group.add(new THREE.Mesh(sphere, material));
            }
        }
    }
}