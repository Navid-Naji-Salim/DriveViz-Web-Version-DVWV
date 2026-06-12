<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import CanvasStage from "./components/CanvasStage.vue";
import SidePanel from "./components/SidePanel.vue";
import { getModels, saveConfiguration } from "./services/catalogApi";
import type { CarModel, ColorOption, WheelOption } from "./types/catalog";

const models = ref<CarModel[]>([]);
const selectedModelId = ref("");
const selectedColorId = ref("");
const selectedWheelId = ref("");
const daylight = ref(true);
const loading = ref(true);
const loadError = ref("");

const selectedModel = computed(() => models.value.find((model) => model.id === selectedModelId.value) ?? null);
const selectedColor = computed<ColorOption | null>(
  () => selectedModel.value?.colors.find((color) => color.id === selectedColorId.value) ?? null
);
const selectedWheel = computed<WheelOption | null>(
  () => selectedModel.value?.wheels.find((wheel) => wheel.id === selectedWheelId.value) ?? null
);

function selectModel(model: CarModel) {
  if (!model.available) {
    return;
  }

  selectedModelId.value = model.id;
  selectedColorId.value = model.colors[0]?.id ?? "";
  selectedWheelId.value = model.wheels[0]?.id ?? "";
}

function selectColor(color: ColorOption) {
  selectedColorId.value = color.id;
}

function selectWheel(wheel: WheelOption) {
  selectedWheelId.value = wheel.id;
}

async function persistConfiguration() {
  if (!selectedModel.value || !selectedColor.value || !selectedWheel.value) {
    return;
  }

  try {
    await saveConfiguration({
      modelId: selectedModel.value.id,
      colorId: selectedColor.value.id,
      wheelId: selectedWheel.value.id,
      daylight: daylight.value
    });
  } catch (error) {
    console.warn("Configuration was not persisted. The visualizer state is still applied locally.", error);
  }
}

onMounted(async () => {
  try {
    models.value = await getModels();
    const firstAvailableModel = models.value.find((model) => model.available);

    if (firstAvailableModel) {
      selectModel(firstAvailableModel);
    }
  } catch (error) {
    console.error(error);
    loadError.value = "Could not reach the DriveViz backend.";
  } finally {
    loading.value = false;
  }
});

watch([selectedModelId, selectedColorId, selectedWheelId, daylight], () => void persistConfiguration());
</script>

<template>
  <div class="layout">
    <SidePanel
      :models="models"
      :selected-model="selectedModel"
      :selected-color="selectedColor"
      :selected-wheel="selectedWheel"
      :loading="loading"
      @select-model="selectModel"
      @select-color="selectColor"
      @select-wheel="selectWheel"
    />

    <CanvasStage
      :model="selectedModel"
      :color="selectedColor"
      :wheel="selectedWheel"
      :daylight="daylight"
      @toggle-daylight="daylight = !daylight"
    />

    <div v-if="loadError" class="app-error">{{ loadError }}</div>
  </div>
</template>
