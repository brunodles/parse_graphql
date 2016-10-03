var express = require('express');
var ParseServer = require('parse-server').ParseServer;

var app = express();

var api = new ParseServer({
  databaseURI: process.env.DATABASE_URI,
  appId: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY
});

app.use(process.env.PARSE_MOUNT, api);

app.get('/', function(req, res) {
  res.status(200).send('I dream of being a web site.');
});

app.listen(process.env.PORT, function() {
    console.log('parse-server-example running on port ' + process.env.PORT + '.');
});
