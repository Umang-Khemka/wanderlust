const User = require("../models/user.js");



module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res) => {
    try {
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password)
        await req.login(registeredUser,(err)=> {
          if(err){
            return next(err);
          }
          req.flash("success", "Welcome to WanderLust!");
          res.redirect("/listings");    
        });
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.loginRenderForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login =  async (req, res) => {
    const redirectUrl = res.locals.redirectUrl || "/listings";
    delete req.session.redirectUrl; 
    req.flash("success", "Welcome back!");
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=> {
    req.logOut((err)=> {
      if(err){
        return next(err);
      }
      req.flash("success", "Successfully logged out!");
      return res.redirect("/login");
    });
};