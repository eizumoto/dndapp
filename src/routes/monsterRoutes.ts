import { Router, Request, Response } from "express"
import { getNextMonsterId, availableMonsters, spawnedMonsters } from "../state/monsters"
import { SpawnedMonster } from "../types/monster";
import { mapObjects, addMapObject, mapHeight, mapWidth, mapLocationOccupied } from "../state/mapState";

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

  const monsterId = getNextMonsterId();
  const monster: SpawnedMonster = {
    ...template,
    stats: { ...template.stats },
    id: monsterId
  };

  // Add to spawned monsters
  spawnedMonsters.push(monster);

  // Update map grid
  addMapObject(monsterId, x, y);

  res.json({"monsterId": monsterId, "x": x, "y": y});
});


export default monstRouter;