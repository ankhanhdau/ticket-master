import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const { Pool } = pg;

app.use(express.json());
app.use(cors());

const db = new Pool(
    {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    });

app.get('/users', async (req, res) => {
    try {
        const users = await db.query('SELECT * FROM users');
        res.json(users.rows);
    } catch (err) {
        console.error(err instanceof Error ? err.message : 'Unknown error');
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/tickets', async (req, res) => {
    try {
        const query = 'SELECT t.id, t.title, t.status, t.created_at, u.id as assignee_id FROM tickets t LEFT JOIN users u ON t.assignee_id = u.id';
        const tickets = await db.query(query);
        res.json(tickets.rows);
    } catch (err) {
        console.error(err instanceof Error ? err.message : 'Unknown error');
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/tickets', async (req, res) => {
    try {
        const { title } = req.body;
        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'Title is required' });
        }
        const query = 'INSERT INTO tickets (title,assignee_id) VALUES ($1,1) RETURNING *';
        const newTicket = await db.query(query, [title]);
        res.json(newTicket.rows[0]);
    } catch (err) {
        console.error(err instanceof Error ? err.message : 'Unknown error');
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.patch('/tickets/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const query = 'UPDATE tickets SET status=$1 WHERE id=$2 RETURNING *';
        const updatedTicket = await db.query(query, [status, req.params.id]);
        res.json(updatedTicket.rows[0]);
    } catch (err) {
        console.error(err instanceof Error ? err.message : 'Unknown error');
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.delete('/tickets/:id', async (req, res) => {
    try {
        const query = 'DELETE FROM tickets WHERE id=$1';
        await db.query(query, [req.params.id]);
        res.json({ message: 'Ticket deleted successfully' });
    } catch (err) {
        console.error(err instanceof Error ? err.message : 'Unknown error');
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});