var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost/photo_app');
var photo_schema=new mongoose.Schema({
	name:String,
	path:String
});
module.exports=mongoose.model('photo',photo_schema);