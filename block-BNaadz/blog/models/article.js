var mongoose=require('mongoose');
var Schema=mongoose.Schema;


var articleSchema=new Schema({
    title:{type:String,required:true},
    description:String,
    tags:[String],
    likes:{type:Number,default:0},
    author:{type:Schema.Types.ObjectId,required:true,ref:'User'},
    

})

module.exports=mongoose.model('Article',articleSchema);