var mongoose=require('mongoose');
var Schema=mongoose.Schema;


var articleSchema=new Schema({
    title:{type:String,required:true},
    description:String,
    tags:[String],
    likes:{type:Number,default:0},
    author:String,
    

})

module.exports=mongoose.model('Article',articleSchema);