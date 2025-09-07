import { Router, Request, Response } from "express"
import { activeCharacters, inactiveCharacters, spawnCharacter } from "../state/characters"
import { mapObjects, addMapObject, mapHeight, mapWidth, mapLocationOccupied } from "../state/mapState";

const charRouter = Router();

charRouter.get("/active", (_, res: Response) => {
    const charactersArray = Object.values(activeCharacters);
    res.json(charactersArray);
});

charRouter.get("/available", (_, res: Response) => {
    const charactersArray = Object.values(inactiveCharacters);
    res.json(charactersArray);
});

charRouter.get("/:entityId", (_, res: Response) => {
    res.json({"dummy":"response"})
});

charRouter.put("/", (req: Request, res: Response) => {
    res.json({"dummy":"response"})
});

charRouter.post("/", (req: Request, res: Response) => {
    const { characterIndex, x, y } = req.body;
    if (
        typeof characterIndex !== "number" ||
        typeof x !== "number" ||
        typeof y !== "number"
    ) {
        return res.status(400).json({ error: "characterIndex, x, and y must be numbers" });
    }

    // Check if the location is already occupied
    if (mapLocationOccupied(x, y)) {
        return res.status(400).json({ error: "Location is already occupied" });
    }

    try {
        // Spawn the character (moves from inactive to active)
        const character = spawnCharacter(characterIndex);

        // Add to mapObjects
        addMapObject(character.id, x, y); // type = 10-99 for characters

        return res.json({
        characterId: character.id,
        x,
        y,
        });
    } catch (err: any) {
        return res.status(400).json({ error: err.message });
    }
});

export default charRouter;
