var express= require('express');
var router = express.Router();

/*
* Get/
*/

router.get('/', function(req,res){
    res.render('index', {
        title: 'Home'
    });
});


/*
* Get/
*/

router.get('/categories', function(req,res){
    res.render('categories', {
        title: 'Home'
    });
});

/*
* Get/
*/

router.get('/carts', function(req,res){
    res.render('carts', {
        title: 'Home'
    });
});
/*
* Get/
*/

router.get('/products', function(req,res){
    res.render('products', {
        title: 'Home'
    });
});
/*
* Get/
*/

router.get('/login', function(req,res){
    res.render('login', {
        title: 'Home'
    });
});
/*
* Get/
*/

router.get('/contacts', function(req,res){
    res.render('contacts', {
        title: 'Home'
    });
});

//export
module.exports = router;