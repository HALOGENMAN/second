const getDb = require("../util/database").getDb;

module.exports = class Product {
    constructor(title,price,description,imageUrl){
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    save(){
        const db = getDb();
        return db.collection("products")
            .insertOne(this)
            .then( result => {
                console.log(result)
            }) 
            .catch( err => {
                console.log(err)
            })
    }

    static fetchAll(){
        const db = getDb();
        return db.collection("products")
            .find()
            .toArray()
            .then(products => {
                console.log(products);
                return products;
            })
            .catch( err =>{
                console.log(err);
            });
    }
}


// const fs = require("fs");
// const path = require("path")
// const p = path.join(__dirname,"..","data","products.json");

// const getProductsFromFile = (cb) =>{
//     fs.readFile(p,(err,fileContent)=>{
//         if(err){
//             cb([]);
//         }
//         else{
//             cb(JSON.parse(fileContent));
//         }
//     });
// }

// module.exports = class Product {
//     constructor(id,title,imagrUrl,description,price) {
//         this.id = id;
//         this.title = title;
//         this.imageUrl=imagrUrl
//         this.description=description
//         this.price=price
//     }

//     save() {
        
//         fs.readFile(p,(err,fileContent)=>{
//             let products = [];
//             if(!err){
//                 products = JSON.parse(fileContent);
//             }
//             if(this.id){
//                 const existingProductIndex = products.findIndex(prod => prod.id === this.id);
//                 const updatedProduct = [...products];
//                 updatedProduct[existingProductIndex] = this;
//                 fs.writeFile(p,JSON.stringify(updatedProduct),(err)=>{
//                     console.log(err)
//                 });
//             }
//             else{
//                 this.id = Math.random().toString();
//                 products.push(this);
//                 fs.writeFile(p,JSON.stringify(products),(err)=>{
//                     console.log(err)
//                 });
//             }
            
//         });
//     }

//     static deleteById(id){
//         getProductsFromFile(products=>{
//             const updatedProduct = products.filter(prod => prod.id !== id);
//             fs.writeFile(p,JSON.stringify(updatedProduct),(err)=>{
//                 console.log(err)
//             });
//         });
//     }

//     static fetchAll(cb) {
//         getProductsFromFile(cb)
//     }

//     static findById(id,cb){
//         getProductsFromFile(products =>{
//             const product = products.find(p => p.id === id);
//             cb(product);
//         });
//     }
// }

