/************
***初始化地图
***
***
***
*************/

var dojoConfig = {
	paths: {
		extras: location.pathname.replace(/\/[^/]+$/, "") + "/extras"
	}
};

String.prototype.trim=function(){
    return this.replace(/(^\s*)|(\s*$)/g,'');
}

var initInt=0;//配置文件加载完毕之前需要定时执行的定时器标识
var m_divName = '';//地图控件渲染时用的div的ID
var map,configData=null;

var qylocate = [
	{'name':'北京','info':'253912去过，112382想去','engl':'Beijing','image':'images/qy/1.jpg','x':116.39293539781097,'y':39.8821553679792},
	{'name':'天津','info':'339121去过，163271想去','engl':'Tianjin','image':'images/qy/2.jpg','x':117.22789633531075,'y':39.06805730691945},
	{'name':'武汉','info':'871251去过，312382想去','engl':'Wuhan','image':'images/qy/3.jpg','x':114.30553305406154,'y':30.58806264564572},
	{'name':'西安','info':'873526去过，184721想去','engl':'XiAn','image':'images/qy/4.jpg','x':108.96617758531296,'y':34.35003768349023},
	{'name':'重庆','info':'164816去过，268214想去','engl':'Chongqing','image':'images/qy/5.jpg','x':106.54918539781359,'y':29.56130031339216},
	{'name':'贵阳','info':'253912去过，112382想去','engl':'Guiyang','image':'images/qy/6.jpg','x':106.72496664781356,'y':26.556374977061566},
	{'name':'福州','info':'562382去过，290871想去','engl':'Fuzhou','image':'images/qy/7.jpg','x':119.2933260228102,'y':26.063965739580624},
	{'name':'海口','info':'873526去过，184721想去','engl':'Haikou','image':'images/qy/8.jpg','x':110.30650961656261,'y':20.02215813351037},
	{'name':'广州','info':'221173去过，90917想去','engl':'Guangzhou','image':'images/qy/9.jpg','x':113.25084555406183 ,'y':23.127506998229947},
	{'name':'银川','info':'339121去过，163271想去','engl':'Yinchuan','image':'images/qy/10.jpg','x':106.21959555406367,'y':38.46845229000583},
	{'name':'拉萨','info':'217636去过，241523想去','engl':'Lasa','image':'images/qy/1.jpg','x':91.14635336656771,'y':29.599517958360337},
	{'name':'沈阳','info':'134123去过，241244想去','engl':'Shenyang','image':'images/qy/3.jpg','x':123.4461580540591,'y':41.793658527695875},
	{'name':'长春','info':'290183去过，598216想去','engl':'Changchun','image':'images/qy/4.jpg','x':125.33580649155859,'y':43.8244438020109},
	{'name':'哈尔滨','info':'632515去过，439023想去','engl':'Haerbin','image':'images/qy/5.jpg','x':126.52232992905829,'y':45.80374380686318},
	{'name':'西宁','info':'232515去过，159023想去','engl':'Xinin','image':'images/qy/6.jpg','x':101.75914633531487,'y':36.60430818622},
	{'name':'乌鲁木齐','info':'422515去过，766153想去','engl':'Wulumuqi','image':'images/qy/7.jpg','x':87.62094914860808,'y':43.78479939773794}
];


