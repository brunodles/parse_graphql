# Batch Requesting

Nesse passo a passo vou mostrar como criar uma api com batch requesting.


## Parse
Para começar esse tutorial vamos precisar de uma api funcionando. Então vamos instalar o `parse` usando docker.

### Docker e Docker-compose
Primeiro, vamos criar nosso docker compose file.

```bash
touch docker-compose.yml
```

Esse arquivo vai ajudar a criar a nosso ambiente.
Também vai dizer como nossos containers vão se comunicar.

### NodeJs

Pra rodar o parse precisamos de NodeJs, então vamos criar um container com NodeJs.

```yml
parse:
  image: node:6.7.0
  command: npm start
  volumes:
    - ./parse:/usr/src/app
  working_dir: /usr/src/app/
  ports:
    - 3000:3000
```

* Usa a *imagem* `node` na versão `6.7.0`
* Roda o comando `npm start`
* Compartilha a pasta `parse` na pasta `usr/src/app`.  
* Expõe a porta `3000`.

Agora vamos precisar criar a pasta `parse`.

```bash
mkdir parse
```

### MongoDb

O parse usa o MongoDb, então vamos criar um container pra o mongo.

```yml
mongodb:
  image: mongo
  ports:
    - "27017:27017"
    - "28017:28017"
  command: mongod --rest
  volumes:
    - ./mongo/db:/data/db
```

* Usa a imagem `mongo`
* Expõe as portas, elas não precisam ser expostas, mas estou espondo para poder acessar o banco da minha maquina (host)
  * 27017 - porta padão
  * 28017 - porta para versão web
* Usa o comando `mongod --rest`, para permitir acessar os dados via web
* Compartilha a pasta `mongo/db` em `data/db`, essa pasta contém os dados do mongo db.

### Instalando o Parse

Agora precisamos instalar o parse. O container `parse` só está com o `NodeJs` instalado.
Nos poderiamos "entrar no conatiner" e rodar o comando, para "entrar" no conatiner.

```bash
docker-compose run parse bash
```

Dentro do container rodar o comando.

```bash
npm install -g parse-server
```

#### Usando NPM

Vamos usar o npm para instalar todas as dependências que precisamos.
Pra isso vamos criar um arquivo `package.json`.  
Nesse arquivo vamos definir o nome do nosso projeto, a versão e as dependências, usando o formato *json*.

```json
{
  "name": "my-parse",
  "version": "1.0.0",
  "dependencies": {
    "express": "~4.2.x",
    "kerberos": "~0.0.x",
    "parse": "~1.6.12",
    "parse-server": "~2.0"
  }
}
```

Basicamente, só estamos dizendo o nome do nosso projeto, a versão e o que ele precisa.

Com isso só será necessário rodar o comando abaixo para instalar todas as dependências.

```bash
npm install
```

Mas esse comando precisa ser rodado dentro do container, vamos ver isso depois.

#### Criando o app

O `parse` pode ser montado dentro do `Express` e é isso que vamos fazer aqui.

Crie um arquivo chamado `index.js` dentro da pasta `parse`

```bash
touch parse/index.js
```

Vamos precisar da lib `express` e `parse-server`, lembrando que elas já estão no nosso `package.json`.

```js
var express = require('express');
var ParseServer = require('parse-server').ParseServer;
```

Usando a variável `express` vamos criar o nosso `app` e usando o `ParseServer` vamos criar a `api`.

```js
var app = express();

var api = new ParseServer({
  databaseURI: process.env.DATABASE_URI,
  appId: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY
});
```

Vamos usar variáveis de ambiente para poder deixar a api configurada, logo vamos configurar a api.

Agora só precisamos colocar a `api` dentro do `app` para poder iniciar.

```js
app.use(process.env.PARSE_MOUNT, api);

app.listen(process.env.PORT, function() {
  console.log('parse-server-example running on port ' + process.env.PORT);
});
```

### Automatizando Script de instalação e execução

Agora vamos criar o script que irá instalar tudo o que precisamos. Vamos criar um *entrypoint*.

Crie um arquivo chamado `entrypoint.sh` dentro da pasta `parse` e dê permissão de execução.

```bash
touch parse/entrypoint.sh
chmod +x parse/entrypoint.sh
```

Agora só precisamos executar `npm install` antes de executar qualquer outro comando.

O arquivo ficará assim.

```bash
#!/bin/bash
npm install
$@
```

Agora só precisamos adicionar o `entrypoint` ao nosso container no `docker-compose.yml`

```yml
parse:
  image: node:6.7.0
  command: npm start
  entrypoint: ./entrypoint.sh
  volumes:
  ...
```

