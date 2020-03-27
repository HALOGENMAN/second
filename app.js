const express = require("express");
const User = require("./models/user")
const mongoose = require("mongoose");
const session = require("express-session");
const mongodbSessionStore = require("connect-mongodb-session")(session);

const csrf = require("csurf");

const MONGODB_URI = "mongodb+srv://shayak:159951sm357753@cluster0-fidtq.mongodb.net/shop";

const app = express();
const store = new mongodbSessionStore({
    uri: MONGODB_URI,
    collection:'sessions',
});
const cserProtection = csrf();

const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
//const mongoConnect = require("./util/database").MongoConnect; //database 

const errorController = require('./controllers/error');

const bodyParse = require("body-parser")

app.set("view engine","ejs");
app.set("views","views");
app.use(express.static("public"));
app.use(bodyParse.urlencoded({extended:false}))
app.use(session({secret:'my secret', resave:false , saveUninitialize: false,store:store }));//this is important
app.use(cserProtection); 
//'5e75c01ea2b5de1cecbd3df3'
app.use((req, res, next) => {
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        req.user = user;  
        next();
      })
      .catch(err => console.log(err));
});
app.use((req,res,next)=>{
    res.locals.csrfToken = req.csrfToken();
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

app.use("/admin",adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose.connect(MONGODB_URI)
.then( () => {
    console.log("connected!")
    app.listen(3000);
})
.catch(err=>console.log(err));


//ip address 47.247.214.173