## 🚀 Projeto Prático DevOps: Full-Stack Containerizado com NGINX

Bem-vindo ao repositório do projeto. Este é um ambiente robusto, moderno e totalmente containerizado que simula uma infraestrutura de produção local. Foi utilizado o **NGINX** como um Proxy Reverso unificando um frontend em **React (Vite)**, um backend em **Node.js (Express)** e um banco de dados **PostgreSQL**.

Interface de usuário desenvolvida em React para o sistema de gestão de favoritos. Esse painel permite que os operadores realizem o cadastro de usuários, tendo a possibilidade de remova-los ou edita-los além da navegação por um catálogo de produtos integrado por meio de uma API externa permitindo favoritar e gerenciar listas de favoritos para cada usuário de forma rápida.

A API REST de USUÁRIOS, foi desenvolvida em Node.js para fim de prática com DevOps da disciplina DevOps Tools, ministrada pelo [Prof. Welligton Feitosa](https://github.com/spaaws). Este backend é responsável por gerenciar o cadastro de clientes (usuários), integrar com o catálogo de produtos de uma API externa e administrar as listas de favoritos de cada uma.

---

## 🏗️ Arquitetura do Projeto Local

Quando você inicia o projeto, o Docker cria uma rede interna onde os contêineres conversam de forma isolada e segura:
* **NGINX (Porta 80):** O único ponto de contato com o seu navegador. Ele distribui o tráfego de forma inteligente.
    * `http://localhost/` ➡️ Roteia diretamente para o Frontend (Vite).
    * `http://localhost/api/` ➡️ Roteia para a API Node.js.
    * `http://localhost/fakestore/` ➡️ Faz o proxy seguro para a API externa da FakeStore (sem problemas de CORS!).
* **Frontend (Vite - Porta 5173 interna):** Interface SPA em React.
* **Backend (Node.js - Porta 2375):** API que gerencia as regras de negócio e favoritos.
* **Banco de Dados (Postgres - Porta 5432 interna / 5433 externa):** Armazenamento relacional dos dados.

---

## 🛠️ Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
1.  [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2.  [Git](https://git-scm.com/) (para clonar ou gerenciar o código)

---

## 🖥️ Como Executar Localmente (Passo a Passo)

### 1. Clonar e Acessar o Projeto
Abra o seu terminal na pasta do projeto onde se encontra o arquivo `docker-compose.yml`.

### 2. Construir e Iniciar os Contêineres
Para compilar as imagens (sem usar lixo de cache antigo) e subir os serviços em segundo plano, execute o comando:

```bash
docker-compose up --build -d
```
O que significa cada flag?
    * `--build`: Força o Docker a reler os seus Dockerfiles (garante que alterações recentes no código sejam aplicadas).
    * `-d`: Roda no modo "detached" (em segundo plano), liberando o seu terminal.

### 3. Verificar se está tudo rodando
Para garantir que todos os 4 contêineres subiram com sucesso e nenhum entrou em pane, digite:

```bash
docker-compose ps
```
Todos os serviços devem exibir o status Up ou running.

---

## 🌐 Links Úteis para Testar no Navegador
Interface Web (Frontend): `http://localhost`

Status da API (Backend): `http://localhost/api/usuarios/1/favoritos` (Substitua pelo ID de teste do banco)

Proxy da FakeStore: `http://localhost/fakestore/products`
Proxy da FakeStore: `http://localhost/fakestore/products/:id`

---

## 🪵 Comandos de Sobrevivência (Logs e Debug)
Se algo não se comportar como esperado, use os logs para descobrir o motivo:

- Ver logs de todos os serviços juntos:

```bash
docker-compose logs -f
```

- Ver logs específicos de um serviço (Ex: Frontend):

```bash
docker-compose logs front
```

- Reiniciar um contêiner específico sem derrubar o resto (Ex: Backend após mudar o código):

```bash
docker-compose restart api
```
- Parar e remover todos os contêineres da memória:

```bash
docker-compose down
```
