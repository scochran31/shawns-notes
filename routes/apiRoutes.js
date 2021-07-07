const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
let allNotes;

router.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

router.get('/', (req, res) => {
    res.sendFile(__dirname, './public/index.html');
});

router.get('/api/notes', (req, res) => {
    readFile(path.join(__dirname, './db/db.json'), 'utf8')
        .then(function (data) {
            return res.json(JSON.parse(data));
        });
});

router.post('/api/notes', (req, res) => {
    var newNote = req.body;
    readFile(path.join(__dirname, './db/db.json'), 'utf8')
        .then(function (data) {
            allNotes = JSON.parse(data);
            if (newNote.id || newNote.id === 0) {
                let currentNote = allNotes[newNote.id];
                currentNote.title = newNote.title;
                currentNote.text = newNote.text;
            } else {
                allNotes.push(newNote);
            }
            writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(allNotes))
                .then(function () {
                    console.log('Note now in db.json!');
                })
        });
        res.json(newNote);
});

router.delete('/api/notes/:id', (req, res) => {
    var id = req.params.id;
    readFile(path.join(__dirname, './db/db.json'), 'utf8')
        .then(function (data) {
            allNotes = JSON.parse(data);
            allNotes.splice(id, 1);
            writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(allNotes))
                .then(function () {
                    console.log('Note deleted from db.json!')
                })
        });
        res.json(id);
});

module.exports = router;