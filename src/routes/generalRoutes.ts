import { Router, Request, Response } from "express";
import { unspawnCharacter, activeCharacters } from "../state/characters";
import { destoryMonster, spawnedMonsters } from "../state/monsters";
import { mapObjects, mapWidth, mapHeight, mapLocationOccupied, 
    findMapObjectByEntityId, removeMapObjectByEntityId,
    checkObjectType } from "../state/mapState";

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




export default generalRouter;