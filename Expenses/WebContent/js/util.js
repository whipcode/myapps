util = {
	log:function(msg) {
		console.log(msg);
	},
	
	dump:function(obj, levels) {
		return JSON.stringify(obj);
	},
	
	getSelectableYears:function() {
		var years = [];
		var startYear = new Date().getFullYear() - 1;
		for (var year=0; year<10; year++)
			years.push(startYear + year);
		return years;
	},
	
	getMonthNames:function() {
		return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	},
	
	getMonthName:function(idx) {
		return this.getMonthNames()[idx];
	},
	
	showError:function(msg) {
		console.error(msg);
		alert(msg);
	},
	
	getToday:function() {
		var date = new Date();
		return new Date(date.getFullYear(), date.getMonth(), date.getDate());
	},
	
	formatDate:function(date, formatStr) {
		if (date) {
			var monthLabel = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
			var d = date.getDate();
			var dd = date.getDate(); dd = dd<10?'0'+dd:dd;
			var Mmm = monthLabel[date.getMonth()];
			var yyyy = date.getFullYear();
			var HH = date.getHours(); HH = HH<10?'0'+HH:HH;
			var h = date.getHours() % 12 || 12;
			var hh = date.getHours() % 12 || 12; hh = hh<10?'0'+hh:hh;
			var ampm = date.getHours() < 12 ? 'am' : 'pm';
			var AMPM = ampm.toUpperCase();
			var mm = date.getMinutes(); mm = mm<10?'0'+mm:mm;
			
			formatStr = formatStr.replace('$(d)',d);
			formatStr = formatStr.replace('$(dd)',dd);
			formatStr = formatStr.replace('$(Mmm)',Mmm);
			formatStr = formatStr.replace('$(yyyy)',yyyy);
			formatStr = formatStr.replace('$(HH)',HH);
			formatStr = formatStr.replace('$(h)',h);
			formatStr = formatStr.replace('$(hh)',hh);
			formatStr = formatStr.replace('$(ampm)',ampm);
			formatStr = formatStr.replace('$(AMPM)',AMPM);
			formatStr = formatStr.replace('$(mm)',mm);
		}
		else
			formatStr = '';
		
		return formatStr;
	},
	
	str2Date:function(str) {
		var date = null;
		var monthIdx = {jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11};
		if (str) {
			date = new Date();
			/* dd mmm yyyy */
			var s = str.split(' ');
			date.setFullYear(s[2]);
			if (parseInt(s[1]) > 0)
				date.setMonth(parseInt(s[1])-1);
			else
				date.setMonth(monthIdx[s[1].toLowerCase()]);
			date.setDate(s[0]);
			date.setHours(0);
			date.setMinutes(0);
			date.setSeconds(0);
			date.setMilliseconds(0);
		}
		
		return date;
	},
	
	formatAmount:function(amount, dp, withSep) {
		var rtn = '';
		
		if (typeof(amount) != 'undefined') {
			if (dp == 0) {
				rtn = '' + Math.round(amount);
	
				if (withSep) {
					var regexp = /(\d+)(\d{3})/;
					while (regexp.test(rtn))
						rtn = rtn.replace(regexp,'$1,$2');
				}
			}
			else if (Math.abs(amount) >= 1) {
				rtn = '' + Math.round(amount*Math.pow(10,dp));
				rtn = rtn.substr(0, rtn.length-dp) + '.' + rtn.substr(rtn.length-dp);
	
				if (withSep) {
					var regexp = /(\d+)(\d{3})/;
					while (regexp.test(rtn))
						rtn = rtn.replace(regexp,'$1,$2');
				}
			}
			else {
				if (amount < 0) {
					rtn = '' + Math.round((amount-1)*Math.pow(10,dp));
					rtn = '-0.' + rtn.substr(rtn.length-dp);
				}
				else {
					rtn = '' + Math.round((amount+1)*Math.pow(10,dp));
					rtn = '0.' + rtn.substr(rtn.length-dp);
				}
			}
		}
		else
			rtn = '';
		
		return rtn;
	},
	
	str2Amount:function(str) {
		return Number(str.replace(/,/g,''));

	},
	
	toArray:function(obj) {
		var array = [];
		
		for (var a in obj) {
			array.push(obj[a]);
		}
		
		return array;
	},
	
	isInYear:function(data, refDateFields, year) {
		for (var i=0; i<refDateFields.length; i++)
			if (util.get(data, refDateFields[i]) && util.get(data, refDateFields[i]).getFullYear() != year)
				return false;
		
		return true;
	},
	
	get:function(data, field) {
		var fieldpath = field.split('.');
		
		var value = data;
		for (var i=0; i<fieldpath.length; i++) {
			if (typeof(value[fieldpath[i]]) != 'undefined')
				value = value[fieldpath[i]];
			else if (typeof(value.get) == 'function')
				value = value.get(fieldpath[i]);
		}
		
		return value;
	},
	
	at:function(data, idx) {
		if (typeof(data.at) == 'function')
			return data.at(idx);
		else if (data instanceof Array)
			return data[idx];
		return undefined;
	},
	
	copyObj:function(srcObj, updObj) {
		var newObj = {};
		
		for (var a in srcObj)
			newObj[a] = srcObj[a];
		
		for (var a in updObj)
			newObj[a] = updObj[a];
		
		return newObj;
	}
};