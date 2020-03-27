const User = require("../models/user");
const bcrypt = require('bcryptjs');

exports.getLogin = (req,res,next)=>{
    // const isLoggedIn = req.get('Cookie').split('=')[1] === 'true';
    console.log(req.session.isLoggedIn)
    res.render("auth/login",{
        path:"/login",
        pageTitle:"Login",
    });
}

exports.postLogin = (req,res,next)=>{
    // res.setHeader("Set-Cookie","loggedIn=true") //this is for sending cookies

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email:email})
    .then(user => {
        if(!user){
            return res.redirect("/login")
        }
        return bcrypt.compare(password,user.password)
        .then(doMatch=>{
            if(doMatch){
                req.session.user = user;
                req.session.isLoggedIn = true;
                req.session.save(err =>{
                    console.log(err);
                    res.redirect("/");
                })
            }
            else{
                res.redirect("/login")
            }    
        })
        .catch(err=>{
            console.log(err)
            res.redirect("/login")
        })  
    })
    .catch(err => console.log(err));
}

exports.postLogout = (req,res,next)=>{
        req.session.destroy((err)=>{
            console.log(err);
            res.redirect("/");
        });
}

exports.getSignup = (req,res,next) => {
    res.render("auth/signup",{
        pageTitle:'SignUp',
        isAuthenticated:req.session.isLoggedIn,
        path:'/signup'
    })
};

exports.postSignup = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confrmPassword = req.body.confrmPassword;
    if(password === confrmPassword){}
    User.findOne({email:email})
    .then(userDoc=>{
        if(userDoc){
            console.log("user exist")
            return res.redirect("/signup");
        }
        return bcrypt.hash(password,12)
        .then(hashPassword=>{
            user = new User({
                email:email,
                password:hashPassword,
                cart:{ items:[] }
            });
            return user.save()
        })
        .then(result=>{
            console.log("user Created")
            res.redirect("/login");
        })  
    })
    .catch(err=> console.log(err));
}
