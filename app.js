// Dependencies

const http = require('http')
path = require('path')
express = require('express')
bodyParser = require('body-parser')
const sqlite3 = require('sqlite3')
const app = express();


// Middleware

app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Database
const db = new sqlite3.Database(':memory:');

db.serialize(function () {
    db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
    db.run ("INSERT user VALUES ('privilegedUser','privilegedUser1', 'Administrator')");
});

app.get('/', function (req, res) {
    res.sendFile('index.html')
})

app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var query = "SELECT title FROM user WHERE username = '"+ username + "' and password = '"+ password + "'";

    console.log("username: " + username);
    console.log("password: " + password);
    console.log('query: ' +query);

    db.get(query, function (req,res) {
        if (err) {
            console.log('ERROR', err);
            res.redirect("/index.html#error");
        } else if (!row) {
            res.redirect("/index.html#unauthorized");
        } else {
            res.send('Hello!' +row.title + 'Some Secret stuff here maybe? <a href="/index.html">Return to Login</a>' )
        }
    });
});

app.listen(3000);