// @D:Diese Datei beinhaltet die Anzeige des Telefonbuchs
console.log('CampusAppTelBook.js v0.5.0');

// @c:2014-12-29:Massiver Umbau des Verzeichnisses;

var ListData;
var ListDataO;
var CampusAppTableO;
var PreFilter;
var TelefonbuchData;

var Load = '';
if(Load == '') {
    spix_CampusApp_Init('State%20eq%20%27on%27');
}

window.setInterval(function() {
	alert('Die Anzeige wird jetzt aktualisier4t, da neuere Daten verfügbar sind!');
	window.location.href = window.location.pathname + '?FilterCol=' + $('#CampusAppInputFilterField').val()+'&FilterVal=' + $('#CampusAppTable_filter label input').val();
}, 60000*60*12); //Reload nach 12h ohne Datenrefresh

// Load Data
function spix_CampusApp_Init(PreFilter,FilterCol,FilterVal) {
	PreFilter = PreFilter || '';
	FilterCol = FilterCol || '';
	FilterVal = FilterVal || '';
    if($('#CampusApp').length == 0) { $('script[src*="CampusAppTelBook"]').parent().append('<div id="CampusApp"></div>'); }
	$('#CampusAppCfg').hide();
	if(!$('div').is('.ms-rte-layoutszone-inner-editable')) {
		var CfgJson = $('#CampusApp').attr('data-cfg');
		try { var CfgO = $.parseJSON(CfgJson); }
			catch (e) { var CfgO = new Array();	}
		if(CfgO.PreFilter !== undefined && PreFilter == '') { PreFilter = CfgO.PreFilter; }
		if(CfgO.FilterCol !== undefined && FilterCol == '') { FilterCol = CfgO.FilterCol; }
		if(CfgO.FilterVal !== undefined && FilterVal == '') { FilterVal = CfgO.FilterVal; }
		spix_CampusApp_InitList(PreFilter,FilterCol,FilterVal);
	} else {
		spix_CampusApp_InitCfg();
	}
}

function spix_CampusApp_InitCfg() {
	if($('#CampusAppCfg').length == 0) {
		$('#CampusApp').after('<div id="CampusAppCfg"></div>');
	} else {
		$('#CampusAppCfg').show();
	}
	$('#CampusApp').html('');

	if($('#CampusApp').closest('div.ms-webpartzone-cell').attr('wptoolpaneopen') == 'true') {
		if($('#CampusApp').closest('div.ms-rte-embedcode').length !== 0) {
			$('#CampusAppCfg').html('Skript Editor Webparts müssen direkt geändert werden.');
		} else {
			var CfgJson = $('#CampusApp').attr('data-cfg');
			try { var CfgO = $.parseJSON(CfgJson); }
				catch (e) { var CfgO = new Array();	}
			if(CfgO.PreFilter == undefined) { CfgO.PreFilter = ''; }
			if(CfgO.FilterCol == undefined) { CfgO.FilterCol = ''; }
			if(CfgO.FilterVal == undefined) { CfgO.FilterVal = ''; }
			var CfgMenu = '<table><tr><td>Vorfilter</td><td><input id="PreFilter" class="CfgDataInput" type="text" value="'+CfgO.PreFilter+'" /></td></tr><tr><td>Spaltenname</td><td><input id="FilterCol" class="CfgDataInput" type="text" value="'+CfgO.FilterCol+'" /></td></tr><tr><td>Filterwert</td><td><input id="FilterVal" class="CfgDataInput" type="text" value="'+CfgO.FilterVal+'" /></td></tr></table>';
			$('#CampusAppCfg').html(CfgMenu);//$('#CampusApp').attr('data-cfg'));
			$('.CfgDataInput').change(function() {
				var CfgJson = '{"PreFilter":"'+$('input#PreFilter').val()+'","FilterCol":"'+$('input#FilterCol').val()+'","FilterVal":"'+$('input#FilterVal').val()+'"}';
				$('#CampusApp').attr('data-cfg', CfgJson);		
			});
			
			$('#CampusAppCfgUpdate').on('click',function () {
				var CfgJson = '{"PreFilter":"'+$('input#PreFilter').val()+'","FilterCol":"'+$('input#FilterCol').val()+'","FilterVal":"'+$('input#FilterVal').val()+'"}';
				$('#CampusApp').attr('data-cfg', CfgJson);
			});
		}
	} else {
		$('#CampusAppCfg').html('Bearbeiten Sie das WebPart um Einstellungen vornehmen zu können.');
	}
}

