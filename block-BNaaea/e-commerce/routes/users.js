var express = require('express');
var router = express.Router();
var flash=require('connect-flash');
var Product=require('../models/product');
var User=require('../models/user');


var User =require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('userIndex');
 // next();
});



//render login form
router.get('/userLogin',(req,res,next)=>{
  var error=req.flash('error')[0];
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
    res.redirect('/users/userLogin');
  })
  
})


//handle post request on userLogin
router.post('/userLogin',(req,res,next)=>{
   
  var {email,password}=req.body;
  //console.log(email,password);
  if(!email || !password){
    req.flash('error','Email/Password is required');
      return res.redirect('/users/userLogin');
   
  }

  User.findOne({email},(err,user)=>{
   if(err)return next(err)
   if(!user){
     req.flash('error','user does not exist');
     return res.redirect('/users/userLogin');
   }

   //compare the password
   user.verifyPassword(password,(err,result)=>{
    if(err)return next(err);
    if(!result){
      req.flash('error','Password is not correct');
      return res.redirect('/users/userLogin');
    }else{
      //persist the useruserLogin using session



     
       req.session.userId=user.id;
       req.flash('error','userLogin Successful');
       res.redirect('/users/userDashboard');

    }

   })

  })
  
})

router.get('/userDashboard',(req,res)=>{
  let error=req.flash('error')[0];
  res.render('userDashboard',{error});
})

//handle logout
router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/userLogin');

})



///handle user product list

router.get('/userProductList',(req,res,next)=>{
  Product.find({},(err,products)=>{
    if(err)return next(err);
    User.findById(req.session.userId,(err,user)=>{
      if(err)return next(err);

      res.render('userProductList',{products:products,cart:user.cart});
    })
    
  })
  
})

//like the product
router.get('/userProductList/likes/:id',(req,res)=>{
  
  let id =req.params.id;
  Product.findByIdAndUpdate(id,{$inc:{likes:1}},{upsert:true,new:true},(err,updatedProduct)=>{
   if(err)return next(err);
   res.redirect('/users/userProductList');
  })
})


//handle cart
router.get('/userProductList/cart/:id',(req,res,next)=>{
  let id =req.params.id;

  Product.findByIdAndUpdate(id,{$inc:{quantity:-1}},{upsert:true,new:true},(err,updatedProduct)=>{
    if(err)return next(err);
  User.findByIdAndUpdate(req.session.userId,{$inc:{cart:1}},{upsert:true,new:true},(err,updatedUser)=>{
  
    if(err) return next(err);
    res.redirect('/users/userProductList');
  })
   
  })


})


module.exports = router;
