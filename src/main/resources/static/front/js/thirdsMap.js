'use strict';

//数据交互
var secondMsh = window.name; //second页面发送的数据
secondMsh = secondMsh.split(',');

$.ajax({
	type: 'get',
	dataType: 'json',
	url: config_rest_url+'/area/street?district=' + secondMsh[1],
	success: function success(data) {
		thirdData(data);
	}
});

function thirdData(data) {
	//data 对应街道的名字
	var thirdToFour = 'fourth.html';
	var theStreetName = []; //当前页面街道的名字
	var str = '';
	for (var i = 0; i < data.length; i++) {
		var datas = data[i];
		var streetName = datas.name;
		var streetID = datas.id;
		theStreetName.push(streetName);
		str = str + '<li class="thirdLi" data-msgids=' + streetID + ' data-ame=' + streetName + '><a href="javascript:void(0)">' + streetName + '</a></li>';
	};
	$('#thirdDiquLi').html(str);

	var thirdLiNode = $('.thirdLi');
	console.log(thirdLiNode);
	for (var k = 0; k < thirdLiNode.length; k++) {
		$(thirdLiNode[k]).click(function () {
			console.log(32);
			var thisid = $(this).data('msgids');
			var thisame = $(this).data('ame');
			window.name = [config_city, secondMsh[1], thisid, secondMsh[3], thisame];
			window.location.href = thirdToFour;
		});
	};

	var mk = [],
	    jsond = [],
	    iconName = [];
	var cityData = jb[secondMsh[3]];

	console.log(cityData);
	for (var key in cityData) {
		var dataobj = {};
		var value = cityData[key];
		var positions = value.position;
		//	console.log(cityData)
		//	console.log(positions);
		jsond.push(positions);
		iconName.push(key);
		dataobj.content = value.tit;
		dataobj.title = value.tit;
		dataobj.imageOffset = { width: -23, height: -21 };
		dataobj.position = { lat: positions[1], lng: positions[0] };
		mk.push(dataobj);
	}
	//console.log(jsond);
	//console.log(iconName);
	var clickName = secondMsh[3];
	if (clickName) {
		var nb = secondMsh[0];
		var nbReg = theCity[nb];
		var pos = nbReg[clickName].position; //点击的区、县的坐标
		//console.log(pos);
		showTheCilckMap(pos);
	} else {
		window.location.href = "kphlsecond.html";
	}
	$("#showName").html(clickName);
	$('#huaLangZongLan').html(clickName + '科普画廊总览');
	$('#showName').click(function () {
		window.location.reload();
	});

	function showTheCilckMap(pos) {
		var map = new BMap.Map('beilunContent');
		//地图中心点
		var point = new BMap.Point(pos[0], pos[1]);
		//地图级别
		map.centerAndZoom(point, 15);
		//地图添加覆盖物
		function initMap() {
			addMapOverlay();
		}
		function addClickHandler(target, window) {
			target.addEventListener("click", function () {
				target.openInfoWindow(window);
			});
		}

		function addMapOverlay() {
			var markers = mk;

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
			}
		}

		var map;
		initMap();
		var json_data = jsond;

		var pointArray = new Array();
		var lianjie = ['fourth.html'];

		var clname = [],
		    str = '';
		//	for (let i=0;i<iconName.length;i++) {
		//		var jiedaoName = iconName[i];
		//		str = str +'<li class="clickLijiedao"><a href=javascript:void(0)>'+ jiedaoName +'</a></li>';
		//	}
		//	$("#thirdDiquLi").html(str)

		var _loop = function _loop(_i) {
			var x = _i;
			marker = new BMap.Marker(new BMap.Point(json_data[_i][0], json_data[_i][1]));
			//生成点

			map.addOverlay(marker);
			//生成点
			pointArray[_i] = new BMap.Point(json_data[_i][0], json_data[_i][1]);
			//加载点
			//对每个点，监听，绑定事件
			var theiconName = iconName[x]; //鼠标移动到标记上的时候显示的名字 反推得到id  到下一级

			//		console.log(data)
			var theiconID = 0;
			for (var j = 0; j < data.length; j++) {
				var chooseName = data[j];
				if (iconName[x] == chooseName.name) {
					theiconID = chooseName.id;
				}
			}

			marker.addEventListener("click", function () {
				window.name = [config_city, secondMsh[1], theiconID, secondMsh[3], iconName[x]];
				setTimeout(function () {
					window.location = thirdToFour;
				}, 100);
			});

			//鼠标移入

			marker.addEventListener("mouseover", function (event) {
				var e = event || window.event;
				var xx = e.clientX,
				    yy = e.clientY,
				    top = $(window).scrollTop();
				$('#absolutethird').css({ 'top': yy + top, 'left': xx });
				$('#absolutethird').html(iconName[x]);
				$('#absolutethird').show();
			});
			marker.addEventListener("mouseout", function (event) {

				$('#absolutethird').html();
				$('#absolutethird').hide();
			});
		};

		for (var _i = 0; _i < json_data.length; _i++) {
			var marker;

			_loop(_i);
		}
		map.setViewport(pointArray);
		map.enableScrollWheelZoom(true);
	}
}