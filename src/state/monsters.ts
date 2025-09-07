import { charConfig } from "../config/config"
import { Monster, SpawnedMonster } from "../types/monster";

export const availableMonsters: Monster[] = charConfig.monsters || [];

export const spawnedMonsters: SpawnedMonster[] = [];

let currentMonsterId = 100; // Start at 100

export function getNextMonsterId(): number {
  if (currentMonsterId > 999) {
    throw new Error("Monster ID limit reached (100–999). No more monsters can be assigned.");
  }
  return currentMonsterId++;
}