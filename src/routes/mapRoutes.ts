import { Router, Request, Response } from "express"
import { mapObjects, mapWidth, mapHeight } from "../state/mapState";


const mapRouter = Router();

// print out map with typeIds

mapRouter.get("/", (_, res: Response) => {
  // Initialize empty grid
  const grid = Array.from({ length: mapHeight }, () =>
    Array(mapWidth).fill(0)
  );

  // Fill grid from mapObjects
  for (const obj of Object.values(mapObjects)) {
    grid[obj.y][obj.x] = obj.type_id;
  }

  res.json(grid);
});

// print out map with entityIds

mapRouter.get("/entity", (_, res: Response) => {
  // Initialize empty grid
  const grid = Array.from({ length: mapHeight }, () =>
    Array(mapWidth).fill(0)
  );

  // Fill grid from mapObjects
  for (const obj of Object.values(mapObjects)) {
    grid[obj.y][obj.x] = obj.entity_id;
  }

  res.json(grid);
});

// print out list of entities on map

mapRouter.get("/occupied", (_, res: Response) => {
    res.json(mapObjects)
});

export default mapRouter;