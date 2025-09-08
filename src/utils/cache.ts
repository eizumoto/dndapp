import { LRUCache } from "lru-cache";

const cacheSize = process.env.CACHE_SIZE || "5";

export const charCache = new LRUCache({ 
    max: parseInt(cacheSize),
    ttl: 1000 * 60 * 5


});