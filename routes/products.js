var express= require('express');
var router = express.Router();

//get product model
var Product = require('./model/product');
var Category =require('./model/category');

//get all prod
router.get('/', function(req,res){
    Product.find(function(err, products){
        if(err)
        console.log(err);

        res.render('all_products', {
            title: 'All products',
            products: products
        })
    })
})

//get prod by cate
router.get('/:category', function(req, res){
    var categorySlug = req.params.category;
    Category.findOne({slug: categorySlug}, function(err, c){
        Product.find( {category: categorySlug}, function(err, products){
            if (err)
            console.log(err);

            res.render('cat_products',{
                title: c.title,
                products: products
            });
        });
    });
});

//get prod by cate
router.get('/:category/:product', function(req, res){
    var g
});

//export
module.exports = router;