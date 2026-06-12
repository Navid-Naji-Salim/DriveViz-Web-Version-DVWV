<script setup lang="ts">
import CarViewer from "./CarViewer.vue";
import type { CarModel, ColorOption, WheelOption } from "../types/catalog";

defineProps<{
  model: CarModel | null;
  color: ColorOption | null;
  wheel: WheelOption | null;
  daylight: boolean;
}>();

const emit = defineEmits<{
  toggleDaylight: [];
}>();
</script>

<template>
  <main class="canvas-wrap" :class="{ night: !daylight }">
    <div class="env-glow" :style="{ background: color ? `radial-gradient(ellipse at 60% 40%, ${color.hex}33 0%, transparent 70%)` : '' }" />

    <div id="carCanvas">
      <CarViewer :model="model" :color="color" :wheel="wheel" :daylight="daylight" />
    </div>

    <div class="ground" />
    <div class="ground-line" />
    <div class="watermark">{{ model?.name ?? "Toyota" }}</div>

    <div class="view-controls">
      <button class="view-btn active control-text" type="button" title="360 degree orbit">360</button>
      <button class="view-btn ms inactive-tool" type="button" title="Exterior view coming later" disabled>directions_car</button>
      <button class="view-btn ms inactive-tool" type="button" title="Interior view coming later" disabled>airline_seat_recline_normal</button>
      <button
        class="view-btn ms"
        :class="{ active: daylight }"
        type="button"
        :title="daylight ? 'Daytime lighting' : 'Night lighting'"
        @click="emit('toggleDaylight')"
      >
        light_mode
      </button>
      <button class="view-btn ms inactive-tool" type="button" title="Screenshot coming later" disabled>photo_camera</button>
    </div>
  </main>
</template>
