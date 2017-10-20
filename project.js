var express = require('express'),
    mysql = require('mysql'),
    formidable = require('formidable'),
    fs = require('fs');

var app = express();
var connection = mysql.createConnection({
    host: 'localhost',
    query: {
        pool: true
    },
    user: 'root',
    password: '1234',
    database: 'kyoungMin'
});

app.get('/loadData_H/', function(req, res) {

    var sql = 'select * from HomeList where Home>' + req.query.Home;
    connection.query(sql, function(err, rows, fields) {
        if (err) {
            res.sendStatus(400);
            return;
        }
        if (rows.length == 0) {
            res.sendStatus(204);
        } else {
            res.status(201).send(rows);
            res.end();
        }
    });

}); 
app.get('/loadData_P/', function(req, res) {

    var sql = 'select * from PersonList where PersonNumber>' + req.query.PersonNumber;
    connection.query(sql, function(err, rows, fields) {
        if (err) {
            res.sendStatus(400);
            return;
        }
        if (rows.length == 0) {
            res.sendStatus(204);
        } else {
            res.status(201).send(rows);
            res.end();
        }
    });

}); 


var isFormData = function(req) {
    var type = req.headers['content-type'] || '';
    return 0 == type.indexOf('multipart/form-data');
}

app.post('/upload_H', function(req, res) {
    var form = new formidable.IncomingForm();
    var body = {};

    if (!isFormData(req)) {
        res.status(400).end('Bad Request : expecting multipart/form-data');
        return;
    }

    form.on('field', function(name, value) {
        body[name] = value;
    });

    form.on('end', function(fields, files) {
        var sql = 'insert into HomeList' +
            '(NowNumber, K1Number, K2Number) ' +
            'values(?,?,?)';
        var args = [body.NowNumber, body.K1Number, body.K2Number];

        connection.query(sql, args, function(err, results, fields) {
            if (err) {
                res.sendStatus(500);
                console.log('error');
                return;
            }
            res.sendStatus(200);
        });
    });
    form.parse(req);
});

app.post('/upload_P', function(req, res) {
    var form = new formidable.IncomingForm();
    var body = {};

    if (!isFormData(req)) {
        res.status(400).end('Bad Request : expecting multipart/form-data');
        return;
    }

    form.on('field', function(name, value) {
        body[name] = value;
    });

    form.on('end', function(fields, files) {
        var sql = 'insert into PersonList' +
            '(HomeNumber, Name, Enlist, GunKind, GunPosition, State, Consideration)' +
            'values(?,?,?,?,?,?,?)';
        var args = [body.HomeNumber, body.Name, body.Enlist, body.GunKind,
            body.GunPosition, body.State, body.Consideration
        ];

        connection.query(sql, args, function(err, results, fields) {
            if (err) {
                res.sendStatus(500);
                console.log('error');
                return;
            }
            res.sendStatus(200);
        });
    });
    form.parse(req);
});
app.listen(5027);