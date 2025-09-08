import { mapConfig } from "../config/config";
import { MapObject } from "../types/map";

export let mapHeight = mapConfig.height;
export let mapWidth = mapConfig.width;

export const mapObjects: MapObject[] = [];

export let mapGrid = JSON.parse(JSON.stringify(mapConfig.grid));

let currentMapObjectId = 1;

for (let y = 0; y < mapGrid.length; y++) {
  for (let x = 0; x < mapGrid[y].length; x++) {
    const cellValue = mapGrid[y][x];
    if (cellValue !== 0) {
      const obj: MapObject = {
        entity_id: currentMapObjectId,
        type_id: cellValue,
        x,
        y
      };

      mapObjects.push(obj);
      currentMapObjectId++;
    }
  }
}

export function getMapCounter(): number{
    return currentMapObjectId;
}

export function getObjectType(mapObject: MapObject): string {
    const { type_id } = mapObject;
    switch(type_id){
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
            if (type_id >= 10 && type_id <= 99) {
                return "character"
            }
            if (type_id>= 100 && type_id <= 999){
                return "monster"
            }
        throw new Error(`type_id value ${type_id} out of bounds`);
    }
}

export function addMapObject(type_id: number, x: number, y: number): MapObject {
  // Validate coordinates
  if (x < 0 || y < 0 || x >= mapWidth || y >= mapHeight) {
    throw new Error(`Invalid coordinates (${x},${y})`);
  }

  const newObject: MapObject = {
    entity_id: currentMapObjectId++,
    type_id,
    x,
    y,
  };

  // Update mapObjects dictionary
  mapObjects.push(newObject);

  // Update mapGrid
  mapGrid[y][x] = type_id;

  return newObject;
}

export function mapLocationOccupied(x: number, y: number): boolean{
    const occupied = Object.values(mapObjects).some((obj) => obj.x === x && obj.y === y);
    if (occupied) {
        return true
    }
    return false
}

export function findMapObjectByEntityId(entityId: number): MapObject | undefined{
    const mapObject = mapObjects.find((c) => c.entity_id === entityId)

    return mapObject
}

export function removeMapObjectByEntityId(entityId: number): void{
    const mapObjectIndex = mapObjects.findIndex((c) => c.entity_id === entityId)
    if (mapObjectIndex !== -1) {
        mapObjects.splice(mapObjectIndex, 1);
    }

}

export function checkObjectType(typeId: number): string{
    if (typeId >= 100) {
        // is a monster
        return "monster";
    }  
        // is a character
    if (typeId >= 10) {
        // is a monster
        return "character";
    }
        // is a map object
    return "mapitem"
}

export function loadMapState(state: {
  width: number;
  height: number;
  objects: MapObject[];
  currentId: number;
}) {
    mapWidth = state.width;
    mapHeight = state.height;
    mapObjects.length = 0;
    mapObjects.push(...state.objects);
    currentMapObjectId = state.currentId;
}