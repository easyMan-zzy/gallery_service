"use strict";

$(document).ready(function () {
	$.ajax({
		dataType: "json",
		type: 'get',
		url: config_rest_url+"/area/district",
		success: function success(data) {
			init(data);
		}
	});
});

/**
 * 初始化区、街道、社区列表和区地图数据
 * @param data 区数据列表
 */
function init(data) {
    //区标志选中
    $("#disImg").attr("src", "img/选中.png");

    //加载区列表
    var str = '';
    for (var i=0;i<data.length;i++ ) {
        var datas = data[i];//获得的区级
        var strName = datas.name;//区级名字
        var strID = datas.id;//区级id
        if (i==0) {
            //默认第一个区
            str = str + '<li class="secondLi" data-msgid=' + datas.id + ' data-name=' + datas.name + '><a class="titleActive" href="javascript:void(0)">' + datas.name + '</a></li>';
        }else{
            str = str + '<li class="secondLi" data-msgid=' + datas.id + ' data-name=' + datas.name + '><a class="secondLi1" href="javascript:void(0)">' + datas.name + '</a></li>';
        }
    }
    $('#secondUl').html(str);

    //区列表事件绑定
    var secondLiNode = $('.secondLi');
    for (var k = 0; k < secondLiNode.length; k++) {
        $(secondLiNode[k]).click(function () {
            var thisid = $(this).data('msgid');
            var datasname = $(this).data('name');
            clickDistrict(data,thisid,datasname);
        });
    }

    //加载地图
    var nbDistrict = theCity,
        theDistrict = config_city; //nbDistrict = 城市区数据，theDistrict = 宁波
    var districtMsg = nbDistrict[theDistrict]; //宁波区数据
    var quName = []; //区一级的name
    var quposition = [];//区一级坐标
    var markersArr = []; //储存markers 信息;

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
        var theiconName;
        for (var j = 0; j < data.length; j++) {
            var chooseName = data[j];
            if (quName[x] == chooseName.name) {
                theiconID = chooseName.id;
                theiconName = chooseName.name;
            }
        }
        marker.addEventListener("click", function () {
            clickDistrict(data,theiconID,theiconName)
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
        //console.log(markers);
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

    //加载街道数据
    streetData(data[0].id,data[0].name)

    //详情关闭
    $('.mengban_close').on('click', function () {
        $('#mengbanfixed').data('show', '0');
        $('#mengbanfixed').hide();
        $('.bengban-content').css({
            marginTop: '280px',
            filter: 'alpha(opacity=30)',
            opacity: '0.3'
        });
    });
}

/**
 * 加载街道数据
 * @param id     区id
 * @param name   区name
 */
function streetData(id,name) {
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: config_rest_url+'/area/street?district=' + id,
        success: function success(data) {
            //加载街道列表
            var theStreetName = []; //当前页面街道的名字
            var str = '';
            for (var i = 0; i < data.length; i++) {
                var datas = data[i];
                var streetName = datas.name;
                var streetID = datas.id;
                theStreetName.push(streetName);
                str = str + '<li class="streetLi" data-msgids=' + streetID + ' data-name=' + streetName + '><a class="secondLi1" href="javascript:void(0)">' + streetName + '</a></li>';
            };
            $('#streetUl').html(str);

            //街道列表事件绑定
            var streetLiNode = $('.streetLi');
            for (var k = 0; k < streetLiNode.length; k++) {
                $(streetLiNode[k]).click(function () {
                    var thisid = $(this).data('msgids');
                    clickStreet(data,thisid,name);
                });
            }
            //改变街道选中
            $(".streetLi").each(function(index, domEle){
                if (index==0){
                    $(this).children().removeClass("secondLi1");
                    $(this).children().removeClass("titleActive");
                    $(this).children().addClass("titleActive");
                }else {
                    $(this).children().removeClass("secondLi1");
                    $(this).children().removeClass("titleActive");
                    $(this).children().addClass("secondLi1");
                }
            });
            //加载社区数据
            communityData(data[0].id,data[0].name)
        }
    });
}

/**
 * 加载社区数据
 * @param id    街道id
 * @param name  街道name
 */
function communityData(id,name) {
    //加载社区数据
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: config_rest_url+'/area/community?street=' + id,
        success: function success(data) {
            //data 对应街道的名字
            var theCommunityName = []; //当前社区的名字
            var str = '';
            for (var i = 0; i < data.length; i++) {
                var datas = data[i];
                var communityName = datas.name;
                var communityID = datas.id;
                theCommunityName.push(communityName);
                str = str + '<li class="communityLi" data-msgids=' + communityID + ' data-name=' + communityName + '><a class="secondLi1" href="javascript:void(0)">' + communityName + '</a></li>';
            };
            $('#communityUl').html(str);

            //街道列表事件绑定
            var communityLiNode = $('.communityLi');
            for (var k = 0; k < communityLiNode.length; k++) {
                $(communityLiNode[k]).click(function () {
                    var thisid = $(this).data('msgids');
                    clickCommunity(data,thisid,name)
                });
            }
        }
    });
}

/**
 * 点击区调用
 * @param data 区数据列表
 * @param id   区ID
 * @param name 区name
 */
