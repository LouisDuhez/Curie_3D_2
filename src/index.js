import * as THREE from "three";
import { GLTFLoader } from "../node_modules/three/examples/jsm/loaders/GLTFLoader.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

// Responsive
const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener('resize', onResize);

// Scène
const scene = new THREE.Scene(); 
const aspect = window.innerWidth / window.innerHeight;

// Caméra
const camera = new THREE.PerspectiveCamera(50, aspect, 0.01, 20);
camera.position.set(2.5, 1.8, 3.7);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const createLight = (color, position, intensity, distance = 0, castShadow = true) => {
    const light = new THREE.PointLight(color, intensity, distance);
    light.position.set(position.x, position.y, position.z);
    light.castShadow = castShadow;
    if (castShadow) {
        light.shadow.bias = -0.001;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
    }
    scene.add(light);
    return light;
};

const light1 = createLight(0xF5A86B, { x: -3.3, y: 2, z: 1.3 }, 30,0,true);
const light2 = createLight(0xFF5A08, { x: 2, y: 1.2, z: 7 }, 3, 5,true);
const light3 = createLight(0xffffff, { x: 0.8, y: 1.3, z: 1.7 }, 1, 2,false);
const light4 = createLight(0xffffff, { x: 0.8, y: 1.5, z: 0.8 }, 1, 2,false);
const light5 = createLight(0xffffff, { x: 1.5, y: 1.3, z: -2.5 }, 1, 2,false);
const light6 = createLight(0xffffff, { x: 5.7, y: 1.3, z: -2.5 }, 1, 2,false);

const lightHelper = new THREE.PointLightHelper(light1);
scene.add(lightHelper);

const rectLight = new THREE.RectAreaLight(0xffffff, 1, 10, 10);
rectLight.position.set(2, 5, 2);
rectLight.lookAt(2, 0, 2);
scene.add(rectLight);
const rectLight2 = new THREE.RectAreaLight(0xffffff, 1, 10, 10);
rectLight2.position.set(2, 0.05, 2);
rectLight2.lookAt(2, 10, 2);
scene.add(rectLight2);

// const rectLightHelper2 = new RectAreaLightHelper(rectLight2);
// scene.add(rectLightHelper2);

// Chargement du modèle 3D
const loaderS = new GLTFLoader();
let labScene;
loaderS.load('assets/labo.glb', (gltf) => {
    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    gltf.scene.scale.set(1, 1, 1);
    gltf.scene.position.set(0, 0, 0);
    scene.add(gltf.scene);
    labScene = gltf.scene;
});

// Tableau pour stocker les objets chargés
const loadedObjects = [];

const loader = new GLTFLoader();

const createCubeAtPosition = (position, scale, cameraPosition, lookAt, info) => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
    const cube = new THREE.Mesh(geometry, material);
    
    cube.position.set(position.x, position.y, position.z);
    cube.scale.set(scale.x, scale.y, scale.z);
    cube.castShadow = true;
    cube.receiveShadow = true;
    
    cube.userData.cameraPosition = cameraPosition; 
    cube.userData.lookAt = lookAt || position;
    cube.userData.info = info || "Aucune information disponible";

    scene.add(cube);
    loadedObjects.push(cube);
};


// Fonction de chargement des objets
const loadObject = (path, position, scale) => {
    loader.load(path, (gltf) => {
        const object = gltf.scene;
        object.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        object.position.set(position.x, position.y, position.z);
        object.scale.set(scale.x, scale.y, scale.z);
        scene.add(object);
    });
};

const button = `<button class="close-info-frame"><i class="fa-solid fa-arrow-left"></i></button>`

// Charger les objets
loadObject('assets/bocal_atome.glb', { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 });
createCubeAtPosition({ x: 2, y: 1.2, z: 7 }, { x: 0.5, y: 0.8, z: 0.5 },{ x: 1.5, y: 1.2, z: 6 }, { x: 1.5, y: 1.2, z: 7 }, `<div class="text-container">
        <h2>La recherche atomique</h2>
        <p>Les découvertes de Marie Curie ont posé les bases de la recherche atomique moderne. En isolant le radium et en étudiant la radioactivité, un terme qu’elle a elle-même introduit, elle a révolutionné la compréhension de la structure de la matière. Ses travaux ont démontré que les atomes n’étaient pas indivisibles, mais pouvaient se transformer en émettant de l’énergie, ouvrant ainsi la voie à la physique nucléaire. Cette avancée a inspiré des générations de scientifiques et a conduit au développement de nombreuses applications, de la radiothérapie au nucléaire civil. Son héritage scientifique a profondément marqué l’histoire de la recherche atomique, influençant des figures majeures comme Ernest Rutherford et les pionniers de la fission nucléaire.</p>
        ${button}
    </div>`
    
    );  // Bocal à atome


loadObject('assets/tableau.glb', { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 },);

