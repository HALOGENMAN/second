const express = require("express");

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const mongoConnect = require("./util/database").MongoConnect; //database 

const errorController = require('./controllers/error');

const bodyParse = require("body-parser")

app.set("view engine","ejs");
app.set("views","views");
app.use(express.static("public"));
app.use(bodyParse.urlencoded({extended:false}))

app.use("/admin",adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect( () => {
    app.listen(3000);
});


//ip address 47.247.214.173