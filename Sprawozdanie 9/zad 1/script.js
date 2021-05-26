
"use strict";

let canvas, renderer, scene, camera; // Standard three.js requirements.

let controls;  // An OrbitControls object that is used to implement
               // rotation of the scene using the mouse.  (It actually rotates
               // the camera around the scene.)

let animating = false;  // Set to true when an animation is in progress.
let frameNumber = 0;  // Frame number is advanced by 1 for each frame while animating.

let base1;
let base2;
let base3;
let middle;
let points = [];
let top1;
let top2;
let top3;
let top4;
let top5;
let top6;

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

    let light1 = new THREE.PointLight(0xffffff, 0.7, 100);
    light1.position.set(0, 10, 0);
    scene.add(light1);

    base1 = new THREE.Mesh(
        new THREE.CylinderGeometry(5, 5, 0.5, 1000)
            .translate(0, -5, 0),
        new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            specular: 0x222222,
            shininess: 16,
            shading: THREE.FlatShading
        })
    );
    scene.add(base1);

    base2 = new THREE.Mesh(
        new THREE.CylinderGeometry(4.5, 5, 0.3, 1000)
            .translate(0,-4.6, 0),
        new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            specular: 0x222222,
            shininess: 16,
            shading: THREE.FlatShading
        })
    );
    scene.add(base2);

    base3 = new THREE.Mesh(
        new THREE.CylinderGeometry(4.5, 4.5, 0.2, 1000)
            .translate(0, -4.35, 0),
        new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            specular: 0x222222,
            shininess: 16,
            shading: THREE.FlatShading
        })
    );
    scene.add(base3);

    for ( let i = 10; i < 18; i ++ ) {
        points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 5, ( i - 5 ) * 2 ) );
    }
    middle = new THREE.Mesh(
        new THREE.LatheGeometry(points, 1000)
            .translate(0, -18.5, 0)
            .scale(0.3,0.5,0.3),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x222222,
            shininess: 16,
            shading: THREE.FlatShading
        })
    );
    scene.add(middle);

    top1 = new THREE.Mesh(
        new THREE.CylinderGeometry(1.4, 1.5, 0.4, 1000)
            .translate(0, 2.8, 0),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x222222,
            shininess: 16,
            shading: THREE.FlatShading
        })
    );
    scene.add(top1);

    top2 = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 1.2, 0.4, 1000)
            .translate(0, 3.1, 0),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x222222,
            shininess: 16,
            shading: THREE.FlatShading
        })
    );
    scene.add(top2);

    top3 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 0.2, 1000)
            .translate(0, 3.4, 0),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x222222,
            shininess: 16,
            shading: THREE.FlatShading
        })
    );
    scene.add(top3);

    points = [];
    for ( let i = 0; i < 5; i ++ ) {
        points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 5, ( i - 5 ) * 2 ) );
    }
    top4 = new THREE.Mesh(
        new THREE.LatheGeometry(points, 1000)
            .translate(0, 33.3, 0)
            .scale(0.05,0.15,0.1),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x222222,
            shininess: 16,
            shading: THREE.FlatShading
        })
    );
    scene.add(top4);

    top5 = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 100, 100, 0, Math.PI, 0, Math.PI)
            .rotateX(-Math.PI/2)
            .translate(0, 4.68, 0),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x222222,
            shininess: 16,
            shading: THREE.FlatShading
        })
    );
    scene.add(top5);

    top6= new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 100, 100, 0, Math.PI, 0, Math.PI)
            .rotateX(-Math.PI/2)
            .translate(0, 5.8, 0),
        new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0x222222,
            shininess: 16,
            shading: THREE.FlatShading
        })
    );
    scene.add(top6);

} // end function createWorld()


/**
 *  This function is called once for each frame of the animation, before
 *  the render() function is called for that frame.  It updates any
 *  animated properties.  The value of the global letiable frameNumber
 *  is incrementd 1 before this function is called.
 */
function updateForFrame() {
    let loopFrame = frameNumber % 240;
    if (loopFrame > 120) {
        loopFrame = 240 - loopFrame;
    }
    let scaleFactor = 1 + loopFrame/120;
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