loadObject('assets/microscope.glb', { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 });
createCubeAtPosition({ x: 5.7, y: 1.3, z: -3.2 }, { x: 0.5, y: 0.7, z: 0.6 }, { x: 6, y: 1.3, z: -2.2 },{ x: 6, y: 1.3, z: -3.2 } , `<div class="text-container">
        <h2>Marie Curie et le microscope : observer l’invisible</h2>
        <p>Bien que principalement connue pour ses travaux sur la radioactivité, Marie Curie a également utilisé le microscope pour analyser les effets des radiations sur la matière et les cellules vivantes. Cet instrument lui permettait d’observer les modifications microscopiques causées par l’exposition aux substances radioactives, ouvrant ainsi la voie aux premières études sur l’impact biologique des rayonnements. Grâce à ces observations, elle a contribué à la compréhension des effets de la radioactivité sur les tissus, une avancée essentielle pour le développement futur de la radiothérapie. Le microscope, en révélant l’invisible, a ainsi joué un rôle complémentaire aux découvertes majeures de Marie Curie, renforçant l’importance de ses recherches dans les domaines de la physique, de la chimie et de la médecine.</p>
        ${button}
    </div>`); // Microscope

loadObject('assets/electrometre.glb', { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 });
createCubeAtPosition({ x: 0.7, y: 1.5, z: 1.7 }, { x: 0.5, y: 0.7, z: 0.6 },{ x: 1.7, y: 1.4, z:1.3 }, { x: 0.7, y: 1.4, z: 1.3 } , `<div class="text-container">
        <h2>Électromètre à quadrant</h2>
        <p>Marie Curie a utilisé un électromètre à quadrant, un instrument de précision conçu pour mesurer de faibles charges électriques, afin d’étudier la radioactivité. Cet appareil, initialement perfectionné par Pierre Curie et son frère Jacques, a joué un rôle clé dans ses recherches. Grâce à lui, elle a pu quantifier avec précision l’intensité du rayonnement émis par les substances radioactives, ce qui lui a permis d’identifier et d’isoler de nouveaux éléments, comme le radium et le polonium. L’électromètre à quadrant a ainsi été un outil essentiel dans la découverte et la compréhension de la radioactivité, marquant une étape déterminante dans l’histoire de la physique et de la chimie.</p>
        ${button}
    </div>`); // Electromètre

loadObject('assets/compteurgeiger.glb', { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 });
createCubeAtPosition({ x: 0.7, y: 1.5, z: 0.7 }, { x: 0.5, y: 0.5, z: 0.6 }, { x: 1.7, y: 1.5, z: 0.5 }, { x: 0.7, y: 1.5, z: 0.5 } , `<div class="text-container">
        <h2>le Compteur Geiger</h2>
        <p>Marie Curie, pionnière de la radioactivité, a ouvert la voie à de nombreuses avancées scientifiques, dont la détection des rayonnements ionisants. Si elle n’a pas directement inventé le compteur Geiger, ses travaux sur le radium et le polonium ont été essentiels à la compréhension de la radioactivité, rendant possible la conception d’instruments capables de la mesurer. Le compteur Geiger, mis au point plus tard par Hans Geiger et Walther Müller, repose sur les principes qu’elle a établis. Cet appareil permet de détecter et quantifier les particules émises par des substances radioactives, une avancée cruciale pour la science, la médecine et la sécurité nucléaire. Ainsi, l’héritage de Marie Curie dépasse ses découvertes : il s’étend aux outils qui, encore aujourd’hui, permettent d’explorer et de comprendre le monde invisible de la radioactivité.</p>
        ${button}
    </div>`);// Compteur Geiger

createCubeAtPosition({ x: 1.3, y: 1, z: -3 }, { x: 1.2, y: 0.5, z: 0.6 }, { x: 2.2, y: 1.2, z: -1.5 }, { x: 2.1, y: 1.2, z: -3 } , `<div class="text-container">
        <h2>Les outils de chimie : au cœur des découvertes de Marie Curie</h2>
        <p>Dans son laboratoire, Marie Curie manipulait divers outils de chimie, tels que des tubes à essai, des béchers et des creusets, indispensables à ses expériences sur les substances radioactives. Avec patience et rigueur, elle utilisait ces instruments pour purifier le radium et le polonium à partir de tonnes de pechblende, un travail titanesque nécessitant des milliers de manipulations. Ses éprouvettes lui permettaient d'observer les précipitations chimiques, tandis que ses creusets servaient à chauffer et concentrer les éléments radioactifs. Ces outils, bien que simples, ont été au cœur de découvertes majeures, illustrant le génie expérimental de Marie Curie et son engagement acharné pour faire avancer la science.</p>
        ${button}
    </div>`); // Verrerie

window.addEventListener("keydown", (event) => {
    keys[event.code] = true;
});
window.addEventListener("keyup", (event) => {
    keys[event.code] = false;
});


document.body.addEventListener("click", () => {
    document.body.requestPointerLock();
});


document.addEventListener("pointerlockchange", () => {
    if (document.pointerLockElement === document.body) {
        console.log("Souris capturée !");
    }
}); 


