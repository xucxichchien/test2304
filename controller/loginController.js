const  express = require("express");
const  router = express.Router();
const fs = require("fs");


//-------------------------------------------
router.get( "/" , (req, res) => {
    data = fs.readFileSync("login.hbs");
    pageContent = data.toString();
    res.send(pageContent);
});

router.get( "/1nguoi" , (req, res) => {
    pageContent = "1 nguoi !!!";
    res.send(pageContent);
});

router.get( "/2nguoi" , (req, res) => {
    pageContent = "2 nguoi !!!";
    res.send(pageContent);
});

//-------------------------------------------
exports.LoginRouter = router;