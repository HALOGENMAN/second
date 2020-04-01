exports.isAuth1 = (req,res,next) =>{
    if(!req.session.isLoggedIn){
        return res.redirect("/login");
        
    }
    next();
}

exports.isAuth2 = (req,res,next) =>{
    if(!req.session.isLoggedIn){
        return res.redirect("/login");
        
    }
    next();
}