let pitch = 0; 
let yaw = 0;   
const sensitivity = 0.002;

document.addEventListener("mousemove", (event) => {
    if (document.pointerLockElement === document.body) {
        yaw -= event.movementX * sensitivity;
        pitch -= event.movementY * sensitivity;
        
        pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));

        const directionFrontale = new THREE.Vector3(0, 0, -1);
        directionFrontale.applyAxisAngle(new THREE.Vector3(1, 0, 0), pitch); // Rotation X
        directionFrontale.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw); // Rotation Y

        camera.lookAt(camera.position.clone().add(directionFrontale));
    }
});


// Fonction de déplacement// Réduction de la vitesse
let moveSpeed = 1; 
let keys = {};
let direction = new THREE.Vector3();

window.addEventListener("keydown", (event) => {
    keys[event.code] = true;
});
window.addEventListener("keyup", (event) => {
    keys[event.code] = false;
});

// Fonction de déplacement
const moveCamera = (delta) => {
    camera.getWorldDirection(direction);
    direction.y = 0; 
    direction.normalize();

    let movement = new THREE.Vector3();

    if (keys["KeyW"]) movement.addScaledVector(direction, moveSpeed * delta);
    if (keys["KeyS"]) movement.addScaledVector(direction, -moveSpeed * delta);

    if (keys["KeyA"]) {
        const left = new THREE.Vector3().crossVectors(camera.up, direction).normalize();
        movement.addScaledVector(left, moveSpeed * delta);
    }
    if (keys["KeyD"]) {
        const right = new THREE.Vector3().crossVectors(direction, camera.up).normalize();
        movement.addScaledVector(right, moveSpeed * delta);
    }

    // Vérification de collision
    if (labScene) {
        const raycaster = new THREE.Raycaster(camera.position, movement.clone().normalize());
        const intersects = raycaster.intersectObjects(labScene.children, true);
        if (intersects.length > 0 && intersects[0].distance < 0.5) {
            movement.set(0, 0, 0); 
        }
    }

    camera.position.add(movement);
};

// Raycaster et position de la souris
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let initialCameraPosition = camera.position.clone();
let initialCameraLookAt = new THREE.Vector3().copy(camera.position).add(camera.getWorldDirection(new THREE.Vector3()));
let isCameraLocked = false;

const cursor = document.querySelector("#cursor"); // Sélection du curseur HTML
const onClick = (event) => {
    if (!cursor) return;

    const rect = cursor.getBoundingClientRect();
    const cursorX = rect.left + rect.width / 2;
    const cursorY = rect.top + rect.height / 2;

    mouse.x = (cursorX / window.innerWidth) * 2 - 1;
    mouse.y = -(cursorY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(loadedObjects, true);

    const infoDiv = document.querySelector(".info-objet");

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        if (clickedObject.userData.cameraPosition) {
            initialCameraPosition = camera.position.clone();
            initialCameraLookAt = new THREE.Vector3().copy(camera.position).add(camera.getWorldDirection(new THREE.Vector3()));
            moveCameraTo(clickedObject.userData.cameraPosition, clickedObject.userData.lookAt);
            isCameraLocked = true;
            document.exitPointerLock();

            // Afficher les informations
            infoDiv.innerHTML = clickedObject.userData.info;
            infoDiv.style.opacity = "1";

            // Ajouter un écouteur d'événement pour le bouton de fermeture
            const closeButton = infoDiv.querySelector(".close-info-frame");
            if (closeButton) {
                closeButton.addEventListener("click", (event) => {
                    event.stopPropagation(); // Empêche la propagation de l'événement de clic
                    moveCameraTo(initialCameraPosition, initialCameraLookAt);
                    isCameraLocked = false;
                    document.body.requestPointerLock();
                    infoDiv.style.opacity = "0";
                });
            }
        }
    } 
};

document.addEventListener('click', onClick);


const moveCameraTo = (targetPosition, targetLookAt) => {
    const startPosition = camera.position.clone();
    const startLookAt = new THREE.Vector3().copy(camera.position).add(camera.getWorldDirection(new THREE.Vector3()));

    const duration = 800; // Durée en millisecondes
    let startTime = null;

    const animateMove = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const t = Math.min(elapsed / duration, 1); // Normalisation

        camera.position.lerpVectors(startPosition, targetPosition, t);
        const interpolatedLookAt = new THREE.Vector3().lerpVectors(startLookAt, targetLookAt, t);
        camera.lookAt(interpolatedLookAt);

        if (t < 1) {
            requestAnimationFrame(animateMove);
        }
    };

    requestAnimationFrame(animateMove);
};
// Ajouter un écouteur d'événement pour détecter les clics
document.addEventListener('click', onClick);

// Animation

const clock = new THREE.Clock();
const animate = () => {
    const delta = clock.getDelta();
    if (!isCameraLocked) {
        moveCamera(delta); 
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};

animate();