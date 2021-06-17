
/* 搜索 */
var helangSearch={
    /* 元素集 */
    els:{},
    /* 搜索类型序号 */
    searchIndex:0,
    /* 火热的搜索列表 */
    hot:{
        /* 颜色 */
        color:['#ff2c00','#ff5a00','#ff8105','#fd9a15','#dfad1c','#6bc211','#3cc71e','#3cbe85','#51b2ef','#53b0ff'],
        /* 列表 */
        list:[
            'helang.love@qq.com',
            'qq:1846492969',
            'web前端梦之蓝',
            '公众号：web-7258',
            'jQuery插件库',
            'CSDN-IT博客',
            'jQuery之美-CSDN博客专栏',
            'jq22.com',
            'csdn.net',
            'mydarling.gitee.io'
        ]
    },
    /* 初始化 */
    init:function(){
        var _this=this;
        this.els={
            pickerBtn:$(".picker"),
            pickerList:$(".picker-list"),
            logo:$(".logo"),
            hotList:$(".hot-list"),
            input:$("#search-input"),
            button:$(".search")
        };

        /* 设置热门搜索列表
        this.els.hotList.html(function () {
            var str='';
            $.each(_this.hot.list,function (index,item) {
                str+='<a href="https://www.baidu.com/s?ie=utf8&oe=utf8&tn=98010089_dg&ch=11&wd='+item+'" target="_blank">'
                    +'<div class="number" style="color: '+_this.hot.color[index]+'">'+(index+1)+'</div>'
                    +'<div>'+item+'</div>'
                    +'</a>';
            });
            return str;
        });*/

        /* 注册事件 */
        /* 搜索类别选择按钮 */
        this.els.pickerBtn.click(function () {
            if(_this.els.pickerList.is(':hidden')) {
                setTimeout(function () {
                    _this.els.pickerList.show();
                },100);
            }
        });
        /* 搜索类别选择列表 */
        this.els.pickerList.on("click",">li",function () {
            _this.els.logo.css("background-image",('url(img/'+$(this).data("logo")+')'));
            _this.searchIndex=$(this).index();
            _this.els.pickerBtn.html($(this).html())
        });
        /* 搜索 输入框 点击*/
        this.els.input.click(function () {
            if(!$(this).val()){
                setTimeout(function () {
                    _this.els.hotList.hide();
                },100);
            }
        });
        /* 搜索 输入框 输入*/
        this.els.input.on("input",function () {
            if($(this).val()){
                _this.els.hotList.hide();
            }
        });
        /* 搜索按钮 */
        this.els.button.click(function () {
            var searchArr=['街道','社区'];
            if (searchArr[_this.searchIndex]=="街道") {
                var name = _this.els.input.val();
                if (name!="") {
                    streetDataSearch(name);
                }
            }
            if (searchArr[_this.searchIndex]=="社区") {
                var name = _this.els.input.val();
                if (name!="") {
                    communityDataSearchInit(name)
                }
            }
        });
        /* 文档 */
        $(document).click(function () {
            _this.els.pickerList.hide();
            _this.els.hotList.hide();
        });
        /* 搜索按钮 */
    }
};

/**
 * 加载街道数据
 * @param name   街道name
 */
function streetDataSearch(name) {
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: config_rest_url+"/area/searchstreet?name=" + name,
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
                    clickStreetSearch(thisid);
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
            communityDataSearch(data[0].id,data[0].name)
        }
    });
}

/**
 * 加载社区数据
 * @param id    街道id
 * @param name  街道name
 */
function communityDataSearch(id) {
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
                    clickCommunitySearch(thisid)
                });
            }
        }
    });
}

/**
 * 点击街道调用
 * @param id     街道id
 */
function clickStreetSearch(id) {
    //改变街道标志
    $("#disImg").attr("src", "img/选中.png");
    $("#strImg").attr("src", "img/选中.png");
    $("#comImg").attr("src", "img/未选中.png");

    //改变街道选中
    $(".streetLi").each(function(){
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

    //加载社区数据列表
    communityDataSearch(id)
}

/**
 * 点击社区调用
 * @param id     社区id
 */
function clickCommunitySearch(id) {
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
    //弹出框
    animateAjax(id);
}

/**
 * 加载社区数据搜索初始化
 */
function communityDataSearchInit(name) {
    //加载社区数据
    $.ajax({
        type: 'get',
        dataType: 'json',
        url: config_rest_url+'/area/searchcommunity?name=' + name,
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
                    clickCommunitySearch(thisid)
                });
            }
        }
    });
}