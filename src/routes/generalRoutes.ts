import { Router, Request, Response } from "express";
import fs from "fs";
import path from "path";
import { unspawnCharacter, activeCharacters, inactiveCharacters, getCharacterCounter, loadCharacterState } from "../state/characters";
import { destoryMonster, spawnedMonsters, availableMonsters, getMonsterCounter, loadMonsterState } from "../state/monsters";
import { mapObjects, mapWidth, mapHeight, mapLocationOccupied, 
    findMapObjectByEntityId, removeMapObjectByEntityId,
    checkObjectType, getMapCounter, loadMapState } from "../state/mapState";

const generalRouter = Router();


generalRouter.delete("/entity", (req: Request, res: Response) => {
  const { entityId } = req.body;

  if (typeof entityId !== "number") {
    return res.status(400).json({ error: "Invalid or missing entityId" });
  }

  const mapObjIndex = mapObjects.findIndex(c => c.entity_id === entityId);

  const mapObjectToDelete = mapObjects[mapObjIndex];
  if (mapObjIndex === -1) {
    return res.status(404).json({ error: "Entity not found in mapObjects" });
  }

  if (mapObjectToDelete.type_id in [0,1,2]) {
    return res.status(400).json({ error: "Cannot delete static map object" });
  }

  mapObjects.splice(mapObjIndex,1);
  const objectType = checkObjectType(mapObjectToDelete.type_id);

  switch(objectType) {
    case "monster":
        destoryMonster(mapObjectToDelete.entity_id);
        return res.json({message: "Monster deleted", entityId: mapObjectToDelete.entity_id, x: mapObjectToDelete.x, y: mapObjectToDelete.y});
    case "character":
        unspawnCharacter(mapObjectToDelete.entity_id);
        return res.json({message: "Character deleted", entityId: mapObjectToDelete.entity_id, x: mapObjectToDelete.x, y: mapObjectToDelete.y});
    case "mapitem":
        return res.json({message: "Object deleted", entityId: mapObjectToDelete.entity_id, x: mapObjectToDelete.x, y: mapObjectToDelete.y});
    }
  return res.status(404).json({ error: "Entity not found" });
});

interface MoveRequest {
  entityId: number;
  entityType: "character" | "monster";
  newX: number;
  newY: number;
}


generalRouter.put("/move", (req: Request, res: Response) => {
    const { entityId, entityType, newX, newY } = req.body as MoveRequest;
    if (
        typeof entityId !== "number" ||
        (entityType !== "character" && entityType !== "monster") ||
        typeof newX !== "number" ||
        typeof newY !== "number"
    ) {
        return res.status(400).json({ error: "Invalid request payload" });
    }

    if (newX < 0 || newX >= mapWidth || newY < 0 || newY >= mapHeight) {
        return res.status(400).json({ error: "Coordinates out of bounds" });
    }

    if(mapLocationOccupied(newX, newY)){
        return res.status(400).json({ error: "Location already occupied" });
    }

    const entityObject = findMapObjectByEntityId(entityId)
    if (!entityObject) {
        return res.status(404).json({ error: "Entity not found in map to move"});
    };

    entityObject.x = newX;
    entityObject.y = newY;

    res.json({
    message: "Entity moved successfully",
    entityId,
    entityType,
    newX,
    newY
  });

});

interface ReplaceRequest {
  attackerId: number;
  targetId: number;
}

generalRouter.put("/replace", (req: Request, res: Response) => {
    const { attackerId, targetId } = req.body as ReplaceRequest;

    if (typeof attackerId !== "number" || typeof targetId !== "number") {
        return res.status(400).json({ error: "Invalid request payload" });
    }

    const attackerObj = findMapObjectByEntityId(attackerId);
    const targetObj = findMapObjectByEntityId(targetId);

    if (!attackerObj || !targetObj) {
        return res.status(404).json({ error: "Attacker or target not found on the map" });
    }

    const dx = Math.abs(attackerObj.x - targetObj.x);
    const dy = Math.abs(attackerObj.y - targetObj.y);

    if (!((dx === 1 && dy === 0) || (dx === 0 && dy === 1))) {
        return res.status(400).json({ error: "Attacker and target are not adjacent" });
    }

    attackerObj.x = targetObj.x;
    attackerObj.y = targetObj.y;

    removeMapObjectByEntityId(targetObj.entity_id);

    const targetObjectType = checkObjectType(targetObj.type_id);
    switch(targetObjectType){
        case "monster":
            destoryMonster(targetObj.entity_id);
            break;
        case "character":
            unspawnCharacter(targetObj.entity_id);
            break;
    }

    return res.json({
        message: "Replace successful",
        attackerId,
        targetId,
        newPosition: { x: attackerObj.x, y: attackerObj.y }
  });
});

generalRouter.post("/save", (req: Request, res: Response) => {
    try {
        let { filename } = req.body;

        if (!filename) {
            filename = "savegame";
        }

        if (!/^[a-zA-Z0-9]+$/.test(filename)) {
            return res.status(400).json({ error: "Filename must be alphanumeric only." });
        }

        const state = {
            map: {
                width: mapWidth,
                height: mapHeight,
                objects: mapObjects,
                currentId: getMapCounter()
            },
            monsters: {
                available: availableMonsters,
                spawned: spawnedMonsters,
                currentId: getMonsterCounter()
            },
            characters: {
                active: activeCharacters,
                inactive: inactiveCharacters,
                currentId: getCharacterCounter()
            },
        };

        const savePath = path.resolve(`./data/${filename}.json`);
        fs.writeFileSync(savePath, JSON.stringify(state, null, 2), "utf-8");

        res.json({ message: "Game state saved successfully", path: savePath });

    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }

});

generalRouter.post("/load", (req: Request, res: Response) => {
    try {
        let { filename } = req.body;

        if (!filename) {
            return res.status(400).json({ error: "Filename is required." });
        }

        // Only allow alphanumeric
        if (!/^[a-zA-Z0-9]+$/.test(filename)) {
            return res.status(400).json({ error: "Filename must be alphanumeric only." });
        }

        const savePath = path.resolve(`./data/${filename}.json`);
        if (!fs.existsSync(savePath)) {
            return res.status(404).json({ error: "Save file not found." });
        }
        const raw = fs.readFileSync(savePath, "utf-8");
        const state = JSON.parse(raw);

        // Restore map

        loadMapState(state.map);
        
        // Restore 
        availableMonsters.length = 0;
        availableMonsters.push(...state.monsters.available);

        spawnedMonsters.length = 0;
        spawnedMonsters.push(...state.monsters.spawned);

        activeCharacters.length = 0;
        activeCharacters.push(...state.characters.active);

        inactiveCharacters.length = 0;
        inactiveCharacters.push(...state.characters.inactive);

        res.json({ message: "Game state loaded successfully", file: `${filename}.json` });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});
export default generalRouter;