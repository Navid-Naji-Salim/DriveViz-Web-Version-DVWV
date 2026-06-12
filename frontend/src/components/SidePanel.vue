<script setup lang="ts">
import { computed, ref } from "vue";
import BrandHeader from "./BrandHeader.vue";
import PanelTabs from "./PanelTabs.vue";
import { useMobilePanel } from "../composables/useMobilePanel";
import type { CarModel, ColorOption, WheelOption } from "../types/catalog";

type TabKey = "model" | "exterior" | "interior" | "environment" | "specs";

const props = defineProps<{
  models: CarModel[];
  selectedModel: CarModel | null;
  selectedColor: ColorOption | null;
  selectedWheel: WheelOption | null;
  loading: boolean;
}>();

const emit = defineEmits<{
  selectModel: [model: CarModel];
  selectColor: [color: ColorOption];
  selectWheel: [wheel: WheelOption];
}>();

const activeTab = ref<TabKey>("model");
const panelRef = ref<HTMLElement | null>(null);
const { isDragging, startDrag, updateDrag, stopDrag } = useMobilePanel(panelRef);

const specGroups = computed(() => {
  const specs = props.selectedModel?.specs;

  if (!specs) {
    return [];
  }

  return [
    {
      label: "Performance",
      items: [
        ["Power", specs.power],
        ["Torque", specs.torque],
        ["0-60 mph", specs.accel],
        ["Drive", specs.drive]
      ]
    },
    {
      label: "Efficiency",
      items: [
        ["City MPG", specs.city],
        ["Hwy MPG", specs.hwy],
        ["Combined", specs.comb],
        ["Fuel", specs.fuel]
      ]
    },
    {
      label: "Dimensions",
      items: [
        ["Length", specs.len],
        ["Wheelbase", specs.wb]
      ]
    }
  ];
});
</script>

<template>
  <aside ref="panelRef" class="panel" :class="{ dragging: isDragging }">
    <div
      class="panel-handle"
      aria-hidden="true"
      @pointerdown="startDrag"
      @pointermove="updateDrag"
      @pointerup="stopDrag"
      @pointercancel="stopDrag"
    >
      <span class="panel-handle-bar" />
    </div>

    <BrandHeader />
    <PanelTabs :active-tab="activeTab" @change="activeTab = $event" />

    <div class="panel-body">
      <div class="tab-content" :class="{ active: activeTab === 'model' }">
        <p class="sec-label">Choose Your Model</p>
        <div class="model-cards">
          <button
            v-for="model in models"
            :key="model.id"
            class="model-card"
            :class="{ active: selectedModel?.id === model.id, disabled: !model.available }"
            type="button"
            :disabled="!model.available"
            @click="emit('selectModel', model)"
          >
            <div>
              <div class="model-card-name">{{ model.name }}</div>
              <div class="model-card-sub">{{ model.trim }}</div>
            </div>
            <div v-if="model.badge || !model.available" class="model-card-meta">
              <div class="model-badge" :class="{ muted: !model.available }">
                {{ model.available ? model.badge : "SOON" }}
              </div>
            </div>
          </button>
        </div>
      </div>

      <div class="tab-content" :class="{ active: activeTab === 'exterior' }">
        <p class="sec-label">Exterior Color</p>
        <div class="color-row">
          <button
            v-for="color in selectedModel?.colors ?? []"
            :key="color.id"
            class="swatch"
            :class="{ active: selectedColor?.id === color.id }"
            :style="{ background: color.hex }"
            :title="color.name"
            type="button"
            @click="emit('selectColor', color)"
          />
        </div>
        <p class="color-name">{{ selectedColor?.name ?? "Select a color" }}</p>

        <p class="sec-label">Wheel Package</p>
        <div class="wheel-row">
          <button
            v-for="wheel in selectedModel?.wheels ?? []"
            :key="wheel.id"
            class="wheel-pill"
            :class="{ active: selectedWheel?.id === wheel.id }"
            type="button"
            @click="emit('selectWheel', wheel)"
          >
            <div class="wheel-preview">
              <div class="wheel-dot" />
              <span>{{ wheel.sortOrder }}</span>
            </div>
            <div>
              <div class="wheel-pill-name">{{ wheel.name }}</div>
              <div class="wheel-pill-sub">{{ wheel.finish }}</div>
            </div>
          </button>
        </div>
      </div>

      <div class="tab-content" :class="{ active: activeTab === 'interior' }">
        <p class="sec-label">Interior Trim</p>
        <div class="int-row">
          <div class="int-item active">
            <div class="int-swatch interior-default" />
            <div class="int-info">
              <div class="int-name">Installed Interior Layer</div>
              <div class="int-sub">Loaded from Interiors.glb</div>
            </div>
            <span class="ms fill int-check">check_circle</span>
          </div>
        </div>
      </div>

      <div class="tab-content" :class="{ active: activeTab === 'environment' }">
        <p class="sec-label">Scene</p>
        <div class="env-note">
          Environment presets are intentionally paused. The current scene is a clean studio canvas for the installed car layers.
        </div>
      </div>

      <div class="tab-content" :class="{ active: activeTab === 'specs' }">
        <template v-if="selectedModel">
          <template v-for="group in specGroups" :key="group.label">
            <p class="sec-label">{{ group.label }}</p>
            <div class="spec-row">
              <div v-for="[label, value] in group.items" :key="label" class="spec-box">
                <p class="spec-lbl">{{ label }}</p>
                <p class="spec-val">{{ value }}</p>
              </div>
            </div>
          </template>
        </template>
        <div v-else class="env-note">{{ loading ? "Loading catalog..." : "No model selected." }}</div>
      </div>
    </div>
  </aside>
</template>
