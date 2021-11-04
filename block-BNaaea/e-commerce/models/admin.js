var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var bcrypt=require('bcrypt');

var adminSchema=new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true,minlength:5}
},{timestamps:true});



//pre(save)hook
adminSchema.pre('save',function(next){
    console.log(this,'before saving into database');
    if(this.password && this.isModified('password')){
        bcrypt.hash(this.password,10,(err,hashed)=>{
            if(err)return next(err);
            this.password=hashed;
             return next()
        })
        
    }else{
        next();
    }

})

//method
adminSchema.methods.verifyPassword=function(password,cb){
    bcrypt.compare(password,this.password,(err,result)=>{
        return cb(err,result);
    })
}

module.exports=mongoose.model('Admin',adminSchema);