// JavaScript Document

var productInfo={}
var newID=74;
var i=0;
$(function () {
	
	getTypeList();
		
	$.validator.setDefaults({
		errorClass: 'error-text',
		highlight: function (element) {
			$(element).addClass('error-border');
		},
		unhighlight: function (element) {
			$(element).removeClass('error-border');
		},
	});
	
	
	$("#step1").validate({
		rules: {
			title: {
				required: true
			},
			series: {
				required: true
			},
			price: {
				required: true
			},
			size: {
				required: true
			},
			scene: {
				required: true
			},
			description: {
				required: true
			},
			color: {
				required: true
			}

		},
		messages: {
			title: {
				required: "请输入产品名字"
			},
			series: {
				required: "请选择产品序列"
			},
			price: {
				required: "请填写产品价格"
			},
			size: {
				required: "请填写尺码"
			},
			scene: {
				required: "请填写适用场景"
			},
			description: {
				required: "请填写产品描述"
			},
			color: {
				required: "请填写产品颜色，多个用逗号分隔，如：蓝色，红色"
			}
		}

	});
						
	$(".btn-cancel").click(function(){
		location.replace('product_manage.html');
	});
	
	$("#btn_cancel").click(function(){
		cancelAddProduct();
		
	})
	
	
	//第一步点击，进入第二步
	$("#do_step1").click(function () {
		if ($("#step1").validate().form()) {
			productInfo = {
				"ThemeID": $("#series option:selected").val(), //所属分类
				"NewTitle": $.trim($("#title").val()), //产品名字
				"SubTitle": $.trim($("#sub_title").val()), //产品副标题
				"Price": $.trim($("#price").val()), //产品价格
				"Discribe": $.trim($("#description").val()), //产品描述
				"Color": $.trim($("#color").val()), //产品颜色
				"SizeInfo": $.trim($("#size").val()), //产品尺寸                              	
				"Scene": $.trim($("#scene").val()), //使用场景
				"DesignConcept": $.trim($("#concept").val())  //设计理念
			}
			
			$.post("https://customer.imotstudio.net/cabi/api/product/AddProduct",productInfo).done(function(res){
				if(res.Code==200){
					newID=res.Data;
					//进入第二步
					$("#step1").addClass('d-none');
					$("#step2").removeClass('d-none');
					$("#tit_step1").removeClass('text-primary');
					$("#tit_step2").addClass('text-primary');
				}
			})
		}

	});


	//第二步返回第一步
	$("#back_step1").click(function () {
		$("#step2").addClass('d-none');
		$("#step1").removeClass('d-none');
		$("#tit_step2").removeClass('text-primary');
		$("#tit_step1").addClass('text-primary');
	});


	//添加封面图
	$("#btn_add_poster,#modi_cover").click(function (e) {
		e.preventDefault();
		$("#poster_select").click();
	});
	

	$("#poster_select").change(function () {
		var size = 2 * 1024 * 1024;
		var file = this.files[0];
		var fileName = file.name;
		var fileSize = file.size;
		fileType = fileName.substring(fileName.lastIndexOf('.'), fileName.length).toLowerCase();
		if (fileType != '.gif' && fileType != '.jpeg' && fileType != '.png' && fileType != '.jpg') {
			alert("上传失败，请上传jpg,png格式的图片");
			return;
		}
		if (fileSize > size) {
			alert("上传失败，请上传2MB以内的图片。");
			return;
		}
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function () {
			
			// 通过 reader.result 来访问生成的 DataURL
			var url = reader.result;
			$("#cropbox,#preview").attr("src", url);
			initCropper();
			
			//保存按钮点击事件只保存一次
			$("#btn_save").one('click',function () {
				var cas = $("#cropbox").cropper('getCroppedCanvas');
				var base64url = cas.toDataURL('image/png');
				$("#product_cover").attr("src", base64url);
				$("#btn_add_poster").addClass("d-none");
				$("#poster_select").next('.card').removeClass("d-none");
				$.closePopLayer();
			});
			
			$.showPopLayer({
				target: "uppic_wrap",
				animate: false,
				onClose: function () {
					$('#poster_select').prop('value', '');
					$('#cropbox').cropper('destroy');
				}
			});
		}
	});
	
	
	//添加展示图相关操作
	$("#btn_add_muti").click(function(e){
		e.preventDefault();
		if($("#zs_pics > .card").length==5){
			alert("最多只能上传5个展示图");
			return false;
		}
		$("#zhanshi_select").click();
	});
	
	$("#zhanshi_select").change(function () {
		var size = 2 * 1024 * 1024;
		var file = this.files[0];
		var fileName = file.name;
		var fileSize = file.size;
		fileType = fileName.substring(fileName.lastIndexOf('.'), fileName.length).toLowerCase();
		if (fileType != '.gif' && fileType != '.jpeg' && fileType != '.png' && fileType != '.jpg') {
			alert("上传失败，请上传jpg,png格式的图片");
			return;
		}
		if (fileSize > size) {
			alert("上传失败，请上传2MB以内的图片。");
			return;
		}
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function () {
			// 通过 reader.result 来访问生成的 DataURL
			var url = reader.result;
			$("#cropbox,#preview").attr("src", url);
			initCropper();
			
			//保存按钮点击事件只保存一次
			$("#btn_save").one('click',function () {
				i++;
				var cas = $("#cropbox").cropper('getCroppedCanvas');
				var base64url = cas.toDataURL('image/png');
				addImgBlock(base64url);
				$.closePopLayer();
			});
			
			
			$.showPopLayer({
				target: "uppic_wrap",
				animate: false,
				onClose: function () {
					$('#zhanshi_select').prop('value', '');
					$('#cropbox').cropper('destroy');
				}
			});
		}
	});
	
	
	//添加面料图片相关操作
	
	$("#btn_add_cloth,#modi_img").click(function(e){
		e.preventDefault();
		$("#img_select").click();
	});
	
	$("#img_select").change(function () {
		var size = 2 * 1024 * 1024;
		var file = this.files[0];
		var fileName = file.name;
		var fileSize = file.size;
		fileType = fileName.substring(fileName.lastIndexOf('.'), fileName.length).toLowerCase();
		if (fileType != '.gif' && fileType != '.jpeg' && fileType != '.png' && fileType != '.jpg') {
			alert("上传失败，请上传jpg,png格式的图片");
			return;
		}
		if (fileSize > size) {
			alert("上传失败，请上传2MB以内的图片。");
			return;
		}
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function () {
			
			// 通过 reader.result 来访问生成的 DataURL
			var url = reader.result;
			$("#cropbox,#preview").attr("src", url);
			initCropper(1);
			
			//保存按钮点击事件只保存一次
			$("#btn_save").one('click',function () {
				var cas = $("#cropbox").cropper('getCroppedCanvas');
				var base64url = cas.toDataURL('image/png');
				$("#cloth_img").attr("src", base64url);
				$("#btn_add_cloth").addClass("d-none");
				$("#btn_add_cloth").next('.card').removeClass("d-none");
				$.closePopLayer();
			});
			
			$.showPopLayer({
				target: "uppic_wrap",
				animate: false,
				onClose: function () {
					$('#img_select').prop('value', '');
					$('#cropbox').cropper('destroy');
				}
			});
		}
	});
	
	
	//添加详情图片相关操作
	$("#btn_add_info,#modi_info_img").click(function(e){
		e.preventDefault();
		$("#info_select").click();
	});
	
	$("#info_select").change(function () {
		var size = 2 * 1024 * 1024;
		var file = this.files[0];
		var fileName = file.name;
		var fileSize = file.size;
		fileType = fileName.substring(fileName.lastIndexOf('.'), fileName.length).toLowerCase();
		if (fileType != '.gif' && fileType != '.jpeg' && fileType != '.png' && fileType != '.jpg') {
			alert("上传失败，请上传jpg,png格式的图片");
			return;
		}
		if (fileSize > size) {
			alert("上传失败，请上传2MB以内的图片。");
			return;
		}
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function () {
			// 通过 reader.result 来访问生成的 DataURL
			var url = reader.result;
			$("#info_img").attr('src',url);
			$("#btn_add_info").addClass('d-none').next().removeClass('d-none');
		}
	});
	
	
}); //ready_end



