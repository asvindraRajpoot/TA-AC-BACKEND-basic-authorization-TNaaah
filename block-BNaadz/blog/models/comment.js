var mongoose=require('mongoose');
var Schema=mongoose.Schema;


var commentSchema=new Schema({
    content:{type:String,required:true},
    articleId:{type:Schema.Types.ObjectId,ref:'Article' ,required:true},
    author:{type:Schema.Types.ObjectId,ref:'User',required:true},
    likes:Number,

},{timestamps:true})

module.exports=mongoose.model('Comment',commentSchema);