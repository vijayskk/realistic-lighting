import * as THREE from 'three'
import { AmbientLight } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'

// const hours = new Date().getHours()
// const isDayTime = hours > 6 && hours < 20

console.log("The Model used here : Ancient Corinth - Peirene Fountain fuzzelhjb is licensed under Creative Commons Attribution");


const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(60 , window.innerWidth/window.innerHeight , 0.001 , 1000000)

const renderer = new THREE.WebGLRenderer({
  canvas:document.querySelector('#bg'),
  antialias:true,
  alpha:true
})
renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = 0.2
renderer.shadowMap = true

renderer.setPixelRatio(window.devicePixelRatio)

renderer.setSize(window.innerWidth,window.innerHeight)

camera.position.set(0,0,1)
//camera.lookAt(0,0,0)


const controls = new OrbitControls(camera,renderer.domElement)
controls.enableZoom = false;
controls.enablePan = false;
controls.enableDamping = true;



//scene.add(new THREE.AxesHelper(500))
const hemilight = new THREE.HemisphereLight(0xffeeb1 , 0x080820, 4)
scene.add(hemilight)


const spotlight = new THREE.SpotLight(0xffa95c,4)
spotlight.castShadow = true
spotlight.position.set(0,10,10)
spotlight.shadow.bias = -0.0001
spotlight.shadow.mapSize.width  = 1024*4;
spotlight.shadow.mapSize.height  = 1024*4;

scene.add(spotlight)


const loader = new GLTFLoader()
loader.load('/gltf/model.gltf',(obj)=>{
  obj.scene.rotateY(-Math.PI)
  obj.scene.children[0].traverse(n => {
    n.castShadow = true;
    n.receiveShadow = true;
    if(n.material.map) n.material.map.anisotropy = 16; 
  })
  
  scene.add(obj.scene)
  document.getElementById("loading").innerText = ""
  document.getElementById("info").innerText = "DRAG TO VIEW AROUND"

})

const hdriloader = new RGBELoader()
hdriloader.load('/hdri/cannon_2k.hdr',(texture)=>{
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture
  scene.environment = texture
})

const composer = new EffectComposer( renderer );


const renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );

// const vignette = new ShaderPass( FXAAShader );
// composer.addPass( vignette );


function animate(){



  controls.update()

  composer.render()
  requestAnimationFrame(animate)
}
animate()





window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
