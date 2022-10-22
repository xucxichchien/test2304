var express = require('express');
var ejs = require('ejs');
var config = require('./config/database');
var bodyParser = require('body-parser');
var router = express.Router();
var expressValidator = require('express-validator');
router.use(expressValidator());
const fs = require("fs");
const path = require('path');
var config = require('./config/database');
var app = express();
var mongoose = require('mongoose');
var session = require('express-session');
var fileUpload = require('express-fileupload');
var mkdir = require('mkdirp');
//var passport = require('passport');

//view engine setup
app.set("view engine", 'ejs');
app.set("views", path.join(__dirname, "views"));

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

// express fileupload middleware
app.use(fileUpload());

//body parser middleware
//parse application/form-urlencoded
app.use(bodyParser.urlencoded({ extended: false}))
//parse application json
app.use(bodyParser.json())

//express session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
   // cookie: { secure: true }
  }))

  //express validator middleware
  app.use(expressValidator ({
    errorFormatter: function(param, msg, value){
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;
    while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
    }
    return{
        param : formParam,
        msg : msg,
        value : value
    };
    },

    customValidators: {
        isImage: function(value, filename) {
            var extension = (path.extname(filename)).toLowerCase();
            switch(extension) {
                case '.jpg':
                    return '.jpg';
                case '.jpeg':
                    return '.jpeg';
                case '.png':
                    return '.png';
                case '':
                    return '.jpg';
                default:
                    return false;        
                
            }
        }
    }
  }));

//express message middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
//passport config
//require('./config/passport')(passport);
//passport middleware
//app.use(passport.initialize());
//app.use(passport.session());

//set global errors variable
app.locals.errors = null;

//get page model
var Page = require('./model/page');

//get cate model
var Category = require('./model/category');

//get all category
Category.find(function(err,categories){
    if (err) {
        console.log(err);
    }else {
        app.locals.categories = categories;
    }
});

//get all product
var Product = require('./model/product');

Product.find(function(err,products){
    if (err) {
        console.log(err);
    }else {
        app.locals.products = products;
    }
});

//get pages to header.ejs
Page.find({}) .sort({sorting: 1}).exec(function(err, pages){
    if (err) {
        console.log(err);
    } else {
        app.locals.pages = pages;
    }
  });


app.listen(9898);
console.log('hehe');
//app.use(bodyParser.urlencoded({extended:true}));


//database
    mongoose.connect(config.database);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log('connected to db');
    })

//Router/Controller
app.use("/", router);
app.use("/categories", router);
app.use("/products", router);
app.use("/carts", router);
app.use("/login", router);
app.use("/contacts", router);

var pages = require('./routes/pages.js');
var adminpages = require('./routes/adminpages.js');
var admincategories = require('./routes/admincategories.js');
var adminproducts = require('./routes/adminproducts.js');

app.use('/admin/pages', adminpages);
app.use('/admin/categories', admincategories);
app.use('/admin/products', adminproducts);
app.use('/', pages);


const LoginRouter = require("./controller/loginController").LoginRouter;
app.use("/login", LoginRouter);