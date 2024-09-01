//app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sql, getPool } = require('./db');
const { apiKeyMiddleware } = require('./middleware'); // Import the API key middleware

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Apply the API key middleware to all routes
app.use(apiKeyMiddleware);

// POST /items
app.post('/items', async (req, res) => {
    const { name, price, categoryId, volumes } = req.body;
    try {
        const pool = await getPool();
        const poolConn = await pool.request()
            .input('name', sql.NVarChar, name)
            .input('categoryId', sql.Int, categoryId)
            .query('INSERT INTO Items (name, categoryId) OUTPUT INSERTED.id VALUES (@name, @categoryId)');

        const itemId = poolConn.recordset[0].id;

        for (let volume of volumes) {
            await pool.request()
                .input('itemId', sql.Int, itemId)
                .input('value', sql.NVarChar, volume)
                .input('price', sql.Decimal(10, 2), price)
                .query('INSERT INTO ItemVolumes (itemId, value, price) VALUES (@itemId, @value, @price)');
        }

        res.json({ success: true, code: 200, data: { id: itemId, name, volumes: { value: volume, price } } });
    } catch (err) {
        console.error('Error in POST /items:', err);
        res.status(500).json({ success: false, code: 500, message: err.message });
    }
});

// GET /category/:id
app.get('/category/:id', async (req, res) => {
    const categoryId = parseInt(req.params.id);
    try {
        const pool = await getPool();
        const poolConn = await pool.request()
            .input('categoryId', sql.Int, categoryId)
            .query('SELECT * FROM Categories WHERE id = @categoryId');

        const category = poolConn.recordset[0];

        const itemsResult = await pool.request()
            .input('categoryId', sql.Int, categoryId)
            .query('SELECT * FROM Items WHERE categoryId = @categoryId');

        const items = itemsResult.recordset;

        res.json({
            success: true,
            code: 200,
            data: {
                category,
                items
            }
        });
    } catch (err) {
        console.error('Error in GET /category/:id:', err);
        res.status(500).json({ success: false, code: 500, message: err.message });
    }
});

// GET /items
app.get('/items', async (req, res) => {
    try {
        const pool = await getPool();
        const poolConn = await pool.request().query('SELECT * FROM Items');

        res.json({
            success: true,
            code: 200,
            data: {
                items: poolConn.recordset
            }
        });
    } catch (err) {
        console.error('Error in GET /items:', err);
        res.status(500).json({ success: false, code: 500, message: err.message });
    }
});

// GET /item/search
app.get('/item/search', async (req, res) => {
    const searchTerm = req.query.q;
    try {
        const pool = await getPool();
        const itemsResult = await pool.request()
            .input('searchTerm', sql.NVarChar, `%${searchTerm}%`)
            .query('SELECT * FROM Items WHERE name LIKE @searchTerm');

        const categoriesResult = await pool.request()
            .input('searchTerm', sql.NVarChar, `%${searchTerm}%`)
            .query('SELECT * FROM Categories WHERE name LIKE @searchTerm');

        res.json({
            success: true,
            code: 200,
            data: {
                items: itemsResult.recordset,
                categories: categoriesResult.recordset
            }
        });
    } catch (err) {
        console.error('Error in GET /item/search:', err);
        res.status(500).json({ success: false, code: 500, message: err.message });
    }
});

// GET /item/:id
app.get('/item/:id', async (req, res) => {
    const itemId = parseInt(req.params.id);
    try {
        const pool = await getPool();
        const poolConn = await pool.request()
            .input('itemId', sql.Int, itemId)
            .query('SELECT * FROM Items WHERE id = @itemId');

        const item = poolConn.recordset[0];

        const volumesResult = await pool.request()
            .input('itemId', sql.Int, itemId)
            .query('SELECT value, price FROM ItemVolumes WHERE itemId = @itemId');

        const volumes = volumesResult.recordset;

        res.json({
            success: true,
            code: 200,
            data: {
                id: item.id,
                name: item.name,
                volumes
            }
        });
    } catch (err) {
        console.error('Error in GET /item/:id:', err);
        res.status(500).json({ success: false, code: 500, message: err.message });
    }
});

// POST /category
app.post('/category', async (req, res) => {
    const { name } = req.body;
    try {
        const pool = await getPool();
        const result = await pool.request()
            .input('name', sql.NVarChar, name)
            .query('INSERT INTO Categories (name) OUTPUT INSERTED.id VALUES (@name)');

        const categoryId = result.recordset[0].id;

        res.json({ success: true, code: 200, data: { id: categoryId, name } });
    } catch (err) {
        console.error('Error in POST /category:', err);
        res.status(500).json({ success: false, code: 500, message: err.message });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});