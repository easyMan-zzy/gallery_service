"use strict";

$(document).ready(function () {
	$.ajax({
		dataType: "json",
		type: 'get',
		url: config_rest_url+"/area/district",
		success: function success(data) {
			allFun(data);
		}
	});
});

function allFun(data) {
	var nbDistrict = theCity,
	    theDistrict = config_city; //nbDistrict = 城市区数据，theDistrict = 宁波
	var quposition = [];
	var districtMsg = nbDistrict[theDistrict]; //宁波区数据
	var quName = []; //区一级的name
	var quposition = [];//区一级坐标
	var secondLinkThird = 'thirdpages.html';
	var markersArr = []; //储存markers 信息;
	//创建好 li  并且对应的点击触发
	var str = '';
	var secondLiNode = $('.secondLi');
	var morenname = [config_city, '1', '2']; //默认 发送的信息
	for (var i=0;i<data.length;i++ ) {
		var datas = data[i];//获得的区 级 
		var strName = datas.name;//区级名字
		var strID = datas.id;//区级id
		str = str + '<li class="secondLi" data-msgid=' + datas.id + ' data-name=' + datas.name + '><a href="javascript:void(0)">' + datas.name + '</a></li>';
	}
	$('#secondUl').html(str);
    secondLiNode = $('.secondLi');
	for (var k = 0; k < secondLiNode.length; k++) {
		$(secondLiNode[k]).click(function () {
			var thisid = $(this).data('msgid');
			var datasname = $(this).data('name');
			window.name = [config_city, thisid, '2', datasname];
			window.location.href = secondLinkThird;
		});
	}
	
	for (var key in districtMsg) {
		//key  对应的 区名字
		var val = districtMsg[key];
		var dataObj = {},
			dataPos = val.position,
			curObj = {};
		quposition.push(dataPos);
		quName.push(key);
		dataObj.content = key;
		dataObj.title = key;
		curObj.lat = dataPos[1];
		curObj.lng = dataPos[0];
		dataObj.position = curObj;
		markersArr.push(dataObj);
	}
	
	var map = new BMap.Map('dituContent');
	var point = new BMap.Point(config_city_center[0], config_city_center[1]);
	map.centerAndZoom(point, 11); 
	
	function initMap() {
		addMapOverlay(); //向地图添加覆盖物
	}

	function addClickHandler(target, window) {
		target.addEventListener("click", function () {
			target.openInfoWindow(window);
		});
	}
	
	
	function addMapOverlay() {
		var markers = markersArr;
		console.log(markers);
		for (var index = 0; index < markers.length; index++) {
			var point = new BMap.Point(markers[index].position.lng, markers[index].position.lat);
			var marker = new BMap.Marker(point, {});
			var label = new BMap.Label(markers[index].title, { offset: new BMap.Size(25, 5) });
			var opts = {
				width: 200,
				title: markers[index].title,
				enableMessage: false
			};
			var infoWindow = new BMap.InfoWindow(markers[index].content, opts);
			marker.setLabel(label);
			addClickHandler(marker, infoWindow);
			map.addOverlay(marker);
		};
	}
	
	var map;
	initMap();
	var json_data = quposition;
	var pointArray = new Array();
	
	var _loop = function _loop(i) {
		var x = i
		
		marker = new BMap.Marker(new BMap.Point(json_data[i][0], json_data[i][1]));
		//生成点

		map.addOverlay(marker);
		//生成点

		pointArray[i] = new BMap.Point(json_data[i][0], json_data[i][1]);
		//加载点

		
		//对每个点，监听，绑定事件
		
		
		var theiconID =0;//theiconID 对应的id  循环 反推 通过名字 获得到对应名字的id
		for (var j = 0; j < data.length; j++) {
				var chooseName = data[j];
				if (quName[x] == chooseName.name) {
					theiconID = chooseName.id;
				}
			}
		
		marker.addEventListener("click", function () {
			window.name = [config_city, theiconID, '2', quName[x]];
			window.location.href = secondLinkThird;
		});

		marker.addEventListener("mouseover", function (event) {
			var e = event || window.event;
			var xx = e.clientX,
			    yy = e.clientY,
			    top = $(window).scrollTop();
			$('#absolutesecond').css({ 'top': yy + top, 'left': xx });
			$('#absolutesecond').html(quName[x]);
			$('#absolutesecond').show();
		});
		marker.addEventListener("mouseout", function (event) {

			$('#absolutesecond').html();
			$('#absolutesecond').hide();
		});
	};

	
	
	
	for (var _i = 0; _i < json_data.length; _i++) {
			var marker;

			_loop(_i);
		}
	
	map.setViewport(pointArray);
	
	map.enableScrollWheelZoom(true);
}