function spix_CampusApp_InitList(PreFilter,FilterCol,FilterVal) {
        setTimeout(function() {
            ListData = spix_ListData_GetAllItems('/_vti_bin/listdata.svc/CampusApp_TelBook',PreFilter,'','DisplayName,DistinguishedName,Department,TelephoneNumber,Mobile,IpPhone,FacsimileTelephoneNumber,Pager,PhysicalDeliveryOfficeName,Mail,Company,ObjectGUID,Manager');
            var i = 0;
            ListDataO = new Array();
            ListDataRawO = new Array();
            TelefonbuchData = new Array();
            ListData.forEach(function (ThisItem) {
                    try	{
                      var Lync = spix_UserProfile_ShowLyncByMail(ThisItem.Mail,'LynList'+ThisItem.ID);
                    }
                    catch(e) {}
                    //TelefonbuchRawDataO.push([i,'','',ThisItem.Name,ThisItem.Firma,ThisItem.Abteilung,ThisItem.Ort,ThisItem.Telefon1+';'+ThisItem.Telefon2,ThisItem.Fax1+';'+ThisItem.Fax2,ThisItem.Mail]);

                    ThisItem = spix_CampusApp_ItemDataMod(ThisItem);
                    //ListDataRawO.push({'Name':ThisItem.DisplayName,'Mail':ThisItem.Mail,'Telefon1':ThisItem.TelephoneNumber,'Telefon2':ThisItem.Mobile,'Telefon3':ThisItem.IpPhone,'Fax1':ThisItem.FacsimileTelephoneNumber,'Fax2':ThisItem.Pager,'Ort':ThisItem.PhysicalDeliveryOfficeName,'Firma':ThisItem.Company,'Abteilung':ThisItem.Department,'Lync':Lync,'Infotext':ThisItem.Info,'Freitext':ThisItem.Freitext});
                    ListDataRawO[ThisItem.ID] = {'Name':ThisItem.DisplayName,'Mail':ThisItem.Mail,'Telefon1':ThisItem.TelephoneNumber,'Telefon2':ThisItem.Mobile,'Telefon3':ThisItem.IpPhone,'Fax1':ThisItem.FacsimileTelephoneNumber,'Fax2':ThisItem.Pager,'Ort':ThisItem.PhysicalDeliveryOfficeName,'Firma':ThisItem.Company,'Abteilung':ThisItem.Department,'Lync':Lync,'Infotext':ThisItem.Info,'Freitext':ThisItem.Freitext}
                    ThisItem = spix_CampusApp_ItemViewMod(ThisItem);
                    TelefonbuchData[ThisItem.ID] = new Array;
                    ListDataO.push([i,'<input type="checkbox" class="PersSelect" id="PersSelect'+ThisItem.ID+'" value="'+ThisItem.ID+'" /><span style="display: none;">'+ThisItem.ID+'</span><a href="#" onclick="spix_CampusApp_DetailView('+ThisItem.ID+'); return false;" data-listid="'+ThisItem.ID+'" data-listguid="'+ThisItem.ObjectGUID+'"><span class="PersDetailsBtn" style="background-color: #004993; color: #EEEEEE;">Mehr</span></a>'+Lync,ThisItem.DisplayName,ThisItem.Company,ThisItem.Department,ThisItem.PhysicalDeliveryOfficeName,ThisItem.TelephoneNumber+ThisItem.Mobile+ThisItem.IpPhone,ThisItem.FacsimileTelephoneNumber+ThisItem.Pager,ThisItem.Mail]);
                    i++;
            });	
			var IntroVideoBtn = '<input type="button" name="IntroVideo" id="IntroVideo" value="VideoAnleitung" style="background-color: #004993; color: #FFFFFF;" title="Lernen Sie die App kennen!" onclick="window.open(\'https://portal.iabg.de/sites/k2b/SitePages/SP%20CampusApp.aspx#Telefonbuch\',\'_blank\'); return false;" />';
            $('#CampusApp').after('<br /><div id="CampusAppToolBar">'+IntroVideoBtn+'<input type="button" name="MultiSort" id="MultiSort" value="MultiSort" title="Es werden je Spalte Suchfelder eingeblendet" onclick="spix_MultiFieldSearch(); return false;" /><input type="button" name="AppendMailList" id="AppendMailList" value="Mailverteiler" title="Markieren Sie Einträge, um daraus einen Mailverteiler für Outlook zu erzeugen." onclick="spix_CampusApp_AppendMailList(); return false;" /><input type="button" name="PrintList" id="PrintList" value="Druckansicht" title="Markieren Sie Einträge, um diese in eine Druckansicht zu bringen." onclick="spix_CampusApp_PrintList(); return false;" /><input type="button" name="GetDirectlink" id="GetDirectlink" value="Direktlink" title="Mit diesem Link können Sie Ihre Recherche speichern." onclick="spix_CampusApp_GetDirectlink(); return false;" /></div>');
            spix_CampusApp_Load(PreFilter,FilterCol,FilterVal);
        },0);
	// DataTables 1.10.0 included
	(function(za,N,l){var M=function(g){function S(a){var b,c,d={};g.each(a,function(e){if((b=e.match(/^([^A-Z]+?)([A-Z])/))&&-1!=="a aa ai ao as b fn i m o s ".indexOf(b[1]+" "))c=e.replace(b[0],b[2].toLowerCase()),d[c]=e,"o"===b[1]&&S(a[e])});a._hungarianMap=d}function G(a,b,c){a._hungarianMap||S(a);var d;g.each(b,function(e){d=a._hungarianMap[e];if(d!==l&&(c||b[d]===l))"o"===d.charAt(0)?(b[d]||(b[d]={}),g.extend(!0,b[d],b[e]),G(a[d],b[d],c)):b[d]=b[e]})}function M(a){var b=p.defaults.oLanguage,c=a.sZeroRecords;
	!a.sEmptyTable&&(c&&"No data available in table"===b.sEmptyTable)&&D(a,a,"sZeroRecords","sEmptyTable");!a.sLoadingRecords&&(c&&"Loading..."===b.sLoadingRecords)&&D(a,a,"sZeroRecords","sLoadingRecords");a.sInfoThousands&&(a.sThousands=a.sInfoThousands);(a=a.sDecimal)&&bb(a)}function cb(a){w(a,"ordering","bSort");w(a,"orderMulti","bSortMulti");w(a,"orderClasses","bSortClasses");w(a,"orderCellsTop","bSortCellsTop");w(a,"order","aaSorting");w(a,"orderFixed","aaSortingFixed");w(a,"paging","bPaginate");
	w(a,"pagingType","sPaginationType");w(a,"pageLength","iDisplayLength");w(a,"searching","bFilter")}function db(a){w(a,"orderable","bSortable");w(a,"orderData","aDataSort");w(a,"orderSequence","asSorting");w(a,"orderDataType","sortDataType")}function eb(a){var a=a.oBrowser,b=g("<div/>").css({position:"absolute",top:0,left:0,height:1,width:1,overflow:"hidden"}).append(g("<div/>").css({position:"absolute",top:1,left:1,width:100,overflow:"scroll"}).append(g('<div class="test"/>').css({width:"100%",height:10}))).appendTo("body"),
	c=b.find(".test");a.bScrollOversize=100===c[0].offsetWidth;a.bScrollbarLeft=1!==c.offset().left;b.remove()}function fb(a,b,c,d,e,f){var h,i=!1;c!==l&&(h=c,i=!0);for(;d!==e;)a.hasOwnProperty(d)&&(h=i?b(h,a[d],d,a):a[d],i=!0,d+=f);return h}function Aa(a,b){var c=p.defaults.column,d=a.aoColumns.length,c=g.extend({},p.models.oColumn,c,{nTh:b?b:N.createElement("th"),sTitle:c.sTitle?c.sTitle:b?b.innerHTML:"",aDataSort:c.aDataSort?c.aDataSort:[d],mData:c.mData?c.mData:d,idx:d});a.aoColumns.push(c);c=a.aoPreSearchCols;
	c[d]=g.extend({},p.models.oSearch,c[d]);fa(a,d,null)}function fa(a,b,c){var d=a.aoColumns[b],b=a.oClasses,e=g(d.nTh);if(!d.sWidthOrig){d.sWidthOrig=e.attr("width")||null;var f=(e.attr("style")||"").match(/width:\s*(\d+[pxem%])/);f&&(d.sWidthOrig=f[1])}c!==l&&null!==c&&(db(c),G(p.defaults.column,c),c.mDataProp!==l&&!c.mData&&(c.mData=c.mDataProp),c.sType&&(d._sManualType=c.sType),c.className&&!c.sClass&&(c.sClass=c.className),g.extend(d,c),D(d,c,"sWidth","sWidthOrig"),"number"===typeof c.iDataSort&&
	(d.aDataSort=[c.iDataSort]),D(d,c,"aDataSort"));var c=d.mData,h=T(c),i=d.mRender?T(d.mRender):null,f=function(a){return"string"===typeof a&&-1!==a.indexOf("@")};d._bAttrSrc=g.isPlainObject(c)&&(f(c.sort)||f(c.type)||f(c.filter));d.fnGetData=function(a,b){var c=h(a,b);return d.mRender&&b&&""!==b?i(c,b,a):c};d.fnSetData=Ba(c);a.oFeatures.bSort||(d.bSortable=!1,e.addClass(b.sSortableNone));a=-1!==g.inArray("asc",d.asSorting);e=-1!==g.inArray("desc",d.asSorting);!d.bSortable||!a&&!e?(d.sSortingClass=
	b.sSortableNone,d.sSortingClassJUI=""):a&&!e?(d.sSortingClass=b.sSortableAsc,d.sSortingClassJUI=b.sSortJUIAscAllowed):!a&&e?(d.sSortingClass=b.sSortableDesc,d.sSortingClassJUI=b.sSortJUIDescAllowed):(d.sSortingClass=b.sSortable,d.sSortingClassJUI=b.sSortJUI)}function U(a){if(!1!==a.oFeatures.bAutoWidth){var b=a.aoColumns;Ca(a);for(var c=0,d=b.length;c<d;c++)b[c].nTh.style.width=b[c].sWidth}b=a.oScroll;(""!==b.sY||""!==b.sX)&&V(a);t(a,null,"column-sizing",[a])}function ga(a,b){var c=W(a,"bVisible");
	return"number"===typeof c[b]?c[b]:null}function X(a,b){var c=W(a,"bVisible"),c=g.inArray(b,c);return-1!==c?c:null}function Y(a){return W(a,"bVisible").length}function W(a,b){var c=[];g.map(a.aoColumns,function(a,e){a[b]&&c.push(e)});return c}function Da(a){var b=a.aoColumns,c=a.aoData,d=p.ext.type.detect,e,f,h,i,j,g,m,o,k;e=0;for(f=b.length;e<f;e++)if(m=b[e],k=[],!m.sType&&m._sManualType)m.sType=m._sManualType;else if(!m.sType){h=0;for(i=d.length;h<i;h++){j=0;for(g=c.length;j<g&&!(k[j]===l&&(k[j]=
	A(a,j,e,"type")),o=d[h](k[j],a),!o||"html"===o);j++);if(o){m.sType=o;break}}m.sType||(m.sType="string")}}function gb(a,b,c,d){var e,f,h,i,j,n,m=a.aoColumns;if(b)for(e=b.length-1;0<=e;e--){n=b[e];var o=n.targets!==l?n.targets:n.aTargets;g.isArray(o)||(o=[o]);f=0;for(h=o.length;f<h;f++)if("number"===typeof o[f]&&0<=o[f]){for(;m.length<=o[f];)Aa(a);d(o[f],n)}else if("number"===typeof o[f]&&0>o[f])d(m.length+o[f],n);else if("string"===typeof o[f]){i=0;for(j=m.length;i<j;i++)("_all"==o[f]||g(m[i].nTh).hasClass(o[f]))&&
	d(i,n)}}if(c){e=0;for(a=c.length;e<a;e++)d(e,c[e])}}function H(a,b,c,d){var e=a.aoData.length,f=g.extend(!0,{},p.models.oRow,{src:c?"dom":"data"});f._aData=b;a.aoData.push(f);for(var b=a.aoColumns,f=0,h=b.length;f<h;f++)c&&Ea(a,e,f,A(a,e,f)),b[f].sType=null;a.aiDisplayMaster.push(e);a.oFeatures.bDeferRender||Fa(a,e,c,d);return e}function ha(a,b){var c;b instanceof g||(b=g(b));return b.map(function(b,e){c=ia(a,e);return H(a,c.data,e,c.cells)})}function A(a,b,c,d){var c=a.aoColumns[c],e=a.aoData[b]._aData,
	f=c.fnGetData(e,d);if(f===l)return a.iDrawError!=a.iDraw&&null===c.sDefaultContent&&(O(a,0,"Requested unknown parameter "+("function"==typeof c.mData?"{function}":"'"+c.mData+"'")+" for row "+b,4),a.iDrawError=a.iDraw),c.sDefaultContent;if((f===e||null===f)&&null!==c.sDefaultContent)f=c.sDefaultContent;else if("function"===typeof f)return f();return null===f&&"display"==d?"":f}function Ea(a,b,c,d){a.aoColumns[c].fnSetData(a.aoData[b]._aData,d)}function Ga(a){return g.map(a.match(/(\\.|[^\.])+/g),
	function(a){return a.replace("\\.",".")})}function T(a){if(g.isPlainObject(a)){var b={};g.each(a,function(a,c){c&&(b[a]=T(c))});return function(a,c,f){var h=b[c]||b._;return h!==l?h(a,c,f):a}}if(null===a)return function(a){return a};if("function"===typeof a)return function(b,c,f){return a(b,c,f)};if("string"===typeof a&&(-1!==a.indexOf(".")||-1!==a.indexOf("[")||-1!==a.indexOf("("))){var c=function(a,b,f){var h,i;if(""!==f){i=Ga(f);for(var j=0,g=i.length;j<g;j++){f=i[j].match(Z);h=i[j].match(P);if(f){i[j]=
	i[j].replace(Z,"");""!==i[j]&&(a=a[i[j]]);h=[];i.splice(0,j+1);i=i.join(".");j=0;for(g=a.length;j<g;j++)h.push(c(a[j],b,i));a=f[0].substring(1,f[0].length-1);a=""===a?h:h.join(a);break}else if(h){i[j]=i[j].replace(P,"");a=a[i[j]]();continue}if(null===a||a[i[j]]===l)return l;a=a[i[j]]}}return a};return function(b,e){return c(b,e,a)}}return function(b){return b[a]}}function Ba(a){if(g.isPlainObject(a))return Ba(a._);if(null===a)return function(){};if("function"===typeof a)return function(b,d){a(b,"set",
	d)};if("string"===typeof a&&(-1!==a.indexOf(".")||-1!==a.indexOf("[")||-1!==a.indexOf("("))){var b=function(a,d,e){var e=Ga(e),f;f=e[e.length-1];for(var h,i,j=0,g=e.length-1;j<g;j++){h=e[j].match(Z);i=e[j].match(P);if(h){e[j]=e[j].replace(Z,"");a[e[j]]=[];f=e.slice();f.splice(0,j+1);h=f.join(".");i=0;for(g=d.length;i<g;i++)f={},b(f,d[i],h),a[e[j]].push(f);return}i&&(e[j]=e[j].replace(P,""),a=a[e[j]](d));if(null===a[e[j]]||a[e[j]]===l)a[e[j]]={};a=a[e[j]]}if(f.match(P))a[f.replace(P,"")](d);else a[f.replace(Z,
	"")]=d};return function(c,d){return b(c,d,a)}}return function(b,d){b[a]=d}}function Ha(a){return B(a.aoData,"_aData")}function ja(a){a.aoData.length=0;a.aiDisplayMaster.length=0;a.aiDisplay.length=0}function ka(a,b,c){for(var d=-1,e=0,f=a.length;e<f;e++)a[e]==b?d=e:a[e]>b&&a[e]--; -1!=d&&c===l&&a.splice(d,1)}function la(a,b,c,d){var e=a.aoData[b],f;if("dom"===c||(!c||"auto"===c)&&"dom"===e.src)e._aData=ia(a,e).data;else{var h=e.anCells;if(h){c=0;for(f=h.length;c<f;c++)h[c].innerHTML=A(a,b,c,"display")}}e._aSortData=
	null;e._aFilterData=null;a=a.aoColumns;if(d!==l)a[d].sType=null;else{c=0;for(f=a.length;c<f;c++)a[c].sType=null}Ia(e)}function ia(a,b){var c=[],d=[],e=b.firstChild,f,h,i,j=0,n,m=a.aoColumns,o=function(a,b,c){"string"===typeof a&&(b=a.indexOf("@"),-1!==b&&(a=a.substring(b+1),i["@"+a]=c.getAttribute(a)))},k=function(a){h=m[j];n=g.trim(a.innerHTML);h&&h._bAttrSrc?(i={display:n},o(h.mData.sort,i,a),o(h.mData.type,i,a),o(h.mData.filter,i,a),c.push(i)):c.push(n);d.push(a);j++};if(e)for(;e;)f=e.nodeName.toUpperCase(),
	("TD"==f||"TH"==f)&&k(e),e=e.nextSibling;else{d=b.anCells;e=0;for(f=d.length;e<f;e++)k(d[e])}return{data:c,cells:d}}function Fa(a,b,c,d){var e=a.aoData[b],f=e._aData,h=[],i,j,g,m,o;if(null===e.nTr){i=c||N.createElement("tr");e.nTr=i;e.anCells=h;i._DT_RowIndex=b;Ia(e);m=0;for(o=a.aoColumns.length;m<o;m++){g=a.aoColumns[m];j=c?d[m]:N.createElement(g.sCellType);h.push(j);if(!c||g.mRender||g.mData!==m)j.innerHTML=A(a,b,m,"display");g.sClass&&(j.className+=" "+g.sClass);g.bVisible&&!c?i.appendChild(j):
	!g.bVisible&&c&&j.parentNode.removeChild(j);g.fnCreatedCell&&g.fnCreatedCell.call(a.oInstance,j,A(a,b,m,"display"),f,b,m)}t(a,"aoRowCreatedCallback",null,[i,f,b])}e.nTr.setAttribute("role","row")}function Ia(a){var b=a.nTr,c=a._aData;if(b){c.DT_RowId&&(b.id=c.DT_RowId);if(c.DT_RowClass){var d=c.DT_RowClass.split(" ");a.__rowc=a.__rowc?Ja(a.__rowc.concat(d)):d;g(b).removeClass(a.__rowc.join(" ")).addClass(c.DT_RowClass)}c.DT_RowData&&g(b).data(c.DT_RowData)}}function hb(a){var b,c,d,e,f,h=a.nTHead,
	i=a.nTFoot,j=0===g("th, td",h).length,n=a.oClasses,m=a.aoColumns;j&&(e=g("<tr/>").appendTo(h));b=0;for(c=m.length;b<c;b++)f=m[b],d=g(f.nTh).addClass(f.sClass),j&&d.appendTo(e),a.oFeatures.bSort&&(d.addClass(f.sSortingClass),!1!==f.bSortable&&(d.attr("tabindex",a.iTabIndex).attr("aria-controls",a.sTableId),Ka(a,f.nTh,b))),f.sTitle!=d.html()&&d.html(f.sTitle),La(a,"header")(a,d,f,n);j&&$(a.aoHeader,h);g(h).find(">tr").attr("role","row");g(h).find(">tr>th, >tr>td").addClass(n.sHeaderTH);g(i).find(">tr>th, >tr>td").addClass(n.sFooterTH);
	if(null!==i){a=a.aoFooter[0];b=0;for(c=a.length;b<c;b++)f=m[b],f.nTf=a[b].cell,f.sClass&&g(f.nTf).addClass(f.sClass)}}function I(a,b,c){var d,e,f,h=[],i=[],j=a.aoColumns.length,n;if(b){c===l&&(c=!1);d=0;for(e=b.length;d<e;d++){h[d]=b[d].slice();h[d].nTr=b[d].nTr;for(f=j-1;0<=f;f--)!a.aoColumns[f].bVisible&&!c&&h[d].splice(f,1);i.push([])}d=0;for(e=h.length;d<e;d++){if(a=h[d].nTr)for(;f=a.firstChild;)a.removeChild(f);f=0;for(b=h[d].length;f<b;f++)if(n=j=1,i[d][f]===l){a.appendChild(h[d][f].cell);for(i[d][f]=
	1;h[d+j]!==l&&h[d][f].cell==h[d+j][f].cell;)i[d+j][f]=1,j++;for(;h[d][f+n]!==l&&h[d][f].cell==h[d][f+n].cell;){for(c=0;c<j;c++)i[d+c][f+n]=1;n++}g(h[d][f].cell).attr("rowspan",j).attr("colspan",n)}}}}function J(a){var b=t(a,"aoPreDrawCallback","preDraw",[a]);if(-1!==g.inArray(!1,b))C(a,!1);else{var b=[],c=0,d=a.asStripeClasses,e=d.length,f=a.oLanguage,h=a.iInitDisplayStart,i="ssp"==z(a),j=a.aiDisplay;a.bDrawing=!0;h!==l&&-1!==h&&(a._iDisplayStart=i?h:h>=a.fnRecordsDisplay()?0:h,a.iInitDisplayStart=
	-1);var h=a._iDisplayStart,n=a.fnDisplayEnd();if(a.bDeferLoading)a.bDeferLoading=!1,a.iDraw++,C(a,!1);else if(i){if(!a.bDestroying&&!ib(a))return}else a.iDraw++;if(0!==j.length){f=i?a.aoData.length:n;for(i=i?0:h;i<f;i++){var m=j[i],o=a.aoData[m];null===o.nTr&&Fa(a,m);m=o.nTr;if(0!==e){var k=d[c%e];o._sRowStripe!=k&&(g(m).removeClass(o._sRowStripe).addClass(k),o._sRowStripe=k)}t(a,"aoRowCallback",null,[m,o._aData,c,i]);b.push(m);c++}}else c=f.sZeroRecords,1==a.iDraw&&"ajax"==z(a)?c=f.sLoadingRecords:
	f.sEmptyTable&&0===a.fnRecordsTotal()&&(c=f.sEmptyTable),b[0]=g("<tr/>",{"class":e?d[0]:""}).append(g("<td />",{valign:"top",colSpan:Y(a),"class":a.oClasses.sRowEmpty}).html(c))[0];t(a,"aoHeaderCallback","header",[g(a.nTHead).children("tr")[0],Ha(a),h,n,j]);t(a,"aoFooterCallback","footer",[g(a.nTFoot).children("tr")[0],Ha(a),h,n,j]);d=g(a.nTBody);d.children().detach();d.append(g(b));t(a,"aoDrawCallback","draw",[a]);a.bSorted=!1;a.bFiltered=!1;a.bDrawing=!1}}function K(a,b){var c=a.oFeatures,d=c.bFilter;
	c.bSort&&jb(a);d?aa(a,a.oPreviousSearch):a.aiDisplay=a.aiDisplayMaster.slice();!0!==b&&(a._iDisplayStart=0);J(a)}function kb(a){var b=a.oClasses,c=g(a.nTable),c=g("<div/>").insertBefore(c),d=a.oFeatures,e=g("<div/>",{id:a.sTableId+"_wrapper","class":b.sWrapper+(a.nTFoot?"":" "+b.sNoFooter)});a.nHolding=c[0];a.nTableWrapper=e[0];a.nTableReinsertBefore=a.nTable.nextSibling;for(var f=a.sDom.split(""),h,i,j,n,m,o,k=0;k<f.length;k++){h=null;i=f[k];if("<"==i){j=g("<div/>")[0];n=f[k+1];if("'"==n||'"'==n){m=
	"";for(o=2;f[k+o]!=n;)m+=f[k+o],o++;"H"==m?m=b.sJUIHeader:"F"==m&&(m=b.sJUIFooter);-1!=m.indexOf(".")?(n=m.split("."),j.id=n[0].substr(1,n[0].length-1),j.className=n[1]):"#"==m.charAt(0)?j.id=m.substr(1,m.length-1):j.className=m;k+=o}e.append(j);e=g(j)}else if(">"==i)e=e.parent();else if("l"==i&&d.bPaginate&&d.bLengthChange)h=lb(a);else if("f"==i&&d.bFilter)h=mb(a);else if("r"==i&&d.bProcessing)h=nb(a);else if("t"==i)h=ob(a);else if("i"==i&&d.bInfo)h=pb(a);else if("p"==i&&d.bPaginate)h=qb(a);else if(0!==
	p.ext.feature.length){j=p.ext.feature;o=0;for(n=j.length;o<n;o++)if(i==j[o].cFeature){h=j[o].fnInit(a);break}}h&&(j=a.aanFeatures,j[i]||(j[i]=[]),j[i].push(h),e.append(h))}c.replaceWith(e)}function $(a,b){var c=g(b).children("tr"),d,e,f,h,i,j,n,m,o,k;a.splice(0,a.length);f=0;for(j=c.length;f<j;f++)a.push([]);f=0;for(j=c.length;f<j;f++){d=c[f];for(e=d.firstChild;e;){if("TD"==e.nodeName.toUpperCase()||"TH"==e.nodeName.toUpperCase()){m=1*e.getAttribute("colspan");o=1*e.getAttribute("rowspan");m=!m||
	0===m||1===m?1:m;o=!o||0===o||1===o?1:o;h=0;for(i=a[f];i[h];)h++;n=h;k=1===m?!0:!1;for(i=0;i<m;i++)for(h=0;h<o;h++)a[f+h][n+i]={cell:e,unique:k},a[f+h].nTr=d}e=e.nextSibling}}}function ma(a,b,c){var d=[];c||(c=a.aoHeader,b&&(c=[],$(c,b)));for(var b=0,e=c.length;b<e;b++)for(var f=0,h=c[b].length;f<h;f++)if(c[b][f].unique&&(!d[f]||!a.bSortCellsTop))d[f]=c[b][f].cell;return d}function na(a,b,c){t(a,"aoServerParams","serverParams",[b]);if(b&&g.isArray(b)){var d={},e=/(.*?)\[\]$/;g.each(b,function(a,b){var c=
	b.name.match(e);c?(c=c[0],d[c]||(d[c]=[]),d[c].push(b.value)):d[b.name]=b.value});b=d}var f,h=a.ajax,i=a.oInstance;if(g.isPlainObject(h)&&h.data){f=h.data;var j=g.isFunction(f)?f(b):f,b=g.isFunction(f)&&j?j:g.extend(!0,b,j);delete h.data}j={data:b,success:function(b){var d=b.error||b.sError;d&&a.oApi._fnLog(a,0,d);a.json=b;t(a,null,"xhr",[a,b]);c(b)},dataType:"json",cache:!1,type:a.sServerMethod,error:function(b,c){var d=a.oApi._fnLog;"parsererror"==c?d(a,0,"Invalid JSON response",1):4===b.readyState&&
	d(a,0,"Ajax error",7);C(a,!1)}};a.oAjaxData=b;t(a,null,"preXhr",[a,b]);a.fnServerData?a.fnServerData.call(i,a.sAjaxSource,g.map(b,function(a,b){return{name:b,value:a}}),c,a):a.sAjaxSource||"string"===typeof h?a.jqXHR=g.ajax(g.extend(j,{url:h||a.sAjaxSource})):g.isFunction(h)?a.jqXHR=h.call(i,b,c,a):(a.jqXHR=g.ajax(g.extend(j,h)),h.data=f)}function ib(a){if(a.bAjaxDataGet){a.iDraw++;C(a,!0);var b=rb(a);na(a,b,function(b){sb(a,b)},a);return!1}return!0}function rb(a){var b=a.aoColumns,c=b.length,d=a.oFeatures,
	e=a.oPreviousSearch,f=a.aoPreSearchCols,h,i=[],j,n,m,o=Q(a);h=a._iDisplayStart;j=!1!==d.bPaginate?a._iDisplayLength:-1;var k=function(a,b){i.push({name:a,value:b})};k("sEcho",a.iDraw);k("iColumns",c);k("sColumns",B(b,"sName").join(","));k("iDisplayStart",h);k("iDisplayLength",j);var l={draw:a.iDraw,columns:[],order:[],start:h,length:j,search:{value:e.sSearch,regex:e.bRegex}};for(h=0;h<c;h++)n=b[h],m=f[h],j="function"==typeof n.mData?"function":n.mData,l.columns.push({data:j,name:n.sName,searchable:n.bSearchable,
	orderable:n.bSortable,search:{value:m.sSearch,regex:m.bRegex}}),k("mDataProp_"+h,j),d.bFilter&&(k("sSearch_"+h,m.sSearch),k("bRegex_"+h,m.bRegex),k("bSearchable_"+h,n.bSearchable)),d.bSort&&k("bSortable_"+h,n.bSortable);d.bFilter&&(k("sSearch",e.sSearch),k("bRegex",e.bRegex));d.bSort&&(g.each(o,function(a,b){l.order.push({column:b.col,dir:b.dir});k("iSortCol_"+a,b.col);k("sSortDir_"+a,b.dir)}),k("iSortingCols",o.length));b=p.ext.legacy.ajax;return null===b?a.sAjaxSource?i:l:b?i:l}function sb(a,b){var c=
	b.sEcho!==l?b.sEcho:b.draw,d=b.iTotalRecords!==l?b.iTotalRecords:b.recordsTotal,e=b.iTotalDisplayRecords!==l?b.iTotalDisplayRecords:b.recordsFiltered;if(c){if(1*c<a.iDraw)return;a.iDraw=1*c}ja(a);a._iRecordsTotal=parseInt(d,10);a._iRecordsDisplay=parseInt(e,10);c=oa(a,b);d=0;for(e=c.length;d<e;d++)H(a,c[d]);a.aiDisplay=a.aiDisplayMaster.slice();a.bAjaxDataGet=!1;J(a);a._bInitComplete||pa(a,b);a.bAjaxDataGet=!0;C(a,!1)}function oa(a,b){var c=g.isPlainObject(a.ajax)&&a.ajax.dataSrc!==l?a.ajax.dataSrc:
	a.sAjaxDataProp;return"data"===c?b.aaData||b[c]:""!==c?T(c)(b):b}function mb(a){var b=a.oClasses,c=a.sTableId,d=a.oPreviousSearch,e=a.aanFeatures,f='<input type="search" class="'+b.sFilterInput+'"/>',h=a.oLanguage.sSearch,h=h.match(/_INPUT_/)?h.replace("_INPUT_",f):h+f,b=g("<div/>",{id:!e.f?c+"_filter":null,"class":b.sFilter}).append(g("<label/>").append(h)),e=function(){var b=!this.value?"":this.value;b!=d.sSearch&&(aa(a,{sSearch:b,bRegex:d.bRegex,bSmart:d.bSmart,bCaseInsensitive:d.bCaseInsensitive}),
	a._iDisplayStart=0,J(a))},i=g("input",b).val(d.sSearch.replace('"',"&quot;")).bind("keyup.DT search.DT input.DT paste.DT cut.DT","ssp"===z(a)?Ma(e,400):e).bind("keypress.DT",function(a){if(13==a.keyCode)return!1}).attr("aria-controls",c);g(a.nTable).on("filter.DT",function(){try{i[0]!==N.activeElement&&i.val(d.sSearch)}catch(a){}});return b[0]}function aa(a,b,c){var d=a.oPreviousSearch,e=a.aoPreSearchCols,f=function(a){d.sSearch=a.sSearch;d.bRegex=a.bRegex;d.bSmart=a.bSmart;d.bCaseInsensitive=a.bCaseInsensitive};
	Da(a);if("ssp"!=z(a)){tb(a,b.sSearch,c,b.bEscapeRegex!==l?!b.bEscapeRegex:b.bRegex,b.bSmart,b.bCaseInsensitive);f(b);for(b=0;b<e.length;b++)ub(a,e[b].sSearch,b,e[b].bEscapeRegex!==l?!e[b].bEscapeRegex:e[b].bRegex,e[b].bSmart,e[b].bCaseInsensitive);vb(a)}else f(b);a.bFiltered=!0;t(a,null,"search",[a])}function vb(a){for(var b=p.ext.search,c=a.aiDisplay,d,e,f=0,h=b.length;f<h;f++)for(var i=c.length-1;0<=i;i--)e=c[i],d=a.aoData[e],b[f](a,d._aFilterData,e,d._aData)||c.splice(i,1)}function ub(a,b,c,d,
	e,f){if(""!==b)for(var h=a.aiDisplay,d=Na(b,d,e,f),e=h.length-1;0<=e;e--)b=a.aoData[h[e]]._aFilterData[c],d.test(b)||h.splice(e,1)}function tb(a,b,c,d,e,f){var d=Na(b,d,e,f),e=a.oPreviousSearch.sSearch,f=a.aiDisplayMaster,h;0!==p.ext.search.length&&(c=!0);h=wb(a);if(0>=b.length)a.aiDisplay=f.slice();else{if(h||c||e.length>b.length||0!==b.indexOf(e)||a.bSorted)a.aiDisplay=f.slice();b=a.aiDisplay;for(c=b.length-1;0<=c;c--)d.test(a.aoData[b[c]]._sFilterRow)||b.splice(c,1)}}function Na(a,b,c,d){a=b?a:
	Oa(a);c&&(a="^(?=.*?"+g.map(a.match(/"[^"]+"|[^ ]+/g)||"",function(a){return'"'===a.charAt(0)?a.match(/^"(.*)"$/)[1]:a}).join(")(?=.*?")+").*$");return RegExp(a,d?"i":"")}function Oa(a){return a.replace(Sb,"\\$1")}function wb(a){var b=a.aoColumns,c,d,e,f,h,i,j,g,m=p.ext.type.search;c=!1;d=0;for(f=a.aoData.length;d<f;d++)if(g=a.aoData[d],!g._aFilterData){i=[];e=0;for(h=b.length;e<h;e++)c=b[e],c.bSearchable?(j=A(a,d,e,"filter"),j=m[c.sType]?m[c.sType](j):null!==j?j:""):j="",j.indexOf&&-1!==j.indexOf("&")&&
	(qa.innerHTML=j,j=Tb?qa.textContent:qa.innerText),j.replace&&(j=j.replace(/[\r\n]/g,"")),i.push(j);g._aFilterData=i;g._sFilterRow=i.join("  ");c=!0}return c}function pb(a){var b=a.sTableId,c=a.aanFeatures.i,d=g("<div/>",{"class":a.oClasses.sInfo,id:!c?b+"_info":null});c||(a.aoDrawCallback.push({fn:xb,sName:"information"}),d.attr("role","status").attr("aria-live","polite"),g(a.nTable).attr("aria-describedby",b+"_info"));return d[0]}function xb(a){var b=a.aanFeatures.i;if(0!==b.length){var c=a.oLanguage,
	d=a._iDisplayStart+1,e=a.fnDisplayEnd(),f=a.fnRecordsTotal(),h=a.fnRecordsDisplay(),i=h?c.sInfo:c.sInfoEmpty;h!==f&&(i+=" "+c.sInfoFiltered);i+=c.sInfoPostFix;i=yb(a,i);c=c.fnInfoCallback;null!==c&&(i=c.call(a.oInstance,a,d,e,f,h,i));g(b).html(i)}}function yb(a,b){var c=a.fnFormatNumber,d=a._iDisplayStart+1,e=a._iDisplayLength,f=a.fnRecordsDisplay(),h=-1===e;return b.replace(/_START_/g,c.call(a,d)).replace(/_END_/g,c.call(a,a.fnDisplayEnd())).replace(/_MAX_/g,c.call(a,a.fnRecordsTotal())).replace(/_TOTAL_/g,
	c.call(a,f)).replace(/_PAGE_/g,c.call(a,h?1:Math.ceil(d/e))).replace(/_PAGES_/g,c.call(a,h?1:Math.ceil(f/e)))}function ra(a){var b,c,d=a.iInitDisplayStart,e=a.aoColumns,f;c=a.oFeatures;if(a.bInitialised){kb(a);hb(a);I(a,a.aoHeader);I(a,a.aoFooter);C(a,!0);c.bAutoWidth&&Ca(a);b=0;for(c=e.length;b<c;b++)f=e[b],f.sWidth&&(f.nTh.style.width=s(f.sWidth));K(a);e=z(a);"ssp"!=e&&("ajax"==e?na(a,[],function(c){var f=oa(a,c);for(b=0;b<f.length;b++)H(a,f[b]);a.iInitDisplayStart=d;K(a);C(a,!1);pa(a,c)},a):(C(a,
	!1),pa(a)))}else setTimeout(function(){ra(a)},200)}function pa(a,b){a._bInitComplete=!0;b&&U(a);t(a,"aoInitComplete","init",[a,b])}function Pa(a,b){var c=parseInt(b,10);a._iDisplayLength=c;Qa(a);t(a,null,"length",[a,c])}function lb(a){for(var b=a.oClasses,c=a.sTableId,d=a.aLengthMenu,e=g.isArray(d[0]),f=e?d[0]:d,e=e?d[1]:d,d=g("<select/>",{name:c+"_length","aria-controls":c,"class":b.sLengthSelect}),h=0,i=f.length;h<i;h++)d[0][h]=new Option(e[h],f[h]);var j=g("<div><label/></div>").addClass(b.sLength);
	a.aanFeatures.l||(j[0].id=c+"_length");b=a.oLanguage.sLengthMenu.split(/(_MENU_)/);j.children().append(1<b.length?[b[0],d,b[2]]:b[0]);g("select",j).val(a._iDisplayLength).bind("change.DT",function(){Pa(a,g(this).val());J(a)});g(a.nTable).bind("length.dt.DT",function(a,b,c){g("select",j).val(c)});return j[0]}function qb(a){var b=a.sPaginationType,c=p.ext.pager[b],d="function"===typeof c,e=function(a){J(a)},b=g("<div/>").addClass(a.oClasses.sPaging+b)[0],f=a.aanFeatures;d||c.fnInit(a,b,e);f.p||(b.id=
	a.sTableId+"_paginate",a.aoDrawCallback.push({fn:function(a){if(d){var b=a._iDisplayStart,j=a._iDisplayLength,g=a.fnRecordsDisplay(),m=-1===j,b=m?0:Math.ceil(b/j),j=m?1:Math.ceil(g/j),g=c(b,j),o,m=0;for(o=f.p.length;m<o;m++)La(a,"pageButton")(a,f.p[m],m,g,b,j)}else c.fnUpdate(a,e)},sName:"pagination"}));return b}function Ra(a,b,c){var d=a._iDisplayStart,e=a._iDisplayLength,f=a.fnRecordsDisplay();0===f||-1===e?d=0:"number"===typeof b?(d=b*e,d>f&&(d=0)):"first"==b?d=0:"previous"==b?(d=0<=e?d-e:0,0>
	d&&(d=0)):"next"==b?d+e<f&&(d+=e):"last"==b?d=Math.floor((f-1)/e)*e:O(a,0,"Unknown paging action: "+b,5);b=a._iDisplayStart!==d;a._iDisplayStart=d;b&&(t(a,null,"page",[a]),c&&J(a));return b}function nb(a){return g("<div/>",{id:!a.aanFeatures.r?a.sTableId+"_processing":null,"class":a.oClasses.sProcessing}).html(a.oLanguage.sProcessing).insertBefore(a.nTable)[0]}function C(a,b){a.oFeatures.bProcessing&&g(a.aanFeatures.r).css("display",b?"block":"none");t(a,null,"processing",[a,b])}function ob(a){var b=
	g(a.nTable);b.attr("role","grid");var c=a.oScroll;if(""===c.sX&&""===c.sY)return a.nTable;var d=c.sX,e=c.sY,f=a.oClasses,h=b.children("caption"),i=h.length?h[0]._captionSide:null,j=g(b[0].cloneNode(!1)),n=g(b[0].cloneNode(!1)),m=b.children("tfoot");c.sX&&"100%"===b.attr("width")&&b.removeAttr("width");m.length||(m=null);c=g("<div/>",{"class":f.sScrollWrapper}).append(g("<div/>",{"class":f.sScrollHead}).css({overflow:"hidden",position:"relative",border:0,width:d?!d?null:s(d):"100%"}).append(g("<div/>",
	{"class":f.sScrollHeadInner}).css({"box-sizing":"content-box",width:c.sXInner||"100%"}).append(j.removeAttr("id").css("margin-left",0).append(b.children("thead")))).append("top"===i?h:null)).append(g("<div/>",{"class":f.sScrollBody}).css({overflow:"auto",height:!e?null:s(e),width:!d?null:s(d)}).append(b));m&&c.append(g("<div/>",{"class":f.sScrollFoot}).css({overflow:"hidden",border:0,width:d?!d?null:s(d):"100%"}).append(g("<div/>",{"class":f.sScrollFootInner}).append(n.removeAttr("id").css("margin-left",
	0).append(b.children("tfoot")))).append("bottom"===i?h:null));var b=c.children(),o=b[0],f=b[1],k=m?b[2]:null;d&&g(f).scroll(function(){var a=this.scrollLeft;o.scrollLeft=a;m&&(k.scrollLeft=a)});a.nScrollHead=o;a.nScrollBody=f;a.nScrollFoot=k;a.aoDrawCallback.push({fn:V,sName:"scrolling"});return c[0]}function V(a){var b=a.oScroll,c=b.sX,d=b.sXInner,e=b.sY,f=b.iBarWidth,h=g(a.nScrollHead),i=h[0].style,j=h.children("div"),n=j[0].style,m=j.children("table"),j=a.nScrollBody,o=g(j),k=j.style,l=g(a.nScrollFoot).children("div"),
	p=l.children("table"),r=g(a.nTHead),q=g(a.nTable),ba=q[0],L=ba.style,t=a.nTFoot?g(a.nTFoot):null,ca=a.oBrowser,v=ca.bScrollOversize,x,u,y,w,z,A=[],B=[],C=[],D,E=function(a){a=a.style;a.paddingTop="0";a.paddingBottom="0";a.borderTopWidth="0";a.borderBottomWidth="0";a.height=0};q.children("thead, tfoot").remove();z=r.clone().prependTo(q);x=r.find("tr");y=z.find("tr");z.find("th, td").removeAttr("tabindex");t&&(w=t.clone().prependTo(q),u=t.find("tr"),w=w.find("tr"));c||(k.width="100%",h[0].style.width=
	"100%");g.each(ma(a,z),function(b,c){D=ga(a,b);c.style.width=a.aoColumns[D].sWidth});t&&F(function(a){a.style.width=""},w);b.bCollapse&&""!==e&&(k.height=o[0].offsetHeight+r[0].offsetHeight+"px");h=q.outerWidth();if(""===c){if(L.width="100%",v&&(q.find("tbody").height()>j.offsetHeight||"scroll"==o.css("overflow-y")))L.width=s(q.outerWidth()-f)}else""!==d?L.width=s(d):h==o.width()&&o.height()<q.height()?(L.width=s(h-f),q.outerWidth()>h-f&&(L.width=s(h))):L.width=s(h);h=q.outerWidth();F(E,y);F(function(a){C.push(a.innerHTML);
	A.push(s(g(a).css("width")))},y);F(function(a,b){a.style.width=A[b]},x);g(y).height(0);t&&(F(E,w),F(function(a){B.push(s(g(a).css("width")))},w),F(function(a,b){a.style.width=B[b]},u),g(w).height(0));F(function(a,b){a.innerHTML='<div class="dataTables_sizing" style="height:0;overflow:hidden;">'+C[b]+"</div>";a.style.width=A[b]},y);t&&F(function(a,b){a.innerHTML="";a.style.width=B[b]},w);if(q.outerWidth()<h){u=j.scrollHeight>j.offsetHeight||"scroll"==o.css("overflow-y")?h+f:h;if(v&&(j.scrollHeight>
	j.offsetHeight||"scroll"==o.css("overflow-y")))L.width=s(u-f);(""===c||""!==d)&&O(a,1,"Possible column misalignment",6)}else u="100%";k.width=s(u);i.width=s(u);t&&(a.nScrollFoot.style.width=s(u));!e&&v&&(k.height=s(ba.offsetHeight+f));e&&b.bCollapse&&(k.height=s(e),b=c&&ba.offsetWidth>j.offsetWidth?f:0,ba.offsetHeight<j.offsetHeight&&(k.height=s(ba.offsetHeight+b)));b=q.outerWidth();m[0].style.width=s(b);n.width=s(b);m=q.height()>j.clientHeight||"scroll"==o.css("overflow-y");ca="padding"+(ca.bScrollbarLeft?
	"Left":"Right");n[ca]=m?f+"px":"0px";t&&(p[0].style.width=s(b),l[0].style.width=s(b),l[0].style[ca]=m?f+"px":"0px");o.scroll();if(a.bSorted||a.bFiltered)j.scrollTop=0}function F(a,b,c){for(var d=0,e=0,f=b.length,h,i;e<f;){h=b[e].firstChild;for(i=c?c[e].firstChild:null;h;)1===h.nodeType&&(c?a(h,i,d):a(h,d),d++),h=h.nextSibling,i=c?i.nextSibling:null;e++}}function Ca(a){var b=a.nTable,c=a.aoColumns,d=a.oScroll,e=d.sY,f=d.sX,h=d.sXInner,i=c.length,d=W(a,"bVisible"),j=g("th",a.nTHead),n=b.getAttribute("width"),
	m=b.parentNode,o=!1,k,l;for(k=0;k<d.length;k++)l=c[d[k]],null!==l.sWidth&&(l.sWidth=zb(l.sWidthOrig,m),o=!0);if(!o&&!f&&!e&&i==Y(a)&&i==j.length)for(k=0;k<i;k++)c[k].sWidth=s(j.eq(k).width());else{i=g(b.cloneNode(!1)).css("visibility","hidden").removeAttr("id").append(g(a.nTHead).clone(!1)).append(g(a.nTFoot).clone(!1)).append(g("<tbody><tr/></tbody>"));i.find("tfoot th, tfoot td").css("width","");var p=i.find("tbody tr"),j=ma(a,i.find("thead")[0]);for(k=0;k<d.length;k++)l=c[d[k]],j[k].style.width=
	null!==l.sWidthOrig&&""!==l.sWidthOrig?s(l.sWidthOrig):"";if(a.aoData.length)for(k=0;k<d.length;k++)o=d[k],l=c[o],g(Ab(a,o)).clone(!1).append(l.sContentPadding).appendTo(p);i.appendTo(m);f&&h?i.width(h):f?(i.css("width","auto"),i.width()<m.offsetWidth&&i.width(m.offsetWidth)):e?i.width(m.offsetWidth):n&&i.width(n);Bb(a,i[0]);if(f){for(k=h=0;k<d.length;k++)l=c[d[k]],e=g(j[k]).outerWidth(),h+=null===l.sWidthOrig?e:parseInt(l.sWidth,10)+e-g(j[k]).width();i.width(s(h));b.style.width=s(h)}for(k=0;k<d.length;k++)if(l=
	c[d[k]],e=g(j[k]).width())l.sWidth=s(e);b.style.width=s(i.css("width"));i.remove()}n&&(b.style.width=s(n));if((n||f)&&!a._reszEvt)g(za).bind("resize.DT-"+a.sInstance,Ma(function(){U(a)})),a._reszEvt=!0}function Ma(a,b){var c=b||200,d,e;return function(){var b=this,h=+new Date,i=arguments;d&&h<d+c?(clearTimeout(e),e=setTimeout(function(){d=l;a.apply(b,i)},c)):d?(d=h,a.apply(b,i)):d=h}}function zb(a,b){if(!a)return 0;var c=g("<div/>").css("width",s(a)).appendTo(b||N.body),d=c[0].offsetWidth;c.remove();
	return d}function Bb(a,b){var c=a.oScroll;if(c.sX||c.sY)c=!c.sX?c.iBarWidth:0,b.style.width=s(g(b).outerWidth()-c)}function Ab(a,b){var c=Cb(a,b);if(0>c)return null;var d=a.aoData[c];return!d.nTr?g("<td/>").html(A(a,c,b,"display"))[0]:d.anCells[b]}function Cb(a,b){for(var c,d=-1,e=-1,f=0,h=a.aoData.length;f<h;f++)c=A(a,f,b,"display")+"",c=c.replace(Ub,""),c.length>d&&(d=c.length,e=f);return e}function s(a){return null===a?"0px":"number"==typeof a?0>a?"0px":a+"px":a.match(/\d$/)?a+"px":a}function Db(){if(!p.__scrollbarWidth){var a=
	g("<p/>").css({width:"100%",height:200,padding:0})[0],b=g("<div/>").css({position:"absolute",top:0,left:0,width:200,height:150,padding:0,overflow:"hidden",visibility:"hidden"}).append(a).appendTo("body"),c=a.offsetWidth;b.css("overflow","scroll");a=a.offsetWidth;c===a&&(a=b[0].clientWidth);b.remove();p.__scrollbarWidth=c-a}return p.__scrollbarWidth}function Q(a){var b,c,d=[],e=a.aoColumns,f,h,i,j;b=a.aaSortingFixed;c=g.isPlainObject(b);var n=[];f=function(a){a.length&&!g.isArray(a[0])?n.push(a):n.push.apply(n,
	a)};g.isArray(b)&&f(b);c&&b.pre&&f(b.pre);f(a.aaSorting);c&&b.post&&f(b.post);for(a=0;a<n.length;a++){j=n[a][0];f=e[j].aDataSort;b=0;for(c=f.length;b<c;b++)h=f[b],i=e[h].sType||"string",d.push({src:j,col:h,dir:n[a][1],index:n[a][2],type:i,formatter:p.ext.type.order[i+"-pre"]})}return d}function jb(a){var b,c,d=[],e=p.ext.type.order,f=a.aoData,h=0,i,g=a.aiDisplayMaster,n;Da(a);n=Q(a);b=0;for(c=n.length;b<c;b++)i=n[b],i.formatter&&h++,Eb(a,i.col);if("ssp"!=z(a)&&0!==n.length){b=0;for(c=g.length;b<c;b++)d[g[b]]=
	b;h===n.length?g.sort(function(a,b){var c,e,h,g,i=n.length,j=f[a]._aSortData,l=f[b]._aSortData;for(h=0;h<i;h++)if(g=n[h],c=j[g.col],e=l[g.col],c=c<e?-1:c>e?1:0,0!==c)return"asc"===g.dir?c:-c;c=d[a];e=d[b];return c<e?-1:c>e?1:0}):g.sort(function(a,b){var c,h,g,i,j=n.length,l=f[a]._aSortData,p=f[b]._aSortData;for(g=0;g<j;g++)if(i=n[g],c=l[i.col],h=p[i.col],i=e[i.type+"-"+i.dir]||e["string-"+i.dir],c=i(c,h),0!==c)return c;c=d[a];h=d[b];return c<h?-1:c>h?1:0})}a.bSorted=!0}function Fb(a){for(var b,c,
	d=a.aoColumns,e=Q(a),a=a.oLanguage.oAria,f=0,h=d.length;f<h;f++){c=d[f];var i=c.asSorting;b=c.sTitle.replace(/<.*?>/g,"");var g=c.nTh;g.removeAttribute("aria-sort");c.bSortable&&(0<e.length&&e[0].col==f?(g.setAttribute("aria-sort","asc"==e[0].dir?"ascending":"descending"),c=i[e[0].index+1]||i[0]):c=i[0],b+="asc"===c?a.sSortAscending:a.sSortDescending);g.setAttribute("aria-label",b)}}function Sa(a,b,c,d){var e=a.aaSorting,f=a.aoColumns[b].asSorting,h=function(a){var b=a._idx;b===l&&(b=g.inArray(a[1],
	f));return b+1>=f.length?0:b+1};c&&a.oFeatures.bSortMulti?(c=g.inArray(b,B(e,"0")),-1!==c?(b=h(e[c]),e[c][1]=f[b],e[c]._idx=b):(e.push([b,f[0],0]),e[e.length-1]._idx=0)):e.length&&e[0][0]==b?(b=h(e[0]),e.length=1,e[0][1]=f[b],e[0]._idx=b):(e.length=0,e.push([b,f[0]]),e[0]._idx=0);K(a);"function"==typeof d&&d(a)}function Ka(a,b,c,d){var e=a.aoColumns[c];Ta(b,{},function(b){!1!==e.bSortable&&(a.oFeatures.bProcessing?(C(a,!0),setTimeout(function(){Sa(a,c,b.shiftKey,d);"ssp"!==z(a)&&C(a,!1)},0)):Sa(a,
	c,b.shiftKey,d))})}function sa(a){var b=a.aLastSort,c=a.oClasses.sSortColumn,d=Q(a),e=a.oFeatures,f,h;if(e.bSort&&e.bSortClasses){e=0;for(f=b.length;e<f;e++)h=b[e].src,g(B(a.aoData,"anCells",h)).removeClass(c+(2>e?e+1:3));e=0;for(f=d.length;e<f;e++)h=d[e].src,g(B(a.aoData,"anCells",h)).addClass(c+(2>e?e+1:3))}a.aLastSort=d}function Eb(a,b){var c=a.aoColumns[b],d=p.ext.order[c.sSortDataType],e;d&&(e=d.call(a.oInstance,a,b,X(a,b)));for(var f,h=p.ext.type.order[c.sType+"-pre"],g=0,j=a.aoData.length;g<
	j;g++)if(c=a.aoData[g],c._aSortData||(c._aSortData=[]),!c._aSortData[b]||d)f=d?e[g]:A(a,g,b,"sort"),c._aSortData[b]=h?h(f):f}function ta(a){if(a.oFeatures.bStateSave&&!a.bDestroying){var b={iCreate:+new Date,iStart:a._iDisplayStart,iLength:a._iDisplayLength,aaSorting:g.extend(!0,[],a.aaSorting),oSearch:g.extend(!0,{},a.oPreviousSearch),aoSearchCols:g.extend(!0,[],a.aoPreSearchCols),abVisCols:B(a.aoColumns,"bVisible")};t(a,"aoStateSaveParams","stateSaveParams",[a,b]);a.fnStateSaveCallback.call(a.oInstance,
	a,b)}}function Gb(a){var b,c,d=a.aoColumns;if(a.oFeatures.bStateSave){var e=a.fnStateLoadCallback.call(a.oInstance,a);if(e&&(b=t(a,"aoStateLoadParams","stateLoadParams",[a,e]),-1===g.inArray(!1,b)&&(b=a.iStateDuration,!(0<b&&e.iCreate<+new Date-1E3*b)&&d.length===e.aoSearchCols.length))){a.oLoadedState=g.extend(!0,{},e);a._iDisplayStart=e.iStart;a.iInitDisplayStart=e.iStart;a._iDisplayLength=e.iLength;a.aaSorting=g.map(e.aaSorting,function(a){return a[0]>=d.length?[0,a[1]]:a});g.extend(a.oPreviousSearch,
	e.oSearch);g.extend(!0,a.aoPreSearchCols,e.aoSearchCols);var f=e.abVisCols;b=0;for(c=f.length;b<c;b++)d[b].bVisible=f[b];t(a,"aoStateLoaded","stateLoaded",[a,e])}}}function ua(a){var b=p.settings,a=g.inArray(a,B(b,"nTable"));return-1!==a?b[a]:null}function O(a,b,c,d){c="DataTables warning: "+(null!==a?"table id="+a.sTableId+" - ":"")+c;d&&(c+=". For more information about this error, please see http://datatables.net/tn/"+d);if(b)za.console&&console.log&&console.log(c);else if(a=p.ext,"alert"==(a.sErrMode||
	a.errMode))alert(c);else throw Error(c);}function D(a,b,c,d){g.isArray(c)?g.each(c,function(c,d){g.isArray(d)?D(a,b,d[0],d[1]):D(a,b,d)}):(d===l&&(d=c),b[c]!==l&&(a[d]=b[c]))}function Hb(a,b,c){var d,e;for(e in b)b.hasOwnProperty(e)&&(d=b[e],g.isPlainObject(d)?(g.isPlainObject(a[e])||(a[e]={}),g.extend(!0,a[e],d)):a[e]=c&&"data"!==e&&"aaData"!==e&&g.isArray(d)?d.slice():d);return a}function Ta(a,b,c){g(a).bind("click.DT",b,function(b){a.blur();c(b)}).bind("keypress.DT",b,function(a){13===a.which&&
	(a.preventDefault(),c(a))}).bind("selectstart.DT",function(){return!1})}function y(a,b,c,d){c&&a[b].push({fn:c,sName:d})}function t(a,b,c,d){var e=[];b&&(e=g.map(a[b].slice().reverse(),function(b){return b.fn.apply(a.oInstance,d)}));null!==c&&g(a.nTable).trigger(c+".dt",d);return e}function Qa(a){var b=a._iDisplayStart,c=a.fnDisplayEnd(),d=a._iDisplayLength;c===a.fnRecordsDisplay()&&(b=c-d);if(-1===d||0>b)b=0;a._iDisplayStart=b}function La(a,b){var c=a.renderer,d=p.ext.renderer[b];return g.isPlainObject(c)&&
	c[b]?d[c[b]]||d._:"string"===typeof c?d[c]||d._:d._}function z(a){return a.oFeatures.bServerSide?"ssp":a.ajax||a.sAjaxSource?"ajax":"dom"}function Ua(a,b){var c=[],c=Ib.numbers_length,d=Math.floor(c/2);b<=c?c=R(0,b):a<=d?(c=R(0,c-2),c.push("ellipsis"),c.push(b-1)):(a>=b-1-d?c=R(b-(c-2),b):(c=R(a-1,a+2),c.push("ellipsis"),c.push(b-1)),c.splice(0,0,"ellipsis"),c.splice(0,0,0));c.DT_el="span";return c}function bb(a){g.each({num:function(b){return va(b,a)},"num-fmt":function(b){return va(b,a,Va)},"html-num":function(b){return va(b,
	a,wa)},"html-num-fmt":function(b){return va(b,a,wa,Va)}},function(b,c){u.type.order[b+a+"-pre"]=c})}function Jb(a){return function(){var b=[ua(this[p.ext.iApiIndex])].concat(Array.prototype.slice.call(arguments));return p.ext.internal[a].apply(this,b)}}var p,u,q,r,x,Wa={},Kb=/[\r\n]/g,wa=/<.*?>/g,Vb=/^[\d\+\-a-zA-Z]/,Sb=RegExp("(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\|\\$|\\^|\\-)","g"),Va=/[',$\u00a3\u20ac\u00a5%\u2009\u202F]/g,da=function(a){return!a||"-"===a?!0:!1},Lb=function(a){var b=
	parseInt(a,10);return!isNaN(b)&&isFinite(a)?b:null},Mb=function(a,b){Wa[b]||(Wa[b]=RegExp(Oa(b),"g"));return"string"===typeof a?a.replace(/\./g,"").replace(Wa[b],"."):a},Xa=function(a,b,c){var d="string"===typeof a;b&&d&&(a=Mb(a,b));c&&d&&(a=a.replace(Va,""));return!a||"-"===a||!isNaN(parseFloat(a))&&isFinite(a)},Nb=function(a,b,c){return da(a)?!0:a&&"string"!==typeof a?null:Xa(a.replace(wa,""),b,c)?!0:null},B=function(a,b,c){var d=[],e=0,f=a.length;if(c!==l)for(;e<f;e++)a[e]&&a[e][b]&&d.push(a[e][b][c]);
	else for(;e<f;e++)a[e]&&d.push(a[e][b]);return d},xa=function(a,b,c,d){var e=[],f=0,h=b.length;if(d!==l)for(;f<h;f++)e.push(a[b[f]][c][d]);else for(;f<h;f++)e.push(a[b[f]][c]);return e},R=function(a,b){var c=[],d;b===l?(b=0,d=a):(d=b,b=a);for(var e=b;e<d;e++)c.push(e);return c},Ja=function(a){var b=[],c,d,e=a.length,f,h=0;d=0;a:for(;d<e;d++){c=a[d];for(f=0;f<h;f++)if(b[f]===c)continue a;b.push(c);h++}return b},w=function(a,b,c){a[b]!==l&&(a[c]=a[b])},Z=/\[.*?\]$/,P=/\(\)$/,qa=g("<div>")[0],Tb=qa.textContent!==
	l,Ub=/<.*?>/g;p=function(a){this.$=function(a,b){return this.api(!0).$(a,b)};this._=function(a,b){return this.api(!0).rows(a,b).data()};this.api=function(a){return a?new q(ua(this[u.iApiIndex])):new q(this)};this.fnAddData=function(a,b){var c=this.api(!0),d=g.isArray(a)&&(g.isArray(a[0])||g.isPlainObject(a[0]))?c.rows.add(a):c.row.add(a);(b===l||b)&&c.draw();return d.flatten().toArray()};this.fnAdjustColumnSizing=function(a){var b=this.api(!0).columns.adjust(),c=b.settings()[0],d=c.oScroll;a===l||
	a?b.draw(!1):(""!==d.sX||""!==d.sY)&&V(c)};this.fnClearTable=function(a){var b=this.api(!0).clear();(a===l||a)&&b.draw()};this.fnClose=function(a){this.api(!0).row(a).child.hide()};this.fnDeleteRow=function(a,b,c){var d=this.api(!0),a=d.rows(a),e=a.settings()[0],g=e.aoData[a[0][0]];a.remove();b&&b.call(this,e,g);(c===l||c)&&d.draw();return g};this.fnDestroy=function(a){this.api(!0).destroy(a)};this.fnDraw=function(a){this.api(!0).draw(!a)};this.fnFilter=function(a,b,c,d,e,g){e=this.api(!0);null===
	b||b===l?e.search(a,c,d,g):e.column(b).search(a,c,d,g);e.draw()};this.fnGetData=function(a,b){var c=this.api(!0);if(a!==l){var d=a.nodeName?a.nodeName.toLowerCase():"";return b!==l||"td"==d||"th"==d?c.cell(a,b).data():c.row(a).data()||null}return c.data().toArray()};this.fnGetNodes=function(a){var b=this.api(!0);return a!==l?b.row(a).node():b.rows().nodes().flatten().toArray()};this.fnGetPosition=function(a){var b=this.api(!0),c=a.nodeName.toUpperCase();return"TR"==c?b.row(a).index():"TD"==c||"TH"==
	c?(a=b.cell(a).index(),[a.row,a.columnVisible,a.column]):null};this.fnIsOpen=function(a){return this.api(!0).row(a).child.isShown()};this.fnOpen=function(a,b,c){return this.api(!0).row(a).child(b,c).show().child()[0]};this.fnPageChange=function(a,b){var c=this.api(!0).page(a);(b===l||b)&&c.draw(!1)};this.fnSetColumnVis=function(a,b,c){a=this.api(!0).column(a).visible(b);(c===l||c)&&a.columns.adjust().draw()};this.fnSettings=function(){return ua(this[u.iApiIndex])};this.fnSort=function(a){this.api(!0).order(a).draw()};
	this.fnSortListener=function(a,b,c){this.api(!0).order.listener(a,b,c)};this.fnUpdate=function(a,b,c,d,e){var g=this.api(!0);c===l||null===c?g.row(b).data(a):g.cell(b,c).data(a);(e===l||e)&&g.columns.adjust();(d===l||d)&&g.draw();return 0};this.fnVersionCheck=u.fnVersionCheck;var b=this,c=a===l,d=this.length;c&&(a={});this.oApi=this.internal=u.internal;for(var e in p.ext.internal)e&&(this[e]=Jb(e));this.each(function(){var e={},h=1<d?Hb(e,a,!0):a,i=0,j,n=this.getAttribute("id"),e=!1,m=p.defaults;
	if("table"!=this.nodeName.toLowerCase())O(null,0,"Non-table node initialisation ("+this.nodeName+")",2);else{cb(m);db(m.column);G(m,m,!0);G(m.column,m.column,!0);G(m,h);var o=p.settings,i=0;for(j=o.length;i<j;i++){if(o[i].nTable==this){j=h.bRetrieve!==l?h.bRetrieve:m.bRetrieve;if(c||j)return o[i].oInstance;if(h.bDestroy!==l?h.bDestroy:m.bDestroy){o[i].oInstance.fnDestroy();break}else{O(o[i],0,"Cannot reinitialise DataTable",3);return}}if(o[i].sTableId==this.id){o.splice(i,1);break}}if(null===n||""===
	n)this.id=n="DataTables_Table_"+p.ext._unique++;var k=g.extend(!0,{},p.models.oSettings,{nTable:this,oApi:b.internal,oInit:h,sDestroyWidth:g(this)[0].style.width,sInstance:n,sTableId:n});o.push(k);k.oInstance=1===b.length?b:g(this).dataTable();cb(h);h.oLanguage&&M(h.oLanguage);h.aLengthMenu&&!h.iDisplayLength&&(h.iDisplayLength=g.isArray(h.aLengthMenu[0])?h.aLengthMenu[0][0]:h.aLengthMenu[0]);h=Hb(g.extend(!0,{},m),h);D(k.oFeatures,h,"bPaginate bLengthChange bFilter bSort bSortMulti bInfo bProcessing bAutoWidth bSortClasses bServerSide bDeferRender".split(" "));
	D(k,h,["asStripeClasses","ajax","fnServerData","fnFormatNumber","sServerMethod","aaSorting","aaSortingFixed","aLengthMenu","sPaginationType","sAjaxSource","sAjaxDataProp","iStateDuration","sDom","bSortCellsTop","iTabIndex","fnStateLoadCallback","fnStateSaveCallback","renderer",["iCookieDuration","iStateDuration"],["oSearch","oPreviousSearch"],["aoSearchCols","aoPreSearchCols"],["iDisplayLength","_iDisplayLength"],["bJQueryUI","bJUI"]]);D(k.oScroll,h,[["sScrollX","sX"],["sScrollXInner","sXInner"],
	["sScrollY","sY"],["bScrollCollapse","bCollapse"]]);D(k.oLanguage,h,"fnInfoCallback");y(k,"aoDrawCallback",h.fnDrawCallback,"user");y(k,"aoServerParams",h.fnServerParams,"user");y(k,"aoStateSaveParams",h.fnStateSaveParams,"user");y(k,"aoStateLoadParams",h.fnStateLoadParams,"user");y(k,"aoStateLoaded",h.fnStateLoaded,"user");y(k,"aoRowCallback",h.fnRowCallback,"user");y(k,"aoRowCreatedCallback",h.fnCreatedRow,"user");y(k,"aoHeaderCallback",h.fnHeaderCallback,"user");y(k,"aoFooterCallback",h.fnFooterCallback,
	"user");y(k,"aoInitComplete",h.fnInitComplete,"user");y(k,"aoPreDrawCallback",h.fnPreDrawCallback,"user");n=k.oClasses;h.bJQueryUI?(g.extend(n,p.ext.oJUIClasses,h.oClasses),h.sDom===m.sDom&&"lfrtip"===m.sDom&&(k.sDom='<"H"lfr>t<"F"ip>'),k.renderer)?g.isPlainObject(k.renderer)&&!k.renderer.header&&(k.renderer.header="jqueryui"):k.renderer="jqueryui":g.extend(n,p.ext.classes,h.oClasses);g(this).addClass(n.sTable);if(""!==k.oScroll.sX||""!==k.oScroll.sY)k.oScroll.iBarWidth=Db();!0===k.oScroll.sX&&(k.oScroll.sX=
	"100%");k.iInitDisplayStart===l&&(k.iInitDisplayStart=h.iDisplayStart,k._iDisplayStart=h.iDisplayStart);null!==h.iDeferLoading&&(k.bDeferLoading=!0,i=g.isArray(h.iDeferLoading),k._iRecordsDisplay=i?h.iDeferLoading[0]:h.iDeferLoading,k._iRecordsTotal=i?h.iDeferLoading[1]:h.iDeferLoading);""!==h.oLanguage.sUrl?(k.oLanguage.sUrl=h.oLanguage.sUrl,g.getJSON(k.oLanguage.sUrl,null,function(a){M(a);G(m.oLanguage,a);g.extend(true,k.oLanguage,h.oLanguage,a);ra(k)}),e=!0):g.extend(!0,k.oLanguage,h.oLanguage);
	null===h.asStripeClasses&&(k.asStripeClasses=[n.sStripeOdd,n.sStripeEven]);var i=k.asStripeClasses,r=g("tbody tr:eq(0)",this);-1!==g.inArray(!0,g.map(i,function(a){return r.hasClass(a)}))&&(g("tbody tr",this).removeClass(i.join(" ")),k.asDestroyStripes=i.slice());var o=[],q,i=this.getElementsByTagName("thead");0!==i.length&&($(k.aoHeader,i[0]),o=ma(k));if(null===h.aoColumns){q=[];i=0;for(j=o.length;i<j;i++)q.push(null)}else q=h.aoColumns;i=0;for(j=q.length;i<j;i++)Aa(k,o?o[i]:null);gb(k,h.aoColumnDefs,
	q,function(a,b){fa(k,a,b)});if(r.length){var s=function(a,b){return a.getAttribute("data-"+b)?b:null};g.each(ia(k,r[0]).cells,function(a,b){var c=k.aoColumns[a];if(c.mData===a){var d=s(b,"sort")||s(b,"order"),e=s(b,"filter")||s(b,"search");if(d!==null||e!==null){c.mData={_:a+".display",sort:d!==null?a+".@data-"+d:l,type:d!==null?a+".@data-"+d:l,filter:e!==null?a+".@data-"+e:l};fa(k,a)}}})}var u=k.oFeatures;h.bStateSave&&(u.bStateSave=!0,Gb(k,h),y(k,"aoDrawCallback",ta,"state_save"));if(h.aaSorting===
	l){o=k.aaSorting;i=0;for(j=o.length;i<j;i++)o[i][1]=k.aoColumns[i].asSorting[0]}sa(k);u.bSort&&y(k,"aoDrawCallback",function(){if(k.bSorted){var a=Q(k),b={};g.each(a,function(a,c){b[c.src]=c.dir});t(k,null,"order",[k,a,b]);Fb(k)}});y(k,"aoDrawCallback",function(){(k.bSorted||z(k)==="ssp"||u.bDeferRender)&&sa(k)},"sc");eb(k);i=g(this).children("caption").each(function(){this._captionSide=g(this).css("caption-side")});j=g(this).children("thead");0===j.length&&(j=g("<thead/>").appendTo(this));k.nTHead=
	j[0];j=g(this).children("tbody");0===j.length&&(j=g("<tbody/>").appendTo(this));k.nTBody=j[0];j=g(this).children("tfoot");if(0===j.length&&0<i.length&&(""!==k.oScroll.sX||""!==k.oScroll.sY))j=g("<tfoot/>").appendTo(this);0===j.length||0===j.children().length?g(this).addClass(n.sNoFooter):0<j.length&&(k.nTFoot=j[0],$(k.aoFooter,k.nTFoot));if(h.aaData)for(i=0;i<h.aaData.length;i++)H(k,h.aaData[i]);else(k.bDeferLoading||"dom"==z(k))&&ha(k,g(k.nTBody).children("tr"));k.aiDisplay=k.aiDisplayMaster.slice();
	k.bInitialised=!0;!1===e&&ra(k)}});b=null;return this};var Ob=[],v=Array.prototype,Wb=function(a){var b,c,d=p.settings,e=g.map(d,function(a){return a.nTable});if(a){if(a.nTable&&a.oApi)return[a];if(a.nodeName&&"table"===a.nodeName.toLowerCase())return b=g.inArray(a,e),-1!==b?[d[b]]:null;if(a&&"function"===typeof a.settings)return a.settings().toArray();"string"===typeof a?c=g(a):a instanceof g&&(c=a)}else return[];if(c)return c.map(function(){b=g.inArray(this,e);return-1!==b?d[b]:null}).toArray()};
	p.Api=q=function(a,b){if(!this instanceof q)throw"DT API must be constructed as a new object";var c=[],d=function(a){(a=Wb(a))&&c.push.apply(c,a)};if(g.isArray(a))for(var e=0,f=a.length;e<f;e++)d(a[e]);else d(a);this.context=Ja(c);b&&this.push.apply(this,b.toArray?b.toArray():b);this.selector={rows:null,cols:null,opts:null};q.extend(this,this,Ob)};q.prototype={concat:v.concat,context:[],each:function(a){if(v.forEach)v.forEach.call(this,a,this);else for(var b=0,c=this.length;b<c;b++)a.call(this,this[b],
	b,this);return this},eq:function(a){var b=this.context;return b.length>a?new q(b[a],this[a]):null},filter:function(a){var b=[];if(v.filter)b=v.filter.call(this,a,this);else for(var c=0,d=this.length;c<d;c++)a.call(this,this[c],c,this)&&b.push(this[c]);return new q(this.context,b)},flatten:function(){var a=[];return new q(this.context,a.concat.apply(a,this.toArray()))},join:v.join,indexOf:v.indexOf||function(a,b){for(var c=b||0,d=this.length;c<d;c++)if(this[c]===a)return c;return-1},iterator:function(a,
	b,c){var d=[],e,f,h,g,j,n=this.context,m,o,k=this.selector;"string"===typeof a&&(c=b,b=a,a=!1);f=0;for(h=n.length;f<h;f++)if("table"===b)e=c(n[f],f),e!==l&&d.push(e);else if("columns"===b||"rows"===b)e=c(n[f],this[f],f),e!==l&&d.push(e);else if("column"===b||"column-rows"===b||"row"===b||"cell"===b){o=this[f];"column-rows"===b&&(m=Ya(n[f],k.opts));g=0;for(j=o.length;g<j;g++)e=o[g],e="cell"===b?c(n[f],e.row,e.column,f,g):c(n[f],e,f,g,m),e!==l&&d.push(e)}return d.length?(a=new q(n,a?d.concat.apply([],
	d):d),b=a.selector,b.rows=k.rows,b.cols=k.cols,b.opts=k.opts,a):this},lastIndexOf:v.lastIndexOf||function(a,b){return this.indexOf.apply(this.toArray.reverse(),arguments)},length:0,map:function(a){var b=[];if(v.map)b=v.map.call(this,a,this);else for(var c=0,d=this.length;c<d;c++)b.push(a.call(this,this[c],c));return new q(this.context,b)},pluck:function(a){return this.map(function(b){return b[a]})},pop:v.pop,push:v.push,reduce:v.reduce||function(a,b){return fb(this,a,b,0,this.length,1)},reduceRight:v.reduceRight||
	function(a,b){return fb(this,a,b,this.length-1,-1,-1)},reverse:v.reverse,selector:null,shift:v.shift,sort:v.sort,splice:v.splice,toArray:function(){return v.slice.call(this)},to$:function(){return g(this)},toJQuery:function(){return g(this)},unique:function(){return new q(this.context,Ja(this))},unshift:v.unshift};q.extend=function(a,b,c){if(b&&(b instanceof q||b.__dt_wrapper)){var d,e,f,h=function(b,c){return function(){var d=b.apply(a,arguments);q.extend(d,d,c.methodExt);return d}};d=0;for(e=c.length;d<
	e;d++)f=c[d],b[f.name]="function"===typeof f.val?h(f.val,f):g.isPlainObject(f.val)?{}:f.val,b[f.name].__dt_wrapper=!0,q.extend(a,b[f.name],f.propExt)}};q.register=r=function(a,b){if(g.isArray(a))for(var c=0,d=a.length;c<d;c++)q.register(a[c],b);else{for(var e=a.split("."),f=Ob,h,i,c=0,d=e.length;c<d;c++){h=(i=-1!==e[c].indexOf("()"))?e[c].replace("()",""):e[c];var j;a:{j=0;for(var n=f.length;j<n;j++)if(f[j].name===h){j=f[j];break a}j=null}j||(j={name:h,val:{},methodExt:[],propExt:[]},f.push(j));c===
	d-1?j.val=b:f=i?j.methodExt:j.propExt}q.ready&&p.api.build()}};q.registerPlural=x=function(a,b,c){q.register(a,c);q.register(b,function(){var a=c.apply(this,arguments);return a===this?this:a instanceof q?a.length?g.isArray(a[0])?new q(a.context,a[0]):a[0]:l:a})};r("tables()",function(a){var b;if(a){b=q;var c=this.context;if("number"===typeof a)a=[c[a]];else var d=g.map(c,function(a){return a.nTable}),a=g(d).filter(a).map(function(){var a=g.inArray(this,d);return c[a]}).toArray();b=new b(a)}else b=
	this;return b});r("table()",function(a){var a=this.tables(a),b=a.context;return b.length?new q(b[0]):a});x("tables().nodes()","table().node()",function(){return this.iterator("table",function(a){return a.nTable})});x("tables().body()","table().body()",function(){return this.iterator("table",function(a){return a.nTBody})});x("tables().header()","table().header()",function(){return this.iterator("table",function(a){return a.nTHead})});x("tables().footer()","table().footer()",function(){return this.iterator("table",
	function(a){return a.nTFoot})});r("draw()",function(a){return this.iterator("table",function(b){K(b,!1===a)})});r("page()",function(a){return a===l?this.page.info().page:this.iterator("table",function(b){Ra(b,a)})});r("page.info()",function(){if(0===this.context.length)return l;var a=this.context[0],b=a._iDisplayStart,c=a._iDisplayLength,d=a.fnRecordsDisplay(),e=-1===c;return{page:e?0:Math.floor(b/c),pages:e?1:Math.ceil(d/c),start:b,end:a.fnDisplayEnd(),length:c,recordsTotal:a.fnRecordsTotal(),recordsDisplay:d}});
	r("page.len()",function(a){return a===l?0!==this.context.length?this.context[0]._iDisplayLength:l:this.iterator("table",function(b){Pa(b,a)})});var Pb=function(a,b,c){"ssp"==z(a)?K(a,b):(C(a,!0),na(a,[],function(c){ja(a);for(var c=oa(a,c),d=0,h=c.length;d<h;d++)H(a,c[d]);K(a,b);C(a,!1)}));if(c){var d=new q(a);d.one("draw",function(){c(d.ajax.json())})}};r("ajax.json()",function(){var a=this.context;if(0<a.length)return a[0].json});r("ajax.params()",function(){var a=this.context;if(0<a.length)return a[0].oAjaxData});
	r("ajax.reload()",function(a,b){return this.iterator("table",function(c){Pb(c,!1===b,a)})});r("ajax.url()",function(a){var b=this.context;if(a===l){if(0===b.length)return l;b=b[0];return b.ajax?g.isPlainObject(b.ajax)?b.ajax.url:b.ajax:b.sAjaxSource}return this.iterator("table",function(b){g.isPlainObject(b.ajax)?b.ajax.url=a:b.ajax=a})});r("ajax.url().load()",function(a,b){return this.iterator("table",function(c){Pb(c,!1===b,a)})});var Za=function(a,b){var c=[],d,e,f,h,i,j;if(!a||"string"===typeof a||
	a.length===l)a=[a];f=0;for(h=a.length;f<h;f++){e=a[f]&&a[f].split?a[f].split(","):[a[f]];i=0;for(j=e.length;i<j;i++)(d=b("string"===typeof e[i]?g.trim(e[i]):e[i]))&&d.length&&c.push.apply(c,d)}return c},$a=function(a){a||(a={});a.filter&&!a.search&&(a.search=a.filter);return{search:a.search||"none",order:a.order||"current",page:a.page||"all"}},ab=function(a){for(var b=0,c=a.length;b<c;b++)if(0<a[b].length)return a[0]=a[b],a.length=1,a.context=[a.context[b]],a;a.length=0;return a},Ya=function(a,b){var c,
	d,e,f=[],h=a.aiDisplay;c=a.aiDisplayMaster;var i=b.search;d=b.order;e=b.page;if("ssp"==z(a))return"removed"===i?[]:R(0,c.length);if("current"==e){c=a._iDisplayStart;for(d=a.fnDisplayEnd();c<d;c++)f.push(h[c])}else if("current"==d||"applied"==d)f="none"==i?c.slice():"applied"==i?h.slice():g.map(c,function(a){return-1===g.inArray(a,h)?a:null});else if("index"==d||"original"==d){c=0;for(d=a.aoData.length;c<d;c++)"none"==i?f.push(c):(e=g.inArray(c,h),(-1===e&&"removed"==i||1===e&&"applied"==i)&&f.push(c))}return f};
	r("rows()",function(a,b){a===l?a="":g.isPlainObject(a)&&(b=a,a="");var b=$a(b),c=this.iterator("table",function(c){var e=b;return Za(a,function(a){var b=Lb(a);if(b!==null&&!e)return[b];var i=Ya(c,e);if(b!==null&&g.inArray(b,i)!==-1)return[b];if(!a)return i;for(var b=[],j=0,n=i.length;j<n;j++)b.push(c.aoData[i[j]].nTr);return a.nodeName&&g.inArray(a,b)!==-1?[a._DT_RowIndex]:g(b).filter(a).map(function(){return this._DT_RowIndex}).toArray()})});c.selector.rows=a;c.selector.opts=b;return c});r("rows().nodes()",
	function(){return this.iterator("row",function(a,b){return a.aoData[b].nTr||l})});r("rows().data()",function(){return this.iterator(!0,"rows",function(a,b){return xa(a.aoData,b,"_aData")})});x("rows().cache()","row().cache()",function(a){return this.iterator("row",function(b,c){var d=b.aoData[c];return"search"===a?d._aFilterData:d._aSortData})});x("rows().invalidate()","row().invalidate()",function(a){return this.iterator("row",function(b,c){la(b,c,a)})});x("rows().indexes()","row().index()",function(){return this.iterator("row",
	function(a,b){return b})});x("rows().remove()","row().remove()",function(){var a=this;return this.iterator("row",function(b,c,d){var e=b.aoData;e.splice(c,1);for(var f=0,h=e.length;f<h;f++)null!==e[f].nTr&&(e[f].nTr._DT_RowIndex=f);g.inArray(c,b.aiDisplay);ka(b.aiDisplayMaster,c);ka(b.aiDisplay,c);ka(a[d],c,!1);Qa(b)})});r("rows.add()",function(a){var b=this.iterator("table",function(b){var c,f,h,g=[];f=0;for(h=a.length;f<h;f++)c=a[f],c.nodeName&&"TR"===c.nodeName.toUpperCase()?g.push(ha(b,c)[0]):
	g.push(H(b,c));return g}),c=this.rows(-1);c.pop();c.push.apply(c,b.toArray());return c});r("row()",function(a,b){return ab(this.rows(a,b))});r("row().data()",function(a){var b=this.context;if(a===l)return b.length&&this.length?b[0].aoData[this[0]]._aData:l;b[0].aoData[this[0]]._aData=a;la(b[0],this[0],"data");return this});r("row().node()",function(){var a=this.context;return a.length&&this.length?a[0].aoData[this[0]].nTr||null:null});r("row.add()",function(a){a instanceof g&&a.length&&(a=a[0]);var b=
	this.iterator("table",function(b){return a.nodeName&&"TR"===a.nodeName.toUpperCase()?ha(b,a)[0]:H(b,a)});return this.row(b[0])});var Qb=function(a){var b=this.context;if(b.length&&this.length){var c=b[0].aoData[this[0]];if(c._details){(c._detailsShow=a)?c._details.insertAfter(c.nTr):c._details.remove();var d=b[0],e=new q(d);e.off("draw.dt.DT_details column-visibility.dt.DT_details");0<B(d.aoData,"_details").length&&(e.on("draw.dt.DT_details",function(){e.rows({page:"current"}).eq(0).each(function(a){a=
	d.aoData[a];a._detailsShow&&a._details.insertAfter(a.nTr)})}),e.on("column-visibility.dt.DT_details",function(a,b){for(var c,d=Y(b),e=0,g=b.aoData.length;e<g;e++)c=b.aoData[e],c._details&&c._details.children("td[colspan]").attr("colspan",d)}))}}return this};r("row().child()",function(a,b){var c=this.context;if(a===l)return c.length&&this.length?c[0].aoData[this[0]]._details:l;if(c.length&&this.length){var d=c[0],c=c[0].aoData[this[0]],e=[],f=function(a,b){if(a.nodeName&&"tr"===a.nodeName.toLowerCase())e.push(a);
	else{var c=g("<tr><td/></tr>");g("td",c).addClass(b).html(a)[0].colSpan=Y(d);e.push(c[0])}};if(g.isArray(a)||a instanceof g)for(var h=0,i=a.length;h<i;h++)f(a[h],b);else f(a,b);c._details&&c._details.remove();c._details=g(e);c._detailsShow&&c._details.insertAfter(c.nTr)}return this});r(["row().child.show()","row().child().show()"],function(){Qb.call(this,!0);return this});r(["row().child.hide()","row().child().hide()"],function(){Qb.call(this,!1);return this});r("row().child.isShown()",function(){var a=
	this.context;return a.length&&this.length?a[0].aoData[this[0]]._detailsShow||!1:!1});var Xb=/^(.*):(name|visIdx|visible)$/;r("columns()",function(a,b){a===l?a="":g.isPlainObject(a)&&(b=a,a="");var b=$a(b),c=this.iterator("table",function(b){var c=a,f=b.aoColumns,h=B(f,"sName"),i=B(f,"nTh");return Za(c,function(a){var c=Lb(a);if(a==="")return R(f.length);if(c!==null)return[c>=0?c:f.length+c];var e=typeof a==="string"?a.match(Xb):"";if(e)switch(e[2]){case "visIdx":case "visible":a=parseInt(e[1],10);
	if(a<0){c=g.map(f,function(a,b){return a.bVisible?b:null});return[c[c.length+a]]}return[ga(b,a)];case "name":return g.map(h,function(a,b){return a===e[1]?b:null})}else return g(i).filter(a).map(function(){return g.inArray(this,i)}).toArray()})});c.selector.cols=a;c.selector.opts=b;return c});x("columns().header()","column().header()",function(){return this.iterator("column",function(a,b){return a.aoColumns[b].nTh})});x("columns().footer()","column().footer()",function(){return this.iterator("column",
	function(a,b){return a.aoColumns[b].nTf})});x("columns().data()","column().data()",function(){return this.iterator("column-rows",function(a,b,c,d,e){for(var c=[],d=0,f=e.length;d<f;d++)c.push(A(a,e[d],b,""));return c})});x("columns().cache()","column().cache()",function(a){return this.iterator("column-rows",function(b,c,d,e,f){return xa(b.aoData,f,"search"===a?"_aFilterData":"_aSortData",c)})});x("columns().nodes()","column().nodes()",function(){return this.iterator("column-rows",function(a,b,c,d,
	e){return xa(a.aoData,e,"anCells",b)})});x("columns().visible()","column().visible()",function(a){return this.iterator("column",function(b,c){var d;if(a===l)d=b.aoColumns[c].bVisible;else{var e=b.aoColumns;d=e[c];var f=b.aoData,h,i,j;if(a===l)d=d.bVisible;else{if(d.bVisible!==a){if(a){var n=g.inArray(!0,B(e,"bVisible"),c+1);h=0;for(i=f.length;h<i;h++)j=f[h].nTr,e=f[h].anCells,j&&j.insertBefore(e[c],e[n]||null)}else g(B(b.aoData,"anCells",c)).detach(),d.bVisible=!1,I(b,b.aoHeader),I(b,b.aoFooter),
	ta(b);d.bVisible=a;I(b,b.aoHeader);I(b,b.aoFooter);U(b);(b.oScroll.sX||b.oScroll.sY)&&V(b);t(b,null,"column-visibility",[b,c,a]);ta(b)}d=void 0}}return d})});x("columns().indexes()","column().index()",function(a){return this.iterator("column",function(b,c){return"visible"===a?X(b,c):c})});r("columns.adjust()",function(){return this.iterator("table",function(a){U(a)})});r("column.index()",function(a,b){if(0!==this.context.length){var c=this.context[0];if("fromVisible"===a||"toData"===a)return ga(c,
	b);if("fromData"===a||"toVisible"===a)return X(c,b)}});r("column()",function(a,b){return ab(this.columns(a,b))});r("cells()",function(a,b,c){g.isPlainObject(a)&&(a.row?(c=b,b=null):(c=a,a=null));g.isPlainObject(b)&&(c=b,b=null);if(null===b||b===l)return this.iterator("table",function(b){var d=a,e=$a(c),f=b.aoData,h=Ya(b,e),e=xa(f,h,"anCells"),i=g([].concat.apply([],e)),j,m=b.aoColumns.length,n,l,p,r;return Za(d,function(a){if(a){if(g.isPlainObject(a))return[a]}else{n=[];l=0;for(p=h.length;l<p;l++){j=
	h[l];for(r=0;r<m;r++)n.push({row:j,column:r})}return n}return i.filter(a).map(function(a,b){j=b.parentNode._DT_RowIndex;return{row:j,column:g.inArray(b,f[j].anCells)}}).toArray()})});var d=this.columns(b,c),e=this.rows(a,c),f,h,i,j,n,m=this.iterator("table",function(a,b){f=[];h=0;for(i=e[b].length;h<i;h++){j=0;for(n=d[b].length;j<n;j++)f.push({row:e[b][h],column:d[b][j]})}return f});g.extend(m.selector,{cols:b,rows:a,opts:c});return m});x("cells().nodes()","cell().node()",function(){return this.iterator("cell",
	function(a,b,c){return a.aoData[b].anCells[c]})});r("cells().data()",function(){return this.iterator("cell",function(a,b,c){return A(a,b,c)})});x("cells().cache()","cell().cache()",function(a){a="search"===a?"_aFilterData":"_aSortData";return this.iterator("cell",function(b,c,d){return b.aoData[c][a][d]})});x("cells().indexes()","cell().index()",function(){return this.iterator("cell",function(a,b,c){return{row:b,column:c,columnVisible:X(a,c)}})});r(["cells().invalidate()","cell().invalidate()"],function(a){var b=
	this.selector;this.rows(b.rows,b.opts).invalidate(a);return this});r("cell()",function(a,b,c){return ab(this.cells(a,b,c))});r("cell().data()",function(a){var b=this.context,c=this[0];if(a===l)return b.length&&c.length?A(b[0],c[0].row,c[0].column):l;Ea(b[0],c[0].row,c[0].column,a);la(b[0],c[0].row,"data",c[0].column);return this});r("order()",function(a,b){var c=this.context;if(a===l)return 0!==c.length?c[0].aaSorting:l;"number"===typeof a?a=[[a,b]]:g.isArray(a[0])||(a=Array.prototype.slice.call(arguments));
	return this.iterator("table",function(b){b.aaSorting=a.slice()})});r("order.listener()",function(a,b,c){return this.iterator("table",function(d){Ka(d,a,b,c)})});r(["columns().order()","column().order()"],function(a){var b=this;return this.iterator("table",function(c,d){var e=[];g.each(b[d],function(b,c){e.push([c,a])});c.aaSorting=e})});r("search()",function(a,b,c,d){var e=this.context;return a===l?0!==e.length?e[0].oPreviousSearch.sSearch:l:this.iterator("table",function(e){e.oFeatures.bFilter&&
	aa(e,g.extend({},e.oPreviousSearch,{sSearch:a+"",bRegex:null===b?!1:b,bSmart:null===c?!0:c,bCaseInsensitive:null===d?!0:d}),1)})});r(["columns().search()","column().search()"],function(a,b,c,d){return this.iterator("column",function(e,f){var h=e.aoPreSearchCols;if(a===l)return h[f].sSearch;e.oFeatures.bFilter&&(g.extend(h[f],{sSearch:a+"",bRegex:null===b?!1:b,bSmart:null===c?!0:c,bCaseInsensitive:null===d?!0:d}),aa(e,e.oPreviousSearch,1))})});p.versionCheck=p.fnVersionCheck=function(a){for(var b=
	p.version.split("."),a=a.split("."),c,d,e=0,f=a.length;e<f;e++)if(c=parseInt(b[e],10)||0,d=parseInt(a[e],10)||0,c!==d)return c>d;return!0};p.isDataTable=p.fnIsDataTable=function(a){var b=g(a).get(0),c=!1;g.each(p.settings,function(a,e){if(e.nTable===b||e.nScrollHead===b||e.nScrollFoot===b)c=!0});return c};p.tables=p.fnTables=function(a){return jQuery.map(p.settings,function(b){if(!a||a&&g(b.nTable).is(":visible"))return b.nTable})};p.camelToHungarian=G;r("$()",function(a,b){var c=this.rows(b).nodes(),
	c=g(c);return g([].concat(c.filter(a).toArray(),c.find(a).toArray()))});g.each(["on","one","off"],function(a,b){r(b+"()",function(){var a=Array.prototype.slice.call(arguments);-1===a[0].indexOf(".dt")&&(a[0]+=".dt");var d=g(this.tables().nodes());d[b].apply(d,a);return this})});r("clear()",function(){return this.iterator("table",function(a){ja(a)})});r("settings()",function(){return new q(this.context,this.context)});r("data()",function(){return this.iterator("table",function(a){return B(a.aoData,
	"_aData")}).flatten()});r("destroy()",function(a){a=a||!1;return this.iterator("table",function(b){var c=b.nTableWrapper.parentNode,d=b.oClasses,e=b.nTable,f=b.nTBody,h=b.nTHead,i=b.nTFoot,j=g(e),f=g(f),n=g(b.nTableWrapper),m=g.map(b.aoData,function(a){return a.nTr}),l;b.bDestroying=!0;t(b,"aoDestroyCallback","destroy",[b]);a||(new q(b)).columns().visible(!0);n.unbind(".DT").find(":not(tbody *)").unbind(".DT");g(za).unbind(".DT-"+b.sInstance);e!=h.parentNode&&(j.children("thead").detach(),j.append(h));
	i&&e!=i.parentNode&&(j.children("tfoot").detach(),j.append(i));j.detach();n.detach();b.aaSorting=[];b.aaSortingFixed=[];sa(b);g(m).removeClass(b.asStripeClasses.join(" "));g("th, td",h).removeClass(d.sSortable+" "+d.sSortableAsc+" "+d.sSortableDesc+" "+d.sSortableNone);b.bJUI&&(g("th span."+d.sSortIcon+", td span."+d.sSortIcon,h).detach(),g("th, td",h).each(function(){var a=g("div."+d.sSortJUIWrapper,this);g(this).append(a.contents());a.detach()}));!a&&c&&c.insertBefore(e,b.nTableReinsertBefore);
	f.children().detach();f.append(m);j.css("width",b.sDestroyWidth).removeClass(d.sTable);(l=b.asDestroyStripes.length)&&f.children().each(function(a){g(this).addClass(b.asDestroyStripes[a%l])});c=g.inArray(b,p.settings);-1!==c&&p.settings.splice(c,1)})});p.version="1.10.0";p.settings=[];p.models={};p.models.oSearch={bCaseInsensitive:!0,sSearch:"",bRegex:!1,bSmart:!0};p.models.oRow={nTr:null,anCells:null,_aData:[],_aSortData:null,_aFilterData:null,_sFilterRow:null,_sRowStripe:"",src:null};p.models.oColumn=
	{idx:null,aDataSort:null,asSorting:null,bSearchable:null,bSortable:null,bVisible:null,_sManualType:null,_bAttrSrc:!1,fnCreatedCell:null,fnGetData:null,fnSetData:null,mData:null,mRender:null,nTh:null,nTf:null,sClass:null,sContentPadding:null,sDefaultContent:null,sName:null,sSortDataType:"std",sSortingClass:null,sSortingClassJUI:null,sTitle:null,sType:null,sWidth:null,sWidthOrig:null};p.defaults={aaData:null,aaSorting:[[0,"asc"]],aaSortingFixed:[],ajax:null,aLengthMenu:[10,25,50,100],aoColumns:null,
	aoColumnDefs:null,aoSearchCols:[],asStripeClasses:null,bAutoWidth:!0,bDeferRender:!1,bDestroy:!1,bFilter:!0,bInfo:!0,bJQueryUI:!1,bLengthChange:!0,bPaginate:!0,bProcessing:!1,bRetrieve:!1,bScrollCollapse:!1,bServerSide:!1,bSort:!0,bSortMulti:!0,bSortCellsTop:!1,bSortClasses:!0,bStateSave:!1,fnCreatedRow:null,fnDrawCallback:null,fnFooterCallback:null,fnFormatNumber:function(a){return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g,this.oLanguage.sThousands)},fnHeaderCallback:null,fnInfoCallback:null,
	fnInitComplete:null,fnPreDrawCallback:null,fnRowCallback:null,fnServerData:null,fnServerParams:null,fnStateLoadCallback:function(a){try{return JSON.parse((-1===a.iStateDuration?sessionStorage:localStorage).getItem("DataTables_"+a.sInstance+"_"+location.pathname))}catch(b){}},fnStateLoadParams:null,fnStateLoaded:null,fnStateSaveCallback:function(a,b){try{(-1===a.iStateDuration?sessionStorage:localStorage).setItem("DataTables_"+a.sInstance+"_"+location.pathname,JSON.stringify(b))}catch(c){}},fnStateSaveParams:null,
	iStateDuration:7200,iDeferLoading:null,iDisplayLength:10,iDisplayStart:0,iTabIndex:0,oClasses:{},oLanguage:{oAria:{sSortAscending:": activate to sort column ascending",sSortDescending:": activate to sort column descending"},oPaginate:{sFirst:"First",sLast:"Last",sNext:"Next",sPrevious:"Previous"},sEmptyTable:"No data available in table",sInfo:"Showing _START_ to _END_ of _TOTAL_ entries",sInfoEmpty:"Showing 0 to 0 of 0 entries",sInfoFiltered:"(filtered from _MAX_ total entries)",sInfoPostFix:"",sDecimal:"",
	sThousands:",",sLengthMenu:"Show _MENU_ entries",sLoadingRecords:"Loading...",sProcessing:"Processing...",sSearch:"Search:",sUrl:"",sZeroRecords:"No matching records found"},oSearch:g.extend({},p.models.oSearch),sAjaxDataProp:"data",sAjaxSource:null,sDom:"lfrtip",sPaginationType:"simple_numbers",sScrollX:"",sScrollXInner:"",sScrollY:"",sServerMethod:"GET",renderer:null};S(p.defaults);p.defaults.column={aDataSort:null,iDataSort:-1,asSorting:["asc","desc"],bSearchable:!0,bSortable:!0,bVisible:!0,fnCreatedCell:null,
	mData:null,mRender:null,sCellType:"td",sClass:"",sContentPadding:"",sDefaultContent:null,sName:"",sSortDataType:"std",sTitle:null,sType:null,sWidth:null};S(p.defaults.column);p.models.oSettings={oFeatures:{bAutoWidth:null,bDeferRender:null,bFilter:null,bInfo:null,bLengthChange:null,bPaginate:null,bProcessing:null,bServerSide:null,bSort:null,bSortMulti:null,bSortClasses:null,bStateSave:null},oScroll:{bCollapse:null,iBarWidth:0,sX:null,sXInner:null,sY:null},oLanguage:{fnInfoCallback:null},oBrowser:{bScrollOversize:!1,
	bScrollbarLeft:!1},ajax:null,aanFeatures:[],aoData:[],aiDisplay:[],aiDisplayMaster:[],aoColumns:[],aoHeader:[],aoFooter:[],oPreviousSearch:{},aoPreSearchCols:[],aaSorting:null,aaSortingFixed:[],asStripeClasses:null,asDestroyStripes:[],sDestroyWidth:0,aoRowCallback:[],aoHeaderCallback:[],aoFooterCallback:[],aoDrawCallback:[],aoRowCreatedCallback:[],aoPreDrawCallback:[],aoInitComplete:[],aoStateSaveParams:[],aoStateLoadParams:[],aoStateLoaded:[],sTableId:"",nTable:null,nTHead:null,nTFoot:null,nTBody:null,
	nTableWrapper:null,bDeferLoading:!1,bInitialised:!1,aoOpenRows:[],sDom:null,sPaginationType:"two_button",iStateDuration:0,aoStateSave:[],aoStateLoad:[],oLoadedState:null,sAjaxSource:null,sAjaxDataProp:null,bAjaxDataGet:!0,jqXHR:null,json:l,oAjaxData:l,fnServerData:null,aoServerParams:[],sServerMethod:null,fnFormatNumber:null,aLengthMenu:null,iDraw:0,bDrawing:!1,iDrawError:-1,_iDisplayLength:10,_iDisplayStart:0,_iRecordsTotal:0,_iRecordsDisplay:0,bJUI:null,oClasses:{},bFiltered:!1,bSorted:!1,bSortCellsTop:null,
	oInit:null,aoDestroyCallback:[],fnRecordsTotal:function(){return"ssp"==z(this)?1*this._iRecordsTotal:this.aiDisplayMaster.length},fnRecordsDisplay:function(){return"ssp"==z(this)?1*this._iRecordsDisplay:this.aiDisplay.length},fnDisplayEnd:function(){var a=this._iDisplayLength,b=this._iDisplayStart,c=b+a,d=this.aiDisplay.length,e=this.oFeatures,f=e.bPaginate;return e.bServerSide?!1===f||-1===a?b+d:Math.min(b+a,this._iRecordsDisplay):!f||c>d||-1===a?d:c},oInstance:null,sInstance:null,iTabIndex:0,nScrollHead:null,
	nScrollFoot:null,aLastSort:[],oPlugins:{}};p.ext=u={classes:{},errMode:"alert",feature:[],search:[],internal:{},legacy:{ajax:null},pager:{},renderer:{pageButton:{},header:{}},order:{},type:{detect:[],search:{},order:{}},_unique:0,fnVersionCheck:p.fnVersionCheck,iApiIndex:0,oJUIClasses:{},sVersion:p.version};g.extend(u,{afnFiltering:u.search,aTypes:u.type.detect,ofnSearch:u.type.search,oSort:u.type.order,afnSortData:u.order,aoFeatures:u.feature,oApi:u.internal,oStdClasses:u.classes,oPagination:u.pager});
	g.extend(p.ext.classes,{sTable:"dataTable",sNoFooter:"no-footer",sPageButton:"paginate_button",sPageButtonActive:"current",sPageButtonDisabled:"disabled",sStripeOdd:"odd",sStripeEven:"even",sRowEmpty:"dataTables_empty",sWrapper:"dataTables_wrapper",sFilter:"dataTables_filter",sInfo:"dataTables_info",sPaging:"dataTables_paginate paging_",sLength:"dataTables_length",sProcessing:"dataTables_processing",sSortAsc:"sorting_asc",sSortDesc:"sorting_desc",sSortable:"sorting",sSortableAsc:"sorting_asc_disabled",
	sSortableDesc:"sorting_desc_disabled",sSortableNone:"sorting_disabled",sSortColumn:"sorting_",sFilterInput:"",sLengthSelect:"",sScrollWrapper:"dataTables_scroll",sScrollHead:"dataTables_scrollHead",sScrollHeadInner:"dataTables_scrollHeadInner",sScrollBody:"dataTables_scrollBody",sScrollFoot:"dataTables_scrollFoot",sScrollFootInner:"dataTables_scrollFootInner",sHeaderTH:"",sFooterTH:"",sSortJUIAsc:"",sSortJUIDesc:"",sSortJUI:"",sSortJUIAscAllowed:"",sSortJUIDescAllowed:"",sSortJUIWrapper:"",sSortIcon:"",
	sJUIHeader:"",sJUIFooter:""});var ya="",ya="",E=ya+"ui-state-default",ea=ya+"css_right ui-icon ui-icon-",Rb=ya+"fg-toolbar ui-toolbar ui-widget-header ui-helper-clearfix";g.extend(p.ext.oJUIClasses,p.ext.classes,{sPageButton:"fg-button ui-button "+E,sPageButtonActive:"ui-state-disabled",sPageButtonDisabled:"ui-state-disabled",sPaging:"dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi ui-buttonset-multi paging_",sSortAsc:E+" sorting_asc",sSortDesc:E+" sorting_desc",sSortable:E+" sorting",
	sSortableAsc:E+" sorting_asc_disabled",sSortableDesc:E+" sorting_desc_disabled",sSortableNone:E+" sorting_disabled",sSortJUIAsc:ea+"triangle-1-n",sSortJUIDesc:ea+"triangle-1-s",sSortJUI:ea+"carat-2-n-s",sSortJUIAscAllowed:ea+"carat-1-n",sSortJUIDescAllowed:ea+"carat-1-s",sSortJUIWrapper:"DataTables_sort_wrapper",sSortIcon:"DataTables_sort_icon",sScrollHead:"dataTables_scrollHead "+E,sScrollFoot:"dataTables_scrollFoot "+E,sHeaderTH:E,sFooterTH:E,sJUIHeader:Rb+" ui-corner-tl ui-corner-tr",sJUIFooter:Rb+
	" ui-corner-bl ui-corner-br"});var Ib=p.ext.pager;g.extend(Ib,{simple:function(){return["previous","next"]},full:function(){return["first","previous","next","last"]},simple_numbers:function(a,b){return["previous",Ua(a,b),"next"]},full_numbers:function(a,b){return["first","previous",Ua(a,b),"next","last"]},_numbers:Ua,numbers_length:7});g.extend(!0,p.ext.renderer,{pageButton:{_:function(a,b,c,d,e,f){var h=a.oClasses,i=a.oLanguage.oPaginate,j,l,m=0,o=function(b,d){var k,p,r,q,s=function(b){Ra(a,b.data.action,
	true)};k=0;for(p=d.length;k<p;k++){q=d[k];if(g.isArray(q)){r=g("<"+(q.DT_el||"div")+"/>").appendTo(b);o(r,q)}else{l=j="";switch(q){case "ellipsis":b.append("<span>&hellip;</span>");break;case "first":j=i.sFirst;l=q+(e>0?"":" "+h.sPageButtonDisabled);break;case "previous":j=i.sPrevious;l=q+(e>0?"":" "+h.sPageButtonDisabled);break;case "next":j=i.sNext;l=q+(e<f-1?"":" "+h.sPageButtonDisabled);break;case "last":j=i.sLast;l=q+(e<f-1?"":" "+h.sPageButtonDisabled);break;default:j=q+1;l=e===q?h.sPageButtonActive:
	""}if(j){r=g("<a>",{"class":h.sPageButton+" "+l,"aria-controls":a.sTableId,"data-dt-idx":m,tabindex:a.iTabIndex,id:c===0&&typeof q==="string"?a.sTableId+"_"+q:null}).html(j).appendTo(b);Ta(r,{action:q},s);m++}}}},k=g(N.activeElement).data("dt-idx");o(g(b).empty(),d);k!==null&&g(b).find("[data-dt-idx="+k+"]").focus()}}});var va=function(a,b,c,d){if(!a||"-"===a)return-Infinity;b&&(a=Mb(a,b));a.replace&&(c&&(a=a.replace(c,"")),d&&(a=a.replace(d,"")));return 1*a};g.extend(u.type.order,{"date-pre":function(a){return Date.parse(a)||
	0},"html-pre":function(a){return!a?"":a.replace?a.replace(/<.*?>/g,"").toLowerCase():a+""},"string-pre":function(a){return"string"===typeof a?a.toLowerCase():!a||!a.toString?"":a.toString()},"string-asc":function(a,b){return a<b?-1:a>b?1:0},"string-desc":function(a,b){return a<b?1:a>b?-1:0}});bb("");g.extend(p.ext.type.detect,[function(a,b){var c=b.oLanguage.sDecimal;return Xa(a,c)?"num"+c:null},function(a){if(a&&!Vb.test(a))return null;var b=Date.parse(a);return null!==b&&!isNaN(b)||da(a)?"date":
	null},function(a,b){var c=b.oLanguage.sDecimal;return Xa(a,c,!0)?"num-fmt"+c:null},function(a,b){var c=b.oLanguage.sDecimal;return Nb(a,c)?"html-num"+c:null},function(a,b){var c=b.oLanguage.sDecimal;return Nb(a,c,!0)?"html-num-fmt"+c:null},function(a){return da(a)||"string"===typeof a&&-1!==a.indexOf("<")?"html":null}]);g.extend(p.ext.type.search,{html:function(a){return da(a)?"":"string"===typeof a?a.replace(Kb," ").replace(wa,""):""},string:function(a){return da(a)?"":"string"===typeof a?a.replace(Kb,
	" "):a}});g.extend(!0,p.ext.renderer,{header:{_:function(a,b,c,d){g(a.nTable).on("order.dt.DT",function(a,f,g,i){a=c.idx;b.removeClass(c.sSortingClass+" "+d.sSortAsc+" "+d.sSortDesc).addClass(i[a]=="asc"?d.sSortAsc:i[a]=="desc"?d.sSortDesc:c.sSortingClass)})},jqueryui:function(a,b,c,d){var e=c.idx;g("<div/>").addClass(d.sSortJUIWrapper).append(b.contents()).append(g("<span/>").addClass(d.sSortIcon+" "+c.sSortingClassJUI)).appendTo(b);g(a.nTable).on("order.dt.DT",function(a,g,i,j){b.removeClass(d.sSortAsc+
	" "+d.sSortDesc).addClass(j[e]=="asc"?d.sSortAsc:j[e]=="desc"?d.sSortDesc:c.sSortingClass);b.find("span."+d.sSortIcon).removeClass(d.sSortJUIAsc+" "+d.sSortJUIDesc+" "+d.sSortJUI+" "+d.sSortJUIAscAllowed+" "+d.sSortJUIDescAllowed).addClass(j[e]=="asc"?d.sSortJUIAsc:j[e]=="desc"?d.sSortJUIDesc:c.sSortingClassJUI)})}}});p.render={number:function(a,b,c,d){return{display:function(e){var e=parseFloat(e),f=parseInt(e,10),e=c?(b+(e-f).toFixed(c)).substring(2):"";return(d||"")+f.toString().replace(/\B(?=(\d{3})+(?!\d))/g,
	a)+e}}}};g.extend(p.ext.internal,{_fnExternApiFunc:Jb,_fnBuildAjax:na,_fnAjaxUpdate:ib,_fnAjaxParameters:rb,_fnAjaxUpdateDraw:sb,_fnAjaxDataSrc:oa,_fnAddColumn:Aa,_fnColumnOptions:fa,_fnAdjustColumnSizing:U,_fnVisibleToColumnIndex:ga,_fnColumnIndexToVisible:X,_fnVisbleColumns:Y,_fnGetColumns:W,_fnColumnTypes:Da,_fnApplyColumnDefs:gb,_fnHungarianMap:S,_fnCamelToHungarian:G,_fnLanguageCompat:M,_fnBrowserDetect:eb,_fnAddData:H,_fnAddTr:ha,_fnNodeToDataIndex:function(a,b){return b._DT_RowIndex!==l?b._DT_RowIndex:
	null},_fnNodeToColumnIndex:function(a,b,c){return g.inArray(c,a.aoData[b].anCells)},_fnGetCellData:A,_fnSetCellData:Ea,_fnSplitObjNotation:Ga,_fnGetObjectDataFn:T,_fnSetObjectDataFn:Ba,_fnGetDataMaster:Ha,_fnClearTable:ja,_fnDeleteIndex:ka,_fnInvalidateRow:la,_fnGetRowElements:ia,_fnCreateTr:Fa,_fnBuildHead:hb,_fnDrawHead:I,_fnDraw:J,_fnReDraw:K,_fnAddOptionsHtml:kb,_fnDetectHeader:$,_fnGetUniqueThs:ma,_fnFeatureHtmlFilter:mb,_fnFilterComplete:aa,_fnFilterCustom:vb,_fnFilterColumn:ub,_fnFilter:tb,
	_fnFilterCreateSearch:Na,_fnEscapeRegex:Oa,_fnFilterData:wb,_fnFeatureHtmlInfo:pb,_fnUpdateInfo:xb,_fnInfoMacros:yb,_fnInitialise:ra,_fnInitComplete:pa,_fnLengthChange:Pa,_fnFeatureHtmlLength:lb,_fnFeatureHtmlPaginate:qb,_fnPageChange:Ra,_fnFeatureHtmlProcessing:nb,_fnProcessingDisplay:C,_fnFeatureHtmlTable:ob,_fnScrollDraw:V,_fnApplyToChildren:F,_fnCalculateColumnWidths:Ca,_fnThrottle:Ma,_fnConvertToWidth:zb,_fnScrollingWidthAdjust:Bb,_fnGetWidestNode:Ab,_fnGetMaxLenString:Cb,_fnStringToCss:s,_fnScrollBarWidth:Db,
	_fnSortFlatten:Q,_fnSort:jb,_fnSortAria:Fb,_fnSortListener:Sa,_fnSortAttachListener:Ka,_fnSortingClasses:sa,_fnSortData:Eb,_fnSaveState:ta,_fnLoadState:Gb,_fnSettingsFromNode:ua,_fnLog:O,_fnMap:D,_fnBindAction:Ta,_fnCallbackReg:y,_fnCallbackFire:t,_fnLengthOverflow:Qa,_fnRenderer:La,_fnDataSource:z,_fnRowAttributes:Ia,_fnCalculateEnd:function(){}});g.fn.dataTable=p;g.fn.dataTableSettings=p.settings;g.fn.dataTableExt=p.ext;g.fn.DataTable=function(a){return g(this).dataTable(a).api()};g.each(p,function(a,
	b){g.fn.DataTable[a]=b});return g.fn.dataTable};"function"===typeof define&&define.amd?define("datatables",["jquery"],M):"object"===typeof exports?M(require("jquery")):jQuery&&!jQuery.fn.dataTable&&M(jQuery)})(window,document);
	// Append CSS for datatables
	$('head').append('<style>table.dataTable{width:100%;margin:0 auto;clear:both;border-collapse:separate;border-spacing:0}table.dataTable thead th,table.dataTable tfoot th{font-weight:bold}table.dataTable thead th,table.dataTable thead td{padding:10px 18px;border-bottom:1px solid #111}table.dataTable thead th:active,table.dataTable thead td:active{outline:none}table.dataTable tfoot th,table.dataTable tfoot td{padding:10px 18px 6px 18px;border-top:1px solid #111}table.dataTable thead .sorting_asc,table.dataTable thead .sorting_desc,table.dataTable thead .sorting{cursor:pointer;*cursor:hand}table.dataTable thead .sorting{background:url("../images/sort_both.png") no-repeat center right}table.dataTable thead .sorting_asc{background:url("../images/sort_asc.png") no-repeat center right}table.dataTable thead .sorting_desc{background:url("../images/sort_desc.png") no-repeat center right}table.dataTable thead .sorting_asc_disabled{background:url("../images/sort_asc_disabled.png") no-repeat center right}table.dataTable thead .sorting_desc_disabled{background:url("../images/sort_desc_disabled.png") no-repeat center right}table.dataTable tbody tr{background-color:#fff}table.dataTable tbody tr.selected{background-color:#b0bed9}table.dataTable tbody th,table.dataTable tbody td{padding:8px 10px}table.dataTable th.center,table.dataTable td.center,table.dataTable td.dataTables_empty{text-align:center}table.dataTable th.right,table.dataTable td.right{text-align:right}table.dataTable.row-border tbody th,table.dataTable.row-border tbody td,table.dataTable.display tbody th,table.dataTable.display tbody td{border-top:2px solid #CCC}table.dataTable.row-border tbody tr:first-child th,table.dataTable.row-border tbody tr:first-child td,table.dataTable.display tbody tr:first-child th,table.dataTable.display tbody tr:first-child td{border-top:none}table.dataTable.cell-border tbody th,table.dataTable.cell-border tbody td{border-top:1px solid #ddd;border-right:1px solid #ddd}table.dataTable.cell-border tbody tr th:first-child,table.dataTable.cell-border tbody tr td:first-child{border-left:1px solid #ddd}table.dataTable.cell-border tbody tr:first-child th,table.dataTable.cell-border tbody tr:first-child td{border-top:none}table.dataTable.stripe tbody tr.odd,table.dataTable.display tbody tr.odd{background-color:#f9f9f9}table.dataTable.stripe tbody tr.odd.selected,table.dataTable.display tbody tr.odd.selected{background-color:#abb9d3}table.dataTable.hover tbody tr:hover,table.dataTable.hover tbody tr.odd:hover,table.dataTable.hover tbody tr.even:hover,table.dataTable.display tbody tr:hover,table.dataTable.display tbody tr.odd:hover,table.dataTable.display tbody tr.even:hover{background-color:#f5f5f5}table.dataTable.hover tbody tr:hover.selected,table.dataTable.hover tbody tr.odd:hover.selected,table.dataTable.hover tbody tr.even:hover.selected,table.dataTable.display tbody tr:hover.selected,table.dataTable.display tbody tr.odd:hover.selected,table.dataTable.display tbody tr.even:hover.selected{background-color:#a9b7d1}table.dataTable.order-column tbody tr>.sorting_1,table.dataTable.order-column tbody tr>.sorting_2,table.dataTable.order-column tbody tr>.sorting_3,table.dataTable.display tbody tr>.sorting_1,table.dataTable.display tbody tr>.sorting_2,table.dataTable.display tbody tr>.sorting_3{background-color:#f9f9f9}table.dataTable.order-column tbody tr.selected>.sorting_1,table.dataTable.order-column tbody tr.selected>.sorting_2,table.dataTable.order-column tbody tr.selected>.sorting_3,table.dataTable.display tbody tr.selected>.sorting_1,table.dataTable.display tbody tr.selected>.sorting_2,table.dataTable.display tbody tr.selected>.sorting_3{background-color:#acbad4}table.dataTable.display tbody tr.odd>.sorting_1,table.dataTable.order-column.stripe tbody tr.odd>.sorting_1{background-color:#f1f1f1}table.dataTable.display tbody tr.odd>.sorting_2,table.dataTable.order-column.stripe tbody tr.odd>.sorting_2{background-color:#f3f3f3}table.dataTable.display tbody tr.odd>.sorting_3,table.dataTable.order-column.stripe tbody tr.odd>.sorting_3{background-color:#f5f5f5}table.dataTable.display tbody tr.odd.selected>.sorting_1,table.dataTable.order-column.stripe tbody tr.odd.selected>.sorting_1{background-color:#a6b3cd}table.dataTable.display tbody tr.odd.selected>.sorting_2,table.dataTable.order-column.stripe tbody tr.odd.selected>.sorting_2{background-color:#a7b5ce}table.dataTable.display tbody tr.odd.selected>.sorting_3,table.dataTable.order-column.stripe tbody tr.odd.selected>.sorting_3{background-color:#a9b6d0}table.dataTable.display tbody tr.even>.sorting_1,table.dataTable.order-column.stripe tbody tr.even>.sorting_1{background-color:#f9f9f9}table.dataTable.display tbody tr.even>.sorting_2,table.dataTable.order-column.stripe tbody tr.even>.sorting_2{background-color:#fbfbfb}table.dataTable.display tbody tr.even>.sorting_3,table.dataTable.order-column.stripe tbody tr.even>.sorting_3{background-color:#fdfdfd}table.dataTable.display tbody tr.even.selected>.sorting_1,table.dataTable.order-column.stripe tbody tr.even.selected>.sorting_1{background-color:#acbad4}table.dataTable.display tbody tr.even.selected>.sorting_2,table.dataTable.order-column.stripe tbody tr.even.selected>.sorting_2{background-color:#adbbd6}table.dataTable.display tbody tr.even.selected>.sorting_3,table.dataTable.order-column.stripe tbody tr.even.selected>.sorting_3{background-color:#afbdd8}table.dataTable.display tbody tr:hover>.sorting_1,table.dataTable.display tbody tr.odd:hover>.sorting_1,table.dataTable.display tbody tr.even:hover>.sorting_1,table.dataTable.order-column.hover tbody tr:hover>.sorting_1,table.dataTable.order-column.hover tbody tr.odd:hover>.sorting_1,table.dataTable.order-column.hover tbody tr.even:hover>.sorting_1{background-color:#eaeaea}table.dataTable.display tbody tr:hover>.sorting_2,table.dataTable.display tbody tr.odd:hover>.sorting_2,table.dataTable.display tbody tr.even:hover>.sorting_2,table.dataTable.order-column.hover tbody tr:hover>.sorting_2,table.dataTable.order-column.hover tbody tr.odd:hover>.sorting_2,table.dataTable.order-column.hover tbody tr.even:hover>.sorting_2{background-color:#ebebeb}table.dataTable.display tbody tr:hover>.sorting_3,table.dataTable.display tbody tr.odd:hover>.sorting_3,table.dataTable.display tbody tr.even:hover>.sorting_3,table.dataTable.order-column.hover tbody tr:hover>.sorting_3,table.dataTable.order-column.hover tbody tr.odd:hover>.sorting_3,table.dataTable.order-column.hover tbody tr.even:hover>.sorting_3{background-color:#eee}table.dataTable.display tbody tr:hover.selected>.sorting_1,table.dataTable.display tbody tr.odd:hover.selected>.sorting_1,table.dataTable.display tbody tr.even:hover.selected>.sorting_1,table.dataTable.order-column.hover tbody tr:hover.selected>.sorting_1,table.dataTable.order-column.hover tbody tr.odd:hover.selected>.sorting_1,table.dataTable.order-column.hover tbody tr.even:hover.selected>.sorting_1{background-color:#a1aec7}table.dataTable.display tbody tr:hover.selected>.sorting_2,table.dataTable.display tbody tr.odd:hover.selected>.sorting_2,table.dataTable.display tbody tr.even:hover.selected>.sorting_2,table.dataTable.order-column.hover tbody tr:hover.selected>.sorting_2,table.dataTable.order-column.hover tbody tr.odd:hover.selected>.sorting_2,table.dataTable.order-column.hover tbody tr.even:hover.selected>.sorting_2{background-color:#a2afc8}table.dataTable.display tbody tr:hover.selected>.sorting_3,table.dataTable.display tbody tr.odd:hover.selected>.sorting_3,table.dataTable.display tbody tr.even:hover.selected>.sorting_3,table.dataTable.order-column.hover tbody tr:hover.selected>.sorting_3,table.dataTable.order-column.hover tbody tr.odd:hover.selected>.sorting_3,table.dataTable.order-column.hover tbody tr.even:hover.selected>.sorting_3{background-color:#a4b2cb}table.dataTable.no-footer{border-bottom:1px solid #111}table.dataTable,table.dataTable th,table.dataTable td{-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}.dataTables_wrapper{position:relative;clear:both;*zoom:1;zoom:1}.dataTables_wrapper .dataTables_length{float:left}.dataTables_wrapper .dataTables_filter{float:right;text-align:right}.dataTables_wrapper .dataTables_filter input{margin-left:0.5em}.dataTables_wrapper .dataTables_info{clear:both;float:left;padding-top:0.755em}.dataTables_wrapper .dataTables_paginate{float:right;text-align:right;padding-top:0.25em}.dataTables_wrapper .dataTables_paginate .paginate_button{box-sizing:border-box;display:inline-block;min-width:1.5em;padding:0.5em 1em;margin-left:2px;text-align:center;text-decoration:none !important;cursor:pointer;*cursor:hand;color:#333 !important;border:1px solid transparent}.dataTables_wrapper .dataTables_paginate .paginate_button.current,.dataTables_wrapper .dataTables_paginate .paginate_button.current:hover{color:#333 !important;border:1px solid #cacaca;background-color:#fff;background:-webkit-gradient(linear, left top, left bottom, color-stop(0%, #fff), color-stop(100%, #dcdcdc));background:-webkit-linear-gradient(top, #fff 0%, #dcdcdc 100%);background:-moz-linear-gradient(top, #fff 0%, #dcdcdc 100%);background:-ms-linear-gradient(top, #fff 0%, #dcdcdc 100%);background:-o-linear-gradient(top, #fff 0%, #dcdcdc 100%);background:linear-gradient(to bottom, #fff 0%, #dcdcdc 100%)}.dataTables_wrapper .dataTables_paginate .paginate_button.disabled,.dataTables_wrapper .dataTables_paginate .paginate_button.disabled:hover,.dataTables_wrapper .dataTables_paginate .paginate_button.disabled:active{cursor:default;color:#666 !important;border:1px solid transparent;background:transparent;box-shadow:none}.dataTables_wrapper .dataTables_paginate .paginate_button:hover{color:white !important;border:1px solid #111;background-color:#585858;background:-webkit-gradient(linear, left top, left bottom, color-stop(0%, #585858), color-stop(100%, #111));background:-webkit-linear-gradient(top, #585858 0%, #111 100%);background:-moz-linear-gradient(top, #585858 0%, #111 100%);background:-ms-linear-gradient(top, #585858 0%, #111 100%);background:-o-linear-gradient(top, #585858 0%, #111 100%);background:linear-gradient(to bottom, #585858 0%, #111 100%)}.dataTables_wrapper .dataTables_paginate .paginate_button:active{outline:none;background-color:#2b2b2b;background:-webkit-gradient(linear, left top, left bottom, color-stop(0%, #2b2b2b), color-stop(100%, #0c0c0c));background:-webkit-linear-gradient(top, #2b2b2b 0%, #0c0c0c 100%);background:-moz-linear-gradient(top, #2b2b2b 0%, #0c0c0c 100%);background:-ms-linear-gradient(top, #2b2b2b 0%, #0c0c0c 100%);background:-o-linear-gradient(top, #2b2b2b 0%, #0c0c0c 100%);background:linear-gradient(to bottom, #2b2b2b 0%, #0c0c0c 100%);box-shadow:inset 0 0 3px #111}.dataTables_wrapper .dataTables_processing{position:absolute;top:50%;left:50%;width:100%;height:40px;margin-left:-50%;margin-top:-25px;padding-top:20px;text-align:center;font-size:1.2em;background-color:white;background:-webkit-gradient(linear, left top, right top, color-stop(0%, rgba(255,255,255,0)), color-stop(25%, rgba(255,255,255,0.9)), color-stop(75%, rgba(255,255,255,0.9)), color-stop(100%, rgba(255,255,255,0)));background:-webkit-linear-gradient(left, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 25%, rgba(255,255,255,0.9) 75%, rgba(255,255,255,0) 100%);background:-moz-linear-gradient(left, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 25%, rgba(255,255,255,0.9) 75%, rgba(255,255,255,0) 100%);background:-ms-linear-gradient(left, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 25%, rgba(255,255,255,0.9) 75%, rgba(255,255,255,0) 100%);background:-o-linear-gradient(left, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 25%, rgba(255,255,255,0.9) 75%, rgba(255,255,255,0) 100%);background:linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 25%, rgba(255,255,255,0.9) 75%, rgba(255,255,255,0) 100%)}.dataTables_wrapper .dataTables_length,.dataTables_wrapper .dataTables_filter,.dataTables_wrapper .dataTables_info,.dataTables_wrapper .dataTables_processing,.dataTables_wrapper .dataTables_paginate{color:#333}.dataTables_wrapper .dataTables_scroll{clear:both}.dataTables_wrapper .dataTables_scroll div.dataTables_scrollBody{*margin-top:-1px;-webkit-overflow-scrolling:touch}.dataTables_wrapper .dataTables_scroll div.dataTables_scrollBody th>div.dataTables_sizing,.dataTables_wrapper .dataTables_scroll div.dataTables_scrollBody td>div.dataTables_sizing{height:0;overflow:hidden;margin:0 !important;padding:0 !important}.dataTables_wrapper.no-footer .dataTables_scrollBody{border-bottom:1px solid #111}.dataTables_wrapper.no-footer div.dataTables_scrollHead table,.dataTables_wrapper.no-footer div.dataTables_scrollBody table{border-bottom:none}.dataTables_wrapper:after{visibility:hidden;display:block;content:"";clear:both;height:0}@media screen and (max-width: 767px){.dataTables_wrapper .dataTables_info,.dataTables_wrapper .dataTables_paginate{float:none;text-align:center}.dataTables_wrapper .dataTables_paginate{margin-top:0.5em}}@media screen and (max-width: 640px){.dataTables_wrapper .dataTables_length,.dataTables_wrapper .dataTables_filter{float:none;text-align:center}.dataTables_wrapper .dataTables_filter{margin-top:0.5em}}');	

	// @m:Anpassungen des Styles in einer eigenen Definition;
	$('head').append('<style>table.dataTable.stripe tbody tr.odd,table.dataTable.display tbody tr.odd{background-color:#EEEEEE}</style>');
}

