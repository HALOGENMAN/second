const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All products',
      path: '/products',
      hasProducts: products.length > 0,
    });
  })
  .catch(err=>{
    console.log(err)
  });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId; 
  Product.findById(prodId,product=>{
    res.render("shop/product-detail",{
      product:product,
      path:"/products",
      pageTitle:product.title,
    })
  });
};

exports.getIndex = (req,res,next)=>{
  Product.fetchAll()
  .then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'home',
      path: '/',
      hasProducts: products.length > 0,
    });
  })
  .catch(err=>{
    console.log(err)
  });
}

exports.getCart = (req,res,next)=>{
  Cart.getCart(cart => {
    Product.fetchAll(products=>{
      const cartProducts = []
      for(product of products){
        const cartProductData = cart.products.find( prod => prod.id === product.id );
        if(cartProductData){
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart",{
        pageTitle:"your cart",
        path:"/cart",
        products: cartProducts,
      });
    });    
  });
  
}

exports.postCart = (req,res,next)=>{
  const productId = req.body.productId;
  console.log(productId);
  Product.findById(productId,product =>{
    Cart.addProduct(productId,product.price);
  });
  res.redirect("/cart")
}

exports.getOrders = (req,res,next)=>{
  res.render("shop/orders",{
    pageTitle:"your Orders",
    path:"/orders"
  });
}

exports.getCheckout = (req,res,next)=>{
  res.render("shop/checkout",{
    pageTitle:"checkout",
    path:"/checkout"
  });
}

exports.postCartRemoveItem = (req,res,next) => {
  const prodId = req.body.productId;
  const prodPrice = req.body.productPrice;
  Cart.deleteProduct(prodId,prodPrice);
  res.redirect("/cart")
}