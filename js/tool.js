/************
***初始化左侧地图工具事件（放大缩小、搜索等）
***数据面板最小化及关闭
***
***
*************/
initToolBar();
var drawGeo;//测量时画出的geometry
var timecount = 50;//infotip显示时的间隔，每次显示时需要重新初始化

function initToolBar()
{
	//地图放大按钮点击事件
	$('#zoomin').bind('click',function(){
		var deslevel = map.getLevel()+1;
		map.setLevel(deslevel);
	});

	$('#kq_aqi_level').bind('mouseover',function(){
		var currobj = $(this);
		var pos = currobj.offset();
		var wh = currobj.width();
		var ht = currobj.height();
		$('#kqzldetail').css({'z-index':'10000','opacity':'1','top':pos.top+ht+10});
	});

	$('#kq_aqi_level').bind('mouseout',function(){
		$('#kqzldetail').css({'z-index':'-1','opacity':'0','top':'100px'});
	});

	//地图缩小按钮点击事件
	$('#zoomout').bind('click',function(){
		var deslevel = map.getLevel()-1;
		map.setLevel(deslevel);
	});

	//收藏按钮
	$('#addfavbtn').bind('click',function(){
		addFav(window.location.href,document.title);
	});

	//退出按钮
	$('#system_user_out').bind('click',function(){
		$.cookie('login',null, { expires:-1,path: '/'});
		$.cookie('username',null, { expires:-1,path: '/'});
		window.location.href='login.html';
	});

	//全图按钮点击事件
	$('#fullextent').bind('click',function(){
		var ext = configData.map.extent;
		map.setExtent(new esri.geometry.Extent({xmin:ext.xmin,ymin:ext.ymin,xmax:ext.xmax,ymax:ext.ymax}));
	});

	//搜索结果输入框值变动事件
	$("#search_input").bind("input propertychange",function(){ 
		searchstr =  $(this).val();
		if(searchstr!="")
		{
			$('#clear_btn').css({'visibility':'visible'});
		}
		else
		{
			$('#clear_btn').css({'visibility':'hidden'});
		}
	});

	//搜索结果输入框enter事件
	$("#search_input").bind("keypress",function(){
		searchstr =  $(this).val();
		if(event.keyCode == "13")
		{
			// console.log(123131313);
			if(searchstr.trim()!="")
			{
				$('.menuitem').removeClass('currentPanel menuitem_click').children(':first-child').css({'display':'none'});
				runWidget('搜索结果');
			}
		}
	});

	//搜索结果查询按钮点击事件
	$("#search_btn").bind("click",function(){
		searchstr =  $("#search_input").val();
		if(searchstr.trim()!="")
		{
			runWidget('搜索结果');
		}
	});

	//搜索结果清除按钮点击事件
	$("#clear_btn").bind("click",function(){
		$('#search_input').val("");
		$('#clear_btn').css({'visibility':'hidden'});
		if(currentPanel == "搜索结果")
		{
			$('#widgetPanel').trigger('panelClose');
			$('#panelDiv').animate({"opacity":"0"},400,function(){$('#panelDiv').css({'display':'none'})});
			$('.menuitem').css({'background-color':'','color':'','border-bottom':''}).removeClass('currentPanel');
			currentPanel = "";
		}
	});

	//主面板关闭按钮点击事件
	$("#paneltitle_close").bind("click",function(){ 
		currentPanel = "";
		var currobj = $('#panelDiv');
		currobj.animate({"opacity":"0"},400,function(){currobj.css({'display':'none','height':'35px'})});
		$('.menuitem').removeClass('currentPanel menuitem_click').children(':first-child').css({'display':'none'});
		$('#widgetPanel').trigger('panelClose');
		$('#search_input').val('');
		$('#clear_btn').css({'visibility':'hidden'});
	});

	//主面板最小化按钮点击事件
	$("#paneltitle_mini").bind("click",function(){
		var currobj = $('#panelDiv');
		var ht = currobj.css({'display':'block'}).height();
		if(ht>40)
		{
			currobj.stop().animate({"height":"35px"},200);
			$('#paneltitle_mini').css({'background':'url("images/fold_down.png") no-repeat center center'});
		}
		else
		{
			currobj.stop().animate({"height":"100%"},200,function(){currobj.css({'height':''})});
			$('#paneltitle_mini').css({'background':'url("images/fold_up.png") no-repeat center center'});
		}
	});

	//全屏按钮点击事件
	$('#qp').bind('click', function(e) {
	    if(fullbool)
	    {
	      cancelFullScreen();
	    }
	    else
	    {
	      launchFullScreen();
	    }
	});

	//图层按钮鼠标移入事件
	$('#la').bind('mouseover', function(e) {
		clearTimeout(timeint);
		var bms = configData.map.baseUrl;
		var bli = $('#layerlist');
		var htmlstr = "";
		for(var i=0;i<bms.length;i++)
		{
			var o = bms[i];
			if(o.name == currentMap)
			{
				htmlstr +=  "<div class='layeritem layeritem_click' data-name='"+o.name+"'>"+
			                    "<div><img src='"+o.icon+"'/></div>"+
			                    "<div>"+o.name+"</div>"+
			                "</div>";
			}
			else
			{
				htmlstr +=  "<div class='layeritem' data-name='"+o.name+"'>"+
			                    "<div><img src='"+o.icon+"'/></div>"+
			                    "<div>"+o.name+"</div>"+
			                "</div>";
			}
		}
		bli.html(htmlstr);
		bli.stop().css({'display':'block'}).animate({"opacity":"1"},400);
		$('.layeritem').bind('click', function(e) {
        	e.stopPropagation();
        	var curobj = $(this);
        	$('.layeritem').removeClass('layeritem_click');
			curobj.addClass('layeritem_click');
			var namestr = curobj.attr('data-name');
			currentMap = namestr;
			$('#tpf25d').css({"visibility":"hidden"});
			$('#shijingdiv').css({"visibility":"hidden"});
			$('#mapsmall').css({"bottom":"-180px"});
			if(namestr=="2.5维")
			{
				$('#tpf25d').css({"visibility":"visible"});
			}
			else if(namestr=="实景")
			{
				$('#shijingdiv').css({"visibility":"visible"});
				$('#mapsmall').css({"bottom":"0px"});
			}
			else
			{
				for(var i=0;i<basemapArray.length;i++)
				{
					var o = basemapArray[i];
					o.layer.setVisibility((o.name == namestr)?true:false);
					// if(o.name == namestr)
					// {
					// 	o.layer.show();
					// }
					// else
					// {
					// 	o.layer.hide();
					// }
				}
			}
		});
	});

	//图层按钮鼠标移出事件
	$('#la').bind('mouseout', function(e) {
		timeint = setTimeout('hide_layerlist_div_fun()',300);
	});

	//工具箱按钮鼠标移入事件
	$('#toolli').bind('mouseover', function(e) {
		$(this).css({'width':'202px'});
	});

	//工具箱按钮鼠标移出事件
	$('#toolli').bind('mouseout', function(e) {
		$(this).css({'width':'40px'});
	});

	//图层列表鼠标移入事件
	$('#layerlist').bind('mouseover', function(e) {
		clearTimeout(timeint);
	});

	//图层列表鼠标移出事件
	$('#layerlist').bind('mouseout', function(e) {
		timeint = setTimeout('hide_layerlist_div_fun()',300);
	});

	//清除按钮点击事件
	$('#cl').bind('click', function(e) {
		bzIndex = 1;
		map.graphics.clear();
		tb.deactivate();
		removeinfotip('staticgraphics');
	});

	//图层编辑按钮点击事件
	$('#le').bind('click', function(e) {
		runWidget('图层编辑');
	});

	//影像对比按钮点击事件
	$('#mc').bind('click', function(e) {
		runWidget('影像对比');
	});

	//下载按钮点击事件
	$('#dl').bind('click', function(e) {
		var htmlstr = "<div style='width:100%;height:100%;padding:10px;'>";
		var filelist = configData.download.filelist;
		for(var i=0;i<filelist.length;i++)
		{
			var o = filelist[i];
			htmlstr += "<div class='downloaditem'><div style='float:left;'>"+o.label+"</div><div style='float:right;color:#58C3F5;font-size:12px;cursor:pointer;' onclick='"+
						"window.location.href=\""+configData.download.url+o.filename+"\""+
						"'>下载</div></div>";
		}
		htmlstr += "</div>";
		layer.open({
			type:1,//page层
			area:['500px'],
			title:'下载列表',
			shade:0.2,
			shadeClose:false,
			moveType:1,//拖拽风格，0默认，1常规
			shift:0,//动画类型0-6，-1不开启
			content:htmlstr
		});
	});

	//打印按钮点击事件
	$('#pr').bind('click', function(e) {
		// html2canvas(document.body, {
  //           onrendered: function(canvas) {
  //           	console.log(canvas.toDataURL());
  //           	document.getElementById('screenshut').innerHTML = "<img src='"+canvas.toDataURL()+"'/>";
  //           }
  //       });

        require(["esri/tasks/PrintTask","esri/tasks/PrintParameters"],
        	function(PrintTask,PrintParameters){
        		var printTask = new PrintTask('http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export Web Map Task');
				var params = new PrintParameters();
				params.map = map;
				printTask.execute(params, printResult);
				function printResult(url)
				{
					console.log(url);
				}
        });

		
	
	});

	var bzIndex = 1;//标注的序号
	var bzClick = false;//标注是否激活
	//标注按钮点击事件
	$('#bz').bind('click', function(e) {
		if(bzClick)
		{
			bzClick = false;
			tb.deactivate();
			return;
		}
		bzClick = true;
		timecount = 50;
	    // map.graphics.clear();
	    require(["dojo/dom",
		          "dojo/_base/lang",
		          "dojo/json",
		          "esri/config",
		          "esri/map",
		          "esri/graphic",
		          "esri/geometry/Geometry",
		          "esri/geometry/Extent",
		          "esri/SpatialReference",
		          "esri/tasks/GeometryService",
		          "esri/tasks/LengthsParameters",
		          "esri/toolbars/draw",
		          "esri/symbols/PictureMarkerSymbol",
		          "esri/symbols/TextSymbol",
		          "esri/symbols/Font",
		          "esri/Color"],
		    function(dom, lang, json, esriConfig, Map, Graphic, Geometry, Extent, SpatialReference, GeometryService, LengthsParameters, Draw, PictureMarkerSymbol,TextSymbol,Font,Color){
		      	var sms = new PictureMarkerSymbol('images/locate.png', 32, 32).setOffset(0, 16);
		      	tb.deactivate();
		      	tb = new Draw(map);
		        tb.on("draw-end", lang.hitch(map, getPoint));
		        // tb.activate(Draw.MULTI_POINT);
		        tb.activate(Draw.POINT);
		        tb.markerSymbol = sms;

		    	function getPoint(evtObj) {
		    		console.log(evtObj);
		      		var map = this,
		          	geometry = evtObj.geometry;
		          	drawGeo = geometry;
				    var graphic = map.graphics.add(new Graphic(geometry, sms));
				    // tb.deactivate();
				    // showinfotip(graphic,"<span style='margin:5px 5px 0px 5px;'>标题:</span><input type='text' style='margin:0px;'/>","top","staticgraphics",false,0,-35);
				    showinfotip(graphic,"<span style='margin:5px 5px 0px 5px;'>标注"+bzIndex+"</span>","top","staticgraphics",false,0,-35);
				    bzIndex++;
		    	}
		});
	});

	//测量距离点击事件
	$('#cj').bind('click', function(e) {
		bzIndex = 1;
		removeinfotip('staticgraphics');
		timecount = 50;
		map.graphics.clear();
	    require(["dojo/dom",
		          "dojo/_base/lang",
		          "dojo/json",
		          "esri/config",
		          "esri/map",
		          "esri/graphic",
		          "esri/geometry/Geometry",
		          "esri/geometry/Extent",
		          "esri/SpatialReference",
		          "esri/tasks/GeometryService",
		          "esri/tasks/LengthsParameters",
		          "esri/toolbars/draw",
		          "esri/symbols/SimpleLineSymbol",
		          "esri/symbols/TextSymbol",
		          "esri/symbols/Font",
		          "esri/Color"],
		    function(dom, lang, json, esriConfig, Map, Graphic, Geometry, Extent, SpatialReference, GeometryService, LengthsParameters, Draw, SimpleLineSymbol,TextSymbol,Font,Color){
		      	var sls = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([88,195,245,.9]),5);
		      	tb.deactivate();
		      	tb = new Draw(map);
		        tb.on("draw-end", lang.hitch(map, getLength));
		        // tb.activate(Draw.FREEHAND_POLYLINE);
		        tb.activate(Draw.POLYLINE);
		        tb.lineSymbol = sls;
		      	var geometryService = new GeometryService("http://10.254.11.7:8399/arcgis/rest/services/Geometry/GeometryServer");
		      	geometryService.on("lengths-complete", outputLength);

		    	function getLength(evtObj) {
		    		tb.deactivate();
		      		var map = this,
		          	geometry = evtObj.geometry;
		          	drawGeo = geometry;
				    var graphic = map.graphics.add(new Graphic(geometry, sls));
			      	var lengthParams = new LengthsParameters();
			      	lengthParams.lengthUnit = GeometryService.UNIT_METER;
			      	lengthParams.geodesic = true;
			      	lengthParams.calculationType = "geodesic";
			      	geometryService.simplify([geometry], function(simplifiedGeometries) {
		        		lengthParams.polylines = simplifiedGeometries;
		        		geometryService.lengths(lengthParams);
		      		});
		      		// 以下方式为不用geometryserver方式获取长度
					// if (geometry.type == "polyline") 
					// {
		   //              var geo = esri.geometry.webMercatorToGeographic(geometry);
		   //              var Length = esri.geometry.geodesicLengths([geo], esri.Units.METERS);
		   //          }
		   //          else if(geometry.type == "polygon") {
		   //              var geo = esri.geometry.webMercatorToGeographic(geometry);
		   //              var Area = esri.geometry.geodesicAreas([geo], esri.Units.SQUARE_METERS);
		   //          }
		    	}
			    function outputLength(evtObj) {
			      	var result = evtObj.result;
			      	console.log(json.stringify(result));
			      	var lts = new TextSymbol(result.lengths[0].toFixed(3)+" 米",new Font("12px", Font.STYLE_NORMAL,Font.VARIANT_NORMAL, Font.WEIGHT_BOLD),new Color([0,0,0,.8]));
		      		map.graphics.add(new Graphic(drawGeo.getExtent().getCenter(), lts));
			    }
		});
	});

	//测量面积点击事件
	$('#cm').bind('click', function(e) {
		bzIndex = 1;
		removeinfotip('staticgraphics');
		timecount = 50;
		map.graphics.clear();
	    require(["dojo/dom",
		          "dojo/_base/lang",
		          "dojo/json",
		          "esri/config",
		          "esri/map",
		          "esri/graphic",
		          "esri/geometry/Geometry",
		          "esri/geometry/Extent",
		          "esri/SpatialReference",
		          "esri/tasks/GeometryService",
		          "esri/tasks/AreasAndLengthsParameters",
		          "esri/toolbars/draw",
		          "esri/symbols/SimpleFillSymbol",
		          "esri/symbols/SimpleLineSymbol",
		          "esri/symbols/TextSymbol",
		          "esri/symbols/Font",
		          "esri/Color"],
		    function(dom, lang, json, esriConfig, Map, Graphic, Geometry, Extent, SpatialReference, GeometryService, AreasAndLengthsParameters, Draw, SimpleFillSymbol, SimpleLineSymbol,TextSymbol,Font,Color){
		      	var sls = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([88,195,245,.8]),3);
		      	var sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,sls,new Color([88,195,245,.6]));
		      	tb.deactivate();
		      	tb = new Draw(map);
		        tb.on("draw-end", lang.hitch(map, getAreaAndLength));
		        // tb.activate(Draw.FREEHAND_POLYGON);
		        tb.activate(Draw.POLYGON);
		        tb.fillSymbol = sfs;
		      	var geometryService = new GeometryService("http://10.254.11.7:8399/arcgis/rest/services/Geometry/GeometryServer");
		      	geometryService.on("areas-and-lengths-complete", outputAreaAndLength);

		    	function getAreaAndLength(evtObj) {
		    		tb.deactivate();
		      		var map = this,
		          	geometry = evtObj.geometry;
		          	drawGeo = geometry;
		      		var graphic = map.graphics.add(new Graphic(geometry, sfs));
					var areasAndLengthParams = new AreasAndLengthsParameters();
					areasAndLengthParams.lengthUnit = GeometryService.UNIT_METER;
					areasAndLengthParams.areaUnit = GeometryService.UNIT_SQUARE_METERS;
					areasAndLengthParams.calculationType = "geodesic";


					//4326坐标系转换时出现错误，需要转换以下坐标系
					var outSR = new esri.SpatialReference({ wkid: 102113 });
			        geometryService.project([geometry], outSR, function (geometry) {
			            geometryService.simplify(geometry, function (simplifiedGeometries) {
			                areasAndLengthParams.polygons = simplifiedGeometries;
			                // areasAndLengthParams.polygons[0].spatialReference = new esri.SpatialReference(102113);
			                geometryService.areasAndLengths(areasAndLengthParams);
			            });
			        });


					// geometryService.simplify([geometry], function(simplifiedGeometries) {
					// 	areasAndLengthParams.polygons = simplifiedGeometries;
					// 	geometryService.areasAndLengths(areasAndLengthParams);
					// });
		    	}
			    function outputAreaAndLength(evtObj) {
			      	var result = evtObj.result;
			     	console.log(json.stringify(result));
			      	var ats = new TextSymbol(result.areas[0].toFixed(3)+" 平方米",new Font("12px", Font.STYLE_NORMAL,Font.VARIANT_NORMAL, Font.WEIGHT_BOLD),new Color([0,0,0,.8]));
		      		map.graphics.add(new Graphic(drawGeo.getExtent().getCenter(), ats));
			      	var lts = new TextSymbol(result.lengths[0].toFixed(3)+" 米",new Font("12px", Font.STYLE_NORMAL,Font.VARIANT_NORMAL, Font.WEIGHT_BOLD),new Color([0,0,0,.8])).setOffset(0, -20);
		      		map.graphics.add(new Graphic(drawGeo.getExtent().getCenter(), lts));

			    }
		});
	});
	
	//infowindow关闭
	$('#infowindowdiv_close').bind('click',function(e){
		closeinfowindow();
	});
}

