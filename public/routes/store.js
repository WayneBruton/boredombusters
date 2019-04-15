const express = require('express');
const router = express.Router();
const pool = require('../routes/connection');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.ENCRYPTION_SECRET);


router.get('/products', (req, res) => {
    let mysql = 'select * from products where available = true'
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            resizeBy.send('Error with connection');
        }
        connection.query(mysql, function (error, result) {
            if (error) throw error;
            res.send(result);
        });
        connection.release();
    });
})

router.get('/getProduct/:id', (req, res) => {
    let id = parseInt(req.params.id);
    let mysql = `select * from products where id = ${id}`

    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            resizeBy.send('Error with connection');
        }
        connection.query(mysql, function (error, result) {
            if (error) throw error;
            res.send(result);
        });
        connection.release();
    });
})

router.get('/getCart/:id', (req, res) => {
    let id = parseInt(req.params.id);
    let mysql = `select * from products where id = ${id}`

    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            resizeBy.send('Error with connection');
        }
        connection.query(mysql, function (error, result) {
            if (error) throw error;
            res.send(result);
        });
        connection.release();
    });
})




module.exports = router;