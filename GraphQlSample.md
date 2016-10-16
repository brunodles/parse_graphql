Request the same api, with alias

# List Game names
```graphQL
{ games { name} }
```

# List Games, find two games by id
```graphQL
{ games { id name type players year } need: game (id:"vrAXf0tEun") { name } witcher: game (id:"GRFASuiM5u") { name } }
```

# Create a game and return it's id and name
```graphQL
mutation {
  createGame(name: "Infamous: Second Sons", type: "Adventure", year: 2012, players: 1, online: false) {
    id
    name
  }
}
```

# Delete a game
```graphQL
mutation {
  deleteGame(name: "Infamous: Second Sons", type: "Adventure", year: 2012, players: 1, online: false) {
    id
    name
  }
}
```

# Query and delete games
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
