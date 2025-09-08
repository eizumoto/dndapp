dnd app

Important env vars:
MAP_CONFIG : location of map config, I used ./data/map_10.json that I generated
CHAR_CONFIG : location of character config, I used ./data/characters.json that I generated
PORT : Default is set to 3000, if change is necessary you can do it with this
CACHE_SIZE : Default is 5

Build instructions

Dev mode: Will reload code when changes occur (Note, this will wipe out server state)
docker-compose up --build

run locally:

Build dist:
npm run build

Run dist:
npm run start

execute in docker container:
docker build -t dndapp

docker run -e MAP_CONFIG=./data/map_10.json -e CHAR_CONFIG=./data/characters.json dndapp

Note: I added 2 additional endpoints to help handle the way entityId had to be handled.

GET /api/map/entity

Will display the map but with entity ids instead of type ids. This is done because by the original specification, the DELETE endpoint takes in an entityId, however the way it is presented would mean only one value for 3, 4, and 5 would be allowed. Due to this 2 sets of ids were required to handle the unique id for each map item and the type that it could be.

GET /api/character/type/:typeId

This was done because only active map items would have an entityId with the way I set it up so this would allow retreval of other character sheets for characters that are not being used.