var qysublocate = [
	// {'name':'test','info':'873526去过，184721想去','engl':'test','image':'images/qy/subimg/1.jpg','belong':'北京','x':,'y':},
	{'name':'故宫','info':'253912去过，112382想去','engl':'Gugong','image':'images/qy/subimg/1.jpg','belong':'北京','x':116.30896890410064,'y':40.00243112909361,'jj':'北京故宫是中国明清两代的皇家宫殿，旧称为紫禁城，位于北京中轴线的中心。是中国古代宫廷建筑之精华，占地72万平方米，建筑面积约15万平方米，共有殿宇9999间半，是世界上现存规模最大、保存最为完整的木质结构古建筑之一。有大小宫殿七十多座，房屋九千余间，以太和、中和、保和三大殿为中心。'},
	{'name':'天坛','info':'339121去过，163271想去','engl':'Tiantan','image':'images/qy/subimg/2.jpg','belong':'北京','x':116.41077818928329,'y':39.881744474356445,'jj':'天坛，在北京市南部，东城区永定门内大街东侧。占地约273万平方米。天坛始建于明永乐十八年（1420年），清乾隆、光绪时曾重修改建。为明、清两代帝王祭祀皇天、祈五谷丰登之场所。天坛是圜丘、祈谷两坛的总称，有坛墙两重，形成内外坛，坛墙南方北圆，象征天圆地方。主要建筑在内坛，圜丘坛在南、祈谷坛在北，二坛同在一条南北轴线上，中间有墙相隔。圜丘坛内主要建筑有圜丘坛、皇穹宇等等，祈谷坛内主要建筑有祈年殿、皇乾殿、祈年门等。'},
	{'name':'北京动物园','info':'873526去过，184721想去','engl':'Dongwuyuan','image':'images/qy/subimg/4.jpg','belong':'北京','x':116.33793499051407,'y':39.941488302693465,'jj':'北京动物园位于北京市西城区西直门外大街，东邻北京展览馆和莫斯科餐厅，占地面积约86公顷，水面8.6公顷。始建于清光绪三十二年（1906年），是中国开放最早、饲养展出动物种类最多的动物园。饲养展览动物500余种5000多只；海洋鱼类及海洋生物500余种10000多尾。每年接待中外游客600多万人次。是中国最大的动物园之一，也是一所世界知名的动物园。'},
	{'name':'香山','info':'164816去过，268214想去','engl':'Xiangshan','image':'images/qy/subimg/5.jpg','belong':'北京','x':116.1885895925651,'y':39.97477825330274,'jj':'香山公园位于北京西郊，地势险峻，苍翠连绵，占地188公顷，是一座具有山林特色的皇家园林。景区内主峰香炉峰俗称“鬼见愁”，海拔575米。香山公园始建于金大定二十六年，距今已有近900年的历史。香山公园有香山寺、洪光寺等著名旅游景点。 香山公园于1993年被评为首都文明单位，2001年被国家旅游局评为AAAA景区，2002年被评为首批北京市精品公园。'},
	{'name':'颐和园','info':'253912去过，112382想去','engl':'Yiheyuan','image':'images/qy/subimg/6.jpg','belong':'北京','x':116.26042987881986,'y':39.98898404737634,'jj':'颐和园，中国清朝时期皇家园林，前身为清漪园，坐落在北京西郊，距城区十五公里，占地约二百九十公顷，与圆明园毗邻。它是以昆明湖、万寿山为基址，以杭州西湖为蓝本，汲取江南园林的设计手法而建成的一座大型山水园林，也是保存最完整的一座皇家行宫御苑，被誉为“皇家园林博物馆”，也是国家重点旅游景点。'},
	{'name':'水立方','info':'562382去过，290871想去','engl':'Shuilifang','image':'images/qy/subimg/7.jpg','belong':'北京','x':116.39243747769726,'y':39.985728813773605,'jj':'国家游泳中心又称“水立方”(Water Cube),位于北京奥林匹克公园内，是北京为2008年夏季奥运会修建的主游泳馆，也是2008年北京奥运会标志性建筑物之一。'},
	{'name':'圆明园','info':'873526去过，184721想去','engl':'Yuanmingyuan','image':'images/qy/subimg/8.jpg','belong':'北京','x':116.2938815092732,'y':40.010828213959485,'jj':'圆明园是清代一座大型皇家宫苑，坐落在北京西郊，与颐和园毗邻，由圆明园、长春园和绮春园组成，所以也叫圆明三园。此外，还有许多小园，分布在东、西、南三面，众星拱月般环绕周围。'},
	{'name':'八达岭长城','info':'871251去过，312382想去','engl':'Badaling','image':'images/qy/subimg/3.jpg','belong':'北京','x':116.06070510090413,'y':40.33465592620917,'jj':'八达岭，Pa-ta-ling，亦作Badaling，是峰峦叠嶂的军都山中的一个山口，位于北京西北60公里处，东经116°65’，北纬40°25’。八达岭景区以八达岭长城为主，兴建了八达岭饭店、全周影院和由江泽民主席亲笔题名的中国长城博物馆等功能齐全的现代化旅游服务设施，被评为中国旅游胜地四十佳之首和北京旅游的“世界之最”。作为“世界文化遗产”，八达岭景区以其宏伟的景观、完善的设施和深厚的文化历史内涵而著称于世。'},
	{'name':'津湾广场','info':'371251去过，112382想去','engl':'Jinwanguangchang','image':'images/qy/subimg/9.png','belong':'天津','x':117.20776903886276,'y':39.132234549898875,'jj':'津湾广场位于天津市和平区的一处海河河湾南岸，其一期工程为紧邻海河、面向天津站的欧式建筑群。东侧和北侧海河环绕，西临解放北路，位于意式风情区内，建筑风格与周边原租界内的历史建筑一致，作为天津金融城的标志性区域，津湾广场于2008年启动建设，并完成一期工程。'},
	{'name':'古文化街','info':'164816去过，268214想去','engl':'Guwenhuajie','image':'images/qy/subimg/10.png','belong':'天津','x':117.1897016789386,'y':39.14451714401293,'jj':'天津古文化街位于南开区东北角东门外，海河西岸，系商业步行街，国家5A级景区。作为津门十景之一，天津古文化街一直坚持“中国味，天津味，文化味，古味”经营特色，以经营文化用品为主。古文化街内有近百家店堂。是天津老字号店民间手工艺品店的集中地，有地道美食：狗不理包子，耳朵眼炸糕，煎饼果子，老翟药糖，天津麻花等。有天后宫等旅游景点。'}
];


