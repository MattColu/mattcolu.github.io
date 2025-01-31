import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const SETTINGS = {
    "Hopper": {
        scene: "/assets/media/hopper/Hopper.glb",
        getCamera: (ratio) => {
            const camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 1000);
            camera.position.set(4, 3, 0);
            return camera;
        },
        getControls: (controls) => {
            controls.target = new THREE.Vector3(0, 2, 0);
            controls.enablePan = false;
            controls.enableZoom = false;
        }
    },
    "Tetris": {
        scene: "/assets/media/tetris/Tetris.glb",
        background: 0x222222,
        getCamera: (ratio) => {
            const camera = new THREE.PerspectiveCamera(80, ratio, 0.1, 1000);
            camera.position.set(30, 14, -10);
            return camera;
        },
        getControls: (controls) => {
            controls.target = new THREE.Vector3(0, 14, -10);
            controls.enablePan = true;
            controls.enableZoom = true;
            controls.maxDistance = 100;
        }
    },
    "Thesis": {
        scene: "/assets/media/thesis/Thesis.glb",
        background: 0x000000,
        getCamera: (ratio) => {
            const camera = new THREE.PerspectiveCamera(60, ratio, 0.1, 1000);
            camera.position.set(-8, 0.5, 5);
            return camera;
        },
        getControls: (controls) => {
            controls.target = new THREE.Vector3(-9, 0.5, -3);
            controls.enablePan = true;
            controls.enableZoom = true;
            controls.maxDistance = 100;
        }
    },
    "Head": {
        scene: "/assets/media/about/Head.glb",
        getCamera: (ratio) => {
            const camera = new THREE.PerspectiveCamera(40, ratio, 0.1, 1000);
            camera.position.set(0, 0, 5);
            return camera;
        },
        getControls: (controls) => {
            controls.target = new THREE.Vector3(0, 0, 0);
            controls.enablePan = true;
            controls.enableZoom = true;
            controls.maxDistance = 10;
        }
    }
}

export function setupScene(pageName) {
    if (!(pageName in SETTINGS)) return;

    const settings = SETTINGS[pageName];

    const loader = new GLTFLoader();
    const clock = new THREE.Clock();
    
    const scene = new THREE.Scene();
    const canvasElement = document.getElementById(`3js-canvas-${pageName}`)
    const w = canvasElement?.offsetWidth ?? 180;
    const h = canvasElement?.offsetWidth ?? 180;
    
    let mixer;
    
    loader.load(
        settings.scene,
        function (gltf) {
            const model = gltf.scene;
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

    // Camera
    const camera = settings.getCamera?.(w/h);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 5)
    light.position.set(5, 5, 0);
    light.castShadow = true;
    scene.add(light)

    if (settings.background !== undefined)
        scene.background = new THREE.Color(settings.background);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    settings.getControls?.(controls);
    controls.update();
    /*controls.minDistance = 5;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI / 8;*/

    canvasElement?.appendChild(renderer.domElement);
    
    function animate() {
        const delta = clock.getDelta();
        mixer.update(delta);
        //controls.update(delta);
        renderer.render(scene, camera);
    }
}