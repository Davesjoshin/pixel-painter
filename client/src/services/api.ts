import type { PixelDesign } from "../types/pixel";

/**
 * Fetch the current design from the server.
 * @returns A Promise that resolves with the current PixelDesign.
 * @throws {Error} If the request fails.
 */
export async function fetchDesign(): Promise<PixelDesign> {
    const res = await fetch("/api/design");
 
    if (!res.ok) {
        throw new Error("Failed to fetch design");
    }
 
    return res.json();
}

/**
 * Save the given design to the server.
 * @param {PixelDesign} payload - The design to save.
 * @returns A Promise that resolves with an object containing a boolean "ok" property.
 * @throws {Error} If the request fails.
 */
export async function saveDesign(payload: PixelDesign): Promise<{ ok: boolean }> {
    const res = await fetch("/api/design", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
 
    if (!res.ok) {
        const err = await res.json().catch(function () {
            return { error: "Unknown error" };
        });

        throw new Error(err.error || "Failed to save design");
    }
 
    return res.json();
}