//添加滚动图
function addImgBlock(img64){
	var temp='<div id="d'+i+'" class="card border-0 mr-4" style="width: 16rem;">\
				<img class="zs" src="'+img64+'" style="width:100%;"/>\
				<div class="card-body d-flex" style="justify-content: center">\
					<button type="button" class="btn btn-danger btn-sm" onclick="removeImgBlock(\'d'+i+'\')">删除</button>\
				</div>\
			  </div>';
    $("#zs_pics").append(temp);
}

//移除滚动图
function removeImgBlock(wid){
	$("#"+wid).remove();
}

//初始化Cropper
function initCropper(t) {
	if(t===1){
		$("#cropbox").cropper({
			aspectRatio: 71 / 24,
			viewMode: 1,
			minCropBoxWidth: 71,
			minCropBoxHeight: 100,
			preview: "#avatat_prev"
		});
	}else{
		$("#cropbox").cropper({
			aspectRatio: 71 / 100,
			viewMode: 1,
			minCropBoxWidth: 71,
			minCropBoxHeight: 100,
			preview: "#avatat_prev"
		});
	}	
}

//获取所有系列
function getTypeList() {
	$.get("https://customer.imotstudio.net/cabi/api/product/GetProductTypeForBack").done(function (res) {
		if (res.Code == "200") {
			if (res.Data.length > 0) {
				$("#series").empty();
				$("#series").append('<option value="">请选择</option>');
				$.each(res.Data, function (i, o) {
					if (o.IsLocked == false) {
						var html = '<option value="' + o.ID + '">' + o.Title + '</option>';
					}
					$("#series").append(html);
				});
			} else {
				alert("您还没有设置产品系列，请先设置产品系列");
			}
		} else {
			alert("您还没有产品系列，请先添加产品系列！");
			location.href = "product_type.html";
		}
	})
}


