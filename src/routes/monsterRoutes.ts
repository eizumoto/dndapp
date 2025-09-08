import { Router, Request, Response } from "express"
import { getNextMonsterId, availableMonsters, spawnedMonsters } from "../state/monsters"
import { SpawnedMonster } from "../types/monster";
import { addMapObject, mapHeight, mapWidth, mapLocationOccupied } from "../state/mapState";
import { MapObject } from "../types/map";

const monstRouter = Router();

monstRouter.get("/", (_, res: Response) => {
    res.json(spawnedMonsters);
});

monstRouter.post("/", (req: Request, res: Response) => {
const { x, y } = req.body;

  // Validate coordinates
  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    x < 0 ||
    y < 0 ||
    x >= mapWidth ||
    y >= mapHeight
  ) {
    return res.status(400).json({ error: "Invalid coordinates" });
  }

  if (mapLocationOccupied(x, y)) {
    return res.status(400).json({ error: "Location is already occupied" });
  }
 
  // Pick a random monster
  const template = availableMonsters[Math.floor(Math.random() * availableMonsters.length)];
  if (!template) return res.status(404).json({ error: "No monsters available" });

  const monsterId = template.type_id;
  const mapObject = addMapObject(monsterId, x, y);
  const monster: SpawnedMonster = {
    ...template,
    stats: { ...template.stats },
    entity_id: mapObject.entity_id
  };

  // Add to spawned monsters
  spawnedMonsters.push(monster);
  

  res.json({"monsterId": mapObject.entity_id, "x": x, "y": y});
});


export default monstRouter;