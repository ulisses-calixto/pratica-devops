# Frontend

Interface de usuário desenvolvida em React para o sistema de gestão de favoritos. Esse painel permite que os operadores realizem o cadastro de usuários, tendo a possibilidade de remova-los ou edita-los além da navegação por um catálogo de produtos integrado por meio de uma API externa permitindo favoritar e gerenciar listas de favoritos para cada usuário de forma rápida.

## Tecnologias usadas

* **React (Vite)**: Framework principal.
* **Tailwind CSS**: Estilização.
* **React Query (TanStack)**: Gerenciamento de estado de servidor, cache e sincronização de dados.
* **Axios**: Cliente HTTP para comunicação com a API (Backend).
* **React Router Dom**: Navegação entre as páginas.

## Pré-requisitos

Para rodar o projeto localmente, certifique-se de ter o seguinte instalado na sua máquina:
* [Node.js](https://nodejs.org/) (Versão LTS 22.x ou superior recomendada)
* A API do backend rodando (preferencialmente via Docker na porta `2375`).

## Como rodar o projeto localmente

### 1. Clone e instale as dependências
Abra o seu terminal, navegue até a pasta do frontend e execute:

```bash
npm install
```

### 2. Configure a conexão com a API
Verifique no arquivo de serviços (src/services/api.js ou equivalente) se a base URL aponta corretamente para o seu backend local. Por padrão, a aplicação espera que o backend esteja rodando em:
http://localhost:2375

### 3. Inicie o servidor de desenvolvimento
Execute o comando do Vite para levantar a aplicação:

```bash
npm run dev
```

O terminal exibirá uma URL local (geralmente http://localhost:5173). Basta abrir este link no seu navegador para acessar o painel do sistema.