function clickDistrict(data,id,name) {
    //改变区标志
    $("#disImg").attr("src", "img/选中.png");
    $("#strImg").attr("src", "img/未选中.png");
    $("#comImg").attr("src", "img/未选中.png");


    //改变区选中
    $(".secondLi").each(function(){
        if ($(this).attr("data-msgid")==id){
            $(this).children().removeClass("secondLi1");
            $(this).children().removeClass("titleActive");
            $(this).children().addClass("titleActive");
        }else {
            $(this).children().removeClass("secondLi1");
            $(this).children().removeClass("titleActive");
            $(this).children().addClass("secondLi1");
        }
    });

    //加载区级地图点位
    var nbDistrict = theCity,
        theDistrict = config_city; //nbDistrict = 城市区数据，theDistrict = 宁波
    var districtMsg = nbDistrict[theDistrict]; //宁波区数据
    var quName = []; //区一级的name
    var quposition = [];//区一级坐标
    var markersArr = []; //储存markers 信息;

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
        var theiconName;
        for (var j = 0; j < data.length; j++) {
            var chooseName = data[j];
            if (quName[x] == chooseName.name) {
                theiconID = chooseName.id;
                theiconName = chooseName.name;
            }
        }
        marker.addEventListener("click", function () {
            clickDistrict(data,theiconID,theiconName)
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
        //console.log(markers);
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

    //加载街道数据
    streetData(id,name)
}

/**
 * 点击街道调用
 * @param data   街道数据（库获取）
 * @param id     街道id
 * @param name   区name（用于对比地图js点位文件）
 */
function clickStreet(data,id,name) {
    var streetName;
    //改变街道标志
    $("#disImg").attr("src", "img/选中.png");
    $("#strImg").attr("src", "img/选中.png");
    $("#comImg").attr("src", "img/未选中.png");

    //改变街道选中
    $(".streetLi").each(function(){
        if ($(this).attr("data-msgids")==id){
            streetName = $(this).attr("data-name");
            $(this).children().removeClass("secondLi1");
            $(this).children().removeClass("titleActive");
            $(this).children().addClass("titleActive");
        }else {
            $(this).children().removeClass("secondLi1");
            $(this).children().removeClass("titleActive");
            $(this).children().addClass("secondLi1");
        }
    });

    //加载街道级地图点位
    var districtMsg = jb[name]; //选中区的街道数据
    var quName = []; //区一级的name
    var quposition = [];//区一级坐标
    var markersArr = []; //储存markers 信息;

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
            clickStreet(data,theiconID,name)
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
        //console.log(markers);
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

    //加载社区数据列表
    communityData(id,streetName)
}

/**
 * 点击社区调用
 * @param data   社区数据
 * @param id     社区id
 * @param name   街道name
 */
function clickCommunity(data,id,name) {
    //改变社区标志
    $("#disImg").attr("src", "img/选中.png");
    $("#strImg").attr("src", "img/选中.png");
    $("#comImg").attr("src", "img/选中.png");

    //改变社区选中
    $(".communityLi").each(function(){
        if ($(this).attr("data-msgids")==id){
            $(this).children().removeClass("secondLi1");
            $(this).children().removeClass("titleActive");
            $(this).children().addClass("titleActive");
        }else {
            $(this).children().removeClass("secondLi1");
            $(this).children().removeClass("titleActive");
            $(this).children().addClass("secondLi1");
        }
    });

    //加载社区级地图点位
    var districtMsg = allJiedao[name]; //所属街道的社区数据
    var quName = []; //区一级的name
    var quposition = [];//区一级坐标
    var markersArr = []; //储存markers 信息;

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
            clickCommunity(data,theiconID,name)
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
        //console.log(markers);
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
    //弹出框
    animateAjax(id);
}

//社区画廊详情
function animateAjax(num) {
    var bg = $("#scbackground");
    bg.show();
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: config_rest_url+'/gallery/galleryWithPanel?community=' + num,
        success: function success(lastdata) {
            var url = '<a class="back-china" href="http://kphl.cndzkp.com">省级首页</a>';
            $('#galleryList').html(url);
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
                var zbMain1 = '<div class=""><article class="card">';
                var allTheImgs = ''; //所有的图片
                for (var k = 0; k < theDisplayPanels.length; k++) {
                    //tDPs = theDisplayPanels 缩写了
                    var tDPs = theDisplayPanels[k];
                    var theimg = '<div class="card__thumb" data-id=' + tDPs.id + '><a href="#"><img alt=' + tDPs.changedescription + ' src= '+config_imageUrl + tDPs.image + ' /></a></div>';

                    allTheImgs = allTheImgs + theimg;
                }

                var zbMain2 = '<div class="card__body_g"><div class="card__category"><a href="#">画廊图片</a></div></div></article>' +
                    '<div class="card__description"><dl class="card-text card-text_g">';
                //gallery 部分
                var zbMain3 = '<dt>' + theGallery.name + '</dt><dd class="clearfix"><b>更换责任人：</b><span>' + theGallery.personincharge + '</span></dd>';
                var zbMain4 = '<dd class="clearfix"><b>联系电话：</b><span>' + theGallery.telofpersonincharge + '</span></dd><dd class="clearfix"><b>画廊维护情况：</b><div>' + theGallery.maintenancestatus + '</div></dd>';
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
                var zbMain6 = '</div><div class="genghuanjilu"><div>更换记录</div><select  onchange="selectOnchange()" class="dpsSelect">';
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
                $('.back-china').before(zbcontent);

                if (theDisplayPanels[0] != undefined) {
                    //隐藏除第一个之外的 所有图片
                    var imgNode = $('.card__thumb');
                    for (var x = 0; x < imgNode.length; x++) {

                        if (x == 0) {
                            continue;
                        } else {
                            $(imgNode[x]).hide();
                        }
                    }

                    //隐藏除第一个之外的 所有displayPanel 列表
                    var disNode = $('.card_text_d');
                    for (var x = 0; x < disNode.length; x++) {
                        if (x == 0) {
                            continue;
                        } else {
                            $(disNode[x]).hide();
                        }
                    }
                }
            }
            bg.hide();
        }
    });
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