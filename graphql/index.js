const express = require('express');
const graphqlHTTP = require('express-graphql');
const fetch = require('node-fetch');
const graphql= require('graphql');
const GraphQLSchema = graphql.GraphQLSchema;
const GraphQLObjectType = graphql.GraphQLObjectType;
const GraphQLString = graphql.GraphQLString;
const GraphQLInt = graphql.GraphQLInt;
const GraphQLList = graphql.GraphQLList;

var app = express();

const GamesType = new GraphQLObjectType({
  name: 'Game',
  fields: {
    id: {
      type: GraphQLString,
      resolve(root, args) { return root.objectId }
    },
    name: {type: GraphQLString},
    type: {type: GraphQLString},
    year: {type: GraphQLInt},
    players: {type: GraphQLInt}
  }
});
const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    games: {
      type: new GraphQLList(GamesType),
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
      type: GamesType,
      args: {
        id: {type:GraphQLString}
      },
      resolve(root, args) {
        var url = process.env.API_URL+"/games/"+args.id;
        console.log(url);
        return fetch(url,
          {"headers": {
            "X-Parse-Application-Id":process.env.APP_ID,
            "X-Parse-REST-API-Key": process.env.MASTER_KEY
          }})
          .then(res => res.json())
      }
    }
  }
});
const GraphQLSchema = new GraphQLSchema({
  query: QueryType,
})

app.use('/graphql', graphqlHTTP({
  schema: GraphQLSchema,
  graphiql: true
}));

app.listen(process.env.PORT, function() {
    console.log('GraphQl running on port ' + process.env.PORT + '.');
});