//图层列表面板div时间定时器
var timeint = 0;
function hide_layerlist_div_fun()
{
  $('#layerlist').stop().animate({"opacity":"0"},200,function(){$('#layerlist').css({'display':'none'})});
}


//标示当前窗口是否全屏
var fullbool = false;
//全屏
function launchFullScreen(element) {
  fullbool = true;
  if(!element)
  {
    element = document.documentElement;
  }
  if(element.requestFullScreen) 
  {
    element.requestFullScreen();
  } else if(element.mozRequestFullScreen) 
  {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullScreen) 
  {
    element.webkitRequestFullScreen();
  } else if(element.msRequestFullscreen) 
  {
    element.msRequestFullscreen();
  }
}

//退出全屏
function cancelFullScreen()
{
  fullbool = false;
  if (document.exitFullscreen) 
  { 
    document.exitFullscreen(); 
  } 
  else if (document.mozCancelFullScreen) 
  { 
    document.mozCancelFullScreen(); 
  } 
  else if (document.webkitCancelFullScreen) 
  { 
    document.webkitCancelFullScreen(); 
  } 
  else if (document.msExitFullscreen) 
  { 
    document.msExitFullscreen(); 
  }
}


//显示当前graphic提示，evt参数是当前事件，str为提示字符串
function showTooltip(evt,str)
{
	var ox = 10;
	var oy = 15;
	//tooltip最大宽度150px
	$("#"+m_divName+"_container").append("<div id='tooltipdiv'>"+str+"</div>");
	//根据tooltip的最终结果调整位置
	var dv = $("#tooltipdiv");
	var wt = dv.width();
	var ht = dv.height();
	var x = evt.offsetX+ox+'px';
	var y = evt.offsetY+oy+'px';
	if(evt.offsetX+wt+ox>=map.width)
	{
		x = evt.offsetX-wt+'px';
	}
	if(evt.offsetY+ht+oy>=map.height)
	{
		y = evt.offsetY-ht+'px';
	}
	dv.css({"left":x,"top":y});
}
//隐藏tooltip
function hideTooltip()
{
	$("#tooltipdiv").remove();
}

