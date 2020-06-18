// JavaScript Document

var productInfo = {}
var newID = -1;
var i = 0;
var isEdit = "";
var scrollNum = 0;


$(function () {

	getTypeList();
	newID = GetQueryString("pid");

	isEdit = GetQueryString('act');
	console.log(isEdit);



	//如果是编辑状态
	if (isEdit == "edit") {
		if (newID == "") {
			alert("参数错误！");
			return false;
		}
		//绑定产品
		BindProductInfo();
	}


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

	$(".btn-cancel").click(function () {
		location.replace('product_manage.html');
	});

	$("#btn_cancel").click(function () {
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

			if (isEdit == "") {
				$.post("https://customer.imotstudio.net/cabi/api/product/AddProduct", productInfo).done(function (res) {
					if (res.Code == 200) {
						newID = res.Data;
						//进入第二步
						$("#step1").addClass('d-none');
						$("#step2").removeClass('d-none');
						$("#tit_step1").removeClass('text-primary');
						$("#tit_step2").addClass('text-primary');
					}
				})
			} else {
				productInfo["ID"] = newID;
				$.ajax('https://customer.imotstudio.net/cabi/api/product/UpdateProductSetpOne', {
					method: 'put',
					data: productInfo,
					success: function (res) {
						if (res.Code == 200) {
							//进入第二步
							$("#step1").addClass('d-none');
							$("#step2").removeClass('d-none');
							$("#tit_step1").removeClass('text-primary');
							$("#tit_step2").addClass('text-primary');
						}
					}
				})
			}
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
			$("#btn_save").one('click', function () {
				var cas = $("#cropbox").cropper('getCroppedCanvas', {
					width: 710,
					height: 1000,
					minWidth: 355,
					minHeight: 500,
					maxWidth: 4096,
					maxHeight: 4096,
					fillColor: '#fff',
					imageSmoothingEnabled: false,
					imageSmoothingQuality: 'high',
				});
				var base64url = cas.toDataURL();
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
	$("#btn_add_muti").click(function (e) {
		e.preventDefault();
		if ($("#zs_pics > .card").length == 5) {
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
			$("#btn_save").one('click', function () {
				i++;
				var cas = $("#cropbox").cropper('getCroppedCanvas', {
					width: 710,
					height: 1000,
					minWidth: 355,
					minHeight: 500,
					maxWidth: 4096,
					maxHeight: 4096,
					fillColor: '#fff',
					imageSmoothingEnabled: false,
					imageSmoothingQuality: 'high',
				});
				var base64url = cas.toDataURL();
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

	$("#btn_add_cloth,#modi_img").click(function (e) {
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
			$("#btn_save").one('click', function () {
				var cas = $("#cropbox").cropper('getCroppedCanvas', {
					width: 710,
					height: 240,
					minWidth: 355,
					minHeight: 120,
					maxWidth: 4096,
					maxHeight: 4096,
					fillColor: '#fff',
					imageSmoothingEnabled: false,
					imageSmoothingQuality: 'high',
				});
				var base64url = cas.toDataURL();
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
	$("#btn_add_info,#modi_info_img").click(function (e) {
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
			$("#info_img").attr('src', url);
			$("#btn_add_info").addClass('d-none').next().removeClass('d-none');
		}
	});


}); //ready_end



//添加滚动图
function addImgBlock(img64) {
	var temp = '<div id="d' + i + '" class="card border-0 mr-4" style="width: 16rem;">\
				<img class="zs" src="'+ img64 + '" style="width:100%;"/>\
				<div class="card-body d-flex" style="justify-content: center">\
					<button type="button" class="btn btn-danger btn-sm" onclick="removeImgBlock(\'d'+ i + '\')">删除</button>\
				</div>\
			  </div>';
	$("#zs_pics").append(temp);
	i++;
}

//移除滚动图
function removeImgBlock(wid) {
	$("#" + wid).remove();
}

//初始化Cropper
function initCropper(t) {
	if (t === 1) {
		$("#cropbox").cropper({
			aspectRatio: 71 / 24,
			viewMode: 1,
			minCropBoxWidth: 71,
			minCropBoxHeight: 100,
			preview: "#avatat_prev"
		});
	} else {
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
function checkImgs() {
	//产品封面图
	var product_cover = $("#product_cover").attr("src") || null;
	//展示图片
	var zs_pics = $("#zs_pics img.zs").length;
	//面料图片
	var cloth_img = $("#cloth_img").attr('src') || null;
	//详情图片
	var info_img = $("#info_img").attr('src') || null;

	if (product_cover == null) {
		alert("请上传封面图");
		return false;
	}

	if (zs_pics == 0) {
		alert("请上传展示图片");
		return false;
	}

	if (cloth_img == null) {
		alert("请上传面料图片");
		return false;
	}

	if (info_img == null) {
		alert("请上传详情图片");
		return false;
	}

	return true;

}


//添加产品
function addProduct() {
	$.showPopLayer({
		target: 'uploading'
	});

	var img = $("#product_cover").attr("src");
	console.log(img);
	var Ext = "";

	var businessParam = {
		imgs: [{ ext: Ext, baseURL: img }],
		ID: newID
	};

	if (isEdit == "edit") {
		$("#up_content").text('更新信息');
		//产品封面图修改
		var coverImgUpdate,zsImgUpdate,clothImgUpdate,infoImgUpdate;
		var imgList;
		//更新封面图
		if (img.indexOf('http://') == -1 && img.indexOf('https://') == -1) {
			Ext = img.substr(11, 3);
			coverImgUpdate=$.post("https://customer.imotstudio.net/cabi/api/UpdateCollection", businessParam).done(function (res) {
				console.log("上传产品封面图：", res);
				var result = JSON.parse(res);
				if (result.code == 200) {

				}
			})
		}

		//更新滚动展示图
		if ($("#zs_pics img.zs").length > 0) {
			businessParam.imgs = [];
			$("#zs_pics img.zs").each(function (i, o) {
				img = $(o).attr('src');
				Ext = img.substr(11, 3);
				var img = { ext: Ext, baseURL: img };
				businessParam.imgs.push(img);
			});
			zsImgUpdate=$.post("https://customer.imotstudio.net/cabi/api/productList", businessParam).done(function (res) {
				console.log("上传滚动展示图：", res);
			});
		}

		//更新面料信息
		if ($("#cloth_img").attr("src").indexOf("http://") == -1 && $("#cloth_img").attr("src").indexOf("https://") == -1) {
			
			let c_img = $("#cloth_img").attr("src");
			Ext = c_img.substr(11, 3)
			businessParam.imgs = [];
			let img = { ext: Ext, baseURL: c_img };
			businessParam.imgs.push(img);
			businessParam['intro'] = $("#cloth_text").val();
			console.log(businessParam);
			clothImgUpdate=$.post("https://customer.imotstudio.net/cabi/api/UpdateClothInfoIMG", businessParam).done(function (res) {
				console.log("更新面料信息", res);
			});
		}
		//更新详情图片
		if ($("#info_img").attr("src").indexOf("http://") == -1 && $("#info_img").attr("src").indexOf("https://") == -1) {
			let c_img = $("#info_img").attr("src");
			Ext = c_img.substr(11, 3)
			businessParam.imgs = [];
			let img = { ext: Ext, baseURL: c_img };
			businessParam.imgs.push(img);
			infoImgUpdate=$.post("https://customer.imotstudio.net/cabi/api/UpdateInfoList", businessParam).done(function (res) {
				console.log("更新详情信息", res);
			});
		}
		
		$.when(coverImgUpdate,zsImgUpdate,clothImgUpdate,infoImgUpdate).done(function(res1,res2,res3,res4){
			console.log(res1);
			console.log(res2);
			console.log(res3);
			console.log(res4);
			alert("产品信息更新成功");
			location.replace('product_manage.html');
		}).always(function(){
			$.closePopLayer();
		})
		
		

	} else {
		Ext = img.substr(11, 3)
		//上传封面图
		$.post("https://customer.imotstudio.net/cabi/api/UpdateCollection", businessParam).then(function (res) {
			console.log("上传产品封面图：", res);
			var result = JSON.parse(res);
			//console.log(result.code);
			if (result.code == 200) {
				$("#up_content").text('展示图');
				businessParam.imgs = [];
				$("#zs_pics img.zs").each(function (i, o) {
					img = $(o).attr('src');
					Ext = img.substr(11, 3);
					var img = { ext: Ext, baseURL: img };
					businessParam.imgs.push(img);
				});
				return $.post("https://customer.imotstudio.net/cabi/api/productList", businessParam);
			}
		}).then(function (res) {
			var result = JSON.parse(res);
			console.log('上传展示图：', result);
			if (result.code == 200) {
				$("#up_content").text('面料信息');
				img = $("#cloth_img").attr('src');
				Ext = img.substr(11, 3);
				var img = { ext: Ext, baseURL: img };
				businessParam.imgs = [];
				businessParam.imgs.push(img);
				businessParam['intro'] = $("#cloth_text").val();
				return $.post("https://customer.imotstudio.net/cabi/api/UpdateClothInfoIMG", businessParam);
			}
		}).then(function (res) {
			var result = JSON.parse(res);
			if (result.code == 200) {
				$("#up_content").text('详情图片');
				img = $("#info_img").attr('src');
				Ext = img.substr(11, 3);
				var img = { ext: Ext, baseURL: img };
				businessParam.imgs = [];
				businessParam.imgs.push(img);
				return $.post("https://customer.imotstudio.net/cabi/api/UpdateInfoList", businessParam);
			}
		}).done(function (res) {
			var result = JSON.parse(res);
			if (result.code == 200) {
				alert("添加产品成功");
				location.replace('product_manage.html');
			} else {
				alert(result.message);
			}
		}).always(function (res) {
			$.closePopLayer();
		});

	}

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


function cancelAddProduct() {
	if (isEdit == "") {
		if (newID !== 0 || newID !== null) {
			$.post("https://customer.imotstudio.net/cabi/api/product/DeleteProduct", { productID: newID }).done(function (res) {
				console.log(res);
			}).fail(function (err) {
				console.log(err);
			})
		}
	}
	location.replace('product_manage.html');
}


//绑定产品信息
function BindProductInfo() {
	$.get("https://customer.imotstudio.net/cabi/api/product/GetProductInfoForBackEnd?pid=" + newID).done(function (res) {
		console.log(res);
		if (res.Code == 200) {
			document.title = res.Data.NewTitle;
			$("#title").val(res.Data.NewTitle);
			$("#sub_title").val(res.Data.SubTitle);

			//由于获取产品分类是异步，所以推迟350ms绑定产品所属系列
			setTimeout(function () {
				$("#series option[value=\"" + res.Data.ThemeID + "\"]").prop("selected", true); //如果值一样 就选中对应的option,
			}, 350);

			$("#description").val(res.Data.Discribe);
			$("#price").val(res.Data.Price);
			$("#color").val(res.Data.Color);
			$("#size").val(res.Data.SizeInfo);
			$("#scene").val(res.Data.Scene);
			$("#concept").val(res.Data.DesignConcept);

			//绑定封面图
			if (res.Data.CollectionImg != null && $.trim(res.Data.CollectionImg) != "") {
				$("#product_cover").attr("src", res.Data.CollectionImg);
				$("#btn_add_poster").addClass("d-none");
				$("#poster_select").next('.card').removeClass("d-none");
			}

			//绑定展示图
			var imgs = res.Data.ListImg;
			if (imgs != null && $.trim(imgs) != "") {
				imgs = imgs.split(',');

				if (imgs.length > 0) {
					imgs.forEach(element => {
						let u = element.replace('http://', 'https://');
						console.log(u);
						let imgInit = new Image();
						imgInit.src = u;
						imgInit.setAttribute("crossOrigin", 'anonymous');
						imgInit.onload = function () {
							var b64 = getBase64Image(imgInit);
							//console.log(b64);
							addImgBlock(b64);
						}
					});
				}
			}
			//绑定面料图和面料信息
			if(res.Data.ImgList!=null && $.trim(res.Data.ImgList)!=""){
				$("#cloth_img").attr("src", res.Data.ImgList);
				$("#btn_add_cloth").addClass("d-none");
				$("#btn_add_cloth").next('.card').removeClass("d-none");
			}
			$("#cloth_text").val(res.Data.ClothInfo);

			//绑定详情阶段
			if(res.Data.Contents!=null && res.Data.Contents!=""){
				$("#info_img").attr('src', res.Data.Contents);
				$("#btn_add_info").addClass('d-none').next().removeClass('d-none');
			}
		}
	})
}


//var img = "http://127.0.0.1/base64/1.jpg";
function getBase64Image(img) {
	var canvas = document.createElement("canvas");
	canvas.width = img.width;
	canvas.height = img.height;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, img.width, img.height);
	var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
	console.log(ext);
	var dataURL = canvas.toDataURL("image/" + ext);
	return dataURL;
}