//检查图片是否都上传
function checkImgs()
{
	//产品封面图
	var product_cover=$("#product_cover").attr("src") || null;
	//展示图片
	var zs_pics=$("#zs_pics img.zs").length;
	//面料图片
	var cloth_img= $("#cloth_img").attr('src') || null;
	//详情图片
	var info_img=$("#info_img").attr('src')||null;
	
	if(product_cover==null){
		alert("请上传封面图");
		return false;
	}
	
	if(zs_pics==0){
		alert("请上传展示图片");
		return false;
	}
	
	if(cloth_img==null){
		alert("请上传面料图片");
		return false;
	}
	
	if(info_img==null){
		alert("请上传详情图片");
		return false;
	}
	
	return true;
	
}


//添加产品
function addProduct(){
	
	if(checkImgs())
	{
	    var img= $("#product_cover").attr("src");
		var Ext=img.substr(11,3);
		
		var businessParam = {
             imgs: [{ext:Ext , baseURL:img }],
             ID: 75
        };
		
		
		//上传封面图
		$.post("https://customer.imotstudio.net/cabi/api/UpdateCollection",businessParam).then(function(res){
			console.log("上传产品封面图：",res);
			if(res.Code==200){
				return $.post("https://customer.imotstudio.net/cabi/api/productList")
			}
			
			
			
		}).then(function(res){
			
			
		});
		
	}

	//var updateCoverImg=$.post("https://customer.imotstudio.net/cabi/api/UpdateCollection",{})
	
	//$.post("https://customer.imotstudio.net/cabi/api/UpdateCollection",{})
	
	
/*	{"ThemeID":"1","NewTitle":"新闻的标题","Price":"999","Contents":"这里存编辑器的内容","Discribe":"这是一个描述","Color":"红色,绿色,蓝色","TopRecommend":"true","SizeInfo":"L,XL,M","Scene":"商务","ListImg":"列表页显示一张","ImgList":"详情页Banner图片数组","CollectionImg":"这里放收藏图","Desplay":"99","TopDesplay":"99","AllDesplay":"99","IsLocked":"false","Remark":"这里是后台的备注"}*/
/*	if(checkImgs()){
		$.post("https://customer.imotstudio.net/cabi/api/AddProduct",{
			ThemeID=productInfo.ThemeID,
			
			
		})
	}*/
}





function cancelAddProduct(){
	if(newID!==0 || newID!==null){
/*		$.ajax("https://customer.imotstudio.net/cabi/api/product/DeleteProduct",{
			method:'delete',
			data:{productID:newID},
			dataType:'json'
		}).done(function(res){
			console.log(res);
		}).fail(function(err){
			console.log(err);
			
		});*/
		
		$.post("https://customer.imotstudio.net/cabi/api/product/DeleteProduct",{productID:newID}).done(function(res){
			console.log(res);
		}).fail(function(err){
			console.log(err);
		})
	}	
	//location.replace('product_manage.html');
}










