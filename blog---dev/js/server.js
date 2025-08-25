// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Aumenta o limite para aceitar imagens em base64
app.use(express.urlencoded({ limit: '10mb', extended: true }));


// --- CONEXÃO COM O BANCO DE DADOS MYSQL ---
// Substitua com as suas credenciais do MySQL.
// O padrão do XAMPP é usuário 'root' sem senha.
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bgp_feed' // O nome do banco de dados que você criou
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL.');
});


// --- ROTAS DA API ---

// Rota para Cadastro de Usuário
app.post('/cadastrar', (req, res) => {
    const { usuario, cpf, senha } = req.body;
    const sql = `INSERT INTO usuarios (usuario, cpf, senha) VALUES (?, ?, ?)`;
    db.query(sql, [usuario, cpf, senha], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'Usuário ou CPF já cadastrado.' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Cadastro realizado com sucesso!', id: result.insertId });
    });
});

// Rota para Login
app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;
    const sql = `SELECT * FROM usuarios WHERE usuario = ? AND senha = ?`;
    db.query(sql, [usuario, senha], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length > 0) {
            res.status(200).json({ message: 'Login bem-sucedido!', user: results[0] });
        } else {
            res.status(401).json({ error: 'Usuário ou senha incorretos!' });
        }
    });
});

// Rota para buscar todos os cadastros (para a página de admin)
app.get('/cadastros', (req, res) => {
    const sql = "SELECT id, usuario, cpf, senha FROM usuarios WHERE senha != 'admin1234'";
    db.query(sql, (err, results) => {
        if (err) {
          res.status(400).json({"error": err.message});
          return;
        }
        res.json({
            "message": "success",
            "data": results
        });
    });
});

// Rota para criar uma publicação
app.post('/posts', (req, res) => {
    const { user, imageUrl, caption } = req.body;
    const sql = `INSERT INTO posts (user, imageUrl, caption) VALUES (?, ?, ?)`;
    db.query(sql, [user, imageUrl, caption], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Post criado com sucesso!', id: result.insertId });
    });
});

// Rota para buscar todas as publicações
app.get('/posts', (req, res) => {
    const sql = "SELECT * FROM posts ORDER BY id DESC";
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

// Rota para deletar uma publicação (para o admin)
app.delete('/posts/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM posts WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Publicação não encontrada' });
        }
        res.status(200).json({ message: 'Publicação deletada com sucesso' });
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});