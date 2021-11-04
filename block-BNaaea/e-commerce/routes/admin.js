var express = require('express');
var router = express.Router();
var flash=require('connect-flash');
var Product=require('../models/product');


var Admin =require('../models/admin');

const product = require('../models/product');
/* GET admin listing. */
router.get('/', function(req, res, next) {
  res.render('adminIndex');
 // next();
});



//render login form
router.get('/adminLogin',(req,res,next)=>{
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
    res.redirect('/admin/adminLogIn');
  }))
  
})


//handle post request on login
router.post('/adminLogin',(req,res,next)=>{
   
  var {email,password}=req.body;
  //console.log(email,password);
  if(!email || !password){
    req.flash('error','Email/Password is required');
      return res.redirect('/admin/adminLogin');
   
  }

  Admin.findOne({email},((err,admin)=>{
   if(err)return next(err)
   console.log(admin);
   if(!admin){
     req.flash('error','admin does not exist');
     return res.redirect('/admin/adminLogin');
   }

   //compare the password
   admin.verifyPassword(password,(err,result)=>{
    if(err)return next(err);
    if(!result){
      req.flash('error','Password is not correct');
      return res.redirect('/admin/adminLogin');
    }else{
      //persist the adminogin using session



     
      req.session.adminId=admin.id;
       req.flash('error','Login Successful');
       res.redirect('/admin/adminDashboard');

    }

   })
  }))
})

router.get('/adminDashboard',(req,res)=>{
  let error=req.flash('error')[0];
  res.render('adminDashboard',{error});
})

//handle logout
router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/admin/adminLogin');

})



//create product
router.get('/product/new',(req,res)=>{
    var error=req.flash('error')[0];
    res.render('createProduct',{error});
})

//capture the data for the creation of the product.
router.post('/product/new',(req,res,next)=>{
   
    if(req.body.name){ Product.create(req.body,(err,product)=>{
        if(err)return next(err);
        res.redirect('/admin/adminProductList');       
    })}else{
        req.flash('error','Please fill all the details');
        res.redirect('/admin/product/new');
    }
   

})



//update product
router.get('/adminProductList/edit/:id',(req,res,next)=>{
    var id =req.params.id;
    Product.findById(id,(err,product)=>{
        if(err)return next(err);
        res.render('updateProduct',{product});
    })
})

router.post('/adminProductList/edit/:id',(req,res,next)=>{
    var id =req.params.id;
    Product.findByIdAndUpdate(id,req.body,{upsert:true,new:true},(err,updatedProduct)=>{
        if(err)return next(err);
        console.log(updatedProduct);
        res.redirect('/admin/adminProductList');
    })
})


//delete product
router.get('/adminProductList/delete/:id',(req,res,next)=>{
    var id =req.params.id;
    Product.findByIdAndDelete(id,{upsert:true,new:true},(err,deletedProduct)=>{
        if(err)return next(err);
        console.log(deletedProduct);
        res.redirect('/admin/adminProductList');
    })
})




//handle products list
router.get('/adminProductList',(req,res,next)=>{


    Product.find({},(err,products)=>{
        if(err)return next(err);
        console.log(products);
        res.render('adminProductList',{products});
    })
    
})






module.exports = router;