$(document).ready(function(){
	getConfigData();
	initInt=setInterval("configLoaded()",100);
	$('#hidden').bind('click',function(){
		var $this = $(this);
		var expend = $this.attr('data-expend');
		$this.attr('data-expend',(expend=='true')?'false':'true').css({'background':'url("images/toogle_icon.png") no-repeat '+((expend=='true')?'-38px':'0')+' 0'});
		$('#panelDiv').css({'left':((expend=='true')?'-300px':'20px'),'opacity':'1'});
	});
	$('#return_btn').bind('click',function(){
		$('#jd_myplan_content').css({'left':0});
		$('#jd_myplan_list').html('');
		getCSList();
		require(["esri/geometry/Extent"], 
			function(Extent) {
				var ext = configData.map.extent;
				var extent = new Extent({"xmin":ext.xmin, "ymin":ext.ymin,"xmax":ext.xmax,"ymax":ext.ymax});
				map.setExtent(extent);
		});
	});
	$('#jd_info_mask_close').on('click',function(){
		$('#jd_info_mask').css({'top':-450,'opacity':'0'});
	});

	$('#jd_myplan_content_close').on('click',function(){
		$('#jd_myplan_content').css({'left':0});
	});

	$(document).on('click',function(){
		$('#jd_info_mask').css({'top':-450,'opacity':'0'});
	});

	$('#jd_info_mask').on('click',function(e){
		e.stopPropagation();
	});

	$('.basemapitem').on('click',function(e){
		var type = $(this).attr('data-type');
		for(var i=0;i<basemapArray.length;i++)
		{
			var o = basemapArray[i];
			o.layer.setVisibility((o.name == type)?true:false);
		}
	});

	$('.maplevel').on('click',function(e){
		var lvl = $(this).attr('data-lvl');
		map.setLevel(map.getLevel()+(lvl=='up'?1:-1));
	});
});



//初始化方法，监听config.json文件是否加载完毕
function configLoaded()
{
	esriConfig.defaults.io.proxyUrl = "http://221.238.40.122:9090/arcgis_proxy/proxy.jsp";
	esriConfig.defaults.io.alwaysUseProxy = false; 
	if(configData==null)
	{
		return;
	}
	clearInterval(initInt);
	initMap();
}

