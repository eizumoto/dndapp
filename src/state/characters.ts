import { charConfig } from "../config/config"
import { Character, CharacterInput } from "../types/character"

const characters: CharacterInput[] = charConfig.characters || [];

let currentCharId = 10;
function getNextCharId(): number {
    if (currentCharId > 99) {
        throw new Error("Character ID limit reached (10–99). No more characters can be assigned.");
    }
    return currentCharId++;
}

export type CharacterRecord = Record<number, Character>;

export function loadCharacters(inputs: CharacterInput[]): CharacterRecord {
    const record: CharacterRecord = {};
    inputs.forEach((char) => {
        const id = getNextCharId();
        record[id] = { ...char, id };
     });
    return record;
}




export let activeCharacters: CharacterRecord = {};
export let inactiveCharacters: CharacterRecord = {};

function initializeCharacters(inactiveJson: CharacterInput[]) {
    inactiveCharacters = loadCharacters(inactiveJson);
}

export function spawnCharacter(id: number): Character {
  const char = inactiveCharacters[id];

  if (!char) {
    throw new Error(`Character with id ${id} not found in inactiveCharacters.`);
  }

  // Move character to activeCharacters
  activeCharacters[id] = char;
  delete inactiveCharacters[id];

  return char;
}

export function unspawnCharacter(id: number): Character {
  const char = activeCharacters[id];

  if (!char) {
    throw new Error(`Character with id ${id} not found in activeCharacters.`);
  }

  // Move character back to inactiveCharacters
  inactiveCharacters[id] = char;
  delete activeCharacters[id];

  return char;
}

initializeCharacters(characters);