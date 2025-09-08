import express, { Request, Response } from "express";
import diceRouter from "./routes/diceRoutes";
import mapRouter from "./routes/mapRoutes";
import monstRouter from "./routes/monsterRoutes";
import charRouter from "./routes/charRoutes";
import generalRouter from "./routes/generalRoutes";

export const app = express();
app.use(express.json());

app.use((req, _, next) => {
  console.log(`[${new Date().toISOString()}] Request Type: ${req.method} URL: ${req.url}`);
  next();
});



app.use("/api/dice", diceRouter);

app.use("/api/map", mapRouter);

app.use("/api/monster", monstRouter);

app.use("/api/character", charRouter);

app.use("/api/", generalRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("dnd app is up");
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
}