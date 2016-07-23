//功能检测，判断是否是IE浏览器
var isIE = (document.all) ? true : false;
//根据navigator中的userAgent中是否包含 MSIE 6 来判断是否是IE6
var isIE6 = isIE && ([/MEIE (\d)+\.0/i.exec(navigator.userAgent)][0].split(' ')[1].split(".")[0] == 6); 
//根据功能获取得到object的方式
var getObj = function(id){
	if(document.getElementById){
		return document.getElementById(id);
	}else if(document.all){
		return document.all[id];
	}else if(document.layers){
		return document.layers[id];
	}
}
//根据id获取object
var $ = function (id) {
	return "string" == typeof id ? getObj(id) : id;
};
var $name = function(name){
	return "string" == typeof name ? document.getElementsByName(name)[0] : name
}
//构造函数初始化
var Class = {
	create: function() {
		return function() { this.initialize.apply(this, arguments); }
	}
}
//数据合并
var Extend = function(destination, source) {
	for (var property in source) {
		destination[property] = source[property];
	}
}
//方法调用
var Bind = function(object, fun) {
	return function() {
		return fun.apply(object, arguments);
	}
}
//函数重载
var BindAsEventListener = function(object, fun) {
	var args = Array.prototype.slice.call(arguments).slice(2);
	return function(event) {
		return fun.apply(object, [event || window.event].concat(args));
	}
}
//获取计算样式
var CurrentStyle = function(element){
	return element.currentStyle || document.defaultView.getComputedStyle(element, null);
}
//事件监听
function addEventHandler(oTarget, sEventType, fnHandler) {
	if (oTarget.addEventListener) {
		oTarget.addEventListener(sEventType, fnHandler, false);
	} else if (oTarget.attachEvent) {
		oTarget.attachEvent("on" + sEventType, fnHandler);
	} else {
		oTarget["on" + sEventType] = fnHandler;
	}
};
//取消事件监听
function removeEventHandler(oTarget, sEventType, fnHandler) {
    if (oTarget.removeEventListener) {
        oTarget.removeEventListener(sEventType, fnHandler, false);
    } else if (oTarget.detachEvent) {
        oTarget.detachEvent("on" + sEventType, fnHandler);
    } else { 
        oTarget["on" + sEventType] = null;
    }
};

