
			var huizhongObj={
			sliderNode:$('#sliderbg'),
			sliderLR:$('.slider-left,.slider-right'),
			sliderLeft:$('.slider-left'),
			sliderRight:$('.slider-right'),	
			spanNodes:$('#sliderbg .slider-bot span'),
			ulNode:$('.slider-ul'),
			liNodes:$('.slider-ul li'),
			
			huizhongFun:function(curPos, oldPos){
				var _this=this;
				_this.spanNodes.eq(curPos).addClass('current').siblings('.current').removeClass('current');
		
				_this.liNodes.eq(curPos).stop(true,true).fadeIn();
				_this.liNodes.eq(oldPos).stop(true,true).fadeOut();
			},
			btnFun:function(){
				var _this=this;
				_this.spanNodes.mouseenter(function(){
					if($(this).hasClass('current')){
						return;
					}
					var curPos=$(this).index();
					var oldPos=$('#sliderbg .slider-bot .current').index();
					_this.huizhongFun(curPos,oldPos);
				});
			},
			
			
			init:function(){
				var _this=this;
				_this.sliderNode.mouseenter(function(){
					_this.sliderLR.show();
					clearInterval(_this.autoDo);
				});
				_this.sliderNode.mouseleave(function(){
					_this.sliderLR.hide();
					_this.autoDo=window.setInterval(function(){
						_this.sliderRight.click();
					},3000);
				});
				_this.btnFun();
				
				_this.sliderRight.click(function(){
					var oldPos=$('#sliderbg .slider-bot .current').index();
					var lastPos=_this.spanNodes.length-1;
					var curPos=oldPos==lastPos?0:oldPos+1;
					_this.huizhongFun(curPos,oldPos);
				});
				_this.sliderLeft.click(function(){
					var oldPos=$('#sliderbg .slider-bot .current').index();
					var lastPos=_this.spanNodes.length-1;
					var curPos=oldPos==0?lastPos:oldPos-1;
					_this.huizhongFun(curPos,oldPos);
				});
				
				_this.autoDo=window.setInterval(function(){
					_this.sliderRight.click();
				},3000);
			}
		};
		huizhongObj.init();
			
			
			
			
