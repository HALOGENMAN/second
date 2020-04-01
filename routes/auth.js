const exoress = require("express")
const { check, body } = require("express-validator");
const User = require('../models/user');
const router = exoress.Router();
const authController = require("../controllers/auth");

router.get("/login",authController.getLogin);

router.post("/login",[
    check('email')
    .isEmail()
    .withMessage('Please enter a valid E-mail!')
    .custom((value,{req})=>{
        return User.findOne({email:value}) //async validation
        .then(userDoc=>{ //userDoc eill return boolean value
            if(!userDoc){
                return Promise.reject('E-mail not exist');//throw error in promise
            }
        });
    })
    ,
    body('password','please enter password with atlease 5 character and only alphanumeric characters')
    .isLength({min:5})
    .isAlphanumeric()
    .trim()
],authController.postLogin);

router.post("/logout",authController.postLogout);

router.get("/signup",authController.getSignup);

router.post("/signup",[
    check('email')
    .isEmail()
    .withMessage('Please enter a valid E-mail!')
    .custom((value,{req})=>{
        return User.findOne({email:value}) //async validation
        .then(userDoc=>{ //userDoc eill return boolean value
            if(userDoc){
                return Promise.reject('E-mail alredy exist');//throw error in promise
            }
        });
    })
    ,
    body('password','please enter password with atlease 5 character and only alphanumeric characters')
    .isLength({min:5})
    .isAlphanumeric()
    .trim()
    ,
    body('confirmPassword')
    .custom((val,{req})=>{
        if(val !== req.body.password){
            throw new Error('Password did not matched');
        }
        return true;
    })
    .trim()
    
],authController.postSignup);

router.get("/reset",authController.getReset);

router.post("/reset",authController.postReset);

router.get("/reset/:token",authController.getNewPassword);

router.post("/new-password",[
    body("password")
    .isAlphanumeric()
    .isLength({min:5})
    .trim()
],authController.postNewPassword);

module.exports = router;