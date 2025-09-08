import { Stats } from "../types/common"

export interface Monster {
  kind: string;
  stats: Stats
  health: number;
  description: string;
  type_id: number
}

export interface SpawnedMonster extends Monster {
    entity_id: number;
}