function spix_CampusApp_ItemDataMod(Element) {
	if(Element.TelephoneNumber == undefined || Element.TelephoneNumber == null || Element.TelephoneNumber == '+49 ') { 
		Element.TelephoneNumber = ''; 
	} 
	if(Element.Mobile == undefined || Element.Mobile == null || Element.Mobile == '+49 ') { 
		Element.Mobile = ''; 
	} 
	if(Element.IpPhone == undefined || Element.IpPhone == null || Element.IpPhone == '+49 ') { 
		Element.IpPhone = ''; 
	}		
	if(Element.PhysicalDeliveryOfficeName == undefined || Element.PhysicalDeliveryOfficeName == null) { 
		Element.PhysicalDeliveryOfficeName = ''; 
	}
	if(Element.Department == undefined || Element.Department == null) { 
		Element.Department = ''; 
	}
	if(Element.Company == undefined || Element.Company == null) { 
		Element.Company = '';
	}
	if(Element.Mail == undefined || Element.Mail == null) { 
		Element.Mail = ''; 
	}
	if(Element.DistinguishedName == undefined || Element.DistinguishedName.indexOf('OU=Besprechungsräume') > 0) {
		Element.Mail = '';
	}
	if(Element.FacsimileTelephoneNumber == undefined || Element.FacsimileTelephoneNumber == null) { 
		Element.FacsimileTelephoneNumber = ''; 
	}
	if(Element.Pager == undefined || Element.Pager == null) { 
		Element.Pager = ''; 
	}
	if(Element.Info == undefined || Element.Info == null) { 
		Element.Info = ''; 
	}
    if(Element.Title == undefined || Element.Title == null) { 
		Element.Title = ''; 
	}
    if(Element.Gender == undefined || Element.Gender == null) { 
		Element.Gender = ''; 
	}
    if(Element.Division == undefined || Element.Division == null) { 
		Element.Division = ''; 
	}
	return Element;
}

