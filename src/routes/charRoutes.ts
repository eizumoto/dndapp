import { Router, Request, Response } from "express"
import { activeCharacters, inactiveCharacters, spawnCharacter } from "../state/characters"
import { mapObjects, addMapObject, mapHeight, mapWidth, mapLocationOccupied } from "../state/mapState";
import { availableMonsters, spawnedMonsters } from "../state/monsters";
import { Stats } from "../types/common";
import { charCache } from "../utils/cache";

const charRouter = Router();

// show active characters

charRouter.get("/active", (_, res: Response) => {
    const charactersArray = Object.values(activeCharacters);
    res.json(charactersArray);
});

// show inactive characters (avaialble)

charRouter.get("/available", (_, res: Response) => {
    const charactersArray = Object.values(inactiveCharacters);
    res.json(charactersArray);
});

// get character by entityId

charRouter.get("/:entityId", (req: Request, res: Response) => {
    const entityId = Number(req.params.entityId);

    const cached = charCache.get(entityId)
    if (cached) {
        console.log("read from cache");
        return res.json(cached);
    }
    const char = activeCharacters.find(c => c.entity_id === entityId);
    const monster = spawnedMonsters.find(c => c.entity_id === entityId);

    if (!char && !monster) return res.status(404).json({ error: "No Active entity found for entity id" });

    charCache.set(entityId, char || monster);

    res.json(char || monster);
});

// get character by typeId

charRouter.get("/type/:typeId", (req: Request, res: Response) => {
    const typeId = Number(req.params.typeId);
    const char = activeCharacters.find(c => c.type_id === typeId);
    const inChar =  inactiveCharacters.find(c => c.type_id === typeId);
    const monster = availableMonsters.find(c => c.type_id === typeId);

    if (!char && !inChar && !monster) return res.status(404).json({ error: "Character not found by type id" });

    res.json(char || inChar || monster);
});


interface UpdateRequest {
    entityId: number;
    updates: Record<string, any>;
}

charRouter.put("/", (req: Request, res: Response) => {
    const { entityId, updates } = req.body as UpdateRequest;

    if (typeof entityId !== "number" || typeof updates !== "object") {
        return res.status(400).json({ error: "Invalid request format" });
    }

    const charIndex = activeCharacters.findIndex(c => c.entity_id === entityId);
    const monsterIndex = spawnedMonsters.findIndex(m => m.entity_id === entityId);

    if (charIndex === -1 && monsterIndex === -1) {
        return res.status(404).json({ error: "Active unit not found" });
    }

    interface HasStats {
        stats: Stats;
        [key: string]: any; // allows other fields
}

    function safeUpdate<T extends HasStats>(original: T, updates: Partial<T>): T {
        const updated: T = { ...original };
        for (const key in updates) {
            if (key in original && key !== "entity_id" && key !== "type_id") {
                if (key === "stats" && typeof updates.stats === "object") {
                    updated.stats = { ...original.stats, ...updates.stats };
                } else {
                    (updated as any)[key] = (updates as any)[key];
                }
            }
        }
        return updated;
    }


    //const { entity_id, type_id, ...safeUpdates } = updates as any;

    if (charIndex !== -1) {
    activeCharacters[charIndex] = safeUpdate(activeCharacters[charIndex], updates);
    charCache.set(entityId, activeCharacters[charIndex]);
    return res.json(activeCharacters[charIndex]);
  }

  if (monsterIndex !== -1) {
    spawnedMonsters[monsterIndex] = safeUpdate(spawnedMonsters[monsterIndex], updates);
    charCache.set(entityId, spawnedMonsters[monsterIndex]);
    return res.json(spawnedMonsters[monsterIndex]);
  }
});

interface MoveRequest {
    characterIndex: number;
    x: number;
    y: number;
}

charRouter.post("/", (req: Request, res: Response) => {
    const { characterIndex, x, y } = req.body as MoveRequest;
    // Check types for request
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
        const character = spawnCharacter(characterIndex, x, y);

        return res.json({ characterId: character.entity_id, x, y });
    } catch (err: any) {
        return res.status(400).json({ error: err.message });
    }
});

export default charRouter;
