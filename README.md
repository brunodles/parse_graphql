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
  build: ./parse
  command: ./parse/start.sh
  volumes:
    - ./parse:/usr/src/app
  ports:
    - 3000:3000
  working_dir: /usr/src/app/
```

Esse container vai usar a pasta parse.  
O comando padrão está no `start.sh`.  
Ele compartilhará a pasta `parse` na pasta `usr/src/app`.  
E deixará a porta `3000` exposta.

Agora vamos precisar criar a pasta `parse`.
```
mkdir parse
```