function spix_CampusApp_ItemViewMod(Element) {
	//FORMAT VALUES
	if(Element.Mail !== '') {
		Element.Mail = '<a href="mailto:'+Element.Mail+'">'+Element.Mail+'</a>';
	}
	if(Element.TelephoneNumber !== '') {
		Element.TelephoneNumber = '<a class="CampusAppTelefonnummer" href="tel:'+Element.TelephoneNumber+'">'+Element.TelephoneNumber+'</a>'; 
	}
	if(Element.Mobile !== '') {
		if(Element.telephoneNumber == '') { 
			Element.Mobile = '<a class="CampusAppTelefonnummer" href="tel:'+Element.Mobile+'">'+Element.Mobile+'</a>'; 
		} else {
			Element.Mobile = '<hr /><a class="CampusAppTelefonnummer" href="tel:'+Element.Mobile+'">'+Element.Mobile+'</a>'; 
		}
	}
	if(Element.IpPhone !== '') {
		if(Element.TelephoneNumber == '' && Element.Mobile == '') { 
			Element.IpPhone = '<a class="CampusAppTelefonnummer" href="tel:'+Element.IpPhone+'">'+Element.IpPhone+'</a>'; 
		} else {
			Element.IpPhone = '<hr /><a class="CampusAppTelefonnummer" href="tel:'+Element.IpPhone+'">'+Element.IpPhone+'</a>'; 
		}
	}
	if(Element.FacsimileTelephoneNumber !== '') {
		Element.FacsimileTelephoneNumber = '<span class="CampusAppFaxnummer"><span>'+Element.FacsimileTelephoneNumber.replace(/ /g,'</span> <span>')+'</span></span>';
	}
	if(Element.Pager !== '') {
		if(Element.Pager.substr(4,1) !== " ") {
				Element.Pager = Element.Pager.replace('+49','+49 ');
		}
		if(Element.Pager.indexOf(';') > 0) {
			Element.Pager = Element.Fax2.substr(0,Element.Pager.indexOf(';'));
		}
		//Element.Fax2 = '<span class="CampusAppFaxnummer"><span>'+Element.Fax2.replace(/ /g,'</span> <span>')+'</span></span>';
		if(Element.FacsimileTelephoneNumber == '') {
			Element.Pager = Element.Pager;
		} else {
			Element.Pager = '<hr />'+Element.Pager;
		}
	}
	if(Element.Department !== '') {
		Element.Department = '<a href="#" onclick="spix_CampusApp_Load(\''+PreFilter+'\',\'Abteilung\',\'&quot;'+Element.Department+' &quot;\'); spix_CampusApp_DetailView(\'close\'); return false;">'+Element.Department+'</a>';
	}
	if(Element.Company == 'IABG mbH') {
		Element.Company = '<a href="#" onclick="spix_CampusApp_Load(\''+PreFilter+'\',\'Firma\',\'&quot;'+Element.Company+' &quot;\'); spix_CampusApp_DetailView(\'close\'); return false;">'+Element.Company+'</a>';
	} else {
		if(Element.Company == null) { Element.Company = 'k.A.'; }
		Element.Company = '<span class="ExterneFirma" style="border-bottom: 2px solid #FF0000; border-top: 2px solid #FF0000;"><a href="#" onclick="spix_CampusApp_Load(\''+PreFilter+'\',\'Firma\',\'&quot;'+Element.Company+' &quot;\'); spix_CampusApp_DetailView(\'close\'); return false;">'+Element.Company+'</a></span>';
	}
    if(Element.PhysicalDeliveryOfficeName !== '') {
        Element.PhysicalDeliveryOfficeName = '<span class="CampusMap" data-loc="'+Element.PhysicalDeliveryOfficeName+'">'+Element.PhysicalDeliveryOfficeName+'</span>';
    }
    if(Element.Info !== '') {
        Element.Info = Element.Info.replace(/\n/g, '<br />');
    }
	return Element;
}

