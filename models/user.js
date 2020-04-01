const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart:{
        items:[{
            productId: {
                type: Schema.Types.ObjectId,
                ref:"Products",
                required:true 
            },
            quantity:{
                type:Number,
                required:true
            }
        }],
        
    }
});

userSchema.methods.addProduct = function(product){
    const cartProductIndex = this.cart.items.findIndex(cp=>{
        return cp.productId.toString() === product._id.toString() 
    })
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if(cartProductIndex >=0){
        newQuantity = updatedCartItems[cartProductIndex].quantity + newQuantity;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    }
    else{
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity,
        });
    }
    const updatedCart ={
        items : updatedCartItems
            }
    
    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.deleteCartItems = function(productId){
    const updatedItems = this.cart.items.filter(i=> { return i.productId.toString()  !==  productId.toString()})
    this.cart.items = updatedItems;
    return this.save();
}

userSchema.methods.clearCart = function(){
    this.cart = {items:[]};
    return this.save();
}

module.exports = mongoose.model("User",userSchema);

// const getDb = require("../util/database").getDb;
// const mongodb = require("mongodb")


// const ObjectId = mongodb.ObjectID;

// module.exports = class User{
//     constructor(name,email,cart,id){
//         this.name = name;
//         this.email = email;
//         this.cart = cart;
//         this._id = id;
//     }

//     addProduct(product){
//         const cartProductIndex = this.cart.items.findIndex(cp=>{
            
//             return cp.productId.toString() === product._id.toString() 
//         })
//         let newQuantity = 1;
//         const updatedCartItems = [...this.cart.items];
//         if(cartProductIndex >=0){
//             newQuantity = updatedCartItems[cartProductIndex].quantity + newQuantity;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         }
//         else{
//             updatedCartItems.push({
//                 productId: new ObjectId(product._id),
//                 quantity: newQuantity,
//             });
//         }
//         const updatedCart ={
//             items : updatedCartItems
//         }
//         const db = getDb();
//         return db.collection("users")
//         .updateOne({_id: new ObjectId(this._id)},{ $set:{cart:updatedCart } })
//         .then(result=>{
//             return result;
//         })
//         .catch(err=>{
//             console.log(err);
//         });
//     }

    
//     save(){
//         const db = getDb();
//         return db.collection("users")
//         .insertOne(this)
//         .then(user=>{
//             console.log("user created")
//         })
//         .catch(err=> console.log(err));
//     }

//     getCart(){
//         const productIds = this.cart.items.map(i => i.productId);
//         const db = getDb();
//         return db.collection("products")
//         .find({ _id: { $in : productIds }})
//         .toArray()
//         .then(products=>{
//             return products.map(p =>{
//                 return {
//                     ...p,
//                     quantity: this.cart.items.find( i=> i.productId.toString() === p._id.toString() ).quantity
//                 }
//             })
//         })
//         .catch(err=>console.log(err))
//     }

//     deleteCartItems(productId){
//         const updatedItems = this.cart.items.filter(i=> { return i.productId.toString()  !==  productId.toString()})
        
//         const db = getDb();
//         return db.collection("users")
//         .updateOne({_id: new ObjectId(this._id)},{ $set:{cart:{items:updatedItems}} })
//         .then(result=>{
//             return result;
//         })
//         .catch(err=>{
//             console.log(err);
//         });
//     }

//     static findById(userId) {
//         const db = getDb();
//         return db
//           .collection('users')
//           .findOne({ _id: new ObjectId(userId) })
//           .then(user => {
//             //console.log(user);
//             return user;
//           })
//           .catch(err => {
//             console.log(err);
//           });
//     }

//     addOrder(){
//         const db = getDb()
//         return this.getCart()
//         .then(product=>{
//             const order={
//                 items: product.map(p=>{
//                     return {
//                         _id: new ObjectId(p._id),
//                         price: p.price,
//                         title: p.title,
//                         quantity:p.quantity
//                     }
//                 }),
//                 user: {
//                     _id: new ObjectId(this._id),
//                     name: this.name,
//                     email: this.email
//                 }
//             }
//             return db.collection("orders")
//             .insertOne(order)
//             .then(result=>{
//                 this.cart = { items:[] };
//                 return db.collection("users")
//                 .updateOne({_id: new ObjectId(this._id)},{ $set: {cart : { items:[] }} })
//             })
//         })
//         .then(()=>{
//             console.log("order done")
//         })
//         .catch(err=>console.log(err));
//     }

//     getOrders(){
//         const db = getDb();
//         return db.collection("orders")
//         .find({'user._id':new ObjectId(this._id)})
//         .toArray()
//         .then(result=>{
//             return result;
//         })
//         .catch(err=>{
//             console.log(err);
//         })
//     }
//     // static findById(userId){
//     //     const  id = new mongodb.ObjectID(userId);
//     //     const db = getDb()
//     //     return db.collection("users")
//     //     .findOne({ _id: id}) //if you use findOne then you not need to use next one
//     //     .then(user=>{
//     //         console.log(user)
//     //         return user;
//     //     })
//     //     .catch(err=>{
//     //         console.log(err)
//     //     })
//     // }
// }