// 以消息提示模式显示当前graphic提示，没有关闭按钮
// gra参数是当前的图斑，
// htmlstr为现实的内容布局，
// position表示显示的位置（top、right、bottom、left）,
// identifystr表示当前的类标识,用当前的Layer名称标识即可，方便识别（用来清除infodiv）
// isanimate是否显示动画
// offsetx,offsety垂直偏移量
function showinfotip(gra,htmlstr,position,identifystr,isanimate,offsetx,offsety)
{
	var mp = null;
	if(gra.geometry.type=="point"){mp = gra.geometry;}
	else if(gra.geometry.type=="polyline"){mp = gra.geometry.getPoint(0,0);}
	else if(gra.geometry.type=="polygon"){mp = gra.geometry.getExtent().getCenter();}
	else if(gra.geometry.type=="multipoint"){mp = gra.geometry.getPoint(0);}
	else if(gra.geometry.type=="extent"){mp = gra.geometry.getExtent().getCenter();}
	if(mp==null)
	{
		return;
	}
    var pt = map.toScreen(mp);
 	var hmstr = htmlstr;
 	var crrdiv = $("<div class='infotipdiv "+identifystr+"' data-position='"+position+"' data-offsetx='"+offsetx+"' data-offsety='"+offsety+"' data-zuobiao='"+mp.x+","+mp.y+"'></div>");
	// if(position=="top")
	// {
	// 	hmstr += "<div class='arrow-down'></div><div class='arrow-downbk'></div>";
	// }
	// else if(position=="right")
	// {
	// 	hmstr += "<div class='arrow-left'></div><div class='arrow-leftbk'></div>";
	// }
	// else if(position=="bottom")
	// {
	// 	hmstr += "<div class='arrow-up'></div><div class='arrow-upbk'></div>";
	// }
	// else if(position=="left")
	// {
	// 	hmstr += "<div class='arrow-right'></div><div class='arrow-rightbk'></div>";
	// }
	var jcrrdiv = $(crrdiv);
	jcrrdiv.append(hmstr);
    $("#"+m_divName+"").append(crrdiv);
    // timecount += 50;
	var wt = jcrrdiv.width();
	var ht = jcrrdiv.height();
	//console.log(wt,ht);
	if(isanimate==false)
	{
		jcrrdiv.css({"-webkit-transition":"none","transition":"none"});
	}
	jcrrdiv.css({"top":-200}).css({"left":pt.x+offsetx,"top":pt.y-ht-13+offsety});
	// if(position=="top")
	// {
	// 	// jcrrdiv.css({"top":-200}).css({"left":pt.x-jcrrdiv.width()+13,"top":pt.y-jcrrdiv.height()-13,"opacity":0.8});
	// 	// jcrrdiv.css({"top":Math.ceil(Math.random()*(-200)+100)}).css({"left":pt.x-jcrrdiv.width()+13,"top":pt.y-jcrrdiv.height()-13,"opacity":0.8});
	// 	 setTimeout(function(){
	// 		jcrrdiv.css({"top":-200}).css({"left":pt.x-wt+13+offsetx,"top":pt.y-ht-13+offsety});
	// 		// jcrrdiv.css({"top":-200}).css({"left":pt.x-jcrrdiv.width()+13,"opacity":0.8}).animate({"top":pt.y-jcrrdiv.height()-13});
	// 	 },timecount);
	// 	//Math.ceil(Math.random()*(3000)+1000)

	// }
	// else if(position=="right")
	// {
	// 	setTimeout(function(){
	// 		jcrrdiv.css({"top":-200}).css({"left":pt.x+9+offsetx,"top":pt.y-13+offsety});
	// 	 },timecount);
	// }
	// else if(position=="bottom")
	// {
	// 	setTimeout(function(){
	// 		jcrrdiv.css({"top":-200}).css({"left":pt.x-20+offsetx,"top":pt.y+8+offsety});
	// 	 },timecount);
	// }
	// else if(position=="left")
	// {
	// 	setTimeout(function(){
	// 		jcrrdiv.css({"top":-200}).css({"left":pt.x-wt-15+offsetx,"top":pt.y-ht+8+offsety});
	// 	 },timecount);
	// }
}

