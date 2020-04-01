const User = require("../models/user");
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator')

const sendgridTransport = require('nodemailer-sendgrid-transport');


const transport = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key: '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',
    }
}));

exports.getLogin = (req,res,next)=>{
    // const isLoggedIn = req.get('Cookie').split('=')[1] === 'true'
    let message = req.flash('error')
    if(message.length > 0){
        message = message[0];
    }
    else{
        message= null;
    }
    res.render("auth/login",{
        path:"/login",
        pageTitle:"Login",
        errorMessage:message,
        oldInput:{
            email: '',
            password: '',
        },
        validateError:[]
    });
}

exports.postLogin = (req,res,next)=>{
    // res.setHeader("Set-Cookie","loggedIn=true") //this is for sending cookies

    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        
        return res.status(422).render("auth/login",{
            pageTitle:'logIn',
            isAuthenticated:req.session.isLoggedIn,
            path:'/login',
            errorMessage:errors.array()[0].msg,
            oldInput:{
                email: email,
                password: password,
            },
            validateError:errors.array()
        });
    }
    User.findOne({email:email})
    .then(user => {
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
                res.status(422).render("auth/login",{
                    pageTitle:'logIn',
                    isAuthenticated:req.session.isLoggedIn,
                    path:'/login',
                    errorMessage:'Invalid email or Password',
                    oldInput:{
                        email: email,
                        password: password,
                    },
                    validateError:errors.array()
                });
            }    
        })
        .catch(err=>{
            console.log(err)
            res.redirect("/login")
        })  
    })
    .catch(err =>{ 
        console.log(err)
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
    
}

exports.postLogout = (req,res,next)=>{
        req.session.destroy((err)=>{
            console.log(err);
            res.redirect("/");
        });
}

exports.getSignup = (req,res,next) => {
    let message = req.flash('error')
    if(message.length > 0){
        message = message[0];
    }
    else{
        message= null;
    }
    res.render("auth/signup",{
        pageTitle:'SignUp',
        isAuthenticated:req.session.isLoggedIn,
        path:'/signup',
        errorMessage:message,
        oldInput:{
            email: '',
            password: '',
            confirmPassword: '',
        },
        validateError:[]
    })
};

exports.postSignup = (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render("auth/signup",{
            pageTitle:'SignUp',
            isAuthenticated:req.session.isLoggedIn,
            path:'/signup',
            errorMessage:errors.array()[0].msg,
            oldInput:{
                email: email,
                password: password,
                confirmPassword: req.body.confirmPassword,
            },
            validateError:errors.array()
        });
    }
    
        bcrypt.hash(password,12)
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
            return transport.sendMail({
                to:email,
                from:'au159951@gmail.com',
                subject:'signUp succeeded',
                html:'<h1> thanks for using this website </h1>'
            })  
        }) 
        .catch(err =>{ 
            console.log(err)
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });   
}

exports.getReset = (req,res,next) =>{
    let message = req.flash('error')
    if(message.length > 0){
        message = message[0];
    }
    else{
        message= null;
    }
    res.render("auth/reset",{
        pageTitle:'reset Password',
        isAuthenticated:req.session.isLoggedIn,
        path:'/reset',
        errorMessage:message,
    });
} 

exports.postReset = (req,res,next) => {
    const email = req.body.email;
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err);
            return res.redirect("/reset");
        }
        const token = buffer.toString('hex');
        User.findOne({email:email})
        .then(user=>{
            if(!user){
                req.flash('error', 'no account with that email')
                return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
        })
        .then(result=>{
            res.redirect('/');
            return transport.sendMail({
                to:email,
                from:'au159951@gmail.com',
                subject:'Password reset',
                html:`
                    <p> You requested password reset </p>
                    <p> Click this link <a href="http://localhost:3000/reset/${token}">link</a> </p>
                `
            })  
        })
        .catch(err =>{ 
            console.log(err)
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    })
}

exports.getNewPassword = (req,res,next)=>{
    const token = req.params.token;
    User.findOne({ resetToken:token,resetTokenExpiration: { $gt:Date.now() } })
    .then(user=>{
        let message = req.flash('error')
        if(message.length > 0){
            message = message[0];
        }
        else{
            message= null;
        }
        res.render('auth/new-password',{
            pageTitle:'New Password',
            isAuthenticated:req.session.isLoggedIn,
            path:'/new-password',
            errorMessage:message,
            userId:user._id.toString(),
        });
    })
    .catch(err =>{ 
        console.log(err)
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
    
}

exports.postNewPassword = (req,res,next) => {
    const userId = req.body.userId;
    const newPassword = req.body.password;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('auth/new-password',{
            pageTitle:'New Password',
            isAuthenticated:req.session.isLoggedIn,
            path:'/new-password',
            errorMessage:errors.array()[0].msg,
            userId:user._id.toString(),
        });
    }
    User.findOne({_id:userId})
    .then(user=>{
        return bcrypt.hash(newPassword,12)
        .then(hashNewPassword=>{
            user.password = hashNewPassword;
            user.resetTokenExpiration = undefined;
            user.resetToken = undefined;
            return user.save();
        })
        .then(()=>{
            res.redirect('/login')
        })
    })
    .catch(err =>{ 
        console.log(err)
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}