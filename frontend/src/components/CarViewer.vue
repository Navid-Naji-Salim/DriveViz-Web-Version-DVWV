<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { CarModel, ColorOption, WheelOption } from "../types/catalog";

const props = defineProps<{
  model: CarModel | null;
  color: ColorOption | null;
  wheel: WheelOption | null;
  daylight: boolean;
}>();

const container = ref<HTMLElement | null>(null);
const loading = ref(false);
const loadError = ref("");

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let controls: OrbitControls | null = null;
let animationFrame = 0;
let resizeObserver: ResizeObserver | null = null;
let bodyGroup: THREE.Group | null = null;
let wheelGroup: THREE.Group | null = null;
const loader = new GLTFLoader();
const clock = new THREE.Clock();

function makeRenderer(host: HTMLElement) {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(host.clientWidth, host.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);
}

function makeScene(host: HTMLElement) {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(35, host.clientWidth / host.clientHeight, 0.1, 100);
  camera.position.set(4.2, 2.2, 5.6);

  controls = new OrbitControls(camera, renderer!.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 0.65, 0);
  controls.minDistance = 3.2;
  controls.maxDistance = 8;
  controls.maxPolarAngle = Math.PI * 0.48;

  const hemi = new THREE.HemisphereLight(0xffffff, 0x171717, props.daylight ? 1.5 : 0.55);
  hemi.name = "daylight";
  scene.add(hemi);

  const key = new THREE.DirectionalLight(0xffffff, props.daylight ? 3.5 : 1.3);
  key.name = "key-light";
  key.position.set(4, 6, 5);
  key.castShadow = true;
  scene.add(key);

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(4.2, 96),
    new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.88, metalness: 0.05 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.02;
  floor.receiveShadow = true;
  scene.add(floor);
}

function frameObject(object: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxAxis = Math.max(size.x, size.y, size.z);
  const scale = maxAxis > 0 ? 3.35 / maxAxis : 1;

  object.scale.setScalar(scale);
  object.position.sub(center.multiplyScalar(scale));
  object.position.y += 0.12;
}

function stylizeLayer(object: THREE.Object3D, role: string) {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) {
      return;
    }

    child.castShadow = true;
    child.receiveShadow = true;

    if (role === "body") {
      child.material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(props.color?.hex ?? "#1a1c1c"),
        metalness: 0.72,
        roughness: 0.26,
        clearcoat: 1,
        clearcoatRoughness: 0.18
      });
    }
  });
}

function setBodyColor(color: ColorOption | null) {
  if (!bodyGroup || !color) {
    return;
  }

  bodyGroup.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhysicalMaterial) {
      child.material.color.set(color.hex);
      child.material.needsUpdate = true;
    }
  });
}

function setWheelFinish(wheel: WheelOption | null) {
  if (!wheelGroup || !wheel) {
    return;
  }

  wheelGroup.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) {
      return;
    }

    child.material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(wheel.colorHex),
      roughness: wheel.roughness,
      metalness: wheel.metalness
    });
  });
}

function setDaylight(daylight: boolean) {
  if (!scene) {
    return;
  }

  const hemi = scene.getObjectByName("daylight") as THREE.HemisphereLight | undefined;
  const key = scene.getObjectByName("key-light") as THREE.DirectionalLight | undefined;

  if (hemi) {
    hemi.intensity = daylight ? 1.5 : 0.55;
  }

  if (key) {
    key.intensity = daylight ? 3.5 : 1.3;
  }
}

async function loadCar(nextModel: CarModel | null) {
  if (!scene || !nextModel?.available) {
    return;
  }

  loading.value = true;
  loadError.value = "";

  scene.children
    .filter((child) => child.name === "car-layer")
    .forEach((child) => scene?.remove(child));

  bodyGroup = null;
  wheelGroup = null;

  try {
    const carRoot = new THREE.Group();
    carRoot.name = "car-layer";

    for (const layer of nextModel.layers) {
      if (!layer.visible) {
        continue;
      }

      const gltf = await loader.loadAsync(layer.url);
      const object = gltf.scene;
      stylizeLayer(object, layer.role);

      if (layer.role === "body") {
        bodyGroup = object;
      }

      if (layer.role === "wheels") {
        wheelGroup = object;
      }

      carRoot.add(object);
    }

    frameObject(carRoot);
    scene.add(carRoot);
    setBodyColor(props.color);
    setWheelFinish(props.wheel);
  } catch (error) {
    console.error(error);
    loadError.value = "Unable to load the installed car model layers.";
  } finally {
    loading.value = false;
  }
}

function animate() {
  animationFrame = window.requestAnimationFrame(animate);
  controls?.update();

  const elapsed = clock.getElapsedTime();
  const car = scene?.getObjectByName("car-layer");
  if (car) {
    car.position.y = 0.02 + Math.sin(elapsed * 0.7) * 0.012;
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

onMounted(() => {
  if (!container.value) {
    return;
  }

  makeRenderer(container.value);
  makeScene(container.value);

  resizeObserver = new ResizeObserver(([entry]) => {
    if (!renderer || !camera) {
      return;
    }

    const { width, height } = entry.contentRect;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });
  resizeObserver.observe(container.value);

  animate();
  void loadCar(props.model);
});

watch(() => props.model?.id, () => void loadCar(props.model));
watch(() => props.color?.id, () => setBodyColor(props.color));
watch(() => props.wheel?.id, () => setWheelFinish(props.wheel));
watch(() => props.daylight, setDaylight);

onBeforeUnmount(() => {
  window.cancelAnimationFrame(animationFrame);
  resizeObserver?.disconnect();
  controls?.dispose();
  renderer?.dispose();
  renderer?.domElement.remove();
});
</script>

<template>
  <div ref="container" class="car-viewer">
    <div v-if="loading || loadError || !model" class="canvas-placeholder">
      <span class="ms">directions_car</span>
      <p class="canvas-ph-title">{{ loadError ? "Model Error" : loading ? "Loading Model" : "Car Canvas" }}</p>
      <p class="canvas-ph-sub">
        {{ loadError || "Select the installed Toyota model to load the 3D layers." }}
      </p>
    </div>
  </div>
</template>
