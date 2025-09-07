import { CharacterInput } from "../types/character";
import { Monster } from "../types/monster";
import { Stats } from "../types/common"

export interface CharConfig {
  characters: CharacterInput[];
  monsters: Monster[];
}

function validateStats(stats: Stats, context: string): void {

    const statFields: (keyof Stats)[] = [
        "strength",
        "dexterity",
        "constitution",
        "intelligence",
        "wisdom",
        "charisma",
    ];

    statFields.forEach((field) => {
    const value = stats[field];
    if (typeof value !== "number" || value < 0 || value > 30) {
      throw new Error(`${context}.${field} is invalid: ${value}`);
    }
  });
}

function validateRequiredFields<T>(
  obj: any,
  requiredFields: (keyof T)[],
  context: string
): void {
  requiredFields.forEach((field) => {
    if (obj[field] === undefined || obj[field] === null) {
      throw new Error(`${context} is missing field: ${String(field)}`);
    }
  });
}

export function validateCharConfig(charConfig: CharConfig): void {

    // Character Checks
    if (!Array.isArray(charConfig.characters) || charConfig.characters.length < 1) {
        throw new Error("Config must include at least one character.");
    }
    charConfig.characters.forEach((char: CharacterInput, index: number) => {
    validateRequiredFields<CharacterInput>(
      char,
      ["name", "class", "race", "level", "xp", "stats", "health", "description"],
      `Character[${index}]`
    );

    validateStats(char.stats, `Character[${index}].stats`);
    });

    // Monster Checks
    if (!Array.isArray(charConfig.monsters) || charConfig.monsters.length < 1) {
        throw new Error("Config must include at least one monster.");
    }

  charConfig.monsters.forEach((monster: Monster, index: number) => {
    validateRequiredFields<Monster>(
      monster,
      ["kind", "stats", "health", "description"],
      `Monster[${index}]`
    );

    validateStats(monster.stats, `Monster[${index}].stats`);
    });
};