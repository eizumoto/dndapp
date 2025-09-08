import { spawn } from "child_process";
import { charConfig } from "../config/config"
import { Monster, SpawnedMonster } from "../types/monster";


let currentMonsterId = 100; // Start at 100

export function getNextMonsterId(): number {
  if (currentMonsterId > 999) {
    throw new Error("Monster ID limit reached (100–999). No more monsters can be assigned.");
  }
  return currentMonsterId++;
}

export const availableMonsters: Monster[] = charConfig.monsters.map((monster) => ({
    ...monster, type_id: getNextMonsterId()
}));

export const spawnedMonsters: SpawnedMonster[] = [];

export function destoryMonster(entityId: number): void{
    const monsterIndex = spawnedMonsters.findIndex(c => c.entity_id === entityId);
    if (monsterIndex !== -1) {
        spawnedMonsters.splice(monsterIndex, 1);
    }
    
}

export function getMonsterByTypeId(typeId: number): Monster | undefined {
    return spawnedMonsters.find(m => m.type_id === typeId);
}

export function getMonsterCounter(): number{
    return currentMonsterId;
}

export function loadMonsterState(state: {
    available: Monster[];
    spawned: SpawnedMonster[];
    currentId: number;
}) {
    currentMonsterId = state.currentId;
    availableMonsters.length = 0;
    availableMonsters.push(...state.available);
    spawnedMonsters.length = 0;
    spawnedMonsters.push(...state.spawned);
}