function spix_CampusApp_Load(PreFilter,FilterCol,FilterVal) {
	Load = 'loaded';
	//@E:spix_GetUrlPara erzeugt hier einen Fehler "ReferenceError: Strings is not defined";
	FilterCol = FilterCol || spix_GetUrlPara('FilterCol');
	FilterVal = FilterVal || decodeURIComponent(spix_GetUrlPara('FilterVal'));
	$('#SearchBox').hide();

	var CampusAppFrame = '<table id="CampusAppTable" class="display" cellspacing="0" width="100%"><thead><tr><td id="IntroAppFilter" style="text-align: right;" colspan="99"><span style="color: #FF4400; font-size: 15pt;">Starten Sie Ihre Suche hier oben rechts..<br /><small>Weitere Hinweise zur Nutzung finden Sie in der Videoanleitung</small></span><br /><br /></td></tr><tr><td></td><td><input type="checkbox" class="PersSelect" id="PersSelectAll" value="All" /> | Mehr | Lync</td><td>Name</td><td>Firma</td><td>Abteilung</td><td>Ort</td><td>Telefon</td><td>Fax</td><td>Mail</td></tr></thead><tbody></tbody></table><style>@media print{#CampusApp{display: none;} } .no-wrap { white-space: nowrap; }.spixDialogBtn { margin-right: 5px; padding: 2px 10px 3px 10px; position: relative; top: 3px; background-color: #004993; color: #FFFFFF; }.PersDetailsBtn { margin-left: 10px; margin-right: 5px; padding: 2px 5px 3px 5px; position: relative; top: 3px;}.ms-imnImg{ margin-right: 10px; margin-left: 10px; top: 3px; outline: 1px solid #888888; border: 1px solid #FFFFFF;} table.dataTable thead .sorting{background:url("'+SPiXscMaster+'Images/jquery.dataTables/sort_both.png") no-repeat center right}table.dataTable thead .sorting_asc{background:url("'+SPiXscMaster+'Images/jquery.dataTables/sort_asc.png") no-repeat center right}table.dataTable thead .sorting_desc{background:url("'+SPiXscMaster+'Images/jquery.dataTables/sort_desc.png") no-repeat center right} table.dataTable thead th, table.dataTable thead td { padding: 10px 10px; }</style>';
	$('#CampusApp').html(CampusAppFrame);
	//spix_LogTimeStamp('Nach CampusFrame');
	// Abhängig vom Url-Parameter FilerCol wird die Suchmaske definiert (welche Spalten sind durchsuchbar)
	var ColDef_No = { "bSearchable": false , "bVisible": false };
	var ColDef_Base = { "sClass": "no-wrap" };
	var ColDef_Ctrl = { "bSearchable": false , "sWidth": "120px" , "bSortable": false , "sClass": "no-wrap" };
	var ColDef_NoSearch = { "bSearchable": false , "sClass": "no-wrap" };
	switch (FilterCol) {
		case 'Firma':
			var FilterDef = [
				ColDef_No,
				ColDef_Ctrl,
				ColDef_NoSearch,
				ColDef_Base,
				ColDef_NoSearch,
				ColDef_NoSearch,
				ColDef_NoSearch,
				ColDef_NoSearch,
				ColDef_NoSearch
				];
			break;
		case 'Name':
			var FilterDef = [
				ColDef_No,
				ColDef_Ctrl,
				ColDef_Base,
				ColDef_NoSearch,
				ColDef_NoSearch,
				ColDef_NoSearch,
				ColDef_NoSearch,
				ColDef_NoSearch,
				ColDef_NoSearch
				];
			break;
		case 'Abteilung':
			var FilterDef = [
				ColDef_No,
				ColDef_Ctrl,
				ColDef_NoSearch,
				ColDef_NoSearch,
				ColDef_Base,
				ColDef_NoSearch,
				ColDef_NoSearch,
				ColDef_NoSearch,
				ColDef_NoSearch
				];
			break;
		case 'Telefon':
			var FilterDef = [
				ColDef_No,
				ColDef_Ctrl,
				ColDef_NoSearch,
				ColDef_NoSearch,
				ColDef_NoSearch,
				ColDef_NoSearch,
				ColDef_Base,
				ColDef_NoSearch,
				ColDef_NoSearch
				];
			break;
		case 'Fax':
			var FilterDef = [
				ColDef_No,
				ColDef_Ctrl,
				ColDef_NoSearch,
				ColDef_NoSearch,
				ColDef_NoSearch,
				ColDef_NoSearch,
				ColDef_NoSearch,
				ColDef_Base,
				ColDef_NoSearch
				];
			break;		
		case 'Ort':
			var FilterDef = [
				ColDef_No,
				ColDef_Ctrl,
				ColDef_NoSearch,
				ColDef_NoSearch,
				ColDef_NoSearch,
				ColDef_Base,
				ColDef_NoSearch,
				ColDef_NoSearch,
				ColDef_NoSearch
				];
			break;
		case 'Mail':
			var FilterDef = [
				ColDef_No,
				ColDef_Ctrl,
				ColDef_NoSearch,
				ColDef_NoSearch,
				ColDef_NoSearch,
				ColDef_NoSearch,
				ColDef_NoSearch,
				ColDef_NoSearch,
				ColDef_Base
				];
			break;		
		default:
			var FilterDef = [
				ColDef_No,
				ColDef_Ctrl,
				ColDef_Base,
				ColDef_Base,
				ColDef_Base,
				ColDef_Base,
				ColDef_Base,
				ColDef_Base,
				ColDef_Base
				];	
			break;
	}
	
	//spix_LogTimeStamp('Nach DatenReorg');
	CampusAppTableO = $('#CampusAppTable').dataTable({
		fnDrawCallback: spix_CampusApp_ModView,
		order: [[2,"asc"]],
		aoColumns: FilterDef,
		lengthMenu: [ [50, 100, 200, -1], [50, 100, 200, "Alle"] ],
		language: {
			emptyTable: 'Keine Einträge gefunden',
			zeroRecords: 'Keine Einträge gefunden',
			infoEmpty: 'Keine Einträge gefunden',
			lengthMenu: 'Zeige _MENU_ Einträge an',
			search: 'Suche nach ',
			info: 'Seite _PAGE_ von _PAGES_<br /><span style="color: #AAAAAA;">Bei _TOTAL_ von _MAX_ Einträgen</span>',
			infoFiltered: '',
			paginate: {
				first: 'Erste',
				last: 'Letzte',
				next: 'Weiter',
				previous: 'Zurück'
			}
		},
		autoWidth: false,
		bProcessing: true,
		bDeferRender: true,
		aaData: ListDataO
	});
	//spix_LogTimeStamp('Nach DataTable');
	CampusAppTableO.fnFilter( FilterVal );
	$('#CampusAppTable_filter label input').val(FilterVal);
	//spix_LogTimeStamp('Nach Neufiltern');

	if($('#CampusAppTable_filter label input').val() == '') {
		$('.dataTable tbody').hide();
	}
	var Filter = ' in <select id="CampusAppInputFilterField"><option value="AlleFelder">Alle Felder</option><option value="Name">Name</option><option value="Firma">Firma</option><option value="Abteilung">Abteilung</option><option value="Ort">Ort</option><option value="Mail">Mail</option><option value="Telefon">Telefon</option><option value="Fax">Fax</option></select>';
	$('#CampusAppTable_filter label').after(Filter);
	$('#CampusAppInputFilterField option').prop('selected', false);
	$('#CampusAppInputFilterField option[value='+FilterCol+']').prop('selected', true);

	//console.log(window.location);
	$('#CampusAppInputFilterField').change(function () {
		//window.location.href = window.location.pathname + '?FilterCol=' + $('#CampusAppInputFilterField').val()+'&FilterVal=' + $('#CampusAppTable_filter label input').val();
		$('#CampusAppTable').remove();
		spix_CampusApp_Load(PreFilter,$('#CampusAppInputFilterField').val(),$('#CampusAppTable_filter label input').val());
	});

	/*CampusAppTableO.api().columns().eq( 0 ).each( function ( colIdx ) {
        $( 'input', CampusAppTableO.api().column( colIdx ).footer() ).on( 'keyup change', function () {
            CampusAppTableO.api()
                .column( colIdx )
                .search( this.value )
                .draw();
        } );
    } );*/

	//Modifiziert die Ansicht und erstellt CampusMap Links (alles Eventreceiver für verschiedene Ereignisse
	//spix_CampusApp_ModView();
	//$(document).ready(spix_CampusApp_ModView());
	//$('.dataTables_paginate').click(spix_CampusApp_ModView);
	//$('.dataTables_length').change(spix_CampusApp_ModView);
	//ERR: Erst am Ende wird das ausgeführt ... 
	//$('.dataTables_filter label input').keypress(spix_CampusApp_ModView);
	//$('.dataTables_filter label input').change(spix_CampusApp_ModView);

	//spix_LogTimeStamp('Nach ModView');
	// ##############################################
	// UI Advanced
	// Wenn MasterAuswahl betätigt wird, dann werden alle entsprechend selektiert
	$('#PersSelectAll').change(function () {
		$('.PersSelect').prop('checked', $('#PersSelectAll').prop('checked'));
	});
	if(spix_GetUrlPara('ItemGuid')) {
		// @c:2014-12-29:DirectLink wurde durch einen Link basierend auf der ObjectGUID ausgetauscht;
		$('#CampusAppTable_length option[value="-1"]').prop('selected',true).trigger('change');
		$('a[data-listguid="'+spix_GetUrlPara('ItemGuid')+'"]').click();
		$('#CampusAppTable_length option[value="50"]').prop('selected',true).trigger('change');
	}
}

