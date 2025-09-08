import { Router, Request, Response} from "express";

const diceRouter = Router()


function rollDice(sides: number, count: number, modifier: number = 0): number {
    let total = 0;
    for (let i = 0; i < count; i++) {
        total += Math.floor(Math.random() * sides) + 1;
    }
    return total + modifier;
};

interface DiceRequest {
    sides: number;
    count: number;
    modifier: number;
}

diceRouter.post("/", (req: Request, res: Response) => {
    const { sides, count, modifier } = req.body as DiceRequest;

    // error checking

    if (typeof sides !== "number" || sides < 1 ) {
        return res.status(400).json({error: "Invalid input. 'sides' must be a positive number"});
    }
    if (typeof count !== "number" || count < 1 ) {
        return res.status(400).json({error: "Invalid input. 'count' must be a positive number"});
    }
    if (modifier !== undefined && typeof modifier !== "number") {
        return res.status(400).json({error: "modifier must be a number if provided"})
    }

    const result = rollDice(sides, count, modifier ?? 0);
    
    return res.json({
        result,
        sides,
        count
    });
});

export default diceRouter;