/************
***工具js
***加载外部的js、css等文件
***
*************/

//保存已加载文件的名称，防止重复加载
var filesArray = [];

function loadFile(filename,filetype,callback)
{
	if(isContains(filename,filesArray))
	{
		if(callback)
		{
			callback();
		}
		return;
	}
	filesArray.push(filename);
	var fr;
	if(filetype=="js")
	{
		fr = document.createElement('script');
		fr.setAttribute("type","text/javascript");
		fr.setAttribute("src",filename);
	}
	else if(filetype=="css")
	{
		fr = document.createElement('link');
		fr.setAttribute("type","text/css");
		fr.setAttribute("rel","stylesheet");
		fr.setAttribute("href",filename);
	}
	if(typeof fr!="undefined")
	{
		document.getElementsByTagName("head")[0].appendChild(fr);
		fr.onload=fr.onreadystatechange=function(){
			if(!this.readyState || this.readyState=="loaded" || this.readyState=="complete")
			{
				if(callback)
				{
					callback();
				}
			}
			fr.onload=fr.onreadystatechange=null;
		}
	}
}

function isContains(name,ary)
{
	var b = false;
	for(var i=0;i<ary.length;i++)
	{
		if(ary[i].indexOf(name)!=-1)
		{
			b = true;
			break;
		}
	}
	return b;
}