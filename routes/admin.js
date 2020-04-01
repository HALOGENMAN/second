const path = require('path');

const { check , body } = require('express-validator')

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

const isAuth = require("../middleware/is-auth").isAuth1;



// /admin/add-product => GET
router.get('/add-product',isAuth,adminController.getAddProduct);

// // /admin/add-product => POST
 router.post('/add-product',[
    body('title','invalid title')
    .isString()
    .isLength({min:3})
    .trim()
    ,
    body('price','enter numeric value')
    .isFloat()
    ,
    body('description','need characters between 5 to 200')
    .isLength({min:5,max:200})
    .trim()
 ], isAuth,adminController.postAddProduct);

router.get("/edit-product/:productId",isAuth,adminController.getEditProduct);

router.post("/edit-product",[
    body('title','invalid title')
    .isString()
    .isLength({min:3})
    .trim()
    ,
    body('productId')
    .trim()
    ,
    body('price','enter numeric value')
    .isFloat()
    ,
    body('description','need characters between 5 to 200')
    .isLength({min:5,max:200})
    .trim()
],isAuth,adminController.postEditProduct);

router.get("/products", isAuth,adminController.getProducts);

router.post("/delete-product", isAuth ,adminController.postDeleteProduct);

module.exports = router;
