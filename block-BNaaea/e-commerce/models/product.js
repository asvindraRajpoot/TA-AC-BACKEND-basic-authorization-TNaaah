var mongoose=require('mongoose');
var Schema=mongoose.Schema;


var productSchema=new Schema({
    name:{type:String,required:true},
    quantity:{type:Number,default:0},
    price:{type:Number,required:true},
    likes:{type:Number,default:0},   
    category:{type:String,required:true},
   

},{timestamps:true})



module.exports=mongoose.model('Product',productSchema);
