import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "gsap";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { Bottles } from "./bottles.js";
import FotocameraLogo from "../static/img/fotocamera.png";
// XXX BASE
// Canvas
const canvas = document.querySelector(".webgl");
// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#b6a68e");

// XXX SIZE SCENE END RESPONSIVE
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// XXX RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// XXX CAMERA
const camera = new THREE.PerspectiveCamera(
  20,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 0.2;

// XXX CONTROLS
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.target.x = 0;
controls.target.y = 0.2;
controls.target.z = 0;
controls.enablePan = true
controls.maxPolarAngle = Math.PI / 1.9;
controls.minPolarAngle = Math.PI / 8;

controls.autoRotate = false;

// XXX LIGHTS
// //todo AMBIENT LIGHT
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// //todo DIRECTIONAL LIGHT
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
light.decay = 2;
scene.add(light);

// //todo POINTS LIGHT
const pointLight = new THREE.PointLight(0xffffff, 0.3);
pointLight.decay = 2;
pointLight.position.x = 0;
pointLight.position.y = 0.3;
pointLight.position.z = 0.3;
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xffffff, 0.3);
pointLight2.decay = 2;
pointLight2.position.x = 0;
pointLight2.position.y = 0.3;
pointLight2.position.z = -0.3;
scene.add(pointLight2);

//XXX PIEDISTALLO____________________________________________________________

// Texture Cylinder
const piedistallo = "piedistallo.jpg";
const texturePiedistalloDefault = new THREE.TextureLoader().load(piedistallo);

// Mesh Cylinder
const meshCylinder = new THREE.MeshStandardMaterial({
  map: texturePiedistalloDefault,
});

// Object Cylinder
const Cylinder = new THREE.Mesh(
  new THREE.CylinderGeometry(0.1, 0.1, 0.02, 100, 100),
  meshCylinder
);

Cylinder.position.y = -0.015;
scene.add(Cylinder);

//XXX TEXTURE AMBIENT____________________________________________________________
const textures_Loader_Ambient = new THREE.CubeTextureLoader();

const textures_Ambient = textures_Loader_Ambient.load([
  "textures_Studio/px.png",
  "textures_Studio/nx.png",
  "textures_Studio/py.png",
  "textures_Studio/ny.png",
  "textures_Studio/pz.png",
  "textures_Studio/nz.png",
]);

//XXX _________________________ bottoni_________________________________________

{
  const content_Type_bottle = document.getElementById("content_Type_bottle");
  const ColorClick = document.querySelector(".Color");

  content_Type_bottle.addEventListener("click", function () {
    ColorClick.style.display = "inline";
  });

  const Bottle_Color_Select = document.querySelector(".Bottle_Color_Select");
  const CapsuleClick = document.querySelector(".Capsule");

  Bottle_Color_Select.addEventListener("click", function () {
    CapsuleClick.style.display = "inline";
  });

  const TypeCapsule = document.querySelector(".TypeCapsule");
  const LabelClick = document.querySelector(".Label");

  TypeCapsule.addEventListener("click", function () {
    LabelClick.style.display = "inline";
  });

  const my_Label = document.getElementById("my_Label");
  const downloadGlb = document.getElementById("download-glb");

  my_Label.addEventListener("click", function () {
    downloadGlb.style.display = "inline";
  });

  const BoxAluminium = document.querySelector(".BoxAluminum");
  const BoxWax = document.querySelector(".BoxWax");

  BoxAluminium.addEventListener("mousedown", (e) => {
    e.currentTarget.style.transform = "scale(0.9)";
    BoxWax.style.transform = "scale(1)";
  });

  // Mousedown event for BoxWax
  BoxWax.addEventListener("mousedown", (e) => {
    e.currentTarget.style.transform = "scale(0.9)";
    BoxAluminium.style.transform = "scale(1)";
  });
}

//XXX _________________________Applicazione Bottiglie___________________________________

const content_Type_bottle = document.getElementById("content_Type_bottle");
let currentModel = null;

