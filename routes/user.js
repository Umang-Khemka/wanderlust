const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middlewares/authenticate.js")

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(async(req,res) => {
    try {
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password)
        console.log(registeredUser);
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
})); 

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  async (req, res) => {
    const redirectUrl = res.locals.redirectUrl || "/listings";
    delete req.session.redirectUrl; 
    req.flash("success", "Welcome back!");
    res.redirect(redirectUrl);
  }
);


router.get("/logout",(req,res,next)=> {
  req.logOut((err)=> {
    if(err){
      return next(err);
    }
    req.flash("success", "Successfully logged out!");
    return res.redirect("/login");
  });
});
module.exports = router;