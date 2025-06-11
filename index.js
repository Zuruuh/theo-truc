import mysql from 'mysql2/promise';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server'

const connection = await mysql.createConnection({
    host: process.env.DB_HOST ?? 'db',
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? 'example',
    database: process.env.DB_NAME ?? 'esgi',
    port: 3306
});

const app = new Hono();
app.use(cors());

await connection.query(`
CREATE TABLE IF NOT EXISTS users (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(80) NOT NULL,
    PRIMARY KEY(id)
)`);

app.get('/api/users', async (c) => {
    const [users] = await connection.query('SELECT * FROM users');
    console.log(users);

    return c.json(users);
});

app.post('/api/users', async (c) => {
    const body = await c.req.parseBody();
    if (typeof body.name !== 'string') {
        return c.text('Invalid request', 400);
    }

    await connection.query('INSERT INTO users (name) VALUES (?)', [body.name]);

    return c.text('', 201);
});

serve(app);