var Chess = Class.create();//实例化对象
Chess.prototype = {
	initialize:function(container,bOw,first,start,end,options){
		this._Start = $(start);
		this._End = $(end);
		this._Chess = $(container);
		this._context = this._Chess.getContext("2d");
		this.SetOptions(options);
		this._bOw = $name(bOw);
	},
	InitCheck:function(){
		this._bOw.checked = true;
	},
	SetOptions:function(options){
		this.options = {
			First: true,
			Me: true,
			Over:false,
			Start:false,
			Count:0,
			Wins:[],
			MyWin:[],
			ComputerWin:[],
			MyScore:[],
		    ComputerScore:[],
		    Max: 0,
		    U: 7,
		    V: 7,
		    ChessBoard :[],
		    Flag:true
		};
		Extend(this.options,options || {});
	},
	InitOptions:function(){
		this.options.Me = true;
		this.options.Over = false;
		this.options.Start=false;
		this.options.Count=0;
		this.options.Wins=[];
		this.options.MyWin=[];
		this.options.ComputerWin=[];
		this.options.MyScore=[];
		this.options.ComputerScore=[];
		this.options.Max=0;
		this.options.U= 7;
		this.options.V= 7;
		this.options.ChessBoard =[];
		this.options.Flag=true;
	},
	StartChangeOpacity:function(){
		this._End.style.opacity = 0.5;
		this._End.style.filter = "alpha(opacity:50)";
		this._Start.style.opacity = 1;
		this._Start.style.filter = "alpha(opacity:100)";
	},
	EndChangeOpacity:function(){
		this._Start.style.opacity = 0.5;
		this._Start.style.filter = "alpha(opacity:50)";
		this._End.style.opacity = 1;
		this._End.style.filter = "alpha(opacity:100)";
	},
	ClearCanvas:function(){
		this._context.clearRect(0,0,450,450);
		this._Chess.width = this._Chess.width;
	},
	Init:function(){
		for(var i = 0;i<15;i++){
			this._context.moveTo(15+i*30,15);
			this._context.lineTo(15+i*30,435);
			this._context.stroke();

			this._context.moveTo(15,15+i*30);
			this._context.lineTo(435,15+i*30);
			this._context.stroke();
		}
		this.ChessBoardArray();
		this.WinMethod();
		this.WinArray();
	},
	WinMethod:function(){
		for(var i = 0;i<15;i++){
			this.options.Wins[i] = [];
			for(var j = 0;j<15;j++){
				this.options.Wins[i][j] = [];
			}
		}

		for(var i = 0;i<15;i++){
			for(var j = 0;j<11;j++){
				for(var k = 0;k<5;k++){
					this.options.Wins[i][j+k][this.options.Count] = true;
				}
				this.options.Count++;
			}
		}

		for(var i = 0;i<15;i++){
			for(var j = 0;j<11;j++){
				for(var k = 0;k<5;k++){
					this.options.Wins[j+k][i][this.options.Count] = true;
				}
				this.options.Count++;
			}
		}

		for(var i = 0;i<11;i++){
			for(var j = 0;j<11;j++){
				for(var k = 0;k<5;k++){
					this.options.Wins[i+k][j+k][this.options.Count] = true;
				}
				this.options.Count++;
			}
		}

		for(var i = 0;i<11;i++){
			for(var j = 14;j>3;j--){
				for(var k = 0;k<5;k++){
					this.options.Wins[i+k][j-k][this.options.Count] = true;
				}
				this.options.Count++;
			}
		}
	},
	WinArray:function(){
		for(var i=0;i<this.options.Count;i++){
			this.options.MyWin[i] = 0;
			this.options.ComputerWin[i] = 0;
		}
	},
	OneStep:function(i,j,me){
		this._context.beginPath();
		this._context.arc(15+i*30,15+j*30,13,0,2 * Math.PI);
		this._context.closePath();
		var gradient = this._context.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30+2,15+j*30-2,0);
		if(me){
			gradient.addColorStop(0,"#0A0A0A");
			gradient.addColorStop(1,"#636766");
		}else{
			gradient.addColorStop(0,"#D1D1D1");
			gradient.addColorStop(1,"#F9F9F9");
		}
		this._context.fillStyle = gradient;
		this._context.fill();
	},
	ComputerAI:function(){
		this.options.Max = 0;
		this.options.U = 7;
		this.options.V = 7;
		for(var i = 0;i<15;i++){
			this.options.MyScore[i] = [];
			this.options.ComputerScore[i] = [];
			for(var j=0;j<15;j++){
				this.options.MyScore[i][j] = 0;
				this.options.ComputerScore[i][j] = 0;
			}
		}

		for(var i=0;i<15;i++){
			for(var j=0;j<15;j++){
				if(this.options.ChessBoard[i][j] == 0){
					for(var k=0;k<this.options.Count;k++){
						if(this.options.Wins[i][j][k]){
							if(this.options.MyWin[k] == 1){
								this.options.MyScore[i][j] += 200;
							}else if(this.options.MyWin[k] == 2){
								this.options.MyScore[i][j] += 400;
							}else if(this.options.MyWin[k] == 3){
								this.options.MyScore[i][j] += 2000;
							}else if(this.options.MyWin[k] == 4){
								this.options.MyScore[i][j] += 10000;
							}
							if(this.options.ComputerWin[k] == 1){
								this.options.ComputerScore[i][j] += 220;
							}else if(this.options.ComputerWin[k] == 2){
								this.options.ComputerScore[i][j] += 420;
							}else if(this.options.ComputerWin[k] == 3){
								this.options.ComputerScore[i][j] += 2100;
							}else if(this.options.ComputerWin[k] == 4){
								this.options.ComputerScore[i][j] += 20000;
							}	
						}
					}
					if(this.options.MyScore[i][j]>this.options.Max){
						this.options.Max = this.options.MyScore[i][j];
						this.options.U=i;
						this.options.V=j;
					}else if(this.options.MyScore[i][j] == this.options.Max){
						if(this.options.ComputerScore[i][j] > this.options.ComputerScore[this.options.U][this.options.V]){
							this.options.U=i;
							this.options.V=j;
						}
					}

					if(this.options.ComputerScore[i][j]>this.options.Max){
						this.options.Max = this.options.ComputerScore[i][j];
						this.options.U=i;
						this.options.V=j;
					}else if(this.options.ComputerScore[i][j] == this.options.Max){
						if(this.options.MyScore[i][j] > this.options.MyScore[this.options.U][this.options.V]){
							this.options.U=i;
							this.options.V=j;
						}
					}
				}
			}
		}
		
		this.OneStep(this.options.U,this.options.V,this.options.Me);
		this.options.ChessBoard[this.options.U][this.options.V] = 2;
		for(var k = 0;k<this.options.Count;k++){
			if(this.options.Wins[this.options.U][this.options.V][k]){
				this.options.ComputerWin[k]++;
				this.options.MyWin[k] = 6;
				if(this.options.ComputerWin[k] == 5){
					alert("计算机赢了");
					this.ClearCanvas();
					this.StartChangeOpacity();
					this.InitOptions();
					this.options.Over = true;
					this.InitCheck();
				}
			}
		}
		if(!this.options.Over){
			this.options.Me = !this.options.Me;
		}
	},
	ChessBoardArray:function(){
		for(var i = 0;i<15;i++){
			this.options.ChessBoard[i] = [];
			for(var j = 0;j<15;j++){
				this.options.ChessBoard[i][j] = 0;
			}
		}	
	}	
}


