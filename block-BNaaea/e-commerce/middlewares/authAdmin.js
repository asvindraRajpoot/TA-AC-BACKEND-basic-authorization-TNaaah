var Admin=require('../models/admin');

module.exports={
    loggedInAdmin:(req,res,next)=>{
        if(req.session && req.session.adminId){
            next();
        }else{
            res.redirect('/admin/login');
        }
    },

    adminInfo:(req,res,next)=>{
        var adminId=req.session && req.session.adminId;

        if(adminId){
            Admin.findById(adminId,'name email',(err,admin)=>{
                if(err) return next(err);
                req.admin=admin;
                res.locals.admin=admin;
                next();
            })
        }else{
            req.admin=null;
            res.locals.admin=null;
            next()
        }
    }
}