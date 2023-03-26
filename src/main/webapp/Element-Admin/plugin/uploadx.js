/**
 * @author Pop
 * 
 * 此插件基于layui.upload模块进行的拓展
 */
layui.define(['jquery', 'util', 'form', 'laytpl', 'slider', 'laypage', 'upload', 'element'], function(
	exports) {
	"use strict";
	var MODULE_NAME = 'uploadx',
		UN_UPLOAD = "未上传",
		UPLOADED = "已上传",
		OPEN_LAYER_ID = "LAY_UPLOADX",//弹出框id
		$ = layui.jquery,
		util = layui.util,
		form = layui.form,
		laytpl = layui.laytpl,
		slider = layui.slider,
		upload = layui.upload,
		element = layui.element,
		page = layui.laypage,
		multiple = {},
		globalId = 0,
		globalCount = 0,
		addBtn = null,// 添加按钮
		hitObj = {},//提示多少文件的提示框
		clazz = {},
		mainUpload = {};
	/*目前支持的所有扩展名的配置*/
	var extConfig = [{
				reg: RegExp('[\\s\\S\\d\\D\\w\u4e00-\u9fa5]\\.(doc|docx)$', 'i'),
				type: 'svg',
				icon: '<svg viewBox="0 0 1024 1024"  xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64"><defs><style type="text/css"></style></defs><path d="M967.111111 281.6V910.222222c0 62.577778-51.2 113.777778-113.777778 113.777778H170.666667c-62.577778 0-113.777778-51.2-113.777778-113.777778V113.777778c0-62.577778 51.2-113.777778 113.777778-113.777778h514.844444L967.111111 281.6z" fill="#4F6BF6" p-id="1730"></path><path d="M581.262222 755.626667h59.363556L739.555556 439.04h-59.335112z" fill="#FFFFFF" p-id="1731"></path><path d="M685.511111 224.711111V0L967.111111 281.6H742.4c-31.288889 0-56.888889-25.6-56.888889-56.888889" fill="#243EBB" p-id="1732"></path><path d="M640.625778 755.626667h-59.363556l-98.929778-277.020445h59.335112zM442.737778 755.626667h-59.363556L284.444444 439.04h59.335112z" fill="#FFFFFF" p-id="1733"></path><path d="M383.374222 755.626667h59.363556l98.929778-277.020445h-59.335112z" fill="#FFFFFF" p-id="1734"></path></svg>'
			},
			{
				reg: RegExp('[\\s\\S\\d\\D\\w\u4e00-\u9fa5]\\.(xls|xlsx)$', 'i'),
				type: 'svg',
				icon: '<svg  viewBox="0 0 1024 1024"  xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64"><defs><style type="text/css"></style></defs><path d="M967.111111 281.6V910.222222c0 62.577778-51.2 113.777778-113.777778 113.777778H170.666667c-62.577778 0-113.777778-51.2-113.777778-113.777778V113.777778c0-62.577778 51.2-113.777778 113.777778-113.777778h514.844444L967.111111 281.6z" fill="#62C558" p-id="1885"></path><path d="M685.511111 224.711111V0L967.111111 281.6H742.4c-31.288889 0-56.888889-25.6-56.888889-56.888889" fill="#2A8121" p-id="1886"></path><path d="M682.666667 724.024889L638.691556 768 341.333333 470.670222 385.308444 426.666667zM454.087111 611.128889l44.088889 44.088889L385.422222 768 341.333333 723.911111zM682.666667 470.755556l-113.066667 113.066666-44.088889-44.088889L638.577778 426.666667z" fill="#FFFFFF" p-id="1887"></path></svg>'
			},
			{
				reg: RegExp('[\\s\\S\\d\\D\\w\u4e00-\u9fa5]\\.(ppt|pptx)$', 'i'),
				type: 'svg',
				icon: '<svg viewBox="0 0 1024 1024"  xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64"><defs><style type="text/css"></style></defs><path d="M967.111111 281.6V910.222222c0 62.577778-51.2 113.777778-113.777778 113.777778H170.666667c-62.577778 0-113.777778-51.2-113.777778-113.777778V113.777778c0-62.577778 51.2-113.777778 113.777778-113.777778h514.844444L967.111111 281.6z" fill="#F16C41" p-id="2040"></path><path d="M685.511111 224.711111V0L967.111111 281.6H742.4c-31.288889 0-56.888889-25.6-56.888889-56.888889" fill="#CD4B29" p-id="2041"></path><path d="M525.880889 648.135111a88.32 88.32 0 0 1-68.750222-32.995555 87.04 87.04 0 0 1-19.626667-55.381334c0-21.048889 7.253333-40.248889 19.626667-55.381333a88.234667 88.234667 0 0 1 68.750222-32.995556 88.490667 88.490667 0 0 1 88.376889 88.376889 88.519111 88.519111 0 0 1-88.376889 88.376889m0-235.690667c-24.945778 0-48.327111 6.087111-68.750222 17.294223a143.075556 143.075556 0 0 0-58.88 56.945777v146.119112a143.132444 143.132444 0 0 0 58.88 56.974222c20.423111 11.178667 43.804444 17.265778 68.750222 17.265778a147.342222 147.342222 0 0 0 147.285333-147.285334 147.342222 147.342222 0 0 0-147.285333-147.342222" fill="#FFFFFF" p-id="2042"></path><path d="M398.222222 824.888889h58.908445V412.444444H398.222222z" fill="#FFFFFF" p-id="2043"></path></svg>'
			},
			{
				reg: RegExp('[\\s\\S\\d\\D\\w\u4e00-\u9fa5]\\.(rar|zip|7z)$', 'i'),
				type: 'svg',
				icon: '<svg  viewBox="0 0 1024 1024"  xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64"><defs><style type="text/css"></style></defs><path d="M967.111111 281.6V910.222222c0 62.862222-50.915556 113.777778-113.777778 113.777778H170.666667c-62.862222 0-113.777778-50.915556-113.777778-113.777778V113.777778c0-62.862222 50.915556-113.777778 113.777778-113.777778h514.844444L967.111111 281.6z" fill="#FFC63A" p-id="2504"></path><path d="M685.511111 167.822222V0L967.111111 281.6H799.288889c-62.862222 0-113.777778-50.915556-113.777778-113.777778" fill="#DD9F08" p-id="2505"></path><path d="M436.565333 68.437333h68.437334V0h-68.437334zM505.002667 136.874667h68.437333V68.437333h-68.437333zM436.565333 205.312h68.437334V136.874667h-68.437334zM505.002667 273.749333h68.437333V205.312h-68.437333z" fill="#FFFFFF" p-id="2506"></path><path d="M436.565333 342.158222h68.437334V273.720889h-68.437334zM505.002667 410.624h68.437333V342.186667h-68.437333z" fill="#FFFFFF" p-id="2507"></path><path d="M436.565333 479.032889h68.437334v-68.437333h-68.437334zM505.002667 547.470222h68.437333v-68.437333h-68.437333zM470.784 762.225778h68.437333v-68.437334h-68.437333v68.437334z m-34.218667-136.874667v136.874667c0 18.915556 15.331556 34.218667 34.218667 34.218666h68.437333c18.915556 0 34.218667-15.303111 34.218667-34.218666v-136.874667h-136.874667z" fill="#FFFFFF" p-id="2508"></path></svg>'
			},
			{
				reg: RegExp('[\\s\\S\\d\\D\\w\u4e00-\u9fa5]\\.(pdf)$', 'i'),
				type: 'svg',
				icon: '<svg  viewBox="0 0 1024 1024"  xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64"><defs><style type="text/css"></style></defs><path d="M967.111111 281.6V910.222222c0 62.577778-51.2 113.777778-113.777778 113.777778H170.666667c-62.577778 0-113.777778-51.2-113.777778-113.777778V113.777778c0-62.577778 51.2-113.777778 113.777778-113.777778h514.844444L967.111111 281.6z" fill="#D23B41" p-id="2196"></path><path d="M685.511111 224.711111V0L967.111111 281.6H742.4c-31.288889 0-56.888889-25.6-56.888889-56.888889" fill="#9C171C" p-id="2197"></path><path d="M680.277333 662.698667c-11.889778-1.194667-23.751111-3.640889-35.640889-9.728 10.666667-2.133333 20.110222-2.133333 30.776889-2.133334 23.751111 0 28.330667 5.774222 28.330667 9.443556-6.997333 2.417778-15.246222 3.356444-23.466667 2.417778z m-120.945777-15.530667c-25.884444 5.802667-54.556444 14.336-80.440889 23.779556v-2.446223l-2.446223 1.223111c13.084444-26.197333 25.002667-53.333333 35.640889-80.753777l0.938667 1.223111 1.194667-2.133334c13.112889 20.110222 29.866667 40.220444 47.530666 57.884445h-3.640889l1.223112 1.223111zM497.777778 417.450667c1.223111-1.223111 3.669333-1.223111 4.551111-1.223111h3.697778a96.739556 96.739556 0 0 1-1.251556 61.553777c-8.220444-18.915556-11.861333-40.220444-6.997333-60.330666zM352.142222 770.275556l-3.669333 1.223111a96.768 96.768 0 0 1 42.666667-34.417778c-9.443556 15.502222-22.556444 27.392-38.997334 33.194667z m324.494222-155.107556c-25.002667 0-49.664 3.669333-74.666666 8.248889a353.365333 353.365333 0 0 1-73.415111-94.776889c20.110222-66.417778 21.333333-111.217778 5.774222-132.551111a39.253333 39.253333 0 0 0-30.748445-15.502222c-15.246222-1.223111-29.582222 6.087111-36.579555 18.887111-21.333333 35.640889 9.443556 105.415111 23.779555 134.058666-16.782222 50.887111-36.864 99.328-63.089777 146.858667-112.412444 48.440889-114.858667 77.994667-114.858667 88.661333 0 13.084444 7.310222 26.197333 20.110222 32 4.864 3.640889 11.889778 4.835556 17.976889 4.835556 29.582222 0 64-33.194667 100.551111-98.389333 46.307556-18.887111 92.615111-34.133333 141.084445-44.8a153.941333 153.941333 0 0 0 87.722666 35.356444c20.110222 0 59.107556 0 59.107556-40.220444 1.223111-15.530667-6.997333-41.443556-62.748445-42.666667z" fill="#FFFFFF" p-id="2198"></path></svg>'
			},
			{
				reg: RegExp('[\\s\\S\\d\\D\\w\u4e00-\u9fa5]\\.(avi|mp4|wma|rmvb|rm|flash|3gp|flv)$', 'i'),
				type: 'svg',
				icon: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64"><defs><style type="text/css"></style></defs><path d="M967.111111 281.6V910.222222c0 62.862222-50.915556 113.777778-113.777778 113.777778H170.666667c-62.862222 0-113.777778-50.915556-113.777778-113.777778V113.777778c0-62.862222 50.915556-113.777778 113.777778-113.777778h514.844444L967.111111 281.6z" fill="#C386F0" p-id="2814"></path><path d="M284.444444 398.222222m42.666667 0l298.666667 0q42.666667 0 42.666666 42.666667l0 234.666667q0 42.666667-42.666666 42.666666l-298.666667 0q-42.666667 0-42.666667-42.666666l0-234.666667q0-42.666667 42.666667-42.666667Z" fill="#FFFFFF" p-id="2815"></path><path d="M738.417778 457.841778a31.971556 31.971556 0 0 1 48.014222 27.676444v154.538667c0 24.632889-26.652444 40.021333-47.985778 27.704889L684.430222 636.586667V488.96z" fill="#FFFFFF" p-id="2816"></path><path d="M685.511111 167.822222V0L967.111111 281.6H799.288889c-62.862222 0-113.777778-50.915556-113.777778-113.777778" fill="#A15FDE" p-id="2817"></path></svg>'
			},
			{
				reg: RegExp('[\\s\\S\\d\\D\\w\u4e00-\u9fa5]\\.(mp3|wav|mid)$', 'i'),
				type: 'svg',
				icon: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64"><defs><style type="text/css"></style></defs><path d="M967.111111 281.6V910.222222c0 62.862222-50.915556 113.777778-113.777778 113.777778H170.666667c-62.862222 0-113.777778-50.915556-113.777778-113.777778V113.777778c0-62.862222 50.915556-113.777778 113.777778-113.777778h514.844444L967.111111 281.6z" fill="#A15FDE" p-id="2351"></path><path d="M685.511111 196.266667V0L967.111111 281.6H770.844444a85.333333 85.333333 0 0 1-85.333333-85.333333" fill="#C386F0" p-id="2352"></path><path d="M669.980444 426.268444v236.999112c0 26.254222-31.857778 47.587556-71.082666 47.587555-39.253333 0-70.741333-21.333333-70.741334-47.587555 0-26.282667 31.516444-47.587556 70.741334-47.587556 14.848 0 28.728889 3.100444 40.163555 8.334222v-165.916444l-205.767111 48.497778v211.057777c0 26.254222-32.142222 47.559111-71.992889 47.559111-39.850667 0-72.305778-21.333333-72.305777-47.559111 0-26.282667 32.426667-47.587556 72.305777-47.587555a96.711111 96.711111 0 0 1 41.102223 8.647111V474.168889c0-14.222222 9.870222-26.88 23.779555-29.980445l205.795556-47.900444a30.862222 30.862222 0 0 1 38.001777 29.980444" fill="#FFFFFF" p-id="2353"></path></svg>'
			},
			{
				reg: RegExp('[\\s\\S\\d\\D\\w\u4e00-\u9fa5]\\.(jpg|png|gif|bmp|jpeg)$', 'i'),
				type: 'svg',
				icon: '<svg viewBox="0 0 1024 1024"  xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64"><defs><style type="text/css"></style></defs><path d="M952.888889 281.6V910.222222c0 62.862222-50.915556 113.777778-113.777778 113.777778H156.444444c-62.862222 0-113.777778-50.915556-113.777777-113.777778V113.777778c0-62.862222 50.915556-113.777778 113.777777-113.777778h514.844445L952.888889 281.6z" fill="#85BCFF" p-id="2661"></path><path d="M676.664889 167.822222V0l281.6 281.6h-167.822222c-62.862222 0-113.777778-50.915556-113.777778-113.777778" fill="#529EE0" p-id="2662"></path><path d="M685.824 363.804444a53.76 53.76 0 0 1 53.731556 53.731556v307.029333a53.76 53.76 0 0 1-53.731556 53.731556H309.76a53.731556 53.731556 0 0 1-53.731556-53.76V417.564444c0-29.667556 24.035556-53.731556 53.731556-53.731555H685.795556z m-72.903111 149.674667l-138.183111 146.545778-80.583111-62.805333-92.131556 94.208v31.402666c0 11.548444 10.325333 20.906667 23.04 20.906667h345.400889c12.714667 0 23.04-9.386667 23.04-20.906667v-125.610666l-80.583111-83.740445z m-227.896889-85.532444a32.085333 32.085333 0 1 0 0 64.142222 32.085333 32.085333 0 0 0 0-64.142222z" fill="#FFFFFF" p-id="2663"></path></svg>'
			},

		],
		HIT={
			MSG1:'此操作将会清空等待上传的文件，你确定要删除吗?',
			MSG2:'此操作将会删除这个未上传的文件，你确定要删除吗?',
			MSG3:'此操作将会删除服务器的这个文件，你确定要删除吗?',
			MSG4:'当前列表无等待上传的文件'
		},
		otherFile = [
			'<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"  xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64"><defs><style type="text/css"></style></defs><path d="M967.111111 281.6V910.222222c0 62.862222-50.915556 113.777778-113.777778 113.777778H170.666667c-62.862222 0-113.777778-50.915556-113.777778-113.777778V113.777778c0-62.862222 50.915556-113.777778 113.777778-113.777778h514.844444L967.111111 281.6z" fill="#BABABA" p-id="2968"></path><path d="M685.511111 167.822222V0L967.111111 281.6H799.288889c-62.862222 0-113.777778-50.915556-113.777778-113.777778" fill="#979797" p-id="2969"></path><path d="M733.667556 632.689778a111.104 111.104 0 0 1-110.819556 110.819555h-221.667556a111.132444 111.132444 0 0 1-110.848-110.819555 111.047111 111.047111 0 0 1 99.754667-110.279111A122.197333 122.197333 0 0 1 512 407.694222a122.197333 122.197333 0 0 1 121.912889 114.716445 111.160889 111.160889 0 0 1 99.754667 110.279111" fill="#FFFFFF" p-id="2970"></path></svg>'
		].join(''),
		HTML_CONTAINER = [
			'<div class="layui-form-item">',
			'<label class="layui-form-label">{{ d.name }}</label>',
			'<div class="layui-input-block">',
			'<a lay-active="open" data-id={{ d.id }} class="layui-btn layui-btn-fluid"><i class="layui-icon layui-icon-upload" style="font-size: 30px;position:relative;top:-25%;"></i>',
				'{{# var finalExt = "*"; }}',
				'{{# var ext = d.ext; var check=true;}}',
				'{{# if(d.accept==="file"){ if(ext!=""){finalExt = ext;}check=false; } }}',
				'{{# if(d.accept==="video"){ finalExt = ext +"avi|mp4|wma|rmvb|rm|flash|3gp|flv";check=false; } }}',
				'{{# if(d.accept==="audio"){ finalExt = ext +"mp3|wav|mid";check=false; } }}',
				'{{# if(check){ finalExt = ext +"jpg|png|gif|bmp|jpeg";} }}',
			'<span title="{{=finalExt}}" style="text-align: center;width:75%;display: inline-block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">允许后缀({{=finalExt}})<span class="layui-badge layui-uploadx-count upload-hide">0</span></span></a>',
			'</div>',
			'</div>'
		].join(''),
		FILE_CONTAINER = [
			'<style type="text/css">',
			'.uploadx-container{width:100%;height:100%;overflow-y: scroll;}',
			'.uploadx-container-top{padding:5px;height: 30px;}',
			'.uploadx-container-bottom{height: 200px;}',
			'.uploadx-container-bottom-content{height: 100%;}',
			'[class^="upload-file-item"]{position: relative;float:left;width: 120px;height: 105px;background-color: #F6F6F6;padding: 7px;border-radius: 5px;margin-left: 5px;margin-bottom: 5px;}',
			'.upload-file-icon{text-align:center;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}',
			'.upload-file-text{font-size:12px;text-align:center;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}',
			'.upload-file-center{float:left;width:70px}',
			'.upload-file-btns{position:relative;left:3px;}',
			'.upload-file-progress{margin-top:5px;}',
			'.upload-file-loading{cursor:pointer;font-size: 30px;color: #1E9FFF;position: absolute;background-color: white;padding:10px 40px 10px 40px;border-radius: 5px;left: 12px;top: 10%;}',
			'.upload-file-loading-text{cursor:default;position: absolute;font-size: 12px;left: 43px;top: 85px;}',
			'.upload-hide{display:none;}',
			'</style>',
			'<div class="uploadx-container" id="xx-{{ d.id }}" style="display:none;" >',
			'<div class="uploadx-container-top">',
			'<div class="layui-btn-group">',
			'<button lay-active="addFile" data-id="{{ d.id }}" type="button" class="layui-btn layui-btn-sm layui-btn-normal">增加</button>',
			'<button lay-active="clearFile"  data-id="{{ d.id }}" type="button" class="layui-btn layui-btn-sm layui-btn-danger">清空</button>',
			'<button type="button" class="layui-btn layui-btn-sm layui-btn-primary" id="startUpload-{{ d.id }}" >上传</button>',
			'</div>',
			'</div>',
			'<div class="uploadx-container-bottom">',
			'<div id="uploadxContent-{{ d.id }}" class="uploadx-container-bottom-content" >',
			'<div class="layui-upload-drag undelete" style="left:27%;top:20%;" id="uploadxBtn-{{ d.id }}">',
			'<i class="layui-icon layui-icon-upload" style="font-size: 30px;"></i>',
			'<p>点击上传，或将文件拖拽到此处</p>',
			'</div>',
			'</div>',
			'</div>',
			'</div>'
		].join(''),
		FILE_ITEM = [
			'<div class="upload-file-item-{{ d.index }}" data-index="{{ d.index }}" title="{{ d.name }}" >',
			'<div class="upload-file-center" >',
			'<div class="upload-file-icon">{{ d.icon }}</div>',
			'<div class="upload-file-text">{{ d.name }}</div>',
			'<div class="upload-file-progress" ><div class="layui-progress layui-progress-big " lay-filter="progress-upload-{{ d.index }}" lay-showpercent="true"><div class="layui-progress-bar " lay-percent="0%" ></div>',
			'</div></div></div>',
			'<div class="upload-file-btns">',
			'<span style="cursor:pointer;width:36px;margin:0px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" class="layui-badge uploadx-delete">删除</span>',
			'<span style="cursor:pointer;width:36px;margin:0px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" class="layui-badge uploadx-delete-server upload-hide">删除</span>',
			'<span style="cursor:pointer;width:36px;margin:0px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" class="layui-badge layui-bg-green uploadx-reupload">上传</span>',
			'<span style="cursor:pointer;width:36px;margin:0px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" data-id="{{ d.index }}" class="layui-badge layui-bg-green uploadx-down upload-hide">下载</span>',
			'<span style="cursor:pointer;width:36px;margin:0px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" title="{{ d.ext }}" class="layui-badge layui-bg-blue">{{ d.ext }}</span>',
			'<span style="cursor:pointer;width:36px;margin:0px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" title="{{ d.size }}kb" class="layui-badge layui-bg-cyan ">{{ d.size }}kb</span>',
			'<span style="cursor:pointer;width:36px;margin:0px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" title="{{ d.state }}" class="layui-badge layui-badge-rim">{{ d.state }}</span>',
			'<span style="cursor:pointer;width:36px;margin:0px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" class="layui-badge layui-badge-rim uploadx-delete-all upload-hide"></span>',
			'</div></div>'
		].join(''),
		LOADING_FILE_ITEM = [
			'<div class="upload-file-item">',
			'<i class="layui-icon layui-icon-loading-1 layui-anim layui-anim-rotate layui-anim-loop upload-file-loading" ></i> ',
			'<span class="upload-file-loading-text">载入文件中...</span>',
			'</div>',
		].join(''),
		ADD_FILE_ITEM = [
			'<div class="upload-file-item upload-add-file">',
			'<i lay-active="uploadAdd" data-id="{{ d.id }}" class="layui-icon layui-icon-add-1 upload-file-loading" ></i> ',
			'<span class="upload-file-loading-text">添加文件</span>',
			'</div>',
		].join(''),
		FILE_UPLOAD_PAGE = [
			'<style type="text/css">[id^="file-upload-page"] a{margin:0;}</style>',
			'<div id="file-upload-page-{{ d.id }}" style="float: left;position: absolute;bottom: -3px;left: 10px;" ></div>'
		].join(''),
		Uploadx = function(options) {
			var that = this;
			that.v = '0.0.1';
			var configxOption = $.extend({}, that.configx, options.ex);
			var pageCfgOption = $.extend({}, that.pageCfg, options.page);
			var temOption = $.extend({}, that.config, options);
			delete temOption['ex'];
			delete temOption['page'];
			that.biz = configxOption.biz;
			multiple[that.biz] = {
				configx : configxOption,
				pageCfg : pageCfgOption,
				config : temOption,
				globalCount : 0,
				addBtn : null,// 添加按钮
				hitObj : {}
			};
			multiple[that.biz].configx.elem = $(configxOption.elem);
			
		};
		Uploadx.prototype.configx = {
			elem: '',
			name: '附件', //表单名字
			title: '文件管理',
			offest: 'auto',
			shade: 0.2,
			url:'https://httpbin.org/post',//用于反显附件信息,会将mainId放入对应的url进行post请求
			biz:'',//用于区别单个表单存在多个表单上传的功能。
			loadType:'get',//请求类别，可以自定义修改成get或者post
			form: '', //目标form的filter是什么
			mainId: 'id',//会去目标表单下找对应的mainId的名字是什么。
			downId: 'id' ,// 点击下载的时候，唯一标识
			downUrl:'https://httpbin.org/post', //下载url
			delUrl:'https://httpbin.org/post', // 删除url
			successCode:200, // 请求成功码，除此之外都会被认为请求失败
			successName:'code', //自定义 请求成功码属性名字
			resultName:'result',//请求中的结果名字,请保证返回结果是一个数组
			countName:'count',//请求的累加数字
			success:function(res){},//操作成功的回调 会根据返回成功码来执行 200 执行
			error:function(res){}//操作失败的回调  非200执行
		},
		Uploadx.prototype.pageCfg = { //分页的配置
			limitName:'limit',
			currentName:'curr',
			limit:8,
			limits:[8, 16, 32, 64],
			groups: 1,
			layout: ['count', 'prev', 'page', 'next', 'limit']
		},
		Uploadx.prototype.config = {
			accept: 'file',
			ext:'',
			auto: false,
			multiple: true,
			url: 'https://httpbin.org/post',
			drag: true
		};
		function extpattern(ext){
			return RegExp('[\\s\\S\\d\\D\\w\u4e00-\u9fa5]\\.(' + ext.split(',').join('|') + ')$', 'i');
		}
		var extcfg = {
			ext: '',
			type: 'svg',
			icon: '',
			style: 'width:64px;height:64px;',
			reg: null
		},
		 loadItem = {// 加载默认值
			 "id":"XXX",
			 "name":"undefined.file",
			 "size":0
		 };
		Uploadx.prototype.getFileInfo = function(name) {
			var pointIndex = name.lastIndexOf('.');
			if (pointIndex > 0) {
				return {
					name: name.substr(0, pointIndex),
					ext: name.substr(pointIndex, name.length)
				}
			} else {
				return {
					name: name,
					ext: '未知扩展名'
				}
			}
		},
		Uploadx.prototype.render = function() {
			var that = this;
			that.container();
			that.event();
		},
		Uploadx.prototype.filterIndex = function(files,index,id){
			multiple[id].mainUpload.config.data.fileData='';
			for(var f in files)
			{
				if(f===index){
					continue;
				}
				multiple[id].mainUpload.config.data.fileData+="["+f+"|"+files[f].name+"]";
			}
		},
		Uploadx.prototype.match = function(name) {
			var result = {};
			for (var o in extConfig) {
				var c = extConfig[o];
				if (c.reg.test(name)) {
					switch (c.type) {
						case 'svg': //一般文件
							result = c.icon;
							break;
						case 'img':
							result = '<img src="' + c.icon + '" style="' + c.style + '" />';
							break;
						default:
							result = otherFile;
							break;
					}
					break;
				} else {
					result = otherFile;
				}
			}
			return result;
		},
		Uploadx.prototype.checkExist = function(files) {
			var that = this,
				keys = Object.keys(files),
				len = keys.length,
				chooseIndex = keys[len - 1],
				chooseFile = files[keys[len - 1]],
				chooseF = that.getFileInfo(chooseFile.name),
				chooseExt = chooseF.ext,
				chooseRealName = chooseF.name,
				isFault = false;
			if (len > 0) {
				//如果是第一次选择，那么直接放行,否则，重命名校验
				if (len > 1) {
					for (var i = 0, l = len - 2; i <= l; i++) {
						//判断名字和扩展名是否都相同
						var curFile = files[keys[i]],
							name = curFile.name,
							f = that.getFileInfo(name),
							ext = f.ext,
							realName = f.name;
						if (realName === chooseRealName && ext === chooseExt) {
							isFault = true;
							break;
						}
					}
				}
			}
			return {
				isFault:isFault,
				chooseIndex:chooseIndex
			};
		},
		Uploadx.prototype.operate = function(id,url,param,callb,type){
			var config =  multiple[this.biz].configx;
			var t = type?type:'post',
				formData = '';
			if('get'===t){
				//get 拼接参数 ?name=''&
				url+=('?t='+new Date().getTime());
				var paramx = '';
				for(var p in param){paramx+=('&'+p+'='+param[p]);}
				url+=paramx;
			}else{
				formData = new FormData();
				formData.append(config.downId, id);
				for(var p in param){formData.append(p, param[p]);}
			}
				
			//提交文件
			$.ajax({
			  url: url
			  ,type: t
			  ,data: formData
			  ,contentType: false 
			  ,processData: false
			  ,dataType: 'json'
			  ,success: function(res){
				  if(res[config.successName]&&
				  (config.successCode==res[config.successName]||(config.successCode+'')==res[config.successName]))
				  {
					  callb.success(res);
					  config.success(res);
				  }else{
					  callb.error(res);
					  config.error(res);
				  }
				}
			  ,error: function(res){callb.error(res);}
			});
		},
		Uploadx.prototype.hasItem = function(id){
			//除了本身拖拽上传组件，其他都被视为是添加的元素
			var flag = multiple[id].activeContent.children().length>1;
			if(flag)
			{
				multiple[id].activeBtn.hide();
			}else{
				multiple[id].activeBtn.show();
			}
			return flag;
		},
		Uploadx.prototype.add = function(that,item,biz){
			if(multiple[biz].addBtn==null){
				laytpl(ADD_FILE_ITEM).render({id:biz},function(html){
					multiple[biz].activeContent.append(html);
					multiple[biz].addBtn=multiple[biz].activeContent.find('.upload-add-file');
					multiple[biz].addBtn.before(item);
				});
			}else{
				multiple[biz].addBtn.before(item)
			}	
		},
		Uploadx.prototype.isUploaded = function(index,id){
			var done = multiple[id].activeContent.find('.upload-file-item-' + index),
			    children=done.children().eq(1).children();
			return UPLOADED===children.eq(6).html();
		},
		Uploadx.prototype.clear = function(id){
			var children=multiple[id].activeContent.children();
			multiple[id].addBtn=null;
			layui.each(children,function(index,value){
				var elem = $(value);
				if(!elem.hasClass('undelete')){elem.remove();}
			});
		},
		Uploadx.prototype.load = function(param){
			var that = this,
				config =  multiple[that.biz].configx;
			// 不放置id，因为是全量请求
			that.operate('',config.url,param,{
				success:function(res){
					if(res[config.resultName])
					{
						var result = res[config.resultName];
						that.clear(that.biz);
						layui.each(result,function(key,file){
							var file = $.extend({},loadItem,file),
									name = file.name,
									icon = that.match(name),
									size = (file.size / 1024).toFixed(1),
									f = that.getFileInfo(name),
									ext = f.ext,
									realName = f.name,
									objData = {
										index: file.id,
										name: realName,
										icon: icon,
										size: size,
										ext: ext,
										state: UPLOADED
									};
								laytpl(FILE_ITEM).render(objData, function(item) {
									var item = $(item);
									// 下载
									item.find('.uploadx-down').on('click', function(e) {
										that.operate(objData.index,config.downUrl,{},{
											success:function(res){},
											error:function(res){}
										});
										return false;
									});		
									// 删除(服务器)
									item.find('.uploadx-delete-server').on('click', function(e) {
										layer.confirm(HIT.MSG3, {icon: 3, title:'提示'}, function(i){
											that.operate(objData.index,config.delUrl,{},{
												success:function(res){
													item.remove();
													that.hasItem(that.biz);
												},
												error:function(res){}
											});
											layer.close(i);
										});
										return false;
									});
									that.add(that,item,that.biz);
									that.overDone(objData.index,that.biz);
									that.hasItem(that.biz);
									element.render();
							});
						});
						var hasCount = multiple[that.biz].globalCount=(res[config.countName]?res[config.countName]:0);
						hasCount =  hasCount>99?'99+':hasCount;
						if(0!=hasCount){
							multiple[that.biz].hitObj.text(hasCount);
							multiple[that.biz].hitObj.removeClass('upload-hide');
						}
					}
				   
				},
				error:function(res){}
			},config.loadType);
		},
		Uploadx.prototype.overDone = function(index,biz){
			var done = multiple[biz].activeContent.find('.upload-file-item-' + index),
			    children=done.children().eq(1).children();
				children.eq(6).html(UPLOADED);
				children.eq(2).addClass('upload-hide');
				children.eq(3).removeClass('upload-hide');
				children.eq(0).addClass('upload-hide');
				children.eq(1).removeClass('upload-hide');
			element.progress('progress-upload-' + index,'100%');
		},
		Uploadx.prototype.onupload = function(mainId,id) {
			var that = this,
				config = multiple[id].configx,
				c = multiple[id].config,
				finalConfig = $.extend({}, {
					bindAction: '#startUpload-'+id,
					elem: '#uploadxBtn-'+id,
					elemList: $('#uploadxContent-'+id),
					data: {
						mainId: mainId,
						biz:id,
						fileData:''
					},
					choose: function(obj) {
						var files = that.files = this.files = obj.pushFile();
						//每次重新选择，都会刷新提交表单的数据
						obj.preview(function(index, file, result) {
							var name = file.name,
								icon = that.match(name),
								size = (file.size / 1024).toFixed(1),
								f = that.getFileInfo(name),
								ext = f.ext,
								realName = f.name,
								objData = {
									index: index,
									name: realName,
									icon: icon,
									size: size,
									ext: ext,
									state: UN_UPLOAD
								};
							multiple[id].mainUpload.config.data.fileData+="["+index+"|"+name+"]";
							laytpl(FILE_ITEM).render(objData, function(item) {
								var item = $(item);
								//单个重传
								item.find('.uploadx-reupload').on('click', function(e) {
									multiple[id].mainUpload.config.data.fileData="["+index+"|"+file.name+"]";
									obj.upload(index, file);
									return false;
								});
								// 下载
								item.find('.uploadx-down').on('click', function(e) {
									that.operate(index,config.downUrl,{},{
										success:function(res){},
										error:function(res){}
									});
									return false;
								});		
								// 删除(服务器)
								item.find('.uploadx-delete-server').on('click', function(e) {
									layer.confirm(HIT.MSG3, {icon: 3, title:'提示'}, function(i){
										that.operate(index,config.delUrl,{},{
											success:function(res){
												item.remove();
												that.hasItem(id);
											},
											error:function(res){}
										});
										layer.close(i);
									});
									return false;
								});
								//删除(等待上传)
								item.find('.uploadx-delete').on('click', function(e) {
									layer.confirm(HIT.MSG2, {icon: 3, title:'提示'}, function(i){
									   if(!that.isUploaded(index,id)){
										   that.filterIndex(files,index,id);
										   delete files[index]; //删除对应的文件
										   item.remove();
										   that.hasItem(id);
										   // multiple[id].mainUpload.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
										   layer.close(i);
									   }else{
										   //这块逻辑是不会走，安全起见这里做了判断
									   }
									});
									return false;
								});
								//用于批量
								item.find('.uploadx-delete-all').on('click', function(e) {
									if(!that.isUploaded(index,id)){
										delete files[index]; //删除对应的文件
										item.remove();
										that.hasItem(id);
										// multiple[id].mainUpload.config.elem.next()[0].value = ''; //清空 input file 值，以免删除后出现同名文件不可选
									}
									return false;
								});
								that.add(that,item,id);
								that.hasItem(id);
								element.render();
							});
						});
					},
					before: function(obj) {
						if (!that.hasItem(id)) {
							layer.msg(HIT.MSG4);
							return false;
						}
					},
					error: function(index, upload) {},
					progress: function(n, elem, e, index) {
						element.progress('progress-upload-' + index, n + '%');
						element.render();
					},
					done: function(res, index, upload) {
						that.overDone(index,id);
						that.filterIndex(this.files,index,id);
						delete this.files[index];
						return;
						this.error(index, upload);
					},
					allDone: function(obj) { 
						layer.msg('文件上传成功: 总数: ' + obj.total + ' ,成功: ' + obj.successful + ' ,失败: ' + obj.aborted, {
							icon: 1
						});
					}
				}, c);
			multiple[id].mainUpload = upload.render(finalConfig);
		},
		Uploadx.prototype.initPage = function(mainId,id){
			var that = this;
			laytpl(FILE_UPLOAD_PAGE).render({
				id: id
			}, function(html) {
				$('#'+OPEN_LAYER_ID+id).siblings(".layui-layer-btn").append(html);			
				var cfg = $.extend({},multiple[id].pageCfg,{
					elem: 'file-upload-page-'+id,
					count: multiple[id].globalCount,
					jump: function(obj,first){
						if(!first){
							var reqPage = {};
							reqPage[cfg.limitName]=obj.limit;
							reqPage[cfg.currentName]=obj.curr;
							reqPage.mainId = mainId;
							reqPage.biz = id;
							that.load(reqPage);
						}
					}
				});
				page.render(cfg);
			});
		},
		Uploadx.prototype.event = function() {
			var that = this,
				config = multiple[that.biz].configx,
				targetForm = form.val(config.form),
				mainId = targetForm[config.mainId];
				var reqPage = {};
				reqPage[that.pageCfg.limitName]=that.pageCfg.limit;
				reqPage[that.pageCfg.currentName]=1;
				reqPage.mainId = mainId;
				reqPage.biz = config.biz;
				that.load(reqPage);
			util.event('lay-active', {
				open: function(e) {
					var id = e[0].dataset.id,
						c=multiple[id].configx;
					that.openIndex = layer.open({
						type: 1, 
						id: OPEN_LAYER_ID+id,
						title: c.title,
						area: ['578px', '398px'],
						shade: c.shade,
						maxmin: false,
						offset: c.offset,
						content: $('#xx-'+id),
						btn: ['关闭'],
						yes: function() {
							layer.close(that.openIndex);
						},
						success: function(layero, index) {
							that.onupload(mainId,id);
							that.initPage(mainId,id);
						},
						end: function() {}
					});
					return false;
				},
				addFile: function(e) {
					multiple[e[0].dataset.id].activeBtn.click();
					return false;
				},
				uploadAdd:function(e){
					multiple[e[0].dataset.id].activeBtn.click();
					return false;
				},
				clearFile: function(e) {
					var id = e[0].dataset.id;
					layer.confirm(HIT.MSG1, {icon: 3, title:'提示'}, function(index){
					  for (var o in that.files) {
						var item = multiple[id].activeContent.find('.upload-file-item-' + o);
						item.children().eq(1).children().eq(7).click();
					  }
					  layer.close(index);
					});
					return false;
				}
			})
		},
		Uploadx.prototype.container = function() {
			var that = this,
				config = multiple[that.biz].configx,
				c =  multiple[that.biz].config;
			laytpl(HTML_CONTAINER).render({
				name: config.name,
				ext:c.ext,
				id:that.biz,
				accept:c.accept
			}, function(html) {
				html = $(html);
				config.elem.append(html);
				multiple[that.biz].hitObj=html.find('.layui-uploadx-count');
				laytpl(FILE_CONTAINER).render({
					id: that.biz,
				}, function(file) {
					config.elem.append(file);
					multiple[that.biz].activeBtn = $("#uploadxBtn-"+that.biz);
					multiple[that.biz].activeContent = $("#uploadxContent-"+that.biz);
				});
			});
		},
		clazz.render = function(options) {
			var uploadx = new Uploadx(options);
			uploadx.render();
		},
		clazz.addExt = function(options) {
			var arg = $.extend({},extcfg, options);
			arg.reg = extpattern(arg.ext);
			extConfig.splice(0, 0, arg);
		},
		exports(MODULE_NAME, clazz);
});
