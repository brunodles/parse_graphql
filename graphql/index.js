const express = require('express');
const graphqlHTTP = require('express-graphql');
const fetch = require('node-fetch');
const graphql= require('graphql');
const GraphQLSchema = graphql.GraphQLSchema;
const GraphQLObjectType = graphql.GraphQLObjectType;
const GraphQLString = graphql.GraphQLString;
const GraphQLInt = graphql.GraphQLInt;
const GraphQLBoolean = graphql.GraphQLBoolean;
const GraphQLList = graphql.GraphQLList;

var app = express();

const GameType = new GraphQLObjectType({
  name: 'Game',
  fields: {
    id: {
      type: GraphQLString,
      resolve(root, args) { return root.objectId }
    },
    name: {type: GraphQLString},
    type: {type: GraphQLString},
    year: {type: GraphQLInt},
    players: {type: GraphQLInt},
    online: {type: GraphQLBoolean}
  }
});
const IdType = new GraphQLObjectType({
  name: "Id",
  description: "This will return the object id",
  fields: {
    id: {
      type: GraphQLString,
      resolve(root, args) { return root.objectId }
    }
  }
})
const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    games: {
      type: new GraphQLList(GameType),
      resolve(root, args) {
        var url = process.env.API_URL+"/games/";
        console.log(url);
        return fetch(url,
          {"headers": {
            "X-Parse-Application-Id":process.env.APP_ID,
            "X-Parse-REST-API-Key": process.env.MASTER_KEY
          }})
          .then(res => res.json())
          .then(j => j.results)
      }
    },
    game: {
      type: GameType,
      args: {
        id: {type:GraphQLString}
      },
      resolve(root, args) {
        var url = process.env.API_URL+"/games/"+args.id;
        console.log(url);
        return fetch(url, {
            "headers": {
              "X-Parse-Application-Id":process.env.APP_ID,
              "X-Parse-REST-API-Key": process.env.MASTER_KEY
            }
          })
          .then(res => res.json())
      }
    }
  }
});
const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createGame: {
      type: IdType,
      description: "Create a game",
      args: {
        name: {type: GraphQLString},
        type: {type: GraphQLString},
        year: {type: GraphQLInt},
        players: {type: GraphQLInt},
        online: {type: GraphQLBoolean}
      },
      resolve(root, args) {
        console.log(args);
        var url = process.env.API_URL+"/games/"
        console.log(url);
        return fetch(url, {
            method: 'POST',
            headers: {
              "X-Parse-Application-Id":process.env.APP_ID,
              "X-Parse-REST-API-Key": process.env.MASTER_KEY,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(args),
          })
          .then(res => res.json())
      }
    },
    deleteGame: {
      type: GameType,
      description: "Delete the game",
      args: {
        id: {type:GraphQLString}
      },
      resolve(root, args) {
        var url = process.env.API_URL+"/games/"+args.id;
        console.log(url);
        return fetch(url, {
            "method": "DELETE",
            "headers": {
              "X-Parse-Application-Id":process.env.APP_ID,
              "X-Parse-REST-API-Key": process.env.MASTER_KEY
            }
          })
          .then(res => res.json())
      }
    }
  }
})
const Schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType
})

app.use('/graphql', graphqlHTTP({
  schema: Schema,
  graphiql: true
}));

app.listen(process.env.PORT, function() {
    console.log('GraphQl running on port ' + process.env.PORT + '.');
});
