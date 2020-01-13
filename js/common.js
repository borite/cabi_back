// JavaScript Document


//格式化时间
function formatTime(dtime){
	var shortTime=dtime.substr(0,10);
	return shortTime;
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