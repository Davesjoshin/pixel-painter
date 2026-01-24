import express, { Request, Response } from "express";
import cors from "cors";

type PixelDesign = {
    gridSize: number;
    pixels: string[];
    updatedAt: string;
};

const app = express();
const port = 3001;

app.use(cors());

app.use(express.json());

const DEFAULT_GRID_SIZE = 16;
const EMPTY_COLOR = "#000000";

// Initialize the design
let savedDesign: PixelDesign = {
    gridSize: DEFAULT_GRID_SIZE,
    pixels: new Array(DEFAULT_GRID_SIZE * DEFAULT_GRID_SIZE).fill(EMPTY_COLOR),
    updatedAt: new Date().toISOString(),
};

// Health check
app.get("/api/health", function (req: Request, res: Response) {
    res.json({ ok: true });
});

// Get the design
app.get("/api/design", function (req: Request, res: Response) {
    res.json(savedDesign);
});

// Update the design
app.post("/api/design", function (req: Request, res: Response) {
    const body = req.body as Partial<PixelDesign>;

    // Validate the payload
    if (typeof body.gridSize !== "number" || !Array.isArray(body.pixels)) {
        res.status(400).json({ error: "Invalid payload" });
        return;
    }

    const expectedLen = body.gridSize * body.gridSize;

    // Validate the pixel array
    if (body.pixels.length !== expectedLen) {
        res.status(400).json({
            error: `Pixels array must be ${expectedLen} items for gridSize ${body.gridSize}`,
        });
        return;
    }

    // Update the design
    savedDesign = {
        gridSize: body.gridSize,
        pixels: body.pixels,
        updatedAt: new Date().toISOString(),
    };

    // Send back the updated design
    res.json({ ok: true, savedDesign });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
