import { Router, Request, Response } from "express"
import { mapObjects, mapWidth, mapHeight } from "../state/mapState";


const mapRouter = Router();

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

export default mapRouter;