//############################################################################

function spix_CampusApp_ModView () {
	spix_CampusMap_ModView();
	if($('#CampusAppTable_filter input').val() !== '') {
		$('.dataTable tbody').show();
		$('#IntroAppFilter').hide();
	}	
	try
	{
	  ProcessImn();
	}
	catch(e)
	{
	  //Handle errors here
	}
	$('.CampusAppTelefonnummer').each(function () {
		if($(this).text().substr(0,11) == '+49 89 6088') { 
			$(this).html($(this).text().replace(/(\w+?)$/, '<b>$1</b>'));
		}
	});

	if(spix_GetUrlPara('DirectLink')) {
		$('#CampusAppTable_filter').hide();
		$('#CampusAppTable_length').hide();
		$('#CampusAppTable_paginate').hide();
		$('#CampusAppTable_info').hide();
		$('#CampusAppToolBar').hide();
	}
}

//############################################################################

function spix_CampusApp_PrintList() {
	if($('.PersSelect:checked').length !== 0) {
		$('head').append('<script src="'+SPiXscMaster+'VisuX/visux.templateengine.js" type="text/javascript"></script>');
		var DataO = new Array();
		var Col = $('.dataTable thead tr td:contains("Mail")').index();
		$('.PersSelect:checked ').each(function() {
			if($(this).val() !== "All" && ListDataRawO[$(this).val()].Firma == 'IABG mbH') {
				ListDataRawO[$(this).val()].Marker = ListDataRawO[$(this).val()].Name.substr(0,1);
				DataO.push(ListDataRawO[$(this).val()]);
			}
		});
		var ActTimeStampe = new Date();
		//ActTimeStampe+'';
		//$('#CampusAppInputFilterField').val(),$('#CampusAppTable_filter label input').val()
		var Signature = "Onlineausdruck erstellt am <b>"+ActTimeStampe.toLocaleString()+"</b> für <b>"+spix_UserProfile_GetCurrentUser('Title')+"</b> || Daten gefiltert nach <b>'"+$('#CampusAppTable_filter label input').val()+"'</b> in <b>"+$('#CampusAppInputFilterField').val()+"</b>";
		var Link = 'https://'+window.location.hostname+window.location.pathname+'?FilterVal='+$("#CampusAppTable_filter label input").val()+'&FilterCol='+$("#CampusAppInputFilterField").val();
		// @c:2014-12-29:Umstellung auf neue Templates;
		spx_visux_PrintListByTemplate("DocTemplUrl:/CampusApp_Assets/TelBook/TelBook_Deckblatt.cfg;ItemTemplUrl:/CampusApp_Assets/TelBook/TelBook_Eintrag.cfg;Print_Signature:"+encodeURIComponent(Signature)+";Link:"+encodeURIComponent(Link)+";Source:DataO",DataO);
		// @E:Umstellung auf PDFe-Ausgabe;
	} else {
		alert('Sie müssen mindestens eine Zeile markieren, um einen Druckansicht erstellen zu können.');
	}
}

