import { Stats } from "./common"

export interface CharacterInput {
  name: string;
  class: string;
  race: string;
  level: number;
  xp: number;
  stats: Stats;
  health: number;
  description: string;
}

export interface Character extends CharacterInput {
    id: number;
}