const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

let dbConn = mysql.createConnection({
    host: process.env.host,
    user: process.env.DB_user,
    password: process.env.DB_pass,
    database: process.env.DB_name
});

app.get('/', (req, res) => {
    res.send('Welcome!');
});

dbConn.connect(err => {
    if (err) throw err;
    console.log("Connected to DB!");
});

// CREATE
app.post('/student', (req, res) => {
    let student = req.body;
    if (!student) {
        return res.status(400).send({ error: true, message: 'Please provide student info' });
    }
    dbConn.query("INSERT INTO personal_info SET ?", student, (err, results) => {
        if (err) throw err;
        res.send({ error: false, data: results.affectedRows, message: 'New student added' });
    });
});

// READ ALL
app.get('/students', (req, res) => {
    dbConn.query("SELECT * FROM personal_info", (err, results) => {
        if (err) throw err;
        res.send({ error: false, data: results, message: 'Student list' });
    });
});

// // READ ONE
// app.get('/student/:id', (req, res) => {
//     const studentID = req.params.id;
//     dbConn.query("SELECT * FROM personal_info WHERE StudentID = ?", studentID, (err, results) => {
//         if (err) throw err;
//         res.send({ error: false, data: results[0], message: 'Student retrieved' });
//     });
// });

// UPDATE
app.put('/student', (req, res) => {
    const student = req.body;
    const studentID = student.StudentID;
    if (!studentID) {
        return res.status(400).send({ error: true, message: 'Please provide StudentID' });
    }
    dbConn.query("UPDATE personal_info SET ? WHERE StudentID = ?", [student, studentID], (err, results) => {
        if (err) throw err;
        res.send({ error: false, data: results.affectedRows, message: 'Student updated' });
    });
});

// DELETE
app.delete('/student', (req, res) => {
    const studentID = req.body.StudentID;
    if (!studentID) {
        return res.status(400).send({ error: true, message: 'Please provide StudentID' });
    }
    dbConn.query("DELETE FROM personal_info WHERE StudentID = ?", studentID, (err, results) => {
        if (err) throw err;
        res.send({ error: false, data: results.affectedRows, message: 'Student deleted' });
    });
});

app.listen(3000, () => console.log('Server running on port 3000'));
