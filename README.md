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
* Roda o comando `nom start`
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

Para deixar o ambiente reproduzivel vamos criar a nossa imagem.

#### Criando Imagem

Para criar a nossa imagem, vamos precisar criar um arquivo chamado `Dockerfile`, dentro da pasta parse, só pra deixar organizado.
