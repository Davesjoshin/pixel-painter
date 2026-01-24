<template>
  <div
    class="grid"
    :style="gridStyle"
    @contextmenu.prevent
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
  >
    <div
      v-for="(color, index) in pixels"
      :key="index"
      class="cell"
      :style="{ background: color }"
      @mousedown.prevent="paintCell(index, $event)"
      @mouseenter="dragPaint(index)"
    ></div>
  </div>
</template>

<script setup lang="ts">
    import { computed, ref } from "vue";

    type Props = {
        pixels: string[];
        gridSize: number;
        selectedColor: string;
    };

    const props = defineProps<Props>();

    // define a custom event called "updatePixels"
    const emit = defineEmits<{
        (e: "updatePixels", value: string[]): void;
    }>();

    const EMPTY_COLOR = "#000000";

    const isMouseDown = ref<boolean>(false);
    const paintMode = ref<"paint" | "erase">("paint");

    const gridStyle = computed(function () {
        return {
            gridTemplateColumns: `repeat(${props.gridSize}, 24px)`,
            gridTemplateRows: `repeat(${props.gridSize}, 24px)`,
        };
    });

    /**
     * Updates the pixel at the given index to the given new color.
     * It creates a copy of the current pixels array and updates the pixel at the given index with the new color.
     * It then emits an "updatePixels" event with the updated pixels array.
     * @param {number} index - The index of the pixel to update.
     * @param {string} newColor - The new color to set the pixel to.
     */
    function updatePixel(index: number, newColor: string): void {
        const copy = props.pixels.slice();
        copy[index] = newColor;
        emit("updatePixels", copy);
    }

    /**
     * Updates the pixel at the given index based on the mouse event.
     * If the right mouse button is clicked, it will erase the pixel by setting it to the empty color.
     * If the left mouse button is clicked, it will paint the pixel with the currently selected color.
     * @param {number} index - The index of the pixel to update.
     * @param {MouseEvent} mouseEvent - The mouse event that triggered this function.
     */
    function paintCell(index: number, mouseEvent: MouseEvent): void {
        // Right click erase
        if (mouseEvent.button === 2) {
            updatePixel(index, EMPTY_COLOR);
            return;
        }

        updatePixel(index, props.selectedColor);
    }

    /**
     * Updates the pixel at the given index if the mouse is currently down.
     * If the paint mode is "erase", it will erase the pixel by setting it to the empty color.
     * If the paint mode is "paint", it will paint the pixel with the currently selected color.
     * @param {number} index - The index of the pixel to update.
     */
    function dragPaint(index: number): void {
        if (!isMouseDown.value) {
            return;
        }

        if (paintMode.value === "erase") {
            updatePixel(index, EMPTY_COLOR);
            return;
        }

        updatePixel(index, props.selectedColor);
    }

    /**
     * Sets the paint mode based on the mouse button pressed.
     * If the right mouse button is pressed, the paint mode is set to "erase".
     * If the left mouse button is pressed, the paint mode is set to "paint".
     * @param {MouseEvent} mouseEvent - The mouse event that triggered this function.
     */
    function onMouseDown(mouseEvent: MouseEvent): void {
        isMouseDown.value = true;

        if (mouseEvent.button === 2) {
            paintMode.value = "erase";
            return;
        }

        paintMode.value = "paint";
    }

    /**
     * Resets the paint mode to "paint" and sets the isMouseDown flag to false when the mouse is released.
     */
    function onMouseUp(): void {
        isMouseDown.value = false;
        paintMode.value = "paint";
    }
</script>

<style scoped>
.grid {
  display: grid;
  gap: 2px;
  user-select: none;
  touch-action: none;
}

.cell {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  cursor: crosshair;
}
</style>

