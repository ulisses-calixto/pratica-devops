# API - Backend

A API REST foi desenvolvida em Node.js para fim de prática com DevOps da disciplina DevOps Tools, ministrada pelo [Prof. Welligton Feitosa](https://github.com/spaaws). Este backend é responsável por gerenciar o cadastro de clientes (usuários), integrar com o catálogo de produtos de uma API externa e administrar as listas de favoritos de cada um.

## 🛠️ Tecnologias usadas

* **Node.js** & **Express**: Estrutura principal do servidor da API criada.
* **PostgreSQL**: Banco de dados relacional (executado via container).
* **Axios**: Integração HTTP com o catálogo de produtos (FakeStoreAPI).
* **Docker & Docker Compose**: Orquestração e conteinerização do ambiente de desenvolvimento.

## ⚙️ Pré-requisitos

Como este projeto está conteinerizado, você **não** precisa ter o Node.js ou o PostgreSQL instalados na sua máquina. Antes de começar, garanta apenas as seguintes ferramentas:
* [Docker Desktop](https://www.docker.com/products/docker-desktop)
* [Docker Compose](https://docs.docker.com/compose/install/) (geralmente já incluso no Docker Desktop)

---

## 🚀 Como rodar o projeto (Via Docker)

O ambiente foi configurado para que o Docker construa a imagem da API e levante o banco de dados PostgreSQL simultaneamente, configurando as tabelas necessárias de forma automática.

### 1. Clone o repositório e acesse a pasta do projeto
Abra o seu terminal e execute os comandos abaixo para baixar o código e navegar até o diretório do backend:

```bash
# Clone o repositório completo
git clone <URL_DO_SEU_REPOSITORIO>

# Entre na pasta raiz do repositório clonado
cd <NOME_DO_REPOSITORIO_CLONADO>

# Acesse especificamente a pasta do backend (ajuste se o nome da pasta for diferente)
cd backend
```

### 2. Configuração das Variáveis de Ambiente
Crie um arquivo chamado `.env` na raiz da pasta do backend (mesmo nível do `docker-compose.yml`) e adicione as variáveis abaixo.

> **Nota:** Como estamos usando o Docker Compose, o `DB_HOST` deve ser o nome do serviço do banco definido no arquivo yml (geralmente `db` ou `postgres`), e não `localhost`.

```env
PORT=2375
DB_USER=admin
DB_PASSWORD=adminpassword
DB_HOST=db
DB_PORT=5432
DB_NAME=db_name
```

### 3. Subindo os Containers
Com o arquivo `.env` configurado, execute o comando abaixo para construir a imagem e iniciar os serviços em segundo plano:

```bash
docker-compose up -d --build
```

O Docker fará o download das imagens do Node e do Postgres, instalará as dependências, e iniciará a API na porta `2375`.

Para visualizar os logs em tempo real e garantir que tudo conectou perfeitamente:

```bash
docker-compose logs -f
```

### 4. Derrubando os containers
Quando terminar de testar ou desenvolver, você pode parar e remover os containers executando:

```bash
docker-compose down