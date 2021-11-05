var express = require('express');
var router = express.Router();
var flash=require('connect-flash');
var Product=require('../models/product');
var User=require('../models/user');
var authUser=require('../middlewares/authUser');


//var User =require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('userIndex');
 // next();
});



//render login form
router.get('/login',(req,res,next)=>{
  var error=req.flash('error')[0];
  console.log(req.body.user);
  res.render('userLogin',{error});
 // next()
})


//render register form
router.get('/userRegister',(req,res,next)=>{
  var error=req.flash('error')[0];
  res.render('userRegister',{error});
  //next();
})


//capture the from registration form
router.post('/userRegister',(req,res,next)=>{
  console.log(req.body);
  User.create(req.body,(err,user)=>{
    if(err){
      if(err.code==='MongoError'){
        req.flash('error','This email is taken');
        return res.redirect('/users/registers');
      }

      if(err.name==='ValidationError'){
        req.flash('error',err.message);
        return res.redirect('/users/userRegister');
      }
      return res.json({err});
    }
    //console.log('after saving into database',user);
   // req.flash('error','User hasbeen Successfully registered');
    res.redirect('/users/login');
  })
  
})


//handle post request on userLogin
router.post('/userLogin',(req,res,next)=>{
   
  var {email,password}=req.body;
  //console.log(email,password);
  if(!email || !password){
    req.flash('error','Email/Password is required');
      return res.redirect('/users/login');
   
  }

  User.findOne({email},(err,user)=>{
   if(err)return next(err)
   if(!user){
     req.flash('error','user does not exist');
     return res.redirect('/users/login');
   }

   //compare the password
   user.verifyPassword(password,(err,result)=>{
    if(err)return next(err);
    if(!result){
      req.flash('error','Password is not correct');
      return res.redirect('/users/login');
    }else{
      //persist the useruserLogin using session



     
       req.session.userId=user.id;
       req.flash('error','userLogin Successful');
       res.redirect('/users');

    }

   })

  })
  
})

router.use(authUser.loggedInUser);


router.get('/userDashboard',(req,res)=>{
  let error=req.flash('error')[0];
  console.log(req.body);
  if(req.user.name){
    res.render('userDashboard',{error});
  }else{
    res.redirect('/users/login');
  }
 
})

//handle logout
router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');

})



///handle user product list

router.get('/userProductList',(req,res,next)=>{
  if(req.user.name){
    Product.find({},(err,products)=>{
      if(err)return next(err);
      User.findById(req.session.userId,(err,user)=>{
        if(err)return next(err);
  
        res.render('userProductList',{products:products,cart:user.cart});
      })
      
    })
  }else{
    res.redirect('/users/login');
  }

  
})

//like the product
router.get('/userProductList/likes/:id',(req,res)=>{
  if(req.user.name){
    let id =req.params.id;
    Product.findByIdAndUpdate(id,{$inc:{likes:1}},{upsert:true,new:true},(err,updatedProduct)=>{
     if(err)return next(err);
     res.redirect('/users/userProductList');
    })
  }else{
    res.redirect('/users/login');
  }
  

})


//handle cart
router.get('/userProductList/cart/:id',(req,res,next)=>{
  let id =req.params.id;
  if(req.user.name){
    Product.findByIdAndUpdate(id,{$inc:{quantity:-1}},{upsert:true,new:true},(err,updatedProduct)=>{
      if(err)return next(err);
    User.findByIdAndUpdate(req.session.userId,{$inc:{cart:1}},{upsert:true,new:true},(err,updatedUser)=>{
    
      if(err) return next(err);
      res.redirect('/users/userProductList');
    })
     
    })
  }else{
    res.redirect('/users/login');
  }




})


module.exports = router;
