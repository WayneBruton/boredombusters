const express = require('express');
const router = express.Router();
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.ENCRYPTION_SECRET);


router.get('/', function (req, res) {
    var title = 'Suburbs Directory - Home'
    var color = '';
    var navBarType = 'navbar-dark bg-dark';
    var backgroundColor = 'background-color: #4267b4;"'
    res.render('../views/index');
}); 

router.get('/about', function (req, res) {
    res.render('../views/menuViews/about', {
        title: 'About'
    });
});
router.get('/terms', function (req, res) {
    res.render('../views/menuViews/terms', {
        title: 'Terms'
    });
});

router.get('/shop', function (req, res) {
    res.render('../views/menuViews/store', {
        title: 'Our Store'
    });
});
router.get('/mailingList', function (req, res) {
    res.render('../views/menuViews/mailing', {
        title: 'Join List'
    });
});
router.get('/contact', function (req, res) {
    res.render('../views/menuViews/contact', {
        title: 'Contact Us'
    });
});
router.get('/science', function (req, res) {
    res.render('../views/menuViews/science', {
        title: 'Why??'
    });
});



module.exports = router;