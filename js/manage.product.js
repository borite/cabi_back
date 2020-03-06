// JavaScript Document

var productInfo={}
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
	
	$("#do_step1").click(function () {
		if ($("#step1").validate().form()) {
			productInfo = {
				"ThemeID": $("#series option:selected").val(), //所属分类
				"NewTitle": $.trim($("#title").val()), //产品名字
				"SubTitle": $.trim($("#sub_title").val()), //产品副标题
				"Price": $.trim($("#price").val()), //产品价格
				"Contents": "", //产品详情图
				"Discribe": $.trim($("#description").val()), //产品描述
				"Color": $.trim($("#color").val()), //产品颜色
				"TopRecommend": "false", //是否首页轮播
				"SizeInfo": $.trim($("#size").val()), //产品尺寸                              	
				"Scene": $.trim($("#scene").val()), //使用场景
				"ListImg": "", //详情页上边的滚动图                    
				"ImgList": "", //面料图片    
				"ClothInfo":"",//面料说明
				"CollectionImg": "" //封面+收藏图片
			}

			//进入第二步
			$("#step1").addClass('d-none');
			$("#step2").removeClass('d-none');
			$("#tit_step1").removeClass('text-primary');
			$("#tit_step2").addClass('text-primary');
			console.log(productInfo);

		}

	});


	//第二步返回第一步
	$("#back_step1").click(function () {
		$("#step2").addClass('d-none');
		$("#step1").removeClass('d-none');
		$("#tit_step2").removeClass('text-primary');
		$("#tit_step1").addClass('text-primary');
	});


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



function addImgBlock(img64){
	var temp='<div id="d'+i+'" class="card border-0 mr-4" style="width: 16rem;">\
				<img id="product_cover" src="'+img64+'" style="width:100%;"/>\
				<div class="card-body d-flex" style="justify-content: center">\
					<button type="button" class="btn btn-danger btn-sm" onclick="removeImgBlock(\'d'+i+'\')">删除</button>\
				</div>\
			  </div>';
    $("#zs_pics").append(temp);
}

function removeImgBlock(wid){
	$("#"+wid).remove();
}


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