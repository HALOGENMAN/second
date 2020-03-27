const Product = require('../models/product');
const Order = require('../models/order');
const User = require("../models/user")

exports.getProducts = (req, res, next) => {
  Product.find()
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
  Product.findById(prodId)
  .then(product=>{
    res.render("shop/product-detail",{
      product:product,
      path:"/products",
      pageTitle:product.title,
    })
  }) 
  .catch(err=>{
    console.log(err)
  });
};

exports.getIndex = (req,res,next)=>{
  Product.find()
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
  req.user.populate("cart.items.productId")
  .execPopulate()
    .then(user => {
      product = user.cart.items;
      res.render("shop/cart",{
        pageTitle:"your cart",
        path:"/cart",
        products: product,
      })
    })
    .catch(err=>console.log(err));
}

exports.postCart = (req,res,next)=>{
  const productId = req.body.productId;
  Product.findById(productId)
    .then(product =>{
      return req.user.addProduct(product);
  })
  .then(result=>{
    res.redirect("/cart")
  })
  .catch(err => console.log(err));
  
}

exports.getOrders = (req,res,next)=>{
  res.render("shop/orders",{
    pageTitle:"your Orders",
    path:"/orders",
  });
}

exports.getCheckout = (req,res,next)=>{
  res.render("shop/checkout",{
    pageTitle:"checkout",
    path:"/checkout",
    isAuthenticated: req.session.isLoggedIn,
  });
}

exports.postCartRemoveItem = (req,res,next) => {
  const prodId = req.body.productId;
  req.user.deleteCartItems(prodId)
  .then(()=>{
    console.log("item removed")
    res.redirect("/cart")
  })
  .catch(err=>consile.log(err))
}

exports.getOrder = (req,res,next)=>{
  Order.find({"user.userId":req.user._id})
  .then(orders=>{
    console.log(orders)
    res.render("shop/orders",{
      pageTitle:"Your Order",
      path:"/orders",
      orders: orders,
    })
  })
  .catch(err=>console.log(err));
}

exports.postOrder = (req,res,next)=>{
  req.user.populate("cart.items.productId")
  .execPopulate()
  .then(user=>{
    const products = user.cart.items.map(i=>{
      return {quantity:i.quantity,product:{ ...i.productId._doc }}
    }); 
    const order = new Order({
      user:{
        email:req.user.email,
        userId: req.user
      }, 
      products: products
    });
    return order.save()
  })
  .then(()=>{
    return req.user.clearCart()
  })
  .then(()=>{
    res.redirect("/create-order")
  })
  .catch(err=>console.log(err))
    
}