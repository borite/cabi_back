// JavaScript Document


$(function(){
	//sessionStorage.setItem('admin',uname);
	//sessionStorage.setItem('isAuth','true');
	var isAuth=sessionStorage.getItem('isAuth');
	if(isAuth==null){
		location.replace('index.html');
	}
	
	var admin=sessionStorage.getItem('admin');
	
	$("#admin_name,#index_admin_name").text(admin);
	
	$("#exit_log").click(function(){
		sessionStorage.clear();
		location.replace('index.html');
	})
	
})



//要上传的图片url JSON数组
var imgurl=null;


//格式化时间
function formatTime(dtime){
	var shortTime=dtime.substr(0,10);
	return shortTime;
}

//格式化时间和日期
function formatDateTime(dt){
	var t=dt.replace('T',' ');
	return t;
}


//返回总页数
function getTotalPages(pageSize,totalRecords){
	
	//var totalPages=(totalRecords + pageSize -1) / pageSize;
	var totalPages = totalRecords % pageSize == 0 ? totalRecords / pageSize : Math.ceil(totalRecords / pageSize);
	
	if(totalPages==1){
		return 0;
	}
	return totalPages;
	
}


//获取URL中指定的参数值
function GetQueryString(name) { 
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
  var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
  var context = ""; 
  if (r != null) 
     context = r[2]; 
  reg = null; 
  r = null; 
  return context == null || context == "" || context == "undefined" ? "" : context; 
}





 //上传图片的方法
 function base64(file) {
 	var reader = null;

 	//循环上传的文件
 	for (let i = 0; i < file.files.length; i++) {
 		reader = new FileReader();
 		//console.log(reader);
 		var pos = file.files[i].name.lastIndexOf("."); //从后往前获取.之后的索引值.jpg返回值为4
 		var type = file.files[i].name.substring(pos + 1); //获取这个后缀名
 		reader.readAsDataURL(file.files[i]);
 		reader.onloadend = function (e) { //这是一个异步的方法
 			var imgInfo = {
 					ext: type,
 					baseURL: e.target.result
 			} //分别是：后缀，流文件
 			imgurl.push(imgInfo);
 			//console.log(imgurl);
 			if (i == file.files.length - 1) {
 				allImgsOK = true;
 			}
 			//updateBackground(file.files[0].name,imgurl); //返回文件，和
 		}
 	}

 	// if (typeof (FileReader) === 'undefined') {
 	//     alert("抱歉，你的浏览器不支持 FileReader，请使用现代浏览器操作！");
 	// }

 	// //判断文件格式
 	// if (type.toLowerCase() != "png" && type.toLowerCase() != 'jpg' && type.toLowerCase() != 'jpeg' && type.toLowerCase() != 'gif' && type.toLowerCase() != 'bmp') {
 	//     alert("格式错误，请上传'png、jpg、jpeg、bmp、gif'格式文件");
 	//     return;
 	// }



 	// Read the file


 }