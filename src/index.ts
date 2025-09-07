import express, { Request, Response } from "express";
import diceRouter from "./routes/diceRoutes"
import mapRouter from "./routes/mapRoutes"
import monstRouter from "./routes/monsterRoutes";
import charRouter from "./routes/charRoutes"

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use((req, _, next) => {
  console.log(`[${new Date().toISOString()}] Request Type: ${req.method} URL: ${req.url}`);
  next();
});

app.use("/api/dice", diceRouter);

app.use("/api/map", mapRouter);

app.use("/api/monster", monstRouter);

app.use("/api/character", charRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World part 3");
});



app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});