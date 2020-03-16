const Product = require('../models/product');
const Cart = require("../models/cart")

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

    const product = new Product(title,price,description,imageUrl);
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
  Product.findById(productId,product=>{
    if(!product){
      return res.redirect("/");
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing:editMode,
      product:product,
    });
  });
  
};

exports.postEditProduct = (req,res,next) => {
  const prodId = req.body.id;
  const UpdatedTitle = req.body.title;
  const UpdatedImageUrl = req.body.imageUrl;
  const UpdatedPrice = req.body.price;
  const UpdatedDescription = req.body.description;
  const UpdatedProduct = new Product(prodId,UpdatedTitle,UpdatedImageUrl,UpdatedDescription,UpdatedPrice);
  UpdatedProduct.save();
  res.redirect("/admin/products");
}

exports.getProducts = (req,res,next) =>{
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin products',
      path: '/admin/products',
    });
  });
}

exports.postDeleteProduct = (req,res,next) =>{
  const id = req.body.productId;
  const price = req.body.productPrice;
  console.log(id);
  Product.deleteById(id);
  Cart.deleteProduct(id,price);
  res.redirect("/admin/products");
}

