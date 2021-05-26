
"use strict";

let canvas, renderer, scene, camera; // Standard three.js requirements.

let controls;  // An OrbitControls object that is used to implement
               // rotation of the scene using the mouse.  (It actually rotates
               // the camera around the scene.)

let animating = false;  // Set to true when an animation is in progress.
let frameNumber = 0;  // Frame number is advanced by 1 for each frame while animating.

let worldObject;
let bottomCircleObject;
let topCircleObject;
let roofObject;
let horseObject = [];
let roofSupportObject = [12];
let light1;
let light2;
let colors = [0xF32800,0x3470E1, 0xDBEE1A, 0xF32800, 0x3470E1, 0xDBEE1A];

/**
 *  The render function draws the scene.
 */
function render() {
    renderer.render(scene, camera);
}


/**
 * This function is called by the init() method to create the world.
 */
function createWorld(array, offset) {

    renderer.setClearColor("black"); // Background color for scene.
    scene = new THREE.Scene();

    // ------------------- Make a camera with viewpoint light ----------------------

    camera = new THREE.PerspectiveCamera(30, canvas.width/canvas.height, 0.1, 100);
    camera.position.z = 30;
    let light;  // A light shining from the direction of the camera; moves with the camera.
    light = new THREE.DirectionalLight();
    light.position.set(0, 0, 1);
    camera.add(light);
    scene.add(camera);

    //------------------- Create the scene's visible objects ----------------------

    light1 = new THREE.PointLight(0xffffff, 1, 100);
    light1.position.set(0, 10, 0);
    scene.add(light1);

    light2 = new THREE.PointLight(0xffffff, 1, 100);
    light2.position.set(0, -10, 0);
    scene.add(light2);

    worldObject = new THREE.Mesh(
        new THREE.SphereGeometry(4,100,100),
        new THREE.MeshBasicMaterial({map : new THREE.TextureLoader().load('resources/brick.jpg')})
    );
    scene.add(worldObject);

    bottomCircleObject = new THREE.Mesh(
        new THREE.CylinderGeometry(10, 10, 0.2, 12)
            .translate(0, -4.1, 0),
        new THREE.MeshPhongMaterial({
            color: 0x66BBFF,
            specular: 0x222222,
            shininess: 16,
            shading: THREE.FlatShading
        })
    );
    scene.add(bottomCircleObject);

    topCircleObject = new THREE.Mesh(
        new THREE.CylinderGeometry(10, 10, 0.2, 12)
            .translate(0, 4.1, 0),
        new THREE.MeshPhongMaterial({
            color: 0x66BBFF,
            specular: 0x222222,
            shininess: 16,
            shading: THREE.FlatShading
        })
    );
    scene.add(topCircleObject);

    roofObject = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 10, 3, 12)
            .translate(0,5.7,0),
        new THREE.MeshPhongMaterial({
            color: 0x66BBFF,
            specular: 0x222222,
            shininess: 16,
            shading: THREE.FlatShading
        })
    );
    scene.add(roofObject);

    for (let i = 0; i < 6; i++){
        roofSupportObject[i] = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 8, 100)
                .translate((8 * Math.cos(i * 2 * Math.PI / 6)), 0, (8 * Math.sin(i * 2 * Math.PI / 6))),
            new THREE.MeshPhongMaterial({
                color: 0x66BB00,
                specular: 0x222222,
                shininess: 16,
                shading: THREE.FlatShading
            })
        );
        scene.add(roofSupportObject[i]);
    }

    let loader = new THREE.LegacyJSONLoader();

    loader.load('resources/horse.json', function(geometry)
    {
        for (let i = 0; i < 6; i++) {
            horseObject[i] = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
                    color: colors[i],
                    specular: 0x000000,
                    shininess: 16,
                    shading: THREE.FlatShading
                }));
            horseObject[i].scale.set(0.025, 0.025, 0.025);
            horseObject[i].position.x = (8 * Math.cos(i * 2 * Math.PI / 6));
            horseObject[i].position.y = -3.95;
            horseObject[i].position.z= (8 * Math.sin(i * 2 * Math.PI / 6));
            horseObject[i].rotation.y = i*(-Math.PI/3);
            scene.add(horseObject[i]);
        }
    });

} // end function createWorld()


/**
 *  This function is called once for each frame of the animation, before
 *  the render() function is called for that frame.  It updates any
 *  animated properties.  The value of the global letiable frameNumber
 *  is incrementd 1 before this function is called.
 */
function updateForFrame() {
    let group = new THREE.Group();
    group.add(worldObject);
    group.add(bottomCircleObject);
    group.add(topCircleObject);
    group.add(roofObject);
    for (let i = 0; i < 12; i++){
        group.add(roofSupportObject[i]);
    }
    for (let i = 0; i < 6; i++){
        group.add(horseObject[i]);
    }
scene.add(group);
group.rotation.y -= frameNumber*0.01;
}


/* ---------------------------- MOUSE AND ANIMATION SUPPORT ------------------

/**
 *  This page uses THREE.OrbitControls to let the user use the mouse to rotate
 *  the view.  OrbitControls are designed to be used during an animation, where
 *  the rotation is updated as part of preparing for the next frame.  The scene
 *  is not automatically updated just because the user drags the mouse.  To get
 *  the rotation to work without animation, I add another mouse listener to the
 *  canvas, just to call the render() function when the user drags the mouse.
 *  The same thing holds for touch events -- I call render for any mouse move
 *  event with one touch.
 */
function installOrbitControls() {
    controls = new THREE.OrbitControls(camera,canvas);
    controls.noPan = true;
    controls.noZoom = true;
    controls.staticMoving = true;
    function move() {
        controls.update();
        if (! animating) {
            render();
        }
    }
    function down() {
        document.addEventListener("mousemove", move, false);
    }
    function up() {
        document.removeEventListener("mousemove", move, false);
    }
    function touch(event) {
        if (event.touches.length === 1) {
            move();
        }
    }
    canvas.addEventListener("mousedown", down, false);
    canvas.addEventListener("touchmove", touch, false);
}

/*  Called when user changes setting of the Animate checkbox. */
function doAnimateCheckbox() {
    let run = document.getElementById("animateCheckbox").checked;
    if (run !== animating) {
        animating = run;
        if (animating) {
            requestAnimationFrame(doFrame);
        }
    }
}

/*  Drives the animation, called by system through requestAnimationFrame() */
function doFrame() {
    if (animating) {
        frameNumber++;
        updateForFrame();
        render();
        requestAnimationFrame(doFrame);
    }
}

/*----------------------------- INITIALIZATION ----------------------------------------

/**
 *  This function is called by the onload event so it will run after the
 *  page has loaded.  It creates the renderer, canvas, and scene objects,
 *  calls createWorld() to add objects to the scene, and renders the
 *  initial view of the scene.  If an error occurs, it is reported.
 */
function init() {
    try {
        canvas = document.getElementById("glcanvas");
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: false
        });
    }
    catch (e) {
        document.getElementById("message").innerHTML=`<b>Sorry, an error occurred:<br>${e}</b>`;
        return;
    }
    document.getElementById("animateCheckbox").checked = false;
    document.getElementById("animateCheckbox").onchange = doAnimateCheckbox;
    createWorld();
    installOrbitControls();
    render();
}