Bottles.forEach((bottle, i) => {
  const childDiv = document.createElement("div");
  childDiv.classList.add("child");
  childDiv.setAttribute("data-id", i);
  const image = document.createElement("img");
  image.src = bottle.image;
  image.alt = bottle.name;
  childDiv.appendChild(image);
  const h6 = document.createElement("h6");
  h6.textContent = bottle.name;
  childDiv.appendChild(h6);
  content_Type_bottle.appendChild(childDiv);

  const focusOnBottle = (bottle) => {
    const aspect = sizes.width / sizes.height;
    const bottleHeight = bottle.height + 0.06;
    const fov = 2.1 * Math.atan(bottleHeight / (2 * 2)) * (180 / Math.PI);

    camera.fov = fov;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    gsap.to(camera.position, {
      x:0,
      y: bottleHeight,
      z: 2,
      duration:1
    })
    gsap.to(controls.target, {
      x:0,
      y: bottleHeight / 2.5,
      z: 0,
      duration:1
    })
  };


  childDiv.addEventListener("mousedown", () => focusOnBottle(bottle));

  childDiv.addEventListener("click", () => {
    const selectedBottle = Bottles[i];
    if (currentModel) {
        scene.remove(currentModel);
      }

    new GLTFLoader().load(`models/${selectedBottle.model}`, (glb) => {
      currentModel = glb.scene;
      
      scene.add(glb.scene);

      //! //XXX BOTTIGLIA____________________________________________________________

      const bottiglia = currentModel.children.filter(
        (obj) => obj.name === "bottiglia"
      );

      bottiglia[0].visible = true;
      bottiglia[0].material.metalness = 0;
      bottiglia[0].material.roughness = 0;
      bottiglia[0].material.color.set("#ffffff");
      bottiglia[0].material.envMap = textures_Ambient;
      bottiglia[0].material.envMapIntensity = 0;

      // ____________debug Bottle___________

      {
        // COLOR
        const my_Select_Color_Bottle = document.getElementById(
          "my_Select_Color_Bottle"
        );
        const TextValueBottleColor = document.getElementById(
          "TextValueBottleColor"
        );

        my_Select_Color_Bottle.addEventListener(
          "change" && "input",
          function () {
            bottiglia[0].material.color.set(
              bottiglia[0].material.color.set(my_Select_Color_Bottle.value)
            );
            TextValueBottleColor.innerHTML = this.value;
          }
        );

        var colorBottiglia = bottiglia[0].material.color;

        function cambiacoloreBottiglia() {
          colorBottiglia = my_Select_Color_Bottle.value;
        }
        cambiacoloreBottiglia();

        // TRASMISSION
        const my_Select_Transmission_Bottle = document.getElementById(
          "my_Select_Transmission_Bottle"
        );
        const TextValueBottleTransmission = document.getElementById(
          "TextValueBottleTransmission"
        );

        my_Select_Transmission_Bottle.addEventListener("change", function () {
          var value = parseFloat(this.value);
          value = Math.max(0, value);
          value = Math.min(1, value);
          bottiglia[0].material.envMapIntensity =
            my_Select_Transmission_Bottle.value;
          TextValueBottleTransmission.innerHTML = value;
        });
        my_Select_Transmission_Bottle.addEventListener("input", function () {
          var value = parseFloat(this.value);
          value = Math.max(0, value);
          value = Math.min(1, value);
          bottiglia[0].material.envMapIntensity =
            my_Select_Transmission_Bottle.value;
          TextValueBottleTransmission.innerHTML = value;
        });

        // ROUGHNESS
        const my_Select_Roughness_Bottle = document.getElementById(
          "my_Select_Roughness_Bottle"
        );
        const TextValueBottleRoughness = document.getElementById(
          "TextValueBottleRoughness"
        );

        my_Select_Roughness_Bottle.addEventListener("change", function () {
          var value = parseFloat(this.value);
          value = Math.max(0, value);
          value = Math.min(1, value);
          bottiglia[0].material.roughness = value;
          TextValueBottleRoughness.innerHTML = value;
        });

        my_Select_Roughness_Bottle.addEventListener("input", function () {
          var value = parseFloat(this.value);
          value = Math.max(0, value);
          value = Math.min(1, value);
          bottiglia[0].material.roughness = value;
          TextValueBottleRoughness.innerHTML = value;
        });
      }

      // ____________pannel bottiglia___________

      const ColorClick = document.querySelector(".Color");
      const Box_ColorBottle_Pannel = document.querySelector(
        ".Box_ColorBottle_Pannel"
      );
      const Box_TypeBottle_Pannel = document.querySelector(
        ".Box_TypeBottle_Pannel"
      );

      ColorClick.addEventListener("click", function () {

        if (ColorClick.classList.value == "Color") {
          Box_ColorBottle_Pannel.style.display = "flex";
          Box_TypeBottle_Pannel.style.display = "none";
          ColorClick.style.display = "none";
        }
      });

      //! //XXX CAPSULE ____________________________________________________________

      // Capsule
      const CapsuleClick = document.querySelector(".Capsule");
      const Capsule_Pannel = document.querySelector(".Capsule_Pannel");

      CapsuleClick.addEventListener("click", function (bottle) {



        if (CapsuleClick.classList.value == "Capsule") {
          Capsule_Pannel.style.display = "flex";
          Box_ColorBottle_Pannel.style.display = "none";
          CapsuleClick.style.display = "none";

          // gsap.to(camera.position, {
          //   x: 0,
          //   y: 1,
          //   z: 2,
          //   duration: 0.8,
          // });

          // gsap.to(controls.target, {
          //   x: 0,
          //   y: 0.3,
          //   z: 0,
          //   duration: 0.8,
          // });
        }
      });

      const champagneCork = currentModel.children.filter(
        (obj) => obj.name === "champagneCork"
      );
      const longAluminium = currentModel.children.filter(
        (obj) => obj.name === "longAluminium"
      );
      const longWax = currentModel.children.filter(
        (obj) => obj.name === "longWax"
      );
      const shortAluminium = currentModel.children.filter(
        (obj) => obj.name === "shortAluminium"
      );
      const shortWax = currentModel.children.filter(
        (obj) => obj.name === "shortWax"
      );
      const sughero = currentModel.children.filter(
        (obj) => obj.name === "sughero"
      );
      const champagneAluminium = currentModel.children.filter(
        (obj) => obj.name === "champagneAluminium"
      );

      champagneCork[0].visible = false;
      longAluminium[0].visible = false;
      shortAluminium[0].visible = false;
      longWax[0].visible = false;
      shortWax[0].visible = false;
      sughero[0].visible = false;
      champagneAluminium[0].visible = false;

      // Card
      const CardCork = document.querySelector(".CardCork");
      const CardChampagneCork = document.querySelector(".CardChampagneCork");
      const CardAluminum = document.querySelector(".CardAluminum");
      const CardWax = document.querySelector(".CardWax");
      const CardTypeAluminumShort = document.querySelector(
        ".CardTypeAluminumShort"
      );
      const CardTypeAluminumLong = document.querySelector(
        ".CardTypeAluminumLong"
      );
      const CardTypeAluminumChampagne = document.querySelector(
        ".CardTypeAluminumChampagne"
      );
      const CardTypeWaxShort = document.querySelector(".CardTypeWaxShort");
      const CardTypeWaxLong = document.querySelector(".CardTypeWaxLong");

      // CardAluminum
      const BoxTypeAluminumShort = document.querySelector(
        ".BoxTypeAluminumShort"
      );
      const BoxTypeAluminumLong = document.querySelector(
        ".BoxTypeAluminumLong"
      );
      const BoxTypeAluminumChampagne = document.querySelector(
        ".BoxTypeAluminumChampagne"
      );
      const textTypeAluminum = document.querySelector(".textTypeAluminum");

      // CardWax
      const BoxTypeWaxShort = document.querySelector(".BoxTypeWaxShort");
      const BoxTypeWaxLong = document.querySelector(".BoxTypeWaxLong");
      const textTypeWax = document.querySelector(".textTypeWax");

      const selectColorCapsuel = document.querySelector(".selectColorCapsuel");

      // CardAluminum
      CardAluminum.addEventListener("click", function () {
        BoxTypeAluminumShort.style.display = "inline";
        BoxTypeAluminumLong.style.display = "inline";
        BoxTypeAluminumChampagne.style.display = "inline";
        textTypeAluminum.style.display = "inline";

        BoxTypeWaxShort.style.display = "none";
        BoxTypeWaxLong.style.display = "none";
        textTypeWax.style.display = "none";

        selectColorCapsuel.style.display = "inline";

        if (sughero[0].visible) {
          sughero[0].visible = false;
        }
        champagneCork[0].visible = false;
        longAluminium[0].visible = false;
        shortAluminium[0].visible = false;
        longWax[0].visible = false;
        shortWax[0].visible = false;
        champagneAluminium[0].visible = false;
      });

      // CardWax
      CardWax.addEventListener("click", function () {
        BoxTypeAluminumShort.style.display = "none";
        BoxTypeAluminumLong.style.display = "none";
        textTypeAluminum.style.display = "none";
        BoxTypeAluminumChampagne.style.display = "none";

        BoxTypeWaxShort.style.display = "inline";
        BoxTypeWaxLong.style.display = "inline";
        textTypeWax.style.display = "inline";

        selectColorCapsuel.style.display = "inline";

        if (sughero[0].visible) {
          sughero[0].visible = false;
        }
        champagneCork[0].visible = false;
        longAluminium[0].visible = false;
        shortAluminium[0].visible = false;
        longWax[0].visible = false;
        shortWax[0].visible = false;
        champagneAluminium[0].visible = false;
      });

      // CardCork
      CardCork.addEventListener("click", function () {
        BoxTypeAluminumShort.style.display = "none";
        BoxTypeAluminumLong.style.display = "none";
        textTypeAluminum.style.display = "none";
        BoxTypeAluminumChampagne.style.display = "none";

        BoxTypeWaxShort.style.display = "none";
        BoxTypeWaxLong.style.display = "none";
        textTypeWax.style.display = "none";

        selectColorCapsuel.style.display = "none";

        if (sughero[0].visible) {
          sughero[0].visible = false;
        }
        champagneCork[0].visible = true;
        longAluminium[0].visible = false;
        shortAluminium[0].visible = false;
        longWax[0].visible = false;
        shortWax[0].visible = false;
        champagneAluminium[0].visible = false;
      });

      // CardChampagneCork
      CardChampagneCork.addEventListener("click", function () {
        BoxTypeAluminumShort.style.display = "none";
        BoxTypeAluminumLong.style.display = "none";
        textTypeAluminum.style.display = "none";
        BoxTypeAluminumChampagne.style.display = "none";

        BoxTypeWaxShort.style.display = "none";
        BoxTypeWaxLong.style.display = "none";
        textTypeWax.style.display = "none";

        selectColorCapsuel.style.display = "none";

        if (champagneCork[0].visible) {
          champagneCork[0].visible = false;
        }
        sughero[0].visible = true;
        longAluminium[0].visible = false;
        shortAluminium[0].visible = false;
        longWax[0].visible = false;
        shortWax[0].visible = false;
        champagneAluminium[0].visible = false;
      });

      // CardTypeAluminumShort
      CardTypeAluminumShort.addEventListener("click", function () {
        if (longAluminium[0].visible) {
          longAluminium[0].visible = false;
        }
        if (champagneAluminium[0].visible) {
          champagneAluminium[0].visible = false;
        }
        shortAluminium[0].visible = true;
      });

      // CardTypeAluminumLong
      CardTypeAluminumLong.addEventListener("click", function () {
        if (shortAluminium[0].visible) {
          shortAluminium[0].visible = false;
        }
        if (champagneAluminium[0].visible) {
          champagneAluminium[0].visible = false;
        }
        longAluminium[0].visible = true;
      });

      // CardTypeAluminumChampagne
      CardTypeAluminumChampagne.addEventListener("click", function () {
        if (shortAluminium[0].visible) {
          shortAluminium[0].visible = false;
        }
        if (longAluminium[0].visible) {
          longAluminium[0].visible = false;
        }
        champagneAluminium[0].visible = true;
      });

      // CardTypeWaxShort
      CardTypeWaxShort.addEventListener("click", function () {
        if (longWax[0].visible) {
          longWax[0].visible = false;
        }
        shortWax[0].visible = true;
      });

      // CardTypeWaxLong
      CardTypeWaxLong.addEventListener("click", function () {
        if (shortWax[0].visible) {
          shortWax[0].visible = false;
        }
        longWax[0].visible = true;
      });

      longAluminium[0].material.metalness = 0;
      longAluminium[0].material.roughness = 0;
      longAluminium[0].material.color.set("#B10606");
      longAluminium[0].material.envMap = textures_Ambient;
      longAluminium[0].material.envMapIntensity = 0.5;

      shortAluminium[0].material.metalness = 0;
      shortAluminium[0].material.roughness = 0;
      shortAluminium[0].material.color.set("#B10606");
      shortAluminium[0].material.envMap = textures_Ambient;
      shortAluminium[0].material.envMapIntensity = 0.5;

      champagneAluminium[0].material.metalness = 0;
      champagneAluminium[0].material.roughness = 0;
      champagneAluminium[0].material.color.set("#B10606");
      champagneAluminium[0].material.envMap = textures_Ambient;
      champagneAluminium[0].material.envMapIntensity = 0.5;

      longWax[0].material.metalness = 0;
      longWax[0].material.roughness = 0;
      longWax[0].material.color.set("#7d0d0d");
      longWax[0].material.envMap = textures_Ambient;
      longWax[0].material.envMapIntensity = 0.2;

      shortWax[0].material.metalness = 0;
      shortWax[0].material.roughness = 0;
      shortWax[0].material.color.set("#7d0d0d");
      shortWax[0].material.envMap = textures_Ambient;
      shortWax[0].material.envMapIntensity = 0.2;

      // ____________debug Capsule___________

      {
        // COLOR
        const my_Select_Color_Capsule = document.getElementById(
          "my_Select_Color_Capsule"
        );
        const TextValueCapsuleColor = document.getElementById(
          "TextValueCapsuleColor"
        );

        my_Select_Color_Capsule.addEventListener(
          "change" && "input",
          function () {
            shortWax[0].material.color.set(
              shortWax[0].material.color.set(my_Select_Color_Capsule.value)
            );
            longWax[0].material.color.set(
              longWax[0].material.color.set(my_Select_Color_Capsule.value)
            );
            longAluminium[0].material.color.set(
              longAluminium[0].material.color.set(my_Select_Color_Capsule.value)
            );
            shortAluminium[0].material.color.set(
              shortAluminium[0].material.color.set(
                my_Select_Color_Capsule.value
              )
            );
            champagneAluminium[0].material.color.set(
              champagneAluminium[0].material.color.set(
                my_Select_Color_Capsule.value
              )
            );
            TextValueCapsuleColor.innerHTML = this.value;
          }
        );

        var colorShortWax = shortWax[0].material.color;
        var colorLongWax = longWax[0].material.color;
        var colorLongAluminium = longAluminium[0].material.color;
        var colorShortAluminium = shortAluminium[0].material.color;
        var colorChampagneAluminium = champagneAluminium[0].material.color;

        function cambiacolore() {
          colorShortWax = my_Select_Color_Capsule.value;
          colorLongWax = my_Select_Color_Capsule.value;
          colorLongAluminium = my_Select_Color_Capsule.value;
          colorShortAluminium = my_Select_Color_Capsule.value;
          colorChampagneAluminium = my_Select_Color_Capsule.value;
        }
        cambiacolore();

        // TRASMISSION
        const my_Select_Transmission_Stopper = document.getElementById(
          "my_Select_Transmission_Stopper"
        );
        const TextValueStopperTransmission = document.getElementById(
          "TextValueStopperTransmission"
        );

        my_Select_Transmission_Stopper.addEventListener("change", function () {
          var value = parseFloat(this.value);
          value = Math.max(0, value);
          value = Math.min(1, value);
          shortWax[0].material.envMapIntensity = value;
          TextValueStopperTransmission.innerHTML = value;
          longWax[0].material.envMapIntensity = value;
          longAluminium[0].material.envMapIntensity = value;
          shortAluminium[0].material.envMapIntensity = value;
          champagneAluminium[0].material.envMapIntensity = value;
        });

        my_Select_Transmission_Stopper.addEventListener("input", function () {
          var value = parseFloat(this.value);
          value = Math.max(0, value);
          value = Math.min(1, value);
          shortWax[0].material.envMapIntensity = value;
          TextValueStopperTransmission.innerHTML = value;
          longWax[0].material.envMapIntensity = value;
          longAluminium[0].material.envMapIntensity = value;
          shortAluminium[0].material.envMapIntensity = value;
          champagneAluminium[0].material.envMapIntensity = value;
        });

        // ROUGHNESS
        const my_Select_Roughness_Stopper = document.getElementById(
          "my_Select_Roughness_Stopper"
        );
        const TextValueStopperRoughness = document.getElementById(
          "TextValueStopperRoughness"
        );

        my_Select_Roughness_Stopper.addEventListener("change", function () {
          var value = parseFloat(this.value);
          value = Math.max(0, value);
          value = Math.min(1, value);
          shortWax[0].material.roughness = value;
          TextValueStopperRoughness.innerHTML = value;
          longWax[0].material.roughness = value;
          longAluminium[0].material.roughness = value;
          shortAluminium[0].material.roughness = value;
          champagneAluminium[0].material.roughness = value;
        });

        my_Select_Roughness_Stopper.addEventListener("input", function () {
          var value = parseFloat(this.value);
          value = Math.max(0, value);
          value = Math.min(1, value);
          shortWax[0].material.roughness = value;
          TextValueStopperRoughness.innerHTML = value;
          longWax[0].material.roughness = value;
          longAluminium[0].material.roughness = value;
          shortAluminium[0].material.roughness = value;
          champagneAluminium[0].material.roughness = value;
        });

        // METALNESS
        const my_Select_Metalness_Stopper = document.getElementById(
          "my_Select_Metalness_Stopper"
        );
        const TextValueStopperMetalness = document.getElementById(
          "TextValueStopperMetalness"
        );

        my_Select_Metalness_Stopper.addEventListener("change", function () {
          var value = parseFloat(this.value);
          value = Math.max(0, value);
          value = Math.min(1, value);
          shortWax[0].material.metalness = value;
          TextValueStopperMetalness.innerHTML = value;
          longWax[0].material.metalness = value;
          longAluminium[0].material.metalness = value;
          shortAluminium[0].material.metalness = value;
          champagneAluminium[0].material.metalness = value;
        });

        my_Select_Metalness_Stopper.addEventListener("input", function () {
          var value = parseFloat(this.value);
          value = Math.max(0, value);
          value = Math.min(1, value);
          shortWax[0].material.metalness = value;
          TextValueStopperMetalness.innerHTML = value;
          longWax[0].material.metalness = value;
          longAluminium[0].material.metalness = value;
          shortAluminium[0].material.metalness = value;
          champagneAluminium[0].material.metalness = value;
        });
      }

      //! //XXX LABEL ____________________________________________________________

      const LabelClick = document.querySelector(".Label");
      const Label_Pannel = document.querySelector(".Label_Pannel");

      // Texture Label
      const etichetta = "label5.png";
      const textureLabelDefault = new THREE.TextureLoader().load(etichetta);

      const label = currentModel.children.filter((obj) => obj.name === "label");

      label[0].visible = false;

      label[0].material.map = textureLabelDefault;
      label[0].material.transparent = true;
      label[0].material.side = 2;

      // ____________debug Label___________

      {
        //  IMG
        const my_Label = document.getElementById("my_Label");
        const progressBar = document.getElementById("progress");

        my_Label.addEventListener("change", function () {
          var picture = new FileReader();
          picture.readAsDataURL(this.files[0]);

          const startTime = performance.now();

          picture.addEventListener("load", function (event) {
            const endTime = performance.now();
            const loadingTime = endTime - startTime;

            progressBar.style.width = "100%";
            progressBar.style.transitionDuration = loadingTime + "ms";

            label[0].material.map = new THREE.TextureLoader().load(
              event.target.result
            );
            label[0].needsUpdate = true;
          });
        });
      }

      LabelClick.addEventListener("click", function () {
        controls.maxPolarAngle = Math.PI / 1.9;
        controls.minPolarAngle = Math.PI / 8;

        if (LabelClick.classList.value == "Label") {
          label[0].visible = true;
          Label_Pannel.style.display = "inline";
          Capsule_Pannel.style.display = "none";
          LabelClick.style.display = "none";

          gsap.to(camera.position, {
            x: 0.88,
            y: 0.2,
            z: 0.88,
            duration: 0.8,
          });

          gsap.to(controls.target, {
            x: 0,
            y: 0.1,
            z: 0,
            duration: 0.8,
          });
        }
      });

      //! //XXX MODEL 3D ____________________________________________________________

      const Model3DClick = document.querySelector(".Model3D");
      
     

      //! //XXX REFRESH ____________________________________________________________

      const Reload = document.querySelector(".refresh");
      Reload.addEventListener("click", function () {
        location.reload();
      });

      // XXX FUNCTION SAVE

      const btn = document.getElementById("download-glb");
      btn.addEventListener("click", download);

      function download() {
        Cylinder.visible = false;
        scene.remove(ambientLight);
        scene.remove(light);
        scene.remove(pointLight);
        scene.remove(pointLight2);

        //  metaverso visore
        bottiglia[0].renderOrder = 2;
        label[0].renderOrder = 3;
        bottiglia[0].material.side = 2;
        label[0].material.side = 2;

        const exporter = new GLTFExporter();
        exporter.parse(
          scene,
          function (result) {
            saveArrayBuffer(result, bottle.name + ".glb");
          },
          function (error) {
            console.error(error);
          },
          {
            binary: true,
          }
        );
      }

      // // --------------------------------------
      // function uploadBlob(blob, file_name) {
      //   var file = new File([blob], "name");

      //   var data = new FormData();
      //   data.append("file", file);
      //   data.append("file_name", file_name);

      //   // Creating a new blob
      //   // Hostname and port of the local server
      //   fetch(
      //     "https://servicesstaging.crurated.com/api/service-media/buckets/files",
      //     {
      //       // HTTP request type
      //       method: "POST",

      //       headers: {
      //         "Content-Type": "application/x-www-form-urlencoded",
      //         Authorization:
      //           "Bearer 7ZpMonLVyDdlmaDco3CmXtJpuRqRIhIf0w0mDosCIwmlHLwKdqz3Wx2Sx2YS6jJVPqkEGNJiIzGbuAlwoHLe9UiV6iHwU9aFRMYINLl20cFWOqtA15DBaBPZRRnd",
      //       },

      //       // Sending our blob with our request
      //       body: data,
      //     }
      //   )
      //     .then((response) => alert("Blob Uploaded"))
      //     .catch((err) => alert(err));
      // }
      // // --------------------------------------

      function saveArrayBuffer(buffer, fileName) {
        save(new Blob([buffer]), fileName);
      }

      const link = document.createElement("a");
      document.body.appendChild(link);

      function save(blob, fileName) {
        // uploadBlob(blob, fileName);
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    });
  });
});

// XXX ANIMATE
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

// XXX____________Effetto al click___________

//_______Effetto per pagina Bottiglie__________

function findChildDiv(element) {
  if (element.classList.contains("child")) {
    return element;
  } else if (element.parentElement) {
    return findChildDiv(element.parentElement);
  } else {
    return null;
  }
}

content_Type_bottle.addEventListener("mousedown", function (event) {
  const childDiv = findChildDiv(event.target);
  if (childDiv) {
    childDiv.style.transform = "scale(0.9)";
  }
});

content_Type_bottle.addEventListener("mouseup", function (event) {
  const childDiv = findChildDiv(event.target);
  if (childDiv) {
    childDiv.style.transform = "scale(1)";
  }
});

content_Type_bottle.addEventListener("mouseout", function (event) {
  const childDiv = findChildDiv(event.target);
  if (childDiv) {
    childDiv.style.transform = "scale(1)";
  }
});
content_Type_bottle.addEventListener("mousedown", function (event) {
  const childDiv = findChildDiv(event.target);
  if (childDiv) {
    childDiv.style.transform = "scale(0.9)";
  }
});

content_Type_bottle.addEventListener("mouseup", function (event) {
  const childDiv = findChildDiv(event.target);
  if (childDiv) {
    childDiv.style.transform = "scale(1)";
  }
});

content_Type_bottle.addEventListener("mouseout", function (event) {
  const childDiv = findChildDiv(event.target);
  if (childDiv) {
    childDiv.style.transform = "scale(1)";
  }
});

//XXX_______Effetto per pagina capsule__________

const BoxAluminium = document.querySelector(".BoxAluminum");
const CardAluminum = document.querySelector(".CardAluminum");
const CardCork = document.querySelector(".CardCork");
const BoxWax = document.querySelector(".BoxWax");
const CardWax = document.querySelector(".CardWax");
const BoxCock = document.querySelector(".BoxCork");
const CardChampagneCork = document.querySelector(".CardChampagneCork");
const BoxTypeAluminumShort = document.querySelector(".BoxTypeAluminumShort");
const BoxChampagneCork = document.querySelector(".BoxChampagneCork");
const BoxTypeAluminumLong = document.querySelector(".BoxTypeAluminumLong");
const BoxTypeAluminumChampagne = document.querySelector(
  ".BoxTypeAluminumChampagne"
);
const CardTypeAluminumShort = document.querySelector(".CardTypeAluminumShort");
const CardTypeAluminumLong = document.querySelector(".CardTypeAluminumLong");
const CardTypeAluminumChampagne = document.querySelector(
  ".CardTypeAluminumChampagne"
);
const BoxTypeWaxShort = document.querySelector(".BoxTypeWaxShort");
const BoxTypeWaxLong = document.querySelector(".BoxTypeWaxLong");
const CardTypeWaxShort = document.querySelector(".CardTypeWaxShort");
const CardTypeWaxLong = document.querySelector(".CardTypeWaxLong");

BoxAluminium.addEventListener("mousedown", (e) => {
  e.currentTarget.style.transform = "scale(0.9)";
  CardAluminum.style.backgroundColor = "#968773";
  BoxWax.style.transform = "scale(1)";
  CardWax.style.backgroundColor = "#FAEBD7";
  CardChampagneCork.style.backgroundColor = "#FAEBD7";
  CardCork.style.backgroundColor = "#FAEBD7";
  CardTypeWaxShort.style.backgroundColor = "#FAEBD7";
  CardTypeWaxLong.style.backgroundColor = "#FAEBD7";
});

BoxWax.addEventListener("mousedown", (e) => {
  e.currentTarget.style.transform = "scale(0.9)";
  CardWax.style.backgroundColor = "#968773";
  BoxAluminium.style.transform = "scale(1)";
  CardAluminum.style.backgroundColor = "#FAEBD7";
  CardChampagneCork.style.backgroundColor = "#FAEBD7";
  CardCork.style.backgroundColor = "#FAEBD7";
  CardTypeAluminumChampagne.style.backgroundColor = "#FAEBD7";
  CardTypeAluminumShort.style.backgroundColor = "#FAEBD7";
  CardTypeAluminumLong.style.backgroundColor = "#FAEBD7";
});

BoxCock.addEventListener("mousedown", (e) => {
  e.currentTarget.style.transform = "scale(0.9)";
  BoxAluminium.style.transform = "scale(1)";
  BoxWax.style.transform = "scale(1)";
});

BoxCock.addEventListener("mouseup", (e) => {
  e.currentTarget.style.transform = "scale(1)";
  CardCork.style.backgroundColor = "#968773";
  CardAluminum.style.backgroundColor = "#FAEBD7";
  CardWax.style.backgroundColor = "#FAEBD7";
  CardChampagneCork.style.backgroundColor = "#FAEBD7";
  CardTypeAluminumChampagne.style.backgroundColor = "#FAEBD7";
  CardTypeAluminumShort.style.backgroundColor = "#FAEBD7";
  CardTypeAluminumLong.style.backgroundColor = "#FAEBD7";
  CardTypeWaxShort.style.backgroundColor = "#FAEBD7";
  CardTypeWaxLong.style.backgroundColor = "#FAEBD7";
});

BoxChampagneCork.addEventListener("mousedown", (e) => {
  CardCork.style.backgroundColor = "#FAEBD7";
  e.currentTarget.style.transform = "scale(0.9)";
  BoxAluminium.style.transform = "scale(1)";
  BoxWax.style.transform = "scale(1)";
  CardWax.style.backgroundColor = "#FAEBD7";
  CardAluminum.style.backgroundColor = "#FAEBD7";
  CardTypeAluminumChampagne.style.backgroundColor = "#FAEBD7";
  CardTypeAluminumShort.style.backgroundColor = "#FAEBD7";
  CardTypeAluminumLong.style.backgroundColor = "#FAEBD7";
  CardTypeWaxShort.style.backgroundColor = "#FAEBD7";
  CardTypeWaxLong.style.backgroundColor = "#FAEBD7";
});

BoxChampagneCork.addEventListener("mouseup", (e) => {
  e.currentTarget.style.transform = "scale(1)";
  CardChampagneCork.style.backgroundColor = "#968773";
  CardAluminum.style.backgroundColor = "#FAEBD7";
  CardWax.style.backgroundColor = "#FAEBD7";
});

BoxTypeAluminumShort.addEventListener("mousedown", (e) => {
  e.currentTarget.style.transform = "scale(0.9)";
});

BoxTypeAluminumShort.addEventListener("mouseup", (e) => {
  e.currentTarget.style.transform = "scale(1)";
  CardTypeAluminumShort.style.backgroundColor = "#968773";
  CardTypeAluminumLong.style.backgroundColor = "#FAEBD7";
  CardTypeAluminumChampagne.style.backgroundColor = "#FAEBD7";
});

BoxTypeAluminumLong.addEventListener("mousedown", (e) => {
  e.currentTarget.style.transform = "scale(0.9)";
});

BoxTypeAluminumLong.addEventListener("mouseup", (e) => {
  e.currentTarget.style.transform = "scale(1)";
  CardTypeAluminumLong.style.backgroundColor = "#968773";
  CardTypeAluminumShort.style.backgroundColor = "#FAEBD7";
  CardTypeAluminumChampagne.style.backgroundColor = "#FAEBD7";
});

BoxTypeAluminumChampagne.addEventListener("mousedown", (e) => {
  e.currentTarget.style.transform = "scale(0.9)";
});

BoxTypeAluminumChampagne.addEventListener("mouseup", (e) => {
  e.currentTarget.style.transform = "scale(1)";
  CardTypeAluminumChampagne.style.backgroundColor = "#968773";
  CardTypeAluminumShort.style.backgroundColor = "#FAEBD7";
  CardTypeAluminumLong.style.backgroundColor = "#FAEBD7";
});

BoxTypeWaxShort.addEventListener("mousedown", (e) => {
  e.currentTarget.style.transform = "scale(0.9)";
  CardTypeWaxLong.style.backgroundColor = "#FAEBD7";
});

BoxTypeWaxShort.addEventListener("mouseup", (e) => {
  e.currentTarget.style.transform = "scale(1)";
  CardTypeWaxShort.style.backgroundColor = "#968773";
});

BoxTypeWaxLong.addEventListener("mousedown", (e) => {
  e.currentTarget.style.transform = "scale(0.9)";
  CardTypeWaxShort.style.backgroundColor = "#FAEBD7";
});

BoxTypeWaxLong.addEventListener("mouseup", (e) => {
  e.currentTarget.style.transform = "scale(1)";
  CardTypeWaxLong.style.backgroundColor = "#968773";
});

//XXX___________Screenshot________
const screenshotButton = document.querySelector("#screenshot-button");

screenshotButton.addEventListener("click", () => {
  Cylinder.visible = false;
  renderer.render(scene, camera);
  const imgData = renderer.domElement.toDataURL("image/jpeg");
  let link = document.createElement("a");
  link.href = imgData;
  link.download = "screenshot.png";
  link.click();
  setTimeout(() => {
    Cylinder.visible = true;
  }, 500);
});

// window.addEventListener("mouseup", function () {
//   console.log("camera position", camera.position);
//   console.log("control target", controls.target);
// });
