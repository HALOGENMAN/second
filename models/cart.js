const fs = require("fs")
const path = require("path")

const p = path.join(__dirname,"..","data","cart.json");

const getProductsFromFile= (cb)=>{
    fs.readFile(p,(err,fileContent)=>{
        if(err){
            return cb({});
        }
        else{
            cb(JSON.parse(fileContent));
        }
    })
}

module.exports = class Cart{
    static addProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
          let cart = { products: [], totalPrice: 0 };
          if (!err) {
            cart = JSON.parse(fileContent);
          }
          // Analyze the cart => Find existing product
          const existingProductIndex = cart.products.findIndex(
            prod => prod.id === id
          );
          const existingProduct = cart.products[existingProductIndex];
          let updatedProduct;
          // Add new product/ increase quantity
          if (existingProduct) {
            updatedProduct = { ...existingProduct };
            updatedProduct.qty = updatedProduct.qty + 1;
            cart.products = [...cart.products];
            cart.products[existingProductIndex] = updatedProduct;
          } else {
            updatedProduct = { id: id, qty: 1 };
            cart.products = [...cart.products, updatedProduct];
          }
          cart.totalPrice = cart.totalPrice + +productPrice;
          fs.writeFile(p, JSON.stringify(cart), err => {
            console.log(err);
          });
        });
    }

    static deleteProduct(id,price){
        getProductsFromFile(cart=>{
            const updatedCart = {...cart};
            const cartProduct = updatedCart.products.find(prod=>prod.id === id);
            if(!cartProduct){
                return;
            }
            updatedCart.totalPrice = updatedCart.totalPrice - cartProduct.qty*(+price);
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);  
            fs.writeFile(p,JSON.stringify(updatedCart),(err)=>{
                console.log(err);
            });
        });
    }

    static getCart(cb){
        getProductsFromFile(cb);
    }
}