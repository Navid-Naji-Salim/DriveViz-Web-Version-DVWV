<script setup lang="ts">
type TabKey = "model" | "exterior" | "interior" | "environment" | "specs";

defineProps<{
  activeTab: TabKey;
}>();

const emit = defineEmits<{
  change: [tab: TabKey];
}>();

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "model", label: "Model" },
  { key: "exterior", label: "Exterior" },
  { key: "interior", label: "Interior" },
  { key: "environment", label: "Environment" },
  { key: "specs", label: "Specs" }
];
</script>

<template>
  <div class="panel-tabs">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      class="p-tab"
      :class="{ active: activeTab === tab.key }"
      type="button"
      @click="emit('change', tab.key)"
    >
      <span class="p-tab-label">{{ tab.label }}</span>
    </button>
  </div>
</template>
