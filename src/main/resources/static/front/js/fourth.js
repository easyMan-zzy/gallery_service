var thirdMsh = window.name; //third 页面发送的数据
thirdMsh = thirdMsh.split(',');

$.ajax({
	type: 'get',
	dataType: 'json',
	url: config_rest_url+'/area/community?street=' + thirdMsh[2],
	success: function success(data) {
		fourthData(data);
	}
});

var allJiedao = allJiedao; // city 里面 所有街道的变量
function fourthData(data) {
	var getData = window.name;
	var map = new BMap.Map('fourthMap');
	var point = new BMap.Point(config_city_center[0], config_city_center[1]);
	map.enableScrollWheelZoom(true);
	map.centerAndZoom(point, 16);

	var arrFourth = getData.split(',');
	var jiedaoClickName = arrFourth[1]; //window.name 里面街道的名字

	//console.log(allJiedao);
	var showJiedao = allJiedao[thirdMsh[4]]; // 点击的街道 下 所有社区的点的坐标
	console.log(arrFourth);
	var showPoint = [],
	    showPointName = [];

	var iconNamefourth = [];
	for (var key in showJiedao) {
		var value = showJiedao[key];
		showPoint.push(value.position);
		showPointName.push(key);
		var datas = {};
		var positionss = value.position;
		datas.content = value.tit;
		datas.title = value.tit;
		datas.imageOffset = {
			width: -23,
			height: -21
		};
		datas.position = {
			lat: positionss[1],
			lng: positionss[0]
		};
		iconNamefourth.push(datas);
	}
	//console.log(showPoint)//坐标
	//console.log(showPointName)//坐标对应的点
	function addClickHandler(target, window) {
		target.addEventListener("mouseenter", function () {
			target.openInfoWindow(window);
		});
	}

	$('#fourth_qu').html(thirdMsh[3]);
	$('#fourth_qu_zhen').html(thirdMsh[4]);
	$('#fourth_div_zhen').html(thirdMsh[4] + "科普画廊总览");

	// 左侧 导航栏添加
	var strs = '';
	for (var i = 0; i < data.length; i++) {
		var _datas = data[i];
		strs = strs + '<li class="navlili"><a href="##">' + _datas.name + '</a></li>';
	}
	$('#fourth_zhen_list').html(strs);

	$('#fourth_qu_zhen').click(function () {
		window.location.reload();
	});

	$('#fourth_qu').click(function () {
		window.history.go(-1);
	});

	function addMapOverlay() {
		var markers = iconNamefourth;
		for (var index = 0; index < markers.length; index++) {
			var point = new BMap.Point(markers[index].position.lng, markers[index].position.lat);
			var marker = new BMap.Marker(point, {});
			var label = new BMap.Label(markers[index].title, {
				offset: new BMap.Size(25, 5)
			});
			var opts = {
				width: 200,
				title: markers[index].title,
				enableMessage: false
			};
			var infoWindow = new BMap.InfoWindow(markers[index].content, opts);
			marker.setLabel(label);
			addClickHandler(marker, infoWindow);
			//enterShow(marker,label);
			map.addOverlay(marker);
		}
	}

	function ininin() {
		addMapOverlay();
	}

	//console.log(showPoint);
	var json_data = showPoint;
	var pointArray = new Array();
	var divShow = [];

	function hover(value) {
		console.log(value);
	}

	ininin();

	var _loop = function _loop(_i) {
		var x = _i;
		var markers = iconNamefourth[x].content;
		//	console.log(markers)
		marker = new BMap.Marker(new BMap.Point(json_data[x][0], json_data[x][1]));
		opts = {
			title: '<span style="font-size:14px;color:red;">这里是移入</span>'
			//	console.log(data);
			//生成点
		};
		map.addOverlay(marker);
		//生成点
		pointArray[_i] = new BMap.Point(json_data[_i][0], json_data[_i][1]);
		//加载点
		//var label = new BMap.Label(markers[x].title,{offset: new BMap.Size(25,5)});

		//
		var theiconId = void 0;
		for (var j = 0; j < data.length; j++) {
			var thedatas = data[j];
			if (thedatas.name == markers) {
				theiconId = thedatas.id;
			}
		}

		marker.addEventListener("mouseover", function (event) {

			var e = event || window.event;
			var xx = e.clientX,
			    yy = e.clientY,
			    top = $(window).scrollTop();
			$('#absolutes').css({
				'top': yy + top,
				'left': xx
			});
			$('#absolutes').html(markers);
			$('#absolutes').show();
		});
		marker.addEventListener("mouseout", function (event) {
			$('#absolutes').html();
			$('#absolutes').hide();
		});
		//对每个点，监听，绑定事件
		marker.addEventListener("click", function () {
			var shequName = showPointName[x];
			//console.log(getData);
			//console.log(theiconId);
			animateAjax(theiconId);
			if ($('#mengbanfixed').data('show') == 0) {
				$('#mengbanfixed').data('show', '1');
				$('#mengbanfixed').show();
				$('.bengban-content').animate({
					marginTop: '-20px',
					filter: 'alpha(opacity=100)',
					opacity: '1'
				}, 500);
			}
		});
	};

	for (var _i = 0; _i < json_data.length; _i++) {
		var marker;
		var opts;

		_loop(_i);
	}

	map.setViewport(pointArray);

	$('#mengbanfixed').on('click', function (e) {
		if ($('#mengbanfixed').data('show') == '1') {
			$('#mengbanfixed').data('show', '0');
			$('#mengbanfixed').hide();
			$('.bengban-content').css({
				marginTop: '280px',
				filter: 'alpha(opacity=30)',
				opacity: '0.3'
			});
		};
	});
	$('.bengban-content').on('click', function (e) {
		e.stopPropagation();
	});

	$('.mengban_close').on('click', function () {
		$('#mengbanfixed').data('show', '0');
		$('#mengbanfixed').hide();
		$('.bengban-content').css({
			marginTop: '280px',
			filter: 'alpha(opacity=30)',
			opacity: '0.3'
		});
	});

	function navClicks(data) {
		var navLiNodes = $('.navlili a');
		for (var i = 0; i < navLiNodes.length; i++) {
			var _x = i;
			$(navLiNodes[_x]).on('click', function () {
				if ($('#mengbanfixed').data('show') == 0) {
					var theNavClickName = $(this).html();
					var id = getNavClickId(data, theNavClickName);
					console.log(id);
					animateAjax(id);
					$('#mengbanfixed').data('show', '1');
					$('#mengbanfixed').show();
					$('.bengban-content').animate({
						marginTop: '-20px',
						filter: 'alpha(opacity=100)',
						opacity: '1'
					}, 500);
				}
			});
		}
	}
	navClicks(data);

	//通过点击的名字获得id
	function getNavClickId(data, name) {
		for (var _i2 = 0; _i2 < data.length; _i2++) {
			var _datas2 = data[_i2];
			if (_datas2.name == name) {
				return _datas2.id;
			}
		};
	}
}