var graphicsLayer=null;
var graphicArray = [];
var basemapArray = [];
//初始化地图
function initMap()
{
	m_divName = 'mapDiv';
	require(["esri/map","esri/geometry/Extent","esri/toolbars/draw","esri/layers/ArcGISTiledMapServiceLayer","esri/geometry/ScreenPoint","esri/dijit/OverviewMap","esri/dijit/Scalebar",
		"esri/layers/GraphicsLayer","esri/geometry/webMercatorUtils"], 
		function(Map, Extent, Draw, ArcGISTiledMapServiceLayer,ScreenPoint,OverviewMap,Scalebar,GraphicsLayer,webMercatorUtils) {

		var ext = configData.map.extent;
		map = new Map(m_divName,{
		  //nav:true,//8个pan 箭头
		  spatialReference:{wkid:4326},
		  slider:false,//左上的缩放 +/-;
		  logo:false,//右下的esri logo
		  extent: new Extent({"xmin":ext.xmin, "ymin":ext.ymin,"xmax":ext.xmax,"ymax":ext.ymax}),
		  showAttribution:false//右下的gisNeu (logo左侧)
		});
		onExtentChange();
		onMoDrag();
		var bms = configData.map.baseUrl;
		var bms = configData.map.baseUrl;
		for(var i=0;i<bms.length;i++)
		{
			var o = bms[i];
			if(o.isarcgismap=="true")
			{
				var tms = new ArcGISTiledMapServiceLayer(o.url);
				tms.visible = false;
				if(o.visible == "true")
				{
					tms.visible = true;
				}
				map.addLayer(tms);
				var obj = {};
				obj.name = o.name;
				obj.layer = tms;
				basemapArray.push(obj);
			}
		}
		
		map.on("click", function(e){
			var mp = map.toMap(ScreenPoint(e.offsetX,e.offsetY));
			mp = webMercatorUtils.webMercatorToGeographic(mp);
			console.log(mp.x,mp.y);


		});

		require(["esri/layers/GraphicsLayer"], 
			function(GraphicsLayer) {
				
				graphicsLayer = new GraphicsLayer({opacity:1});
				map.addLayer(graphicsLayer);

				graphicsLayer.on('click',function(e){
					// $("path[data-highlight='highlight']").removeAttr("data-highlight");
					var graphic = e.graphic;
					var attr = graphic.attributes;
					if(attr.belong)
					{
						$('#jd_myplan_content').css({'left':'370px'});
						var hs = "<div class='jd_myplan_list_item'>"+attr.name+"</div><div class='jd_myplan_list_item_split'>13.1km</div>";
						$('#jd_myplan_list').append(hs);
					}
					else
					{
						hideinfotip(true);
						var name = attr.name;
						for(var i=0;i<graphicArray.length;i++)
						{
							var gra = graphicArray[i];
							if(gra.attributes.name==name)
							{
								map.centerAt(gra.geometry).then(function (obj) {
									map.setLevel(11);
									hideinfotip(false);
									getJDList(name);
								});
								break;
							}
						}
					}
					// highlightLayer.add(new Graphic(graphic.geometry,sfs,graphic.attributes));
					// node.setAttribute("data-highlight","highlight");
				});
			}
		);

		getCSList();
	});
}


//读取城市列表数据
function getCSList()
{
	$('#return_btn').css({'display':'none'});
	var htmlstr = "";
	for(var i=0;i<qylocate.length;i++)
	{
		var o = qylocate[i];
		htmlstr += "<div class='jd_item' data-name='"+o.name+"'>"+
                            "<a href='javascript:;'>"+
                                "<img src='"+o.image+"' style='float:left;margin-left: -90px;width:80px;height:80px;'/>"+
                            "</a>"+
                            "<div style='position:relative;'>"+
                                "<div style='position:relative;font-size: 16px;color: #323232;line-height: 20px;'>"+o.name+"</div>"+
                                "<div style='position:relative;font-size: 14px;color: #959595;line-height: 16px;'>"+o.engl+"</div>"+
                                "<div style='position:relative;font-size: 12px;color: #959595;line-height: 16px;margin-top:27px;'>"+o.info+"</div>"+
                            "</div>"+
                        "</div>";
	}
	$('#content_div').html(htmlstr);
	$('.jd_item').on('mouseenter',function(){
		var $this = $(this);
		var name = $this.attr('data-name');
		for(var i=0;i<graphicArray.length;i++)
		{
			var gra = graphicArray[i];
			if(gra.attributes.name==name)
			{
				var node = gra.getNode();
				// node.setAttribute("transform","translateY(-43px)");
				node.setAttribute("class","imagejump");
				break;
			}
		}
	});
	$('.jd_item').on('mouseleave',function(){
		$('g image').attr('class','image');
	});
	$('.jd_item').on('click',function(){
		hideinfotip(true);
		var $this = $(this);
		var name = $this.attr('data-name');
		for(var i=0;i<graphicArray.length;i++)
		{
			var gra = graphicArray[i];
			if(gra.attributes.name==name)
			{
				map.centerAt(gra.geometry).then(function (obj) {
					map.setLevel(11);
					hideinfotip(false);
					getJDList(name);
				});
				break;
			}
		}
	});

	getCSLayer();
}
//读取城市gis数据
function getCSLayer()
{
	graphicArray = [];
	graphicsLayer.clear();
	removeinfotip('graphicsLayer');

	require(["esri/tasks/QueryTask","esri/graphic","esri/geometry/Point","esri/tasks/query","esri/layers/GraphicsLayer","esri/graphicsUtils","esri/symbols/PictureMarkerSymbol",
		"esri/symbols/SimpleFillSymbol","esri/symbols/SimpleLineSymbol","esri/Color","esri/symbols/TextSymbol","esri/symbols/Font"], 
		function(QueryTask,Graphic,Point, Query,GraphicsLayer,graphicsUtils,PictureMarkerSymbol,SimpleFillSymbol,SimpleLineSymbol,Color,TextSymbol,Font) {

			for(var i=0;i<qylocate.length;i++)
			{
				var o = qylocate[i];
				var gra = new Graphic(new Point(o.x,o.y),new PictureMarkerSymbol("images/maskLayout_bg2.png", 30, 46).setOffset(0, 23),o);
				graphicArray.push(gra);
				graphicsLayer.add(gra);
				showinfotip(gra,o.name,'top','graphicsLayer',false,15,0);
			}
			// refreshinfotip(0,0,"drag");
		}
	);
}


