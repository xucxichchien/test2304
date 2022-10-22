var express= require('express');
var router = express.Router();
var expressValidator = require('express-validator');
var fs = require('fs-extra');
var resizeImg = require('resize-img');
var mkdirp = require('mkdirp');

//get prod model
var Product = require('../model/product');
//get cate model
var Category = require('../model/category');
const { readSync } = require('fs-extra');
const product = require('../model/product');

/*
* GET product index
*/

router.get('/', function(req, res){
 var count;

 Product.count(function(err, c){
    count = c;
 });
Product.find(function(err, products){
    res.render('admin/products',{
        products: products,
        count: count
    });
});
    
});

/*
* GET add product
*/

router.get('/add-product', function(req, res){
   
    var title = '';
    var desc = '';
    var price = '';


    Category.find(function(err, categories){
        res.render('admin/add_product', {
            title: title,
            desc: desc,
            categories: categories,
            price: price
        });
    });
 
    
});

/*
* POST add prod
*/

router.post('/add-product', function(req, res){
       
    var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";

   req.checkBody('title', 'title must have a value').notEmpty();
   req.checkBody('desc', 'Desc must have a value').notEmpty();
   req.checkBody('price', 'Price must have a value').isDecimal();
   req.checkBody('image', 'U must upload an image').isImage(imageFile);

   var title = req.body.title;
    slug =  title.replace(/\/s+/g, '-').toLowerCase();
   var desc = req.body.desc;
   var price = req.body.price;     
   var category = req.body.category;
  

   

   var errors = req.validationErrors();

   if (errors) {  
    console.log('pls input smth');
    Category.find(function(err, categories){
        res.render('admin/add_product', {
            errors: errors,
            title: title,
            desc: desc,
            categories: categories,
            price: price
        });
    });
   } else {
    Product.findOne({slug: slug}, function(err, product){
        if (product) {
            req.flash('danger', 'Product title exist, choose another one');
            Category.find(function(err, categories){
                res.render('admin/add_product', {
                    title: title,
                    desc: desc,
                    categories: categories,
                    price: price
                });
            });
        }
        else {
            var price2 = parseFloat(price).toFixed(2);
            var product = new Product({
                title: title,
                slug: slug,
                desc: desc,
                price: price2,
                category: category,
                image: imageFile
            });

            product.save(function(err){
                if (err) return console.log(err);

                mkdirp('public/product_images/' + product._id, function(err){
                    return console.log(err);
                });
                mkdirp('public/product_images/' + product._id + '/gallery', function(err){
                    return console.log(err);
                });
                mkdirp('public/product_images/' + product._id +'/gallery/thumbs', function(err){
                    return console.log(err);
                });
        
                if(imageFile != ""){
                    var productImage = req.files.image;
                    var path = 'public/product_images/' + product._id + '/' +imageFile;

                    productImage.mv(path, function(err){
                        return console.log(err);
                    });
                }
                
                Product.find(function(err,products){
                    if (err) {
                        console.log(err);
                    }else {
                        req.app.locals.products = products;
                    }
                });


                res.redirect('/admin/products');
            });
        }
    });
   }

    
});


  /*
* GET edit prod
*/

router.get('/edit-product/:id', function(req, res){

    var errors;

    if(req.session.errors) errors = req.session.errors;
    req.session.errors = null;
   
    Category.find( function(err, categories){
        Product.findById(req.params.id, function(err, p){
            if (err){
                console.log(err);
                res.redirect('/admin/products');
            } else {
                var galleryDir = 'public/product_images/' + p._id +'/gallery';
                var galleryImages = null;

                fs.readdir(galleryDir, function(err, files){
                    if(err){
                        console.log(err);
                    } else {
                        galleryImages = files;

                        res.render('admin/edit_product', {
                            title: p.title,
                            errors: errors,
                            desc: p.desc,
                            categories: categories,
                            category: p.category.replace(/\s+/g, '-').toLowerCase(),
                            price: parseFloat(p.price).toFixed(2),
                            image: (p.image),
                            galleryImages: galleryImages,
                            id: p._id
                        })
                        
                        }
                })
            };
            });
        });
    });

       
        





/*
* POST edit prod
*/

router.post('/edit-product/:id', function(req, res){

       
        var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";
    
       req.checkBody('title', 'title must have a value').notEmpty();
       req.checkBody('desc', 'Desc must have a value').notEmpty();
       req.checkBody('price', 'Price must have a value').isDecimal();
       req.checkBody('image', 'U must upload an image').isImage(imageFile);
    
       var title = req.body.title;
        slug =  title.replace(/\/s+/g, '-').toLowerCase();
       var desc = req.body.desc;
       var price = req.body.price;     
       var category = req.body.category;
       var pimage = req.body.pimage;
       var id = req.params.id;

      
    
    
       var errors = req.validationErrors();

       if (errors){
        req.session.errors = errors;
        res.redirect('/admin/products/edit-product/'+id);
       } else {
        Product.findOne({slug: slug, _id:{'$ne':id}}, function(err, p){
            if (err) console.log (err);

            if (p) {
                req.flash('danger', 'product title existed');
                res.redirect('/admin/products/edit-product/'+id);
            }
            else{
                Product.findById(id, function(err, p){
                    if (err)
                    console.log(err);

                    p.title = title;
                    p.slug = slug;
                    p.desc = desc;
                    p.price = parseFloat(price).toFixed(2);
                    p.category = category;
                    if(imageFile != ""){
                        p.image = imageFile;
                    }

              

                    p.save(function(err){
                        if(err)
                        console.log(err);

                        if(imageFile != ""){
                            if(pimage != ""){
                                fs.remove('public/product_image/'+id+'/'+pimage, function(err){
                                    if (err)
                                    console.log(err);
                                });
                            }
                                  
                            var productImage = req.files.image;
                            var path = '/public/product_images/'+id+'/'+imageFile;

                            productImage.mv(path, function(err){
                                return console.log(err);
                            });
                        }
                        Product.find(function(err,products){
                            if (err) {
                                console.log(err);
                            }else {
                                req.app.locals.products = products;
                            }
                        });
                            req.flash('success', 'product added');
                            res.redirect('/admin/products/edit-product/'+id);
                    });
                });
            }
        });
       }
    });


 

  /*
* GET delete prod
*/

router.get('/delete-product/:id', function(req, res){
   
    var id = req.params.id;
    var path = 'public/product_images/' +id;

    fs.remove(path, function(err){
        if(err){
        console.log(err);
        } else {
            Product.findByIdAndRemove(id, function(err){
                console.log(err);
            });
            Product.find(function(err,products){
                if (err) {
                    console.log(err);
                }else {
                   req.app.locals.products = products;
                }
            });
            req.flash('success', 'product deleted');
                            res.redirect('/admin/products');
        }
    });
    
   });
//export
module.exports = router;