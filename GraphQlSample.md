Request the same api, with alias

# Query
## List games name
```graphQL
{ games { name } }
```
## List all games
```graphQL
query listGames {
  list: games {
    id
    name
    type
    year
    players
    online
  }
}
```

## List Games and find two games by id
```graphQL
{ games { id name type players year } need: game (id:"vrAXf0tEun") { name } witcher: game (id:"GRFASuiM5u") { name } }
```

# Mutation
## Create a game and return it's id and name
```graphQL
mutation createOne {
  create: createGame(name: "New Super Mario Brothers", type: "Platformer", year: 2006, players: 1, online: false) {
    id
  }
}
```
## Create multiple games
```graphQL
mutation createSamples {
  c1: createGame(name: "Need For Speed", type: "race", year: 2015, players: 1, online: true) {
    id
  }
  c2: createGame(name: "Forza Horizon", type: "race", year: 2016, players: 1, online: true){
    id
  }
  c3: createGame(name: "The Witcher III" type: "RPG" year:2015 players:1 online: false){
    id
  }
  c4: createGame(name: "Mortal Kombat X" type: "Fighting" year: 2014 players:2 online:true){
    id
  }
  c5: createGame(name: "Infamous: Second Sons", type: "Adventure", year: 2012, players: 1, online: false) {
    id
  }
}
```

## Delete a game
```graphQL
mutation deleteOne {
  delete: deleteGame(id: "smu5R1KxrS") {
    id
  }
}
```

## Delete multiple games
```graphQL
mutation deleteMultiple {
  d1: deleteGame(id: "vrAXf0tEun"){
    id
  }
  d2: deleteGame(id: "GRFASuiM5u"){
    id
  }
  d3: deleteGame(id: "VtI1xu0KSX"){
    id
  }
  d4: deleteGame(id: "GFNpvmGC13"){
    id
  }
  d5: deleteGame(id: "9FBFM90uOw"){
    id
  }
}
```

# Complex
## Query and delete games
```graphQL
query games {
  games {
    id
    name
  }

}

mutation delete {
  d1: deleteGame(id: "u7XXeBfFCr") {
    name
    year
    online
  }
  d2:deleteGame(id: "5ymGu3cofY") {
    name
    year
    online
  }
  d3: deleteGame(id: "UjzDtqTlPj") {
    name
    year
    online
  }
}
```
