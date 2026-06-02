### Prática DevOps: Full-Stack Containerizado + NGINX

Bem-vindo ao repositório do projeto. Este é um ambiente simples, mas funcional, aparentemente. O projeto é totalmente containerizado, temos uma infraestrutura de produção. Foi utilizado o *NGINX* como um proxy reverso unificando o frontend em *React (Vite)*, o backend em *Node.js (Express)* e banco de dados *PostgreSQL*. A UI  permite que o professor realize o CRUD simples de usuários, tendo a possibilidade de criar, editar, atualizar e deletar. Além da navegação por um catálogo de produtos integrado por meio de uma API externa(FakeStoreAPI), que faz a integração dos produtos do catálogo escolhidos e associados aos usuários cadastrados.

A disciplina de DevOps Tools é ministrada pelo [Prof. Welligton Feitosa](https://github.com/spaaws).

*Obs: Não houve implementação de sistema de autenticação. O projeto é de finalidade acadêmica, pensado para colocar o professor em primeiro plano como o admin nativo, afim da analise do projeto sem muitas "barreiras". Isso desfez minha ideia de um Auth(JWT), por exemplo, aqui.*

---

## Arquitetura do projeto local

Quando você inicia o projeto, o Docker cria uma rede interna onde os contêineres conversam entre si de maneira isolada e segura:
* **NGINX (Porta 80):** Ele distribui o tráfego.
    * `http://localhost/` -> Roteia diretamente para o frontend (Vite).
    * `http://localhost/api/` -> Roteia para a API Node.js.
    * `http://localhost/fakestore/` -> Faz o proxy seguro para a API externa da FakeStore.
* **Frontend (Vite - Porta 5173 interna):** Interface React.
* **Backend (Node.js - Porta 2375):** API que gerencia o CRUD de usuários e favoritos.
* **Banco de Dados (Postgres - Porta 5432 interna / 5433 externa):** Armazenamento relacional dos dados dos usuários e seus favoritados.

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
1.  [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2.  [Git](https://git-scm.com/) (para clonar ou gerenciar o código)

---

## Como executar localmente

### 1. Clonar e acessar o projeto
Abra o seu terminal na pasta do projeto onde se encontra o arquivo `docker-compose.yml`.

### 2. Construir e iniciar os contêineres
Para compilar as imagens (sem usar o resto de cache antigo) e subir os serviços em segundo plano, execute o comando:

```bash
docker-compose up -d -build
```

---

### 3. Verificar se está tudo rodando
Para verificar se todos os 4 contêineres subiram com sucesso, cole o comando abaixo no seu terminal:

```bash
docker-compose ps
```
Todos os serviços devem exibir o status Up.

---

## Links para testes no navegador
Interface web (Frontend): `http://localhost`

Status da API (Backend): `http://localhost/api/health`

Proxy da API externa retorna todos os produtos: `http://localhost/fakestore/products`
E esse para produto especifico pelo 'id': `http://localhost/fakestore/products/:id`