//############################################################################

function spix_CampusApp_AppendMailList() {
	var Mail = '';
	var Col = $('.dataTable thead tr td:contains("Mail")').index();
	console.log('Col '+Col);
	if($('.PersSelect:checked').length !== 0) {
		$('.PersSelect:checked').each(function() { 
			//console.log(ListDataRawO[$(this).val()]);
			if($(this).val() !== "All" && ListDataRawO[$(this).val()].Firma == 'IABG mbH') {
				var ThisMail = $(this).closest('tr')[0].childNodes[Col].textContent;
				if(ThisMail !== undefined && ThisMail !== "" && ThisMail !== 'mailto://') {
					Mail += ThisMail + ';\n';
				}
			}
		});
	} else {
			Mail = 'Es wurde KEINE Zeile markiert!';
	}
	//console.log(Mail);
	spix_VisuX_Dialog('<h1 class="ms-core-pageTitle">Mailverteiler</h1>Kopieren Sie die folgende Liste in Ihr Mailprogramm:<br /><br /><textarea name="MailList" cols="50" rows="10">'+Mail+'</textarea><br />','spixGetDirectlink');	
}

function spix_CampusApp_GetDirectlink() {
	var DirectLink = 'https://'+window.location.hostname+window.location.pathname+'?FilterVal='+encodeURIComponent($('#CampusAppTable_filter label input').val())+'&FilterCol='+$('#CampusAppInputFilterField').val();
	spix_VisuX_Dialog('<h1 class="ms-core-pageTitle">Direktlink</h1>Kopieren Sie den folgenden Link, um Ihre Recherche direkt aufzurufen:<br /><br /><input type="text" size="60" value="'+DirectLink+'" /><br /><a href="'+DirectLink+'">DirekLink als Link</a>','spixGetDirectlink');	
}

