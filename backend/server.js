const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

const mysql = require('mysql');
const cors = require('cors');
const fileUpload = require('express-fileupload');

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(fileUpload());
const path = require('path');
const assetFolder = path.join(__dirname, "/public/images")

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'emworkgroup',
    port: '3306'
    
})
db.connect((err) => {
    if (err) {
        console.log('Error connecting to MySQL database = ', err)
        return;
    } 
    console.log('MySQL succesfully connected.')
})

app.get("/", (req, res) => {
    res.send("hello, world!")
});

app.get("/users", (req, res) => {
    const sql = `SELECT * FROM users`

    try {
        db.query(sql, (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send()
            }
            res.status(200).json(results);
        })
    } catch(err) {
        return res.status(500).send();
    }
});

app.get("/users-filter", (req, res) => {
    
});

app.post("/user", (req, res) => {

    const {name_title, surename, lastname, birth_date, profile_pic, updated_at} = req.body;
    console.log(req.body);
    

    
    try {
        db.query(
            "INSERT INTO users(name_title, surename, lastname, birth_date, profile_pic) \
            VALUES(?, ?, ?, ?, ?)",
            [name_title, surename, lastname, birth_date, profile_pic],
            (err, result, fields) => {
                if (err){
                    console.log(err)
                    return res.status(400).send();
                }
                return res.status(201).json({
                    message: "New item successful created"
                })
            }
        )
    } catch (err) {
        // throw err
        console.log(err)
        return res.status(500).send();
    }
});

app.get("/user/:id", (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM users WHERE id = ?`

    try {
        db.query(sql, [id], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send()
            }
            res.status(200).json(results);
        })
    } catch(err) {
        return res.status(500).send();
    }
})

app.put("/user:id", (req, res) => {
    const id = req.params.id;
    const {name_title, surename, lastname, birth_date, profile_pic, updated_at} = req.body;
    const sql = "UPDATE items\
    SET name_title = ?, surename = ?, lastname = ?, birth_date = ?\
    , profile_pic = ?, updated_at = ? \
    WHERE id = ?"

    try {
        db.query(sql,
            [name_title, surename, lastname, birth_date, profile_pic, updated_at, id],
            (err, results, fields) => {
                if (err) {
                    console.log(err);
                    return res.status(400).send();
                }
                res.status(200).json(results);
            })
        
    } catch (err) {
        console.log(err)
        return res.status(500).send();
    }
});

app.delete("/user/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM users WHERE id = ?"
    try {
        db.query(sql, [id], (err, results, fields) => {
            if (err) {
                console.log(err);
                return res.status(400).send();
            }
            if (results.affectedRows === 0){
                return res.status(400).json({
                    message: "No item with that id."
                });
            }
            return res.status(200).json({
                message: "The item is deleted scuccessfully."
            })
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send();
    }
});

app.get("/report", (req, res) => {
    res.send("hello, world!")
});

app.listen(port, () => {
    console.log(`Starting nodejs at port ${port}`)
})