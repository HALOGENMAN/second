const express = require("express");
const User = require("./models/user")
const mongoose = require("mongoose");
const session = require("express-session");
const path = require('path')
const multer = require('multer');
const mongodbSessionStore = require("connect-mongodb-session")(session);

const csrf = require("csurf"); //VIP for forms and request
const flash = require("connect-flash");//desplaying error message

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

const errorRouter = require('./routes/error');

const bodyParse = require("body-parser")

const fileStorage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'images');
    } ,
    filename:(req,file,cb)=>{
    
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const fileFilter = (req,file,cb) =>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' ){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
    
}

app.set("view engine","ejs");
app.set("views","views");
app.use(express.static("public"));
app.use("/images",express.static("images"));
app.use(bodyParse.urlencoded({extended:false}))
app.use(multer({storage: fileStorage, }).single('image'));
app.use(session({secret:'my secret', resave:false , saveUninitialize: false,store:store }));//this is important
app.use(cserProtection); 
//'5e75c01ea2b5de1cecbd3df3'

app.use((req,res,next)=>{
    res.locals.csrfToken = req.csrfToken();
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});
app.use(flash());
app.use((req, res, next) => {
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        req.user = user;  
        next();
      })
      .catch(err =>{
          next(new Error(err))
      });
});


app.use("/admin",adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorRouter);

app.use((error,req,res,next)=>{
    res.redirect('/500');
})

mongoose.connect(MONGODB_URI)
.then( () => {
    console.log("connected!")
    app.listen(3000);
})
.catch(err=>console.log(err));


//ip address 47.247.214.173