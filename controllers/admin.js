const Product = require('../models/product');
//const Cart = require("../models/cart")
//const mongodb = require("mongodb")
//const User = require("../models/user")

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing:false,
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description; 
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
      console.log(err);
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
      product:product,
    });
  })
  .catch(err=>{
    console.log(err)
  });
  
};

exports.postEditProduct = (req,res,next) => {
  const productId = req.body.productId;
  const UpdatedTitle = req.body.title;
  const UpdatedImageUrl = req.body.imageUrl;
  const UpdatedPrice = req.body.price;
  const UpdatedDescription = req.body.description;
  Product.findById(productId)
  .then(product=>{
    product.title = UpdatedTitle;
    product.price = UpdatedPrice;
    product.description = UpdatedDescription;
    product.imageUrl = UpdatedImageUrl;
    return product.save()
  })
  .then(()=>{
    res.redirect("/admin/products");
  })
  .catch(err=>{
    console.log(err)
  });
}

exports.getProducts = (req,res,next) =>{
  Product.find()
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
  });
}

exports.postDeleteProduct = (req,res,next) =>{
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(()=>{
      console.log("deleted")
      res.redirect('/admin/products');
    })
    .catch(err=>{
      console.log(err)
    })
  
}

