import fs from "fs";
import path from "path";
import { MapConfig, validateMapConfig } from "../utils/mapValidation";
import { CharConfig, validateCharConfig } from "../utils/charValidation";

// Load map config path from environment variable
function loadJsonConfig<T>(configPath: string): T {
    if (configPath.length == 0 ) {
        throw new Error(`Config was not provided in env vars`);
    }
    if (!configPath) {
        throw new Error(`Missing config located at ${configPath}`);
    }
    const rawMap = fs.readFileSync(path.resolve(configPath), "utf-8");
    try {
        return JSON.parse(rawMap) as T;
    } catch (err) {
        throw new Error(`Invalid JSON in config file at ${configPath}: ${(err as Error).message}`);
    }
}

const mapConfigPath = process.env.MAP_CONFIG || "";
const charConfigPath = process.env.CHAR_CONFIG || "";

// Read and parse JSON file
export const mapConfig = loadJsonConfig<MapConfig>(mapConfigPath);

// Validate immediately after loading
validateMapConfig(mapConfig);
console.log("Map config loaded and validated");

export const charConfig = loadJsonConfig<CharConfig>(process.env.CHAR_CONFIG || "");
validateCharConfig(charConfig);
console.log("Char config loaded and validated");