angular.module('app')
.factory('pdfMake', function() {
	
	var pm = {};
	var els = [ 'text', 'stack', 'columns', 'table', 'image'];
	
	pm.fnval = function fnval(val) {
		return function() { return val; }
	};
	
	function makeEl(name) {
		
		function elb(body, attrs) {
			attrs = attrs || {};
			attrs[name] = body;
			return attrs;
		}
		return elb;
	}
	
	var fn0 = function() { return 0 };
	pm.emptyLayout = {
		hLineWidth: fn0, vLineWidth: fn0, paddingBottom: fn0, paddingTop: fn0, paddingRight: fn0, paddingLeft: fn0
	}
	
	pm.boxLayout = {
		hLineWidth: function(row, node) {  return (row === 0 || row === node.table.body.length) ? 1 : 0 },
		vLineWidth: function(col, node) {  return (col === 0 || col === node.table.body[0].length) ? 1 : 0 },
	}
	
	pm.box = function(content, tableAttrs, fill) {
		tableAttrs = tableAttrs || {};
		tableAttrs.layout = tableAttrs.layout || pm.boxLayout;
		content = Array.isArray(content) ? { stack: content } : content;
		if(fill) content.fillColor = fill;
		return pm.table({ widths: ['*'],  body: [[content]] }, tableAttrs);
	}
	
	for(var i=0; i<els.length; i++) {
		pm[els[i]] = makeEl(els[i]);
	}
	
	pm.st = function st(text, style) {
		var res = { text: text || ''};
		if(style) {
			res.style = style;
		}
		return res;
	}
	
	pm.vOffset = function vOffset(obj, vunits) {
		obj.margin = [ 0, vunits, 0, 0 ];
		return obj; 
	}
	
	pm.fmtNum = function fmtNum(number, decimals, dec_point, thousands_sep, isPct) {
		var n = !isFinite(+number) ? 0 : +number * (isPct ? 100 : 1),
			prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
			sep = (typeof thousands_sep === 'undefined') ? ' ' : thousands_sep,
			dec = (typeof dec_point === 'undefined') ? ',' : dec_point,
			s = '';
	
		s = (prec ? n.toFixed(prec) : '' + Math.round(n)).split('.');
		if (s[0].length > 3) {
			s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
		}
		if ((s[1] || '').length < prec) {
			s[1] = s[1] || '';
			s[1] += new Array(prec - s[1].length + 1).join('0');
		}
	
		return s.join(dec) + (isPct ? '%' : '');
	}
	
	pm.cc = function cc(num, prec) { 
		return pm.fmtNum(num, prec)
	}
	pm.pct = function pct(num) { return pm.fmtNum(num, 0, ',', ' ', true) }
	pm.printer = window.pdfMake;
	return pm;
	
});