function selectOnchange() {
	var dpsSelectNode = $(".dpsSelect");
	var checkid = 0;
	for (var i = 0; i < dpsSelectNode.length; i++) {
		var checkText = $(dpsSelectNode[i]).find("option:selected").val();
		checkid = checkText;
	}

	var imgsNode = $('.card__thumb');
	for (var _i3 = 0; _i3 < imgsNode.length; _i3++) {
		if ($(imgsNode[_i3]).data('id') == checkid) {
			$(imgsNode[_i3]).show().siblings().hide();
			$('.card__body_g').show();
		}
	}
	var dsNode = $('.card_text_d');
	for (var _i4 = 0; _i4 < dsNode.length; _i4++) {
		if ($(dsNode[_i4]).data('num') == checkid) {
			$(dsNode[_i4]).show().siblings().hide();
			$('.card-text_g').show();
		}
	}
}

//最后点击点产生的 弹出框
function animateAjax(num) {
	$.ajax({
		type: 'get',
		dataType: 'json',
		url: config_rest_url+'/gallery/galleryWithPanel?community=' + num,
		success: function success(lastdata) {
			$('#galleryList').html("");
			//console.log(lastdata);
			for (var i = 0; i < lastdata.length; i++) {
				var datas = lastdata[i]; //datas 就是每一条
				var theGallery = datas.gallery; ////每一个的 gallery
				var theDisplayPanels = datas.displayPanels; //每一个的 displayPanels
				//console.log();
				//				console.log(theGallery);
				//				console.log(theDisplayPanels);
				//展板加载的内容 
				var allDisplayPanelsDate = []; //一条数据的所有option
				var allDisplayPanelsID = [];

				if (theDisplayPanels[0]) {
					for (var j = 0; j < theDisplayPanels.length; j++) {

						var theDisplayPanel = theDisplayPanels[j]; //单个
						allDisplayPanelsDate.push(theDisplayPanel.changedate); //每个的日期
						allDisplayPanelsID.push(theDisplayPanel.id);
					}
				}

				//				console.log(theDisplayPanels[0].id);
				var zbcontent = '';
				//zbMain 展板内容
				var zbMain1 = '<div class="zhanban-main clearfix"><article class="card">';
				var allTheImgs = ''; //所有的图片
				for (var k = 0; k < theDisplayPanels.length; k++) {
					//tDPs = theDisplayPanels 缩写了
					var tDPs = theDisplayPanels[k];
					var theimg = '<div class="card__thumb" data-id=' + tDPs.id + '><a href="#"><img alt=' + tDPs.changedescription + ' src= '+config_imageUrl + tDPs.image + ' /></a></div>';

					allTheImgs = allTheImgs + theimg;
				}

				var zbMain2 = '<div class="card__body_g"><div class="card__category"><a href="#">画廊图片</a></div><div class="card__description"><dl class="card-text card-text_g">';
				//gallery 部分
				var zbMain3 = '<dt>' + theGallery.name + '更换记录</dt><dd class="clearfix"><b>更换责任人：</b><span>' + theGallery.personincharge + '</span></dd>';
				var zbMain4 = '<dd class="clearfix"><b>联系电话：</b><span>' + theGallery.telofpersonincharge + '</span></dd><dd class="clearfix"><b>画廊维护情况：</b><span>' + theGallery.maintenancestatus + '</span></dd>';
				var zbMain5 = '<dd class="clearfix"><b>画廊更换周期：</b><span>' + theGallery.changeperiod + '</span></dd><dd class="clearfix"><b>画廊投诉电话：</b><span>' + theGallery.telofpersonincharge + '</span></dd></dl>';
				//displayPanels 部分
				var allTDPS = '';
				if (theDisplayPanels[0] != undefined) {
					for (var _k = 0; _k < theDisplayPanels.length; _k++) {
						//tDPs = theDisplayPanels 缩写了
						var _tDPs = theDisplayPanels[_k];
						var tDPs1 = '<dl class="card-text card_text_d" data-num=' + _tDPs.id + '>';
						var tDPs2 = '<dd class="clearfix"><b>画廊更换内容：</b><span>' + _tDPs.changedescription + '</span></dd>';
						var tDPs3 = '<dd class="clearfix"><b>更换时间：</b><span>' + _tDPs.changedate + '</span></dd>';
						var tDPs4 = '<dd class="clearfix"><b>版块简介：</b><div>' + _tDPs.paneldescription + '</div></dd></dl>';

						allTDPS = allTDPS + tDPs1 + tDPs2 + tDPs3 + tDPs4;
					};
				}
				var zbMain6 = '</div></div></article><div class="genghuanjilu"><div>更换记录</div><select  onchange="selectOnchange()" class="dpsSelect">';
				var options = '';
				if (theDisplayPanels[0] != undefined) {
					for (var _k2 = 0; _k2 < theDisplayPanels.length; _k2++) {
						//tDPs = theDisplayPanels 缩写了
						var _tDPs2 = theDisplayPanels[_k2];
						var tDPsoption = '<option value=' + _tDPs2.id + '>' + _tDPs2.changedate + '</option>';
						options = options + tDPsoption;
					}
				}
				zbcontent = zbMain1 + allTheImgs + zbMain2 + zbMain3 + zbMain4 + zbMain5 + allTDPS + zbMain6 + options;

				//将所有数据 添加到HTML中
				$('#galleryList').append(zbcontent);

				if (theDisplayPanels[0] != undefined) {
					//隐藏除第一个之外的 所有图片
					var imgNode = $('.card__thumb');
					for (x = 0; x < imgNode.length; x++) {

						if (x == 0) {
							continue;
						} else {
							$(imgNode[x]).hide();
						}
					}

					//隐藏除第一个之外的 所有displayPanel 列表
					var disNode = $('.card_text_d');
					for (x = 0; x < disNode.length; x++) {
						if (x == 0) {
							continue;
						} else {
							$(disNode[x]).hide();
						}
					}
				}
			}
		}
	});
}