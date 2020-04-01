const Product = require('../models/product');
//const Cart = require("../models/cart")
const mongodb = require("mongodb")
//const User = require("../models/user")

const { validationResult } = require('express-validator')

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing:false,
      editing2:false,
      errorMessage:null,
      oldInput:{
        title : '',
        imageUrl: '',
        price: '',
        description: '',
      },
      validateError:[]
    });
};

exports.postAddProduct = (req, res, next) => {
    const errors = validationResult(req);
    
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    
    if(!image){
      return res.status(422).render('admin/edit-product',{
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing:false,
        editing2:false,
        errorMessage:'invalid image',
        oldInput:{
          title : title,
          price:price,
          description:description,
        },
        validateError: []
      })
    }

    const imageUrl = image.path;

    if(!errors.isEmpty()){
      return res.status(422).render('admin/edit-product',{
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing:false,
        editing2:false,
        errorMessage:errors.array()[0].msg,
        oldInput:{
          title : title,
          imageUrl: imageUrl,
          price:price,
          description:description,
        },
        validateError: errors.array()
      })
    }
    const product = new Product({
      title:title,
      price:price,
      description:description,
      imageUrl:imageUrl,
      userId:req.user,
    });
    product.save()
    .then(result => {
      console.log("product created")
      res.redirect('/');
    })
    .catch(err => {
      // return res.status(422).render('admin/edit-product',{  //we can actually do this but this is not a good approch
      //   pageTitle: 'Add Product',
      //   path: '/admin/add-product',
      //   editing:false,
      //   editing2:false,
      //   errorMessage:'database operation failed',
      //   oldInput:{
      //     title : title,
      //     imageUrl: imageUrl,
      //     price:price,
      //     description:description,
      //   },
      //   validateError: []
      // })
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
    
  };

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode){
    return res.redirect("/")
  }
  const productId = req.params.productId;
  Product.findById(productId)
  .then(product=>{
    if(!product){
      return res.redirect("/");
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing:editMode,
      errorMessage:null,
      product:product,
      validateError:[],
      editing2: false,
      productId:null,
    });
  })
  .catch(err=>{
    console.log(err)
    const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
  });
  
};
var mongoose = require('mongoose');

exports.postEditProduct = (req,res,next) => {
  const productId = req.body.productId;
  const UpdatedTitle = req.body.title;
  const image = req.body.image;
  const UpdatedPrice = req.body.price;
  const UpdatedDescription = req.body.description;

  // if(!image){
  //   return res.status(422).render('admin/edit-product',{
  //     pageTitle: 'Add Product',
  //     path: '/admin/add-product',
  //     editing:false,
  //     editing2:false,
  //     errorMessage:'invalid image',
  //     oldInput:{
  //       title : title,
  //       price:price,
  //       description:description,
  //     },
  //     validateError: []
  //   })
  // }
  
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(productId)
    return res.status(422).render('admin/edit-product',{
      pageTitle: 'Edit Product',
      path: '/admin/add-product',
      editing:false,
      editing2: true,
      productId:productId,
      errorMessage:errors.array()[0].msg,
      oldInput:{
        title : UpdatedTitle,
        price:UpdatedPrice,
        description:UpdatedDescription,
      },
      validateError: errors.array()
    })
  }

  Product.findById(productId)
  .then(product=>{
    if(product.userId.toString() !== req.user._id.toString()){
      return res.redirect('/')
    }
    product.title = UpdatedTitle;
    product.price = UpdatedPrice;
    product.description = UpdatedDescription;
    if(image){
      product.imageUrl = image.path;
    }
    return product.save()
    .then(()=>{
      res.redirect("/admin/products");
    })
    .catch(err=>{
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  }) 
}

exports.getProducts = (req,res,next) =>{
  Product.find({userId:req.user._id})
  //.select("title proce -_id")
  //.populate("userId ","name")
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin products',
      path: '/admin/products',
    });
  })
  .catch( err =>{
    console.log(err);
    const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
  });
}

exports.postDeleteProduct = (req,res,next) =>{
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId,userId:req.user._id })
    .then(()=>{
      console.log("deleted")
      res.redirect('/admin/products');
    })
    .catch(err=>{
      console.log(err)
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })
}