//读取景点列表数据
function getJDList(address)
{
	$('#return_btn').css({'display':'block'});
	var htmlstr = "";
	for(var i=0;i<qysublocate.length;i++)
	{
		var o = qysublocate[i];
		if(o.belong==address)
		{
			htmlstr += "<div class='jd_item' data-name='"+o.name+"'>"+
                            "<a href='javascript:;'>"+
                                "<img src='"+o.image+"' style='float:left;margin-left: -90px;width:80px;height:80px;'/>"+
                            "</a>"+
                            "<div style='position:relative;'>"+
                                "<div class='jd_name_div' data-name='"+o.name+"'>"+o.name+"</div>"+
                                "<div style='position:relative;font-size: 14px;color: #959595;line-height: 16px;'>"+o.engl+"</div>"+
                                "<div style='position:relative;font-size: 12px;color: #959595;line-height: 16px;margin-top:27px;'>"+o.info+"</div>"+
                                "<div class='jd_add_div' data-name='"+o.name+"'></div>"+
                            "</div>"+
                        "</div>";
		}
	}
	if(htmlstr=="")
	{
		htmlstr = "<div style='width:100%;padding-left:10px;line-height:50px;color:#B5B5B5;font-size:15px;'>未查询到相关景点</div>";
	}
	$('#content_div').html(htmlstr);
	$('.jd_item').on('mouseenter',function(){
		var $this = $(this);
		var name = $this.attr('data-name');
		for(var i=0;i<graphicArray.length;i++)
		{
			var gra = graphicArray[i];
			if(gra.attributes.name==name)
			{
				var node = gra.getNode();
				node.setAttribute("class","imagejump");
				break;
			}
		}
	});
	$('.jd_item').on('mouseleave',function(){
		$('g image').attr("class","image");
	});
	$('.jd_item').on('click',function(){
		hideinfotip(true);
		var $this = $(this);
		var name = $this.attr('data-name');
		for(var i=0;i<graphicArray.length;i++)
		{
			var gra = graphicArray[i];
			if(gra.attributes.name==name)
			{
				map.centerAt(gra.geometry).then(function (obj) {
					hideinfotip(false);
				});
				break;
			}
		}
	});

	$('.jd_name_div').on('click',function(e){
		e.stopPropagation();
		var name = $(this).attr('data-name');
		// console.log($(this).offset());
		var postop = $(this).offset().top;
		var winheight = $(window).height();
		var maskheight = $('#jd_info_mask').outerHeight();
		if(winheight-postop>=maskheight)
		{
			$('#jd_info_mask').css({'top':postop,'opacity':'.9'});
		}
		else
		{
			$('#jd_info_mask').css({'top':postop-maskheight+40,'opacity':'.9'});
		}
		var htmlstr = "";
		for(var i=0;i<qysublocate.length;i++)
		{
			var o = qysublocate[i];
			if(o.name==name)
			{
				htmlstr += "<div style='width:160px;height: 120px;float:left;'>"+
	                        "<div style='font-size: 24px;line-height: 28px;width: 100%;color: #323232;'>"+o.name+"</div>"+
	                        "<div style='font-size: 18px;line-height: 18px;margin-top:3px;width: 100%;color: #959595;'>"+o.engl+"</div>"+
	                        "<div style='font-size: 14px;line-height: 24px;margin-top: 10px;padding-left: 30px;color: #323232;background:url(images/mwant_icon.png) no-repeat 0 -34px;'>"+o.info.split('，')[0]+"</div>"+
	                        "<div style='font-size: 14px;line-height: 24px;margin-top: 10px;padding-left: 30px;width: 100%;color: #323232;background:url(images/mwant_icon.png) no-repeat 0 0;'>"+o.info.split('，')[1]+"</div>"+
	                    "</div>"+
	                    "<div style='float:right;margin: 0 25px 0 10px;'>"+
	                        "<img src='"+o.image+"' width='120px' height='120px' style='border-radius:3px;'/>"+
	                    "</div>"+
	                    "<div style='float:left;width:100%;border-top:1px solid #A9A9A9;margin-top: 15px;padding-top:15px;color:#636363;'>"+
	                        "<strong>介绍：</strong>"+o.jj+
	                    "</div>";
	            break;
			}
		}
		$('#jd_info_mask_content').html(htmlstr);
	});
	
	$('.jd_add_div').on('click',function(e){
		e.stopPropagation();
		var name = $(this).attr('data-name');
		$('#jd_myplan_content').css({'left':'370px'});
		var hs = "<div class='jd_myplan_list_item'>"+name+"</div><div class='jd_myplan_list_item_split'>13.1km</div>";
		$('#jd_myplan_list').append(hs);
	});

	getJDLayer(address);
}
//读取景点gis数据
function getJDLayer(address)
{
	graphicArray = [];
	graphicsLayer.clear();
	removeinfotip('graphicsLayer');

	require(["esri/tasks/QueryTask","esri/graphic","esri/geometry/Point","esri/tasks/query","esri/layers/GraphicsLayer","esri/graphicsUtils","esri/symbols/PictureMarkerSymbol",
		"esri/symbols/SimpleFillSymbol","esri/symbols/SimpleLineSymbol","esri/Color","esri/symbols/TextSymbol","esri/symbols/Font"], 
		function(QueryTask,Graphic,Point, Query,GraphicsLayer,graphicsUtils,PictureMarkerSymbol,SimpleFillSymbol,SimpleLineSymbol,Color,TextSymbol,Font) {

			for(var i=0;i<qysublocate.length;i++)
			{
				var o = qysublocate[i];
				if(o.belong==address)
				{
					var gra = new Graphic(new Point(o.x,o.y),new PictureMarkerSymbol("images/maskLayout_bg2.png", 30, 46).setOffset(0, 23),o);
					graphicArray.push(gra);
					graphicsLayer.add(gra);
					showinfotip(gra,o.name,'top','graphicsLayer',false,15,0);
				}
			}
			// refreshinfotip(0,0,"drag");
		}
	);
}


//读取config.json配置文件
function getConfigData()
{
	$.ajax({
		url:'config.json',  
		type:'get',    
		cache:false,  
		dataType:'json', 
		success:function(data) {
			configData = data;
		},    
		error : function() {
			
		}
	});
}


//地图范围变化事件
function onExtentChange()
{
	map.on('extent-change',function(evt){
		refreshinfotip(0,0,"extent");
	});
	map.on('zoom-start',function(evt){
		hideinfotip(true);
	});
	map.on('zoom-end',function(evt){
		hideinfotip(false);
	});
}

var dragStartPointX,dragStartPointY;//地图刚开始拖动时的鼠标位置
//地图拖动事件
function onMoDrag()
{
	map.on('mouse-drag-start',function(evt){
		dragStartPointX = evt.screenX;
		dragStartPointY = evt.screenY;
	});
	map.on('mouse-drag',function(evt){
		// console.log('mouse-drag');
		var dragDifferPointX = evt.screenX - dragStartPointX;
		var dragDifferPointY = evt.screenY - dragStartPointY;
		refreshinfotip(dragDifferPointX,dragDifferPointY,"drag");
	});
}

