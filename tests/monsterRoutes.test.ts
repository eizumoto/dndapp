import request from "supertest";

import path from "path";

process.env.MAP_CONFIG = path.resolve(__dirname, "../data/map_10.json");
process.env.CHAR_CONFIG = path.resolve(__dirname, "../data/characters.json");

import { app } from '../src/index';
import { mapObjects, mapWidth, mapHeight } from "../src/state/mapState";

// Helper to clear map state between tests
beforeEach(() => {
  // Reset mapObjects if needed
  for (const key in mapObjects) {
    delete mapObjects[key];
  }
});

describe("Monster API", () => {

  describe("GET /api/monster", () => {
    it("returns empty list when no monsters spawned", async () => {
      const res = await request(app).get("/api/monster");
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });
  });

  describe("POST /api/monster", () => {

    it("spawns a monster at a valid location", async () => {
      const res = await request(app)
        .post("/api/monster")
        .send({ x: 1, y: 1 });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("monsterId");
      expect(res.body.x).toBe(1);
      expect(res.body.y).toBe(1);

      // Ensure mapObjects updated
      const found = Object.values(mapObjects).find(obj => obj.x === 1 && obj.y === 1);
      expect(found).toBeDefined();
      expect(found!.type_id).toBe(res.body.monsterId);
    });

    it("returns 400 when location is occupied", async () => {
      // Spawn first monster
      await request(app).post("/api/monster").send({ x: 2, y: 2 });

      // Attempt to spawn at the same spot
      const res = await request(app)
        .post("/api/monster")
        .send({ x: 2, y: 2 });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("returns 400 when coordinates are out of bounds", async () => {
      const res = await request(app)
        .post("/api/monster")
        .send({ x: -1, y: mapHeight + 1 });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
    });

    it("GET /api/monster returns spawned monsters", async () => {
      // Spawn two monsters
      await request(app).post("/api/monster").send({ x: 0, y: 0 });
      await request(app).post("/api/monster").send({ x: 1, y: 0 });

      const res = await request(app).get("/api/monster");
      expect(res.status).toBe(200);
      console.log(res.body);
      expect(res.body.length).toBe(4);

      res.body.forEach((monster: any) => {
        expect(monster).toHaveProperty("entity_id");
        expect(monster).toHaveProperty("type_id");
      });
    });

  });

});