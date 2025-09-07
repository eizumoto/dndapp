import { mapConfig } from "../config/config";
import { MapObject } from "../types/map";

export const mapHeight = mapConfig.height;
export const mapWidth = mapConfig.width;

export const mapObjects: Record<number, MapObject> = {};

export let mapGrid = JSON.parse(JSON.stringify(mapConfig.grid));
let currentId = 1;

for (let y = 0; y < mapGrid.length; y++) {
  for (let x = 0; x < mapGrid[y].length; x++) {
    const cellValue = mapGrid[y][x];
    if (cellValue !== 0) {
      mapObjects[currentId] = {
        id: currentId,
        type: cellValue,
        x,
        y
      };
      currentId++;
    }
  }
}

export function getObjectType(mapObject: MapObject): string {
    const { type } = mapObject;
    switch(type){
        case 0:
            return "empty";
        case 1:
            return "water";
        case 2:
            return "hole";
        case 3:
            return "tree";
        case 4:
            return "rock";
        case 5:
            return "wall";
        default:
            if (type >= 10 && type <= 99) {
                return "character"
            }
            if (type>= 100 && type <= 999){
                return "monster"
            }
        throw new Error(`Type value ${type} out of bounds`);
    }
}

export function addMapObject(type: number, x: number, y: number): MapObject {
  // Validate coordinates
  if (x < 0 || y < 0 || x >= mapWidth || y >= mapHeight) {
    throw new Error(`Invalid coordinates (${x},${y})`);
  }

  const newObject: MapObject = {
    id: currentId++,
    type,
    x,
    y,
  };

  // Update mapObjects dictionary
  mapObjects[newObject.id] = newObject;

  // Update mapGrid
  mapGrid[y][x] = type;

  return newObject;
}

export function mapLocationOccupied(x: number, y: number): boolean{
    const occupied = Object.values(mapObjects).some((obj) => obj.x === x && obj.y === y);
    if (occupied) {
        return true
    }
    return false
}