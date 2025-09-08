import { charConfig } from "../config/config"
import { Character, CharacterInput, ActiveCharacter } from "../types/character"
import { addMapObject } from "./mapState";
import { MapObject } from "../types/map";

const characters: CharacterInput[] = charConfig.characters || [];

export let currentCharId = 10;
function getNextCharId(): number {
    if (currentCharId > 99) {
        throw new Error("Character ID limit reached (10–99). No more characters can be assigned.");
    }
    return currentCharId++;
}

export function loadCharacters(inputs: CharacterInput[]): Character[] {
    const record: Character[] = []
    inputs.forEach((char) => {
        const id = getNextCharId();
        record.push({...char, type_id: id });
     });
    return record;
}




export let activeCharacters: ActiveCharacter[] = [];
export let inactiveCharacters: Character[] = [];

function initializeCharacters(inactiveJson: CharacterInput[]) {
    inactiveCharacters = loadCharacters(inactiveJson);
}

export function spawnCharacter(typeId: number, x: number, y: number): ActiveCharacter {
    const index = inactiveCharacters.findIndex((c) => c.type_id === typeId);
    if (index === -1) {
        throw new Error(`Character with type_id ${typeId} not found in inactiveCharacters.`);
    }
    const char = inactiveCharacters[index];

    if (!char) {
        throw new Error(`Character with id ${typeId} not found in inactiveCharacters.`);
    }
    const newCharMapInfo: MapObject = addMapObject(typeId, x, y);
    // Move character to activeCharacters
    const newChar: ActiveCharacter = {
        entity_id: newCharMapInfo.entity_id,
        ...char
    };
    activeCharacters.push(newChar);
    inactiveCharacters.splice(index, 1);

    return newChar;
}

export function unspawnCharacter(entityId: number): Character {
    const index = activeCharacters.findIndex((c) => c.entity_id === entityId);
    if (index === -1) {
        throw new Error(`Character with entity_id ${entityId} not found in activeCharacters.`);
    }

    const char = activeCharacters[index];
    const {entity_id, ...charWithoutEntity }: ActiveCharacter & {entity_id: number} = char;

    // Move character back to inactiveCharacters
    activeCharacters.splice(index, 1);
    inactiveCharacters.push(charWithoutEntity);

    return char;
}

export function getCharacterCounter(): number{
    return currentCharId;
}

export function loadCharacterState(state: {
    active: ActiveCharacter[];
    inactive: Character[]
    currentId: number;
}) {
    currentCharId = state.currentId;
    activeCharacters.length = 0;
    activeCharacters.push(...state.active);
    inactiveCharacters.length = 0;
    inactiveCharacters.push(...state.inactive);
}

initializeCharacters(characters);