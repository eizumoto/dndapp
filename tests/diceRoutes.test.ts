import request from "supertest";
import path from "path"
process.env.MAP_CONFIG = path.resolve(__dirname, "../data/map_10.json");
process.env.CHAR_CONFIG = path.resolve(__dirname, "../data/characters.json");

import { app } from '../src/index';

describe("POST /api/dice", () => {

  it("rolls dice correctly without modifier", async () => {
    const res = await request(app)
      .post("/api/dice")
      .send({ sides: 6, count: 2 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("result");
    expect(res.body.sides).toBe(6);
    expect(res.body.count).toBe(2);

    // result should be between count and count*sides
    expect(res.body.result).toBeGreaterThanOrEqual(2);
    expect(res.body.result).toBeLessThanOrEqual(12);
  });

  it("applies modifier correctly", async () => {
    const res = await request(app)
      .post("/api/dice")
      .send({ sides: 6, count: 3, modifier: 2 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("result");
    expect(res.body.sides).toBe(6);
    expect(res.body.count).toBe(3);

    // result should be between count + modifier and count*sides + modifier
    expect(res.body.result).toBeGreaterThanOrEqual(3 + 2);
    expect(res.body.result).toBeLessThanOrEqual(18 + 2);
  });

  it("returns 400 for invalid input", async () => {
    const res = await request(app)
      .post("/api/dice")
      .send({ sides: -1, count: 0 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/dice")
      .send({ sides: 6 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

});