### Ligando o Mongo ao Parse

Nossa instancia do mongo roda em um container separado, agora nós precisamos fazer com que os dois containers se conversem. Para isso vamos atualizar o nosso `docker-compose` para addcionar a tag `links` ao `parse`.

```yml
parse:
  ...
  links:
  - mongodb
  ...
```

### Configurações do Parse

No `index.js` estamos usando várias variáveis de ambiente. Agora vamos configurar essas variáveis.

Dentro do arquivo `docker-compose.yml` vamos adicionar um novo parâmetro ao container `parse`.

```yml
parse:
  ...
  environment:
    - DATABASE_URI=mongodb://mongodb:27017/dev
    - APP_ID=AppId
    - MASTER_KEY=MasterKey
    - PARSE_MOUNT=/api
    - PORT=1337
```

### Rodando

Para rodar agora apenas um comando é necessário.

```bash
docker-compose up
```
Como já deixamos tudo configurado, esse comando vai baixar e instalar tudo que precisamos. Ao final irá iniciar os nossos containers.

## GraphQL-js
O GraphQl é uma nova forma de criar fazer pesquisas em apis. Uma das ideias é deixar que o cliente escolha quais dados ele deseja. Também permite fazer mais de uma requisição ao mesmo tempo, permitindo assim reduzir a quantidade de requisições feitas a api.

### Criando Middleware
O GraphQl poderia ser instalado dentro do mesmo app do do parse, mas aqui vamos instalar em um app separado de container separado. A ideia é mostrar que da pra usar o graphQl junto com uma Api Rest.

Então pra isso vamos criar uma nova pasta.

```bash
mkdir graphql
```

A estrutura desse app é igual com a que fizemos para o `parse`.  
Então vamos criar os arquivos `entrypoint.sh`, `index.js` e `package.json`

```bash
mkdir graphql
touch graphql/entrypoint.sh
touch graphql/index.js
touch graphql/package.json
chmod +x graphql/entrypoint.sh
```

O `entrypoint.sh` vai ser igual.
```bash
#!/bin/bash
npm install
$@
```

No `package.json`, vamos usar algumas libs diferentes.
```json
{
  "name": "graphql-server",
  "version": "1.0.0",
  "dependencies": {
    "express": "~4.2.x",
    "express-graphql": "^0.5.4",
    "graphql": "^0.7.1",
    "node-fetch": "^1.6.3"
  },
  "scripts": {
    "start": "node index.js"
  }
}
```

#### Construindo a GraphQL Query

Aqui também iremos usar o `express`.  
Então nosso `index.js` inicial será assim.

```js
const express = require('express');

var app = express();

app.listen(process.env.PORT, function() {
    console.log('GraphQl running on port ' + process.env.PORT + '.');
});
```
*Sim, também vamos usar variáveis de ambiente aqui.*


## Sources
* Parse - https://parseplatform.github.io
* Parse Server - https://github.com/ParsePlatform/parse-server
* Parse Server Example - https://github.com/ParsePlatform/parse-server-example
* MongoDb https://docs.mongodb.com/manual/reference/default-mongodb-port/
* Docker Compose - https://docs.docker.com/compose/gettingstarted/
* DockerHub - NodeJs - https://hub.docker.com/_/node/
* DockerHub - MongoDb - https://hub.docker.com/_/mongo/
* Padawan Docker - Parse - https://github.com/Padawan-org/Padawan-Docker/tree/parse
* Parse Server - Rest Api - http://parseplatform.github.io/docs/rest/guide/
* GraphQL - http://graphql.org/
* GraphQL-js - https://github.com/graphql/graphql-js
* Parse-GraphQl-Server - https://github.com/bakery/parse-graphql-server
* Express GraphQl - https://github.com/graphql/express-graphql
* GraphQl and Parse -  http://blog.thebakery.io/getting-graphql-to-play-nicely-with-parse-server-and-react-native/
* GraphQl + NodeJS + MongoDb - https://www.sitepoint.com/creating-graphql-server-nodejs-mongodb/
* Zero to GraphQL - https://www.youtube.com/watch?v=UBGzsb2UkeY

## Useful Links
* GraphQl + NodeJs + Sql -
https://www.reindex.io/blog/building-a-graphql-server-with-node-js-and-sql/
* GraphQl + Nodejs + MongoDb - https://www.sitepoint.com/creating-graphql-server-nodejs-mongodb/
* graphql-server - https://github.com/RisingStack/graphql-server
* GraphQl and NodeJS  - https://blog.risingstack.com/graphql-overview-getting-started-with-graphql-and-nodejs/
