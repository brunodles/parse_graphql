# Batch Requesting

Nesse passo a passo vou mostrar como criar uma api com batch requesting.



## Docker e Docker-compose
Primeiro, vamos criar nosso docker compose file.

```
touch docker-compose.yml
```

Esse arquivo vai ajudar a criar a nosso ambiente.
Também vai dizer como nossos containers vão se comunicar.

### NodeJs

Pra rodar o parse precisamos de NodeJs, então vamos criar um container com NodeJs.

```
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
```
mkdir parse
```

### MongoDb

O parse usa o MongoDb, então vamos criar um container pra o mongo.

```
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

```
docker-compose run parse bash
```

Dentro do container rodar o comando.

```
npm install -g parse-server
```

Mas isso não é reproduzivel, seria necessário fazer isso em uma nova maquina.
Não é isso que queremos.

#### Usando NPM

Vamos usar o npm para instalar todas as dependências que precisamos.
Pra isso vamos criar um arquivo `package.json`.  
Nesse arquivo vamos definir o nome do nosso projeto, a versão e as dependências, mas usando o formato *json*.

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

```
npm install
```

Mas esse comando precisa ser rodado dentro do container.

### Automatizando Script de instalação e execução

Agora vamos criar o script que irá instalar tudo o que precisamos. Vamos criar um *entrypoint*.

Crie um arquivo chamado `entrypoint.sh` dentro da pasta `parse` e dê permissão de execução.

```
touch parse/entrypoint.sh
chmod +x parse/entrypoint.sh
```

Agora só precisamos executar `npm install` antes de executar qualquer outro comando.

O arquivo ficará assim.

```
#!/bin/bash
npm install
$@
```

Agora só precisamos adicionar o `entrypoint` ao nosso container no `docker-compose.yml`

```
parse:
  image: node:6.7.0
  command: npm start
  entrypoint: ./entrypoint.sh
  volumes:
  ...
```

## Sources
* Parse - https://parseplatform.github.io
* Parse Server - https://github.com/ParsePlatform/parse-server
* Parse Server Example - https://github.com/ParsePlatform/parse-server-example
* MongoDb https://docs.mongodb.com/manual/reference/default-mongodb-port/
* Docker Compose - https://docs.docker.com/compose/gettingstarted/
* DockerHub - NodeJs - https://hub.docker.com/_/node/
* DockerHub - MongoDb - https://hub.docker.com/_/mongo/
* Padawan Docker - Parse -https://github.com/Padawan-org/Padawan-Docker/tree/parse
* Parse Server - Rest Api - http://parseplatform.github.io/docs/rest/guide/
