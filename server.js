const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;

// middleware for  project
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("public"));

app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), 'UTF8', (err, data) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.post('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), 'UTF8', (err, data) => {
        if (err) {
            res.status(500).json(err);
        } else {
            const notes = JSON.parse(data);
            req.body.id = uuidv4();
            const newNote = [req.body, ...notes];
            fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(newNote), (err) => {
                if (err) {
                    res.status(500).json(err);
                } else {
                    res.json(newNote);
                }
            })
        }
    });
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});