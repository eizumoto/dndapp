import { ActiveCharacter, Character } from "./character";
import { MapObject } from "./map";
import { SpawnedMonster, Monster } from "./monster";

export interface Stats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface GameState {
  map: {
    width: number;
    height: number;
    objects: MapObject[];
    currentId: number;
  };
  monsters: {
    available: Monster[];
    spawned: SpawnedMonster[];
    currentId: number;

  };
  characters: {
    active: ActiveCharacter[];
    inactive: Character[]
    currentId: number;
  }
}