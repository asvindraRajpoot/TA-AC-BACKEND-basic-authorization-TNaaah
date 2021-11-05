var express = require('express');
var router = express.Router();
var flash=require('connect-flash');
var Product=require('../models/product');
var authAdmin=require('../middlewares/authAdmin');


var Admin =require('../models/admin');

const product = require('../models/product');
//const admin = require('../models/admin');
/* GET admin listing. */
router.get('/', function(req, res, next) {
  res.render('adminIndex');
 // next();
});



//render login form
router.get('/login',(req,res,next)=>{
  var error=req.flash('error')[0];
  res.render('adminLogIn',{error});
 // next()
})


//render register form
router.get('/adminRegister',(req,res,next)=>{
  var error=req.flash('error')[0];
  res.render('adminRegister',{error});
  //next();
})


//capture the from registration form
router.post('/adminRegister',(req,res,next)=>{
  console.log(req.body);
  Admin.create(req.body,((err,admin)=>{
    if(err){
      if(err.code==='MongoError'){
        req.flash('error','This email is taken');
        return res.redirect('/admin/adminRegister');
      }

      if(err.name==='ValidationError'){
        req.flash('error',err.message);
        return res.redirect('/admin/adminRegister');
      }
      return res.json({err});
    }
    //console.log('after saving into database',admin;
   // req.flash('error','adminhasbeen Successfully registered');
    res.redirect('/admin/logIn');
  }))
  
})


//handle post request on login
router.post('/adminLogin',(req,res,next)=>{
   
  var {email,password}=req.body;
  //console.log(email,password);
  if(!email || !password){
    req.flash('error','Email/Password is required');
      return res.redirect('/admin/login');
   
  }

  Admin.findOne({email},((err,admin)=>{
   if(err)return next(err)
   console.log(admin);
   if(!admin){
     req.flash('error','admin does not exist');
     return res.redirect('/admin/login');
   }

   //compare the password
   admin.verifyPassword(password,(err,result)=>{
    if(err)return next(err);
    if(!result){
      req.flash('error','Password is not correct');
      return res.redirect('/admin/login');
    }else{
      //persist the adminogin using session



     
      req.session.adminId=admin.id;
       req.flash('error','Login Successful');
       res.redirect('/admin');

    }

   })
  }))
})

router.use(authAdmin.loggedInAdmin);


router.get('/adminDashboard',(req,res)=>{
  let error=req.flash('error')[0];
  console.log(req.body);
  if(req.admin.name){
    console.log('in if');
    console.log(req.body.admin);
    res.render('adminDashboard',{error});

  }else{
    console.log('in else');
    res.redirect('/admin/login');
  }
 
})

//handle logout
router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/admin/login');

})



//create product
router.get('/product/new',(req,res)=>{
    var error=req.flash('error')[0];
    if(req.admin.name){
      res.render('createProduct',{error});
    }else{
      res.redirect('/admin/login');
    }
    
  
})

//capture the data for the creation of the product.
router.post('/product/new',(req,res,next)=>{
  if(req.admin.namee){
    if(req.body.name){ Product.create(req.body,(err,product)=>{
      if(err)return next(err);
      res.redirect('/admin/adminProductList');       
  })}else{
      req.flash('error','Please fill all the details');
      res.redirect('/admin/product/new');
  }
  }else{
    res.redirect('/admin/login');
  }
 
   
 
   

})



//update product
router.get('/adminProductList/edit/:id',(req,res,next)=>{
    var id =req.params.id;
    if(req.admin.name){
      Product.findById(id,(err,product)=>{
        if(err)return next(err);
        res.render('updateProduct',{product});
    })
    }else{
      res.redirect('/admin/login');
    }
   
})

router.post('/adminProductList/edit/:id',(req,res,next)=>{
    var id =req.params.id;
    if(req.admin.name){
      Product.findByIdAndUpdate(id,req.body,{upsert:true,new:true},(err,updatedProduct)=>{
        if(err)return next(err);
        console.log(updatedProduct);
        res.redirect('/admin/adminProductList');
    })
    }else{
      res.redirect('/admin/login');

    }
  
})


//delete product
router.get('/adminProductList/delete/:id',(req,res,next)=>{
    var id =req.params.id;
    if(req.admin.name){
      Product.findByIdAndDelete(id,{upsert:true,new:true},(err,deletedProduct)=>{
        if(err)return next(err);
        console.log(deletedProduct);
        res.redirect('/admin/adminProductList');
    })
    }else{
      res.redirect('/admin/login');
    }
  
})




//handle products list
router.get('/adminProductList',(req,res,next)=>{
  console.log('in admin');

   if(req.admin.name){
    Product.find({},(err,products)=>{
      if(err)return next(err);
      console.log(products);
      res.render('adminProductList',{products});
  })
   }else{
     console.log('in admin Product List');
    res.redirect('/admin/login');
   }
  
    
})






module.exports = router;