// 以infowindow模式显示当前graphic提示，带关闭按钮，每次只能显示一个window实例
// gra参数是当前的图斑，
// htmlstr为显示的内容布局，
// showclosebtn是否显示关闭按钮
// evt图斑点击事件，包含当前点击的鼠标位置等信息
function showinfowindow(gra,title,htmlstr,showclosebtn,evt)
{
	$('#infowindowdiv_close').css({'display':(showclosebtn==false?'none':'block')});
	var mp = null;
	if(!evt)
	{
		if(gra.geometry.type=="point"){mp = gra.geometry;}
		else if(gra.geometry.type=="polyline"){mp = gra.geometry.getPoint(0,0);}
		else if(gra.geometry.type=="polygon"){mp = gra.geometry.getExtent().getCenter();}
		else if(gra.geometry.type=="multipoint"){mp = gra.geometry.getPoint(0);}
		else if(gra.geometry.type=="extent"){mp = gra.geometry.getExtent().getCenter();}
	}
	else
	{
		require(["esri/geometry/ScreenPoint"], 
		function(ScreenPoint) {
			var pos = new ScreenPoint(evt.offsetX,evt.offsetY);
			mp = map.toMap(pos);
		});
	}
	if(mp==null)
	{
		return;
	}
    var pt = map.toScreen(mp);
    var infowin = $('#infowindowdiv');
    infowin.attr('data-zuobiao',''+mp.x+','+mp.y);
    $('#infowindowdiv_tit').html(title);
    $('#infowindowdiv_cont').html(htmlstr);
	var wt = infowin.width();
	var ht = infowin.height();
	//console.log(wt,ht);
	infowin.css({"top":-200}).css({"left":pt.x-150,"top":pt.y-ht-30,"display":"block",'opacity':0});
	mapinfowindowmove(gra);
}
// 关闭infowindow
function closeinfowindow()
{
	$('#infowindowdiv').css({"top":-2000,'display':'none','opacity':0}).attr('data-zuobiao','');
	$('path').attr('data-highlight','');
	$('image').attr('data-highlight','');
	$('#widgetPanel').trigger('infoWindowClose');
}
//模仿百度infowindow显示方式显示自定义infowindow（当infowindow超出界面范围时，该方法可以使infowindow移动到界面范围）
function mapinfowindowmove(gra)
{
    var contobj = {xmin:0,ymin:0,xmax:0,ymax:0};//计算最小能包含infowindow的矩形区域的左下、右上的坐标信息，ymin、ymax与视窗坐标相反，目的是保持与map坐标的一致性
    var bl = false;//是否包含
    var winwidth = $(window).width();
    var winheight = $(window).height();
    var infowinwidth = $('#infowindowdiv').width();
    var infowinheight = $('#infowindowdiv').height();
    var pos = $('#infowindowdiv').offset();
    // console.log(pos.left,pos.top);
    var minx = pos.left-60;
    var miny = pos.top-170;//减一个数作用是：info要超出toolbar显示，该参数可自由设定，必须大于等于toolbar高度
    var maxx = pos.left+infowinwidth+30;
    var maxy = pos.top+infowinheight-150;
    //计算八个方位（上、下、左、右、左上、左下、右上、右下）的坐标信息，用来确定能包含infowindow的地图范围
    //上
    if(minx>=0 && maxx<=winwidth && miny<0)
    {
        bl = true;
        contobj.xmin = 0;
        contobj.xmax = winwidth;
        contobj.ymax = miny;
        contobj.ymin = miny+winheight;
    }
    //下
    else if(minx>=0 && maxx<=winwidth && maxy>winheight)
    {
        bl = true;
        contobj.xmin = 0;
        contobj.xmax = winwidth;
        contobj.ymin = maxy;
        contobj.ymax = contobj.ymin-winheight;
    }
    //左
    else if(miny>=0 && maxy<=winheight && minx<0)
    {
        bl = true;
        contobj.xmin = minx;
        contobj.xmax = minx+winwidth;
        contobj.ymin = winheight;
        contobj.ymax = 0;
    }
    //右
    else if(miny>=0 && maxy<=winheight && maxx>winwidth)
    {
        bl = true;
        contobj.xmin = maxx-winwidth;
        contobj.xmax = maxx;
        contobj.ymin = winheight;
        contobj.ymax = 0;
    }
    //左上
    else if(minx<0 && miny<0)
    {
        bl = true;
        contobj.xmin = minx;
        contobj.xmax = minx+winwidth;
        contobj.ymin = miny+winheight;
        contobj.ymax = miny;
    }
    //左下
    else if(minx<0 && maxy>winheight)
    {
        bl = true;
        contobj.xmin = minx;
        contobj.xmax = minx+winwidth;
        contobj.ymin = maxy;
        contobj.ymax = maxy-winheight;
    }
    //右上
    else if(maxx>winwidth && miny<0)
    {
        bl = true;
        contobj.xmin = maxx-winwidth;
        contobj.xmax = maxx;
        contobj.ymin = miny+winheight;
        contobj.ymax = miny;
    }
    //右下
    else if(maxx>winwidth && maxy>winheight)
    {
        bl = true;
        contobj.xmin = maxx-winwidth;
        contobj.xmax = maxx;
        contobj.ymin = maxy;
        contobj.ymax = maxy-winheight;
    }
    // 如果需要移动地图
    if(bl)
    {
        require(["esri/geometry/Extent","esri/geometry/ScreenPoint"],function(Extent,ScreenPoint) {
            var minsp = new ScreenPoint(contobj.xmin, contobj.ymin);
            var maxsp = new ScreenPoint(contobj.xmax, contobj.ymax);
            var minmp = map.toMap(minsp);
            var maxmp = map.toMap(maxsp);
            var extent = new Extent({xmin:minmp.x,ymin:minmp.y,xmax:maxmp.x,ymax:maxmp.y});
            map.setExtent(extent);
            //showxy(gra);
        });
    }
    else
    {
    	$('#infowindowdiv').css({'opacity':1});
    }
}
var refreshPosint=0,refreshPosx=0,refreshPosy=0;
//监听地图是否移动完毕
function showxy(gra)
{
	refreshPosint=setInterval(function(){refreshPos(gra)},20);
}
function refreshPos(gra)
{
	var node = gra.getNode();
	var pos = $(node).offset();
	// console.log(refreshPosx,refreshPosy);
	if(refreshPosx == pos.left && refreshPosy == pos.top)
	{
		clearInterval(refreshPosint);
		// setTimeout(function(){console.log(123);refreshinfotip(0,0,"extent");},2000);
	}
	refreshPosx = pos.left;
	refreshPosy = pos.top;
}

