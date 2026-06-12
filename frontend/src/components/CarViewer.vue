<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
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
const wheelLoading = ref(false);
const loadError = ref("");

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let controls: OrbitControls | null = null;
let animationFrame = 0;
let resizeObserver: ResizeObserver | null = null;
let carRoot: THREE.Group | null = null;
let bodyGroup: THREE.Object3D | null = null;
let wheelGroup: THREE.Object3D | null = null;
let carLoadToken = 0;
let wheelLoadToken = 0;
let carBaseY = 0;
const loader = new GLTFLoader();
const clock = new THREE.Clock();
const loadingTitle = computed(() => {
  if (loadError.value) {
    return "Model Error";
  }

  if (loading.value) {
    return "Loading Model";
  }

  if (wheelLoading.value) {
    return "Loading Wheels";
  }

  return "Car Canvas";
});

const loadingMessage = computed(() => {
  if (loadError.value) {
    return loadError.value;
  }

  if (wheelLoading.value) {
    return "Applying the selected wheel package.";
  }

  return "Select the installed Toyota model to load the 3D layers.";
});

const fallbackWheelAssets: Record<string, string> = {
  "split-spoke-alloy": "/models/Wheels_1.glb",
  "matte-black-sport": "/models/Wheels_2.glb",
  "forged-black": "/models/Wheels_2.glb",
  "dark-chrome": "/models/Wheels_3.glb",
  "premium-machined": "/models/Wheels_4.glb"
};

function makeRenderer(host: HTMLElement) {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(host.clientWidth, host.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  host.appendChild(renderer.domElement);
}

function makeScene(host: HTMLElement) {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(35, host.clientWidth / host.clientHeight, 0.01, 500);
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
  object.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxAxis = Math.max(size.x, size.y, size.z);
  const scale = maxAxis > 0 ? 3.35 / maxAxis : 1;

  object.scale.setScalar(scale);
  object.position.sub(center.multiplyScalar(scale));
  object.position.y += 0.12;
  object.updateMatrixWorld(true);
}

function stylizeLayer(object: THREE.Object3D, role: string) {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) {
      return;
    }

    child.castShadow = true;
    child.receiveShadow = true;
    child.frustumCulled = false;

    if (Array.isArray(child.material)) {
      child.material = child.material.map((material) => {
        const clone = material.clone();
        clone.side = THREE.DoubleSide;
        return clone;
      });
    } else {
      const clone = child.material.clone();
      clone.side = THREE.DoubleSide;
      child.material = clone;
    }

    if (role === "body") {
      child.material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(props.color?.hex ?? "#1a1c1c"),
        metalness: 0.72,
        roughness: 0.26,
        clearcoat: 1,
        clearcoatRoughness: 0.18,
        side: THREE.DoubleSide
      });
    }
  });
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) {
      return;
    }

    child.geometry.dispose();
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => material.dispose());
  });
}

function removeCar() {
  if (!scene || !carRoot) {
    return;
  }

  scene.remove(carRoot);
  disposeObject(carRoot);
  carRoot = null;
  bodyGroup = null;
  wheelGroup = null;
  carBaseY = 0;
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

function resolveWheelAsset(model: CarModel | null, wheel: WheelOption | null) {
  return (
    wheel?.assetUrl ??
    (wheel?.id ? fallbackWheelAssets[wheel.id] : undefined) ??
    model?.layers.find((layer) => layer.role === "wheels")?.url ??
    "/models/Wheels_1.glb"
  );
}

async function loadWheelLayer(model: CarModel, wheel: WheelOption | null, token: number) {
  if (!carRoot) {
    return;
  }

  const url = resolveWheelAsset(model, wheel);
  wheelLoading.value = true;

  try {
    const gltf = await loader.loadAsync(url);

    if (token !== wheelLoadToken || !carRoot) {
      disposeObject(gltf.scene);
      return;
    }

    if (wheelGroup) {
      carRoot.remove(wheelGroup);
      disposeObject(wheelGroup);
    }

    wheelGroup = gltf.scene;
    wheelGroup.name = "wheel-layer";
    stylizeLayer(wheelGroup, "wheels");
    carRoot.add(wheelGroup);
    carRoot.updateMatrixWorld(true);
    setWheelFinish(wheel);
  } catch (error) {
    console.error(error);
    loadError.value = "Unable to load the selected wheel package.";
  } finally {
    if (token === wheelLoadToken) {
      wheelLoading.value = false;
    }
  }
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

  const token = ++carLoadToken;
  loading.value = true;
  loadError.value = "";
  removeCar();

  try {
    const nextRoot = new THREE.Group();
    nextRoot.name = "car-layer";

    for (const layer of nextModel.layers) {
      if (!layer.visible || layer.role === "wheels") {
        continue;
      }

      const gltf = await loader.loadAsync(layer.url);
      if (token !== carLoadToken) {
        disposeObject(gltf.scene);
        return;
      }

      const object = gltf.scene;
      stylizeLayer(object, layer.role);

      if (layer.role === "body") {
        bodyGroup = object;
      }

      nextRoot.add(object);
    }

    carRoot = nextRoot;
    await loadWheelLayer(nextModel, props.wheel, ++wheelLoadToken);

    if (token !== carLoadToken || !carRoot) {
      return;
    }

    frameObject(carRoot);
    carBaseY = carRoot.position.y;
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
  if (carRoot) {
    carRoot.position.y = carBaseY + Math.sin(elapsed * 0.7) * 0.006;
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
watch(
  () => props.wheel?.id,
  () => {
    if (!props.model?.available || !carRoot) {
      return;
    }

    void loadWheelLayer(props.model, props.wheel, ++wheelLoadToken);
  }
);
watch(() => props.daylight, setDaylight);

onBeforeUnmount(() => {
  window.cancelAnimationFrame(animationFrame);
  resizeObserver?.disconnect();
  controls?.dispose();
  removeCar();
  renderer?.dispose();
  renderer?.domElement.remove();
});
</script>

<template>
  <div ref="container" class="car-viewer">
    <div v-if="loading || wheelLoading || loadError || !model" class="canvas-placeholder">
      <span class="ms">directions_car</span>
      <p class="canvas-ph-title">{{ loadingTitle }}</p>
      <p class="canvas-ph-sub">
        {{ loadingMessage }}
      </p>
    </div>
  </div>
</template>
