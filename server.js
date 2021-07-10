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

// Get route to display saved notes
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), 'UTF8', (err, data) => {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Post route to save and display new notes
app.post('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, './db/db.json'), 'UTF8', (err, data) => {
        if (err) {
            res.status(500).json(err);
        } else {
            const notes = JSON.parse(data);
            req.body.id = uuidv4();
            const newNotes = [req.body, ...notes];
            fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(newNotes), (err) => {
                if (err) {
                    res.status(500).json(err);
                } else {
                    res.json(newNotes);
                }
            })
        }
    });
});

// Delete route to remove saved notes
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile(path.join(__dirname, './db/db.json'), 'UTF8', (err, data) => {
        if (err) {
            res.status(500).json(err);
        } else {
            const notes = JSON.parse(data);
            const newNotes = notes.filter((note) => {
                return note.id != id;
            });
            fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(newNotes), (err) => {
                if (err) {
                    res.status(500).json(err);
                } else {
                    res.json(newNotes);
                }
            });
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