$(window).onload = function(){
	var ch = new Chess("chess","bOw","first","start","end",{Me:true,First:true});
	ch.StartChangeOpacity();
	$("start").onclick = function(){
		if(ch.options.Flag){
			var option = read();
			ch.options.Me = option['Me'];
			// ch.options.First = option['First'];
			ch.Init();
			ch.options.Flag = false;
			ch.EndChangeOpacity();
			ch.options.Over = false;
			if(!ch.options.Me){
				ch.ComputerAI();
			}
		}else{
			return;
		}
	};
	function read(){
		var option = {};
		
		var bOw = document.getElementsByName("bOw");
		
		for(var i = 0,len = bOw.length;i<len;i++){
			if(bOw[i].checked == true){
				if(bOw[i].id != "my"){
					option['Me'] = false;
				}else{
					option['Me'] = true;
				}
				
			}
		}
		return option;
	}
	$("end").onclick = function(){
		if(!ch.options.Flag){
			ch.options.Flag = true;
			ch.options.Over = true;
			ch.StartChangeOpacity();
			ch.InitOptions();
			ch.ClearCanvas();
			ch.InitCheck();
		}else{
			return;
		}
	}
	$("chess").onclick = function(e){
		if(ch.options.Over){
			return;
		}
		if(!ch.options.Me){
			alert(ch.options.Me+"Me");
			return;
		}
		var x = e.offsetX;
		var y = e.offsetY;
		var i = Math.floor(x / 30);
		var j = Math.floor(y / 30);
		if(ch.options.ChessBoard[i][j] == 0){
			ch.OneStep(i,j,ch.options.Me);
			ch.options.ChessBoard[i][j] = 1;
		}
		for(var k = 0;k<ch.options.Count;k++){
			if(ch.options.Wins[i][j][k]){
				ch.options.MyWin[k]++;
				ch.options.ComputerWin[k] = 6;
				if(ch.options.MyWin[k] == 5){
					alert("你赢了");
					ch.ClearCanvas();
					ch.StartChangeOpacity();
					ch.InitOptions();
					ch.options.Over = true;
					ch.InitCheck();
				}
			}
		}
		if(!ch.options.Over){
			ch.options.Me = !ch.options.Me;
			ch.ComputerAI();
		}
	}
}
