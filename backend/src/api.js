require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'up' });
});

//crud usuario
app.post('/usuarios', async (req, res) => {
    const {nome, email} = req.body;
    try {
        const result = await pool.query(
            'insert into "Usuarios" (nome, email) VALUES ($1, $2) returning *',
            [nome, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao cadastrar usuário', detalhes: err.message });
    }
});

app.get('/usuarios', async (req, res) => {
    try {
        const result = await pool.query('select * from "Usuarios" order by id asc');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar usuários', detalhes: err.message });
    }
});

app.get('/usuarios/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query('select * from "Usuarios" where id = $1', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar usuário', detalhes: err.message });
    }
});

app.put('/usuarios/:id', async (req, res) => {
    const {id} = req.params;
    const {nome, email} = req.body;
    try {
        const result = await pool.query(
            'update "Usuarios" SET nome = $1, email = $2 where id = $3 returning *',
            [nome, email, id]
        );      
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        } 
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar usuário', detalhes: err.message });
    }
});

app.delete('/usuarios/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const result = await pool.query('delete from "Usuarios" where id = $1 returning *', [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        res.status(200).json({ message: 'Usuário e dados removidos.' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao remover usuário', detalhes: err.message });
    }
});

// api externa
app.get('/produtos', async (req, res) => {
    try {
        const urlDestino = 'https://fakestoreapi.com/products';
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(urlDestino)}`;
        
        const response = await axios.get(proxyUrl);
        res.status(200).json(response.data);
    } catch (err) {
        console.error("Erro no Proxy/API Externa:", err.message);
        res.status(500).json({ error: 'Erro ao buscar produtos da API externa', detalhes: err.message });
    }
});

app.get('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const urlDestino = `https://fakestoreapi.com/products/${id}`;
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(urlDestino)}`;
        const response = await axios.get(proxyUrl);
        res.status(200).json(response.data);
    } catch (err) {
        console.error(`Erro no Proxy para o produto ${id}:`, err.message);
        res.status(500).json({ error: 'Erro ao buscar o produto', detalhes: err.message });
    }
});

//favoritos
app.post('/favoritos', async (req, res) => {
    const { id_usuario, id_produto } = req.body;
    try {
        await pool.query(
            'insert into "Favoritos" (id_usuario, id_produto) values ($1, $2)',
            [id_usuario, id_produto]
        );
        res.status(201).json({ message: 'Produto favoritado com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: 'Produto já favoritado.', detalhes: err.message });
    }
});

app.get('/usuarios/:id/favoritos', async (req, res) => {
    const { id } = req.params;
    try {
        const dbResultado = await pool.query(
            'select id_produto from "Favoritos" where id_usuario = $1', [id]
        );
        if (dbResultado.rows.length === 0) {
            return res.status(200).json([]);
        }  
        const idFavoritos = dbResultado.rows.map(row => row.id_produto);
        
        const produtosData = await Promise.all(
            idFavoritos.map(async (produtoId) => {
                const urlDestino = `https://fakestoreapi.com/products/${produtoId}`;
                const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(urlDestino)}`;
                const response = await axios.get(proxyUrl);
                const produto = response.data;
                return {
                    id: produto.id,
                    imagem: produto.image,
                    titulo: produto.title,
                    preco: produto.price,
                    avaliacao: produto.rating
                };
            })
        );
        res.status(200).json(produtosData);
    } catch (err) {
        console.error(`Erro ao buscar favoritos do usuário ${id}:`, err.message);
        res.status(500).json({ error: 'Erro ao buscar favoritos.', detalhes: err.message });
    }
});

app.delete('/usuarios/:id_usuario/favoritos/:id_produto', async (req, res) => {
    const {id_usuario, id_produto} = req.params;
    try {
        const resultado = await pool.query(
            'delete from "Favoritos" where id_usuario = $1 and id_produto = $2',
            [id_usuario, id_produto]
        );
        if (resultado.rowCount === 0) {
            return res.status(404).json({ error: 'Produto já removido dos favoritos.' });
        }
        res.status(200).json({ message: 'Produto removido dos favoritos.' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao remover favorito', detalhes: err.message });
    }
});

const PORT = process.env.PORT || 2375;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