//############################################################################

function spix_CampusApp_Vcard(Id) {
	VCardContent = TelefonbuchData[Id]['VCARD2'];
	if($('#CampusAppVcardQr canvas').length == 0) {
		spix_CampusApp_VcardQr(VCardContent);
		spix_CampusApp_VcardLink(VCardContent);
	}
}

function spix_CampusApp_VcardQr(VCardContent) {
	$('head').append('<script src="'+SPiXscMaster+'jquery.qrcode.min.js" type="text/javascript"></script>');
	$('#CampusAppVcardQr canvas').remove();
	$('#CampusAppVcardQr').qrcode({
			width: 300,
			height: 300,
			color: '#000000',
			text: decodeURIComponent(VCardContent)
		});
}

function spix_CampusApp_VcardLink(VCardContent) {
	$('#CampusAppVcardLink a').remove();

	if(window.navigator.msSaveOrOpenBlob) {
        $('#CampusAppVcardLink').html('<a href="#" id="DownloadVcard"><button type="button">Download als VCF</button></a> oder QR-Code scannen ');    
        $('#DownloadVcard').on('click', function () {
			var fileName = 'vCard.vcf'; 
			var fileData = [VCardContent]; 
			blobObject = new Blob(fileData); 
			window.navigator.msSaveOrOpenBlob(blobObject, fileName); 
			return false;
        });
    } else {
    	VCardContent = encodeURIComponent(VCardContent);
		$('#CampusAppVcardLink').html('<a href="data:text/vCard;charset=utf-8,'+VCardContent+'" download="vCard.vcf"><button type="button">Download als VCF</button></a> oder QR-Code scannen ');    
	}
}

function spix_CampusApp_DetailView(ID) {
	//console.log(ID);
	// @c:2014-12-29:Die "Source" wurde entfernt und statt dessen immer auf die ListenID verwiesen;
	if(ID !== 'close') {
		var DetailDataGet = spix_CampusApp_GetProfileTelBookByPara(ID,'ID');
		//var DetailDataRaw = spix_CampusApp_GetProfileTelBookByPara(ID,'ID');
		var DetailData = DetailDataGet;
		var DetailDataRaw = DetailDataGet;
		//var DetailDataRaw = spix_CampusApp_GetProfileTelBookByPara(ID,'ID');
		try	{
		  var Lync = spix_UserProfile_ShowLyncByMail(DetailData.Mail,'LyncDialogBox'+ID);
		}
		catch(e) {}
		//var Lync = spix_UserProfile_ShowCompactImgPres(DetailData[0].Mail);
		var CampusAppDialog = '<div style="width:800px; min-height: 200px;">';

		if(DetailData.Manager !== null) {
			var ManagerDetailData = spix_CampusApp_GetProfileTelBookByPara(DetailData.Manager,'DistinguishedName');
			if(ManagerDetailData == undefined) {
				var ManagerLink = '..';
			} else {
				var ManagerLink = '<a href="#" onclick="spix_CampusApp_DetailView(\''+ManagerDetailData.ID+'\'); return false;">'+ManagerDetailData.DisplayName+'</a>';
			}
		} else {
			var ManagerDetailData = new Array();
			//ManagerDetailData.Name = '...';
			//ManagerDetailData.ID = '';
			var ManagerLink = '..';
		}
		ImgUrl = 'https://my.iabg.de/User%20Photos/Profilbilder/'+DetailDataRaw.NtName+'_LThumb.jpg';
		var VCard2 = 'BEGIN:VCARD\r\nVERSION:2.1\r\nFN;CHARSET=utf-8:'+DetailData.Name+'\r\nN;CHARSET=utf-8:'+DetailData.Name+'\r\nTITLE:\r\nTEL;CELL:'+DetailData.Telefon2+'\r\nTEL;WORK;VOICE:'+DetailData.Telefon1+'\r\nTEL;WORK;VOICE:'+DetailData.Telefon3+'\r\nTEL;WORK;FAX:'+DetailData.Fax1+'\r\nEMAIL;WORK;INTERNET:'+DetailData.Mail+'\r\nURL:http://www.iabg.de\r\nADR;WORK:;;'+DetailData.Ort+'\r\nORG:'+DetailData.Firma+' ('+DetailData.Abteilung+')\r\nPHOTO;JPEG:'+ImgUrl+'\r\nEND:VCARD';
		var VCard4 = 'BEGIN:VCARD\r\nVERSION:4.0\r\nN;CHARSET=Windows-1252:'+DetailDataRaw.Name+';;;\r\nFN;CHARSET=Windows-1252:'+DetailDataRaw.Name+'\r\nORG:'+DetailDataRaw.Firma+' ('+DetailDataRaw.Abteilung+')\r\nTITLE:\r\nTEL;TYPE=work,voice;VALUE=uri:tel:'+DetailDataRaw.Telefon1+'\r\nTEL;TYPE=home,voice;VALUE=uri:tel:'+DetailDataRaw.Telefon2+'\r\nADR;TYPE=home;LABEL="'+DetailDataRaw.Ort+'"\r\n :;;'+DetailDataRaw.Ort+'\r\nEMAIL:'+DetailDataRaw.Mail+'\r\nREV:20140301T221110Z\r\nEND:VCARD';		
		TelefonbuchData[ID]['VCARD2'] = VCard2;
		TelefonbuchData[ID]['VCARD4'] = VCard4;		
		DetailData = spix_CampusApp_ItemDataMod(DetailData);
		DetailData = spix_CampusApp_ItemViewMod(DetailData);

		if(DetailData.Info !== '') {
			DetailData.Info = '<hr /><p>'+DetailData.Info+'</p>';
		}
		//<img src="https://my.iabg.de/User%20Photos/Profilbilder/'+DetailData.NtName+'_LThumb.jpg" />
		//<span style="position:relative; top: -5px;">'+Lync+'</span><span style="font-size:2em;">'+DetailData.Name.replace(/^(\S+)/, '<b>$1</b>')+'</span>
		var ItemLink = 'https://'+window.location.hostname+window.location.pathname+'?ItemGuid='+DetailData.ObjectGUID;		
                if(DetailData.DistinguishedName.indexOf('OU=Besprechungsräume') > 0) {
                   var InfoTemplate = '<table style="width:100%;"><tr><td rowspan="2"><img id="CampusAppDialogInfoImg" src="https://my.iabg.de/User%20Photos/Profilbilder/'+DetailData.SAMAccountName+'_LThumb.jpg" style="box-shadow:0px 0px 4px #666666; width: 160px; height: 160px; margin-right: 10px;" /></td><td colspan="2"><span style="font-size:2em;">'+DetailData.DisplayName.replace(/^(\S+)/, '<b>$1</b>')+'</span></td></tr><tr><td style="width:50%; vertical-align:top;"><table style="width:100%;"><tr><td class="Label">Firma</td><td class="Data">'+DetailData.Company+'</td></tr><tr><td class="Label">Abteilung</td><td class="Data">'+DetailData.Department+'<br />'+DetailData.Division+'</td></tr><tr><td class="Label">Verantwortlich</td><td class="Data">'+DetailData.Title+'</td></tr><tr><td colspan="2"><hr /></td></tr><tr><td class="Label">Ort</td><td class="Data">'+DetailData.PhysicalDeliveryOfficeName+'</td></tr></table></td><td style="width:50%; vertical-align:top;"><table style="width:100%;"><tr><td class="Label">Telefon 1</td><td class="Data">'+DetailData.TelephoneNumber+'</td></tr><tr><td class="Label">Telefon 2</td><td class="Data">'+DetailData.Mobile.replace('<hr />','')+'</td></tr><tr><td class="Label">Telefon 3</td><td class="Data">'+DetailData.IpPhone.replace('<hr />','')+'</td></tr></table></td></tr></table><table style="width: 100%;"><tr><td class="Data">'+DetailData.Info+'</td></tr></table>';
                } else {
                   var InfoTemplate = '<table style="width:100%;"><tr><td rowspan="2"><img id="CampusAppDialogInfoImg" src="https://my.iabg.de/User%20Photos/Profilbilder/'+DetailData.SAMAccountName+'_LThumb.jpg" style="box-shadow:0px 0px 4px #666666; width: 160px; height: 160px; margin-right: 10px;" /></td><td colspan="2"><span style="margin-left: -6px; position:relative; top: -5px;">'+Lync+'</span><span style="font-size:2em;">'+DetailData.DisplayName.replace(/^(\S+)/, '<b>$1</b>')+'</span></td></tr><tr><td style="width:50%; vertical-align:top;"><table style="width:100%;"><tr><td class="Label">Firma</td><td class="Data">'+DetailData.Company+'</td></tr><tr><td class="Label">Abteilung</td><td class="Data">'+DetailData.Department+'<br />'+DetailData.Division+'</td></tr><tr><td class="Label">Position</td><td class="Data">'+DetailData.Title+'</td></tr><tr><td class="Label">Manager</td><td class="Data">'+ManagerLink+'</td></tr><tr><td colspan="2"><hr /></td></tr><tr><td class="Label">Büro</td><td class="Data">'+DetailData.PhysicalDeliveryOfficeName+'</td></tr></table></td><td style="width:50%; vertical-align:top;"><table style="width:100%;"><tr><td class="Label">Mail</td><td class="Data">'+DetailData.Mail+'</td></tr><tr><td colspan="2"><hr /></td></tr><tr><td class="Label">Telefon 1</td><td class="Data">'+DetailData.TelephoneNumber+'</td></tr><tr><td class="Label">Telefon 2</td><td class="Data">'+DetailData.Mobile.replace('<hr />','')+'</td></tr><tr><td class="Label">Telefon 3</td><td class="Data">'+DetailData.IpPhone.replace('<hr />','')+'</td></tr><tr><td colspan="2"><hr /></td></tr><tr><td class="Label">Fax 1</td><td class="Data">'+DetailData.FacsimileTelephoneNumber+'</td></tr><tr><td class="Label">Fax 2</td><td class="Data">'+DetailData.Pager.replace('<hr />','')+'</td></tr></table></td></tr></table><table style="width: 100%;"><tr><td class="Data">'+DetailData.Info+'</td></tr></table>';
                }   
        CampusAppDialog += '<div id="CampusAppDialogInfo" class="CampusAppDialogBox" style="width: 100%; height: 100%;">'+InfoTemplate+'</div><style>td.Label { color: #999999; font-size: 0.9em; } td.Data { color: #004993; } td.Data a { color: #004993; } span.Data { color: #004993; }</style>';
        CampusAppDialog += '<div id="CampusAppDialogZusatz" class="CampusAppDialogBox" style="display:none; width: 100%; height: 100%;"><h1 class="ms-core-pageTitle">Zusatz</h1><a href="'+ItemLink+'">Link zu diesem Eintrag</a><br /><br /><br /></div><style>td.Label { color: #999999; font-size: 0.9em; } td.Data { color: #004993; } td.Data a { color: #004993; } span.Data { color: #004993; }</style>';        
		CampusAppDialog += '<div id="CampusAppDialogVcard" class="CampusAppDialogBox" style="display:none; width: 100%; height: 100%;"><h1 class="ms-core-pageTitle">Visitenkarte</h1><table style="margin: 0 auto;"><tr><td><div id="CampusAppVcardLink"></div></td><td><div id="CampusAppVcardQr"></div></td></tr><tr><td colspan="2" style="text-align:center;"><small>Diese Funktion befindet sich noch in der Entwicklung!</small></td></tr></table></div>';

		var PermaLinkBtn = '<a href="#" onclick="PermaLinkBtn(\''+ItemLink+'\'); return false;"><span class="spixDialogBtn">PermaLink</span></a>';
		var ShareBtn = '<a href="mailto:?subject=Kontaktdaten%20von%20Thema%20'+encodeURIComponent(DetailData.Name)+'&amp;body=%0D%0A%0D%0AHier%20gelangen%20Sie%20zum%20entsprechenden%20Eintrag:%20' + ItemLink + '"><span class="spixDialogBtn">Jemandem per Mail senden</span></a>';
		
		CampusAppDialog += '<hr /><div id="CampusAppDialogMenu" style=""><a href="#" onclick="$(\'.CampusAppDialogBox\').hide(); $(\'#CampusAppDialogInfo\').show(); spix_VisuX_ResizeDialog(\'#CampusAppDialog\'); return false; "><span class="spixDialogBtn">INFO</span></a><!--<a href="#" onclick="$(\'.CampusAppDialogBox\').hide(); $(\'#CampusAppDialogZusatz\').show(); spix_VisuX_ResizeDialog(\'#CampusAppDialog\'); return false; "><span class="spixDialogBtn">ZUSATZ</span></a>--><a href="#" onclick="$(\'.CampusAppDialogBox\').hide(); $(\'#CampusAppDialogVcard\').show(); spix_CampusApp_Vcard(\''+ID+'\'); spix_VisuX_ResizeDialog(\'#CampusAppDialog\');return false; "><span class="spixDialogBtn">vCARD</span></a>'+PermaLinkBtn+ShareBtn+'<a href="mailto:telefonbuch@iabg.de?subject=Telefonbuch%20Korrekturmeldung&amp;body=%0D%0A%0D%0AFolgender%20Eintrag%20soll%20korrigiert%20werden:%20' + ItemLink + '"><span class="spixDialogBtn">Eintrag korrigieren!</span></a></div></div>';
		//<a href="https://portal.iabg.de/Lists/CampusApp_TelBook_FehlerMelden/NewForm.aspx?AdGuid='+DetailData.AdGuid+'" target="_blank">
		// ERR: EDIT-Link ergänzen, wenn ich selbst es bin
		// | <a href="https://portal.iabg.de/infothek/Lists/CampusMap_Telefonbuch/EditForm.aspx?ID='+DetailData.ID+'&Source=%2Finfothek%2FLists%2FCampusMap%5FTelefonbuch">EDIT</a>
		
		//'<div style="margin: 50px;"><br />' + MapView + '<br /><span style="float:left;font-size: 35px;"><a href="#" onclick="$(\'#_iabgCampusMap\').remove(); return false;"><img style="margin-right: 20px;" src="https://portal.iabg.de/infothek/CampusMap_Sources/MapsImg/Close.png" /></a>' + MapNav + '</span><br /></div>';
		//spix_VisuX_DialogClose('CampusAppDialog');
		spix_VisuX_Dialog(CampusAppDialog,'CampusAppDialog');
		/*if ($('#_iabgCampusAppDialog').length == 0) {
			$('body').append('<div id="_iabgCampusAppDialog" class="ms-dlgBorder ms-dlgContent" style="position: absolute; background: #FFFFFF; z-index: 1505;">' + CampusAppDialog + '</div><div id="_iabgCampusAppDialogOverlay" class="ms-dlgOverlay" style="display: block; z-index: 1504; width: 100%; height: 100%;"></div>');
			//$('#_iabgCampusMap img').load(spix_ResizeDialog);
		} else {
			$('#_iabgCampusAppDialog').html(CampusAppDialog);
			//$('#_iabgCampusMap img').load(spix_ResizeDialog);
		}
		$('#CampusAppDialogInfoImg').error(function () { $(this).remove(); });
		spix_ResizeDialog('#_iabgCampusAppDialog');
		$('#CampusAppDialogMenu a').on('click',function () {
			spix_ResizeDialog('#_iabgCampusAppDialog');
		});*/
	} else {
		//$('#_iabgCampusAppDialogOverlay').remove();
		//$('#_iabgCampusAppDialog').remove();
		spix_VisuX_DialogClose('CampusAppDialog');
	}	
	spix_CampusApp_ModView();
	spix_CampusMap_ModView();
}

function spix_CampusApp_RepairProfileImg() {
	console.log($(this).hide());
}

//############################################################################

function spix_UserProfile_ShowCompactImgPres(ThisElement) {
    //console.log('spix_UserProfile_ShowProfileCard');
    var Profil = ThisElement.attr('data-profile');
    var ThisUserData = spix_UserProfile_GetUserData(Profil);
    if (Profil.substr(0, 3) == "pdb") {
        //console.log('Load Data from PDB');
    } else {
        //console.log('Load Data from AD '+ThisElement.attr('profile'));
        //NtName = ThisElement.attr('profile');
        var ImgUrl = ThisUserData['PictureURL'];
        ImgUrl = ImgUrl.replace('MThumb', 'LThumb');
        var Lync = spix_UserProfile_ShowLyncByMail(ThisUserData['WorkEmail']);
        if (ThisElement.text().length > 0) {
            var AddText = ' (' + ThisElement.text() + ') ';
        } else {
            var AddText = '';
        }
        ThisElement.html('<div style="border: 1px solid #999999;"><div style="float:left; margin-right: 20px; "><img src="' + ImgUrl + '" /></div><div style="float:left; margin-top: 5px;">' + Lync + ' <span style="font-size: 20px;">' + ThisUserData['PreferredName'] + AddText + '</span><br /><table><tr><td class="ShowProfileLabel">Abteilung</td><td>' + ThisUserData['Department'] + '</td></tr><tr><td class="ShowProfileLabel">Telefon</td><td><a href="tel:' + ThisUserData['WorkPhone'] + '">' + ThisUserData['WorkPhone'] + '</a></td></tr><tr><tr><td class="ShowProfileLabel"></td><td><a href="tel:' + ThisUserData['CellPhone'] + '">' + ThisUserData['CellPhone'] + '</a></td></tr><tr><tr><td class="ShowProfileLabel">Fax</td><td>' + ThisUserData['Fax'] + '</td></tr><tr><td class="ShowProfileLabel">Mail</td><td><a href="mailto:' + ThisUserData['WorkEmail'] + '">' + ThisUserData['WorkEmail'] + '</a></td></tr><tr><td class="ShowProfileLabel">Büro</td><td><div class="CampusMap">' + ThisUserData['Office'] + '</div></td></tr></table></div><div style="clear:both;"></div></div><div style="float:clear;"></div><br />');
    }
    spix_CampusMap_ModView();
}

//############################################################################

function spix_ResizeDialog(DivId) {
	if(DivId == undefined) { DivId = $(this); }
    /* D: Change position and size of the map responding to the window size;
     * T: ;
     * U: 2014-04-24;
     * A: Markus Hottenrott;
     * I: ;
     * O: ;
     * E: ;
     */
	var Width = $(DivId).width();
	var Height = $(DivId).height();
	if(Width == null) { 
		setTimeout(spix_ResizeDialog, 500);
		return false;
	}
    $(DivId).css({'left': ($(window).width() - Width) / 2, 'top': ($(window).height() - Height) / 2});
}

function spix_MultiFieldSearch () {
	$('#CampusAppTable_filter label input').val('').trigger("keyup");
	$('.dataTable tbody').hide();

	if($('.ColSearchFilter').length == 0) {
		i=2;

		$('#CampusAppTable thead').append('<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>')
		$('#CampusAppTable thead tr:eq(1) td').slice(1).each( function () {
			$(this).append( '<input type="text" placeholder="" class="ColSearchFilter" data-colid="'+i+'" />' );
			i = i+1;
		});

		$('.ColSearchFilter').on('keyup change', function () {
			CampusAppTableO.api().column( $(this).attr('data-colid') ).search( $(this).val() ).draw();
			$('.dataTable tbody').show();
		});

		$('#CampusAppTable_filter').hide();
	}
}

function PermaLinkBtn(ItemLink) {
		spix_VisuX_Dialog('<h1 class="ms-core-pageTitle">Permanenter Link</h1>Kopieren Sie den folgenden Link, um diesen Eintrag direkt aufzurufen:<br /><br /><input type="text" size="60" value="'+ItemLink+'" /><br /><a href="'+ItemLink+'">DirectLink als Link</a>','spixGetItemPermaLink');
}