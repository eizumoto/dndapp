import { Stats } from "../types/common"

export interface Monster {
  kind: string;
  stats: Stats
  health: number;
  description: string;
}

export interface SpawnedMonster extends Monster {
    id: number;
}