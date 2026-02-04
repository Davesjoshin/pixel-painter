<template>
    <div class="app">
        <div class="card">
            <h1 class="text-4xl font-bold text-green-400">
                Pixel Painter
            </h1>
            <p class="muted">
                Left-click paints
                Right-click erases
                Click + drag to draw
            </p>

            <div class="gridWrap">
                <PixelGrid 
                    :gridSize="gridSize"
                    :pixels="pixels"
                    :selectedColor="selectedColor"
                    @updatePixels="handlePixelUpdate"
                />
            </div>
        </div>

        <div class="card toolbar">
            <Toolbar 
                :selectedColor="selectedColor"
                :palette="palette"
                :statusMessage="statusMessage"
                @setSelectedColor="setSelectedColor"
                @clearAll="clearAll"
                @fillAll="fillAll"
                @saveToServer="saveToServer"
                @loadFromServer="loadFromServer"
                @exportJson="exportJson"
                @importJson="importJson"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, ref } from "vue";
    import PixelGrid from "./components/PixelGrid.vue";
    import Toolbar from "./components/Toolbar.vue";
    import { fetchDesign, saveDesign } from "./services/api";
    import type { PixelDesign } from "./types/pixel";

    const gridSize = 16;
    const emptyColor = "#000000";

    // Initialize the design
    const pixels = ref<string[]>(Array(gridSize * gridSize).fill(emptyColor));
    const selectedColor = ref<string>("#ffcc00");
    const statusMessage = ref<string>("");

    const palette = ref<string[]>([
        "#000000",
        "#ffffff",
        "#ff3b30",
        "#ff9500",
        "#ffcc00",
        "#34c759",
        "#00c7be",
        "#007aff",
        "#5856d6",
        "#af52de",
        "#ff2d55",
        "#8e8e93",
    ]);

    let statusTimeout: number | undefined;

    /**
     * Set the status message and clear it after 2 seconds.
     * If the status message is already set, it will be cleared and then set again.
     * @param {string} msg - The message to set.
     */
    function setStatus(msg: string): void {
        statusMessage.value = msg;

        if (statusTimeout) {
            window.clearTimeout(statusTimeout);
        }

        statusTimeout = window.setTimeout(() => {
            statusMessage.value = "";
        }, 2000);
    }

    /**
     * Updates the pixels array with the new pixel data.
     * @param {string[]} newPixel - The new pixel data to update the array with.
     */
    function handlePixelUpdate(newPixel: string[]): void {
        pixels.value = newPixel;
    }

    /**
     * Updates the selected color.
     * @param {string} newColor - The new color to select.
     */
    function setSelectedColor(newColor: string): void {
        selectedColor.value = newColor;
    }

    /**
     * Resets the pixel array to its initial state, filling it with the empty color.
     */
    function clearAll(): void {
        pixels.value = Array(gridSize * gridSize).fill(emptyColor);
    }

    /**
     * Fills the entire pixel array with the currently selected color.
     */
    function fillAll(): void {
        pixels.value = Array(gridSize * gridSize).fill(selectedColor.value);
    }

    /**
     * Exports the current pixel design as a JSON object.
     * The JSON object will contain the gridSize and the pixels array.
     */
    function exportJSON(): void {
        const payload: PixelDesign = {
            gridSize: gridSize,
            pixels: pixels.value,
        };

        // Format the JSON object with indentation
        const text = JSON.stringify(payload, null, 2);

        navigator.clipboard
            .writeText(text)
            .then(() => {
                setStatus("JSON copied to clipboard");
            })
            .catch(() => {
                setStatus("Failed to copy JSON to clipboard");
            });
    }

    function importJSON(jsonText: string): void {
        try {
            const parsed = JSON.parse(jsonText) as PixelDesign;

            // Check if the JSON format is valid
            if (!parsed.pixels || !Array.isArray(parsed.pixels)) {
                setStatus("Invalid JSON format");
                return;
            }

            const expectedLen = gridSize * gridSize;

            // Check if the grid size is correct
            if (parsed.pixels.length !== expectedLen) {
                setStatus("Invalid JSON format, wrong grid size");
                return;
            }

            pixels.value = parsed.pixels;
            setStatus("JSON imported successfully");
        } catch (error) {
            setStatus("Import failed, invalid JSON format");
        }
    }


    /**
     * Saves the current design to the server.
     * If the request fails, it will show an error message.
     * If the server design does not match the current grid size, it will show an error message.
     * @returns A Promise that resolves when the design is loaded successfully.
     * @throws {Error} If the request fails.
     */
    async function saveToServer(): Promise<void> {
        try {
            try {
                const design: PixelDesign = {
                    gridSize: gridSize,
                    pixels: pixels.value,
                    updatedAt: new Date().toISOString(),
                };

                if (!design.gridSize || !Array.isArray(design.pixels)) {
                    throw new Error("Invalid design");
                }

                await saveDesign(design);
            } catch (e) {
                const message = e instanceof Error ? e.message : "Save failed";
                setStatus(message);
            }

            setStatus("Saved to server");
        } catch (e) {
            const message = e instanceof Error ? e.message : "Save failed";
            setStatus(message);
        }
    }
    
    /**
     * Loads the current design from the server.
     * If the request fails, it will show an error message.
     * If the server design does not match the current grid size, it will show an error message.
     * @returns A Promise that resolves when the design is loaded successfully.
     * @throws {Error} If the request fails.
     */
    async function loadFromServer(): Promise<void> {
        try {
            const data = await fetchDesign();

            const expectedLen = gridSize * gridSize;
            if (data.pixels && data.pixels.length === expectedLen) {
                pixels.value = data.pixels;
                setStatus("Loaded from server");
            } else {
                setStatus("Server design did not match grid size");
            }
        } catch (e) {
                setStatus("Server not available (using local)");
        }
    }

    // Load the design from the server
    onMounted(function () {
        loadFromServer();
    });
</script>

<style>
:root {
  --border: #2a2a2a;
  --panel: #111;
  --text: #f2f2f2;
  --muted: #bcbcbc;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial,
    sans-serif;
  background: #0b0b0b;
  color: var(--text);
  display: flex;
  justify-content: center;
  padding: 24px;
}

.app {
  width: 980px;
  max-width: 100%;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 16px;
}

.card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 16px;
}

.muted {
  color: var(--muted);
  font-size: 13px;
}

.gridWrap {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.toolbar {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

@media (max-width: 900px) {
  .app {
    grid-template-columns: 1fr;
  }
}
</style>