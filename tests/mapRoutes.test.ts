import request from 'supertest';
import path from "path";

process.env.MAP_CONFIG = path.resolve(__dirname, "../data/map_10.json");
process.env.CHAR_CONFIG = path.resolve(__dirname, "../data/characters.json");

import { app } from '../src/index';
import { mapConfig } from '../src/config/config';
import { mapObjects, mapGrid, addMapObject } from "../src/state/mapState";
import { MapConfig} from '../src/utils/mapValidation';
import { CharConfig } from '../src/utils/charValidation';

import { CharacterInput } from "../src/types/character";

beforeEach(() => {
  // Reset mapGrid and mapObjects
  mapGrid.length = 0;
  mapObjects.length = 0;

  // Deep copy original mapConfig grid
  mapConfig.grid.forEach((row) => mapGrid.push([...row]));
});

describe("GET /api/map", () => {
  it("should return the map grid in its current state", async () => {
    const response = await request(app).get("/api/map");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(mapConfig.height);

    // Each row length matches width
    response.body.forEach((row: number[]) => {
      expect(row.length).toBe(mapConfig.width);
    });
  });
});

describe("Map GET after adding object", () => {
  it("should include newly added object in the grid", async () => {
    addMapObject(3, 1, 1); // type 3 = tree at (1,1)

    const response = await request(app).get("/api/map");

    expect(response.body[1][1]).toBe(3); // the grid should reflect new object
  });
});
