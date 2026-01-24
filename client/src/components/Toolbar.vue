<template>
  <div>
    <div class="sectionTitle">Current Color</div>
    <div class="currentColor">
      <div class="currentColorBox" :style="{ background: selectedColor }"></div>
      <div>
        <div class="strong">{{ selectedColor }}</div>
        <div class="muted">Click a swatch</div>
      </div>
    </div>
  </div>

  <div>
    <div class="sectionTitle">Palette</div>
    <div class="palette">
      <div
        v-for="swatch in palette"
        :key="swatch"
        class="swatch"
        :class="{ active: swatch === selectedColor }"
        :style="{ background: swatch }"
        @click="emit('setSelectedColor', swatch)"
        :title="swatch"
      ></div>
    </div>
  </div>

  <div>
    <div class="sectionTitle">Actions</div>
    <div class="row">
      <button @click="emit('clearAll')">Clear</button>
      <button @click="emit('fillAll')">Fill</button>
      <button @click="emit('saveToServer')">Save</button>
      <button @click="emit('loadFromServer')">Load</button>
    </div>
  </div>

  <div>
    <div class="sectionTitle">Export / Import</div>

    <textarea v-model="jsonText"></textarea>

    <div class="row" style="margin-top: 8px">
      <button @click="emit('exportJson')">Export</button>
      <button @click="importClicked">Import</button>
    </div>

    <div v-if="statusMessage" class="muted hint">{{ statusMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

type Props = {
  selectedColor: string;
  palette: string[];
  statusMessage: string;
};

defineProps<Props>();

const emit = defineEmits<{
  (e: "setSelectedColor", value: string): void;
  (e: "clearAll"): void;
  (e: "fillAll"): void;
  (e: "saveToServer"): void;
  (e: "loadFromServer"): void;
  (e: "exportJson"): void;
  (e: "importJson", value: string): void;
}>();

const jsonText = ref<string>("");

function importClicked(): void {
  emit("importJson", jsonText.value);
}
</script>

<style scoped>
.sectionTitle {
  font-size: 14px;
  margin: 0 0 8px 0;
  color: #e6e6e6;
}

.currentColor {
  display: flex;
  align-items: center;
  gap: 10px;
}

.currentColorBox {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: #000;
}

.strong {
  font-weight: 600;
}

.palette {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
}

.swatch {
  height: 32px;
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
}

.swatch.active {
  outline: 2px solid rgba(255, 255, 255, 0.6);
  outline-offset: 2px;
}

.row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

button {
  background: #1c1c1c;
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #f2f2f2;
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;
}

textarea {
  width: 100%;
  min-height: 140px;
  resize: vertical;
  background: #0f0f0f;
  color: #ddd;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 10px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
  font-size: 12px;
}

.muted {
  color: #bcbcbc;
  font-size: 13px;
}

.hint {
  margin-top: 8px;
}
</style>
