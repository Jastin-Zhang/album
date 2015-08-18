var mongoPhoto=require('../mongodb/photo');
var fs =require('fs');
var path=require('path');
var join=path.join;
var formidable=require('formidable');

exports.show=function(req,res,next){
	mongoPhoto.find({},function(err,photos){       //the first param '{ }' means to find all the records in photo Collection
		res.render('photo',{
			title:'Photos',
			photos:photos
		});
	});
};

exports.uploadGet=function(req,res,next){
	res.render('photo/upload',{
		title:'Photo upload'
	})
};

exports.uploadPost=function(dir){
	return function(req,res,next){
		var form=new formidable.IncomingForm();
		form.parse(req,function(err,fields,files){
			if(err) return err;
			var name=fields['photoname'];
			var image=files['photoimage'];
			var path=join(dir,image.name);
			fs.rename(image.path,path,function(err){
				if(err) return next(err);

				mongoPhoto.create({
					name:name,
					path:image.name
				},function(err){
					if(err) return next(err);
					res.redirect('/photoshow');
				});
			});
		});

	};
};

//test file upload.
/*exports.uploadTest=function(req,res,next){
	 var form=new formidable.IncomingForm();
    	form.parse(req,function(err,fields,files){
    		if(err) return err;
       		console.log(fields);
        		console.log(files);
        		for(var each in files){
            			fs.rename(files[each].path,'./public/images/uploadPhotos/'+files[each].name);
        		};
        		res.end('upload finished');
	});
};*/

exports.download=function(dir){
	return function(req,res,next){
		var id=req.params.id;
		console.log('id:'+id);
		console.log('dir:'+dir);
		mongoPhoto.findById(id,function(err,photo){
			if(err) return next(err);
			var path=join(dir,photo.path);
			res.download(path,photo.name+'.jpeg');  //the first param is the photo's path in server,the 
								//second param is replace the  name of the photo.
		});
	};
};