//移除tooltip
function removeinfotip(identifystr)
{
	$("."+identifystr).remove();
}
//隐藏tooltip
function hideinfotip(showbool)
{
	$(".infotipdiv").css({"display":showbool?"none":"block"});
	$('#infowindowdiv').css({"display":showbool?"none":"block"});
}
// 刷新infodiv的位置，
// diffoffsetx 鼠标移动的偏移量
// diffoffsety 鼠标移动的偏移量
function refreshinfotip(diffoffsetx,diffoffsety,iden)
{
	// var objay = $(".infotipdiv");
	// for(var i=0;i<objay.length;i++)
	// {
	// 	var currobj = $(objay[i]);
	// 	currobj.css({"left":currobj.position().left+diffoffsetx,"top":currobj.position().top+diffoffsety});
	// }
	$(".infotipdiv").each(function(){
		var currobj = $(this);
		var wt = currobj.width();
		var ht = currobj.height();
		var offsetx = parseInt(currobj.attr('data-offsetx'));
		var offsety = parseInt(currobj.attr('data-offsety'));
		// var wt = currobj.outerWidth();
		// var ht = currobj.outerHeight();
		var zb = currobj.attr('data-zuobiao');
		var pos = currobj.attr('data-position');
		var pt = map.toScreen(new esri.geometry.Point(zb.split(",")[0],zb.split(",")[1]));
		var lt = (pos=="top"?(pt.x+3):(pos=="right"?(pt.x+9):(pos=="bottom"?(pt.x-20):(pt.x-wt-15))));
		var rt = (pos=="top"?(pt.y-ht-13):(pos=="right"?(pt.y-13):(pos=="bottom"?(pt.y+8):(pt.y-ht+8))));
		currobj.css({"left":lt+((iden=="drag")?diffoffsetx:0)+offsetx,"top":rt+((iden=="drag")?diffoffsety:0)+offsety,"display":"block","-webkit-transition":"none","transition":"none"});
	});
	var infowin = $('#infowindowdiv');
	var iwzb = infowin.attr('data-zuobiao');
	if(iwzb!='')
	{
		var pt = map.toScreen(new esri.geometry.Point(iwzb.split(",")[0],iwzb.split(",")[1]));
		var wt = infowin.width();
		var ht = infowin.height();
		var lt = pt.x-150;
		var rt = pt.y-ht-30;
		infowin.css({"left":lt+((iden=="drag")?diffoffsetx:0),"top":rt+((iden=="drag")?diffoffsety:0),'opacity':1});
	}
}