<?xml version="1.0" encoding="UTF-8" ?>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>WorkMan - Country Calendar Maintenance</title>
<script type="text/javascript" src="/wui3/js/ObjectUtil.js"></script>
<script type="text/javascript" src="/wui3/js/StringUtil.js"></script>
<script type="text/javascript" src="/wui3/js/LabelHelper.js"></script>
<script type="text/javascript" src="/wui3/js/Callback.js"></script>
<script type="text/javascript" src="/wui3/js/DomHelper.js"></script>
<script type="text/javascript" src="/wui3/js/DomElement.js"></script>
<script type="text/javascript" src="/wui3/js/widget/Wrapper.js"></script>
<script type="text/javascript" src="/wui3/js/widget/TextBox.js"></script>
<script type="text/javascript" src="/wui3/js/widget/CheckBox.js"></script>
<script type="text/javascript" src="/wui3/js/widget/DropdownBox.js"></script>
<script type="text/javascript" src="/wui3/js/widget/Button.js"></script>
<script type="text/javascript" src="/wui3/js/widget/Table.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/bo/Data.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/bo/CountryCalendar.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/bo/CalendarDay.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/dwr/interface/CalendarDao.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/dwr/engine.js"></script>
<script type="text/javascript">
var lbl = new LabelHelper();

var dataController = {
	countryCalendarList:[],
	countryCalendar:null,

	newCountryCalendar:function(calendarName) {
		this.countryCalendar = new CountryCalendar();
		this.countryCalendar.calendarName = calendarName;
	},
	
	load:function() {
		this.loadCountryCalendarList();
	},

	loadCountryCalendarList:function() {
		this.countryCalendarList = [];
		this.currentCountryCalendar = null;

		var dataCtrlr = this;
		CalendarDao.getCountryCalendarList(function(countryCalendarList) {dataCtrlr.countryCalendarList = countryCalendarList;});
		this.currentCountryCalendar = this.countryCalendarList[0];
	},
	
	loadCountryCalendar:function(countryCalendarId, year) {
		if (this.selectedCountryCalendarIdx>=0) {
			var dataCtrl = this;
			CalendarDao.loadCountryCalendarOfYear(countryCalendarId, year, function(countryCalendar) {dataCtrl.countryCalendar = countryCalendar;});
			this.year = year;
		}
	},

	getCountryCalendarList:function() {
		return this.countryCalendarList;
	},
	
	getCountryDays:function() {
		return this.countryDays;
	},
	
	newCountryDay:function() {
		var countryDay = new CalendarDay();
		return countryDay;
	},
	
	addCountryDay:function(countryDay) {
		this.countryDays.push(countryDay);
		// CountryDayDao.saveCountryDay(countryDay);
	},

	delCountryDay:function(countryDay) {
		for (var i=0; i<this.countryDays.length && countryDay != this.countryDays[i]; i++);
		if (i<this.countryDays.length) this.countryDays[i].deleteMark = true;
	},
	
	saveCountryCalendar:function() {
		CalendarDao.saveCountryCalendar();
	},

	setSelectedCountryCalendar:function(idx) {
		this.selectedCountryCalendarIdx = idx;
	}
};

var pageController = {
	components:{
		countryFilter:null,
		yearFilter:null,
		calendarTable:null
		},

	render:function(baseHtml) {
			var app = new DomElement();
			app.setContext(baseHtml);

			var appWrapper = app.createWrapper(null, true);
			var dialog = appWrapper.createRow().createCol((new WrapperColSettings).setVerticalAlignment(WrapperColSettings.VERT_MIDDLE).setHorizontalAlignment(WrapperColSettings.HORZ_CENTER)).createInlineBlock();

			dialog.createParagraph('Hi');
		},

	renderold:function(baseHtml) {
			var ctrlPanel = appWrapper.createRow();
			if (ctrlPanel) {
				ctrlPanel.createLabel(lbl.getFieldLabel('dict.country'));
	
				this.components.countryFilter = ctrlPanel.createTextBox();
	
				ctrlPanel.createLabel(lbl.getFieldLabel('dict.year'));
				
				this.components.yearFilter = ctrlPanel.createTextBox();

				ctrlPanel.createButton(this.getSettings('loadCalnBtn'));
			}
			
			var viewPanel = appWrapper.createRow();
			if (viewPanel) {
				this.components.calendarTable = viewPanel.createTable(this.getSettings('calendarTable'), dataController.getCountryDays());
			}
			
			var buttonPanel = appWrapper.createRow();
			if (buttonPanel) {
				buttonPanel.createButton(this.getSettings('saveCalnBtn'));
			}

		},

	getSettings:function(componentName) {
			var settings = null;

			switch (componentName) {
			case 'loadCalnBtn':
				settings = (new ButtonSettings())
					.setLabel(lbl.getLabel('button.load'))
					.addCallback('click', new Callback(this, this.cbLoadCaln));
				break;
				
			case 'calendarTable':
				settings = (new TableSettings())
					.addColumn({field:'',header:{widget:Button, settings:this.getSettings('newCalendarDayBtn')},ctrl:Button,ctrlSettings:this.getSettings('deleteCalendarDayBtn')})
					.addColumn({field:'date',header:lbl.getLabel('dict.date'),ctrl:TextBox})
					.addColumn({field:'name',header:lbl.getLabel('dict.dayName'),ctrl:TextBox})
					.addColumn({field:'abv',header:lbl.getLabel('dict.abv'),ctrl:TextBox})
					.addColumn({field:'isHoliday',header:lbl.getLabel('dict.holiday'),ctrl:CheckBox});
				break;

			case 'newCalendarDayBtn':
				settings = (new ButtonSettings())
					.setLabel(lbl.getLabel('button.new'))
					.addCallback('click', new Callback(this, this.cbNewCalnDay));
				break;

			case 'deleteCalendarDayBtn':
				settings = (new ButtonSettings())
					.setLabel(lbl.getLabel('button.delete'))
					.addCallback('click', new Callback(this, this.cbDelCalnDay));
				break;

			case 'saveCalnBtn':
				settings = (new ButtonSettings())
					.setLabel(lbl.getLabel('button.save'))
					.addCallback('click', new Callback(this, this.cbSaveCaln));
				break;
				
			default:
				error('Component Name:' + componentName + ' not defined.');
			}

			return settings;
		},

	refreshCountryCalendar:function() {
		},

	cbLoadCaln:function(evt) {
		},
		
	cbChangeCountry:function(evt) {
			dataController.setSelectedCountryCalendar(this.components.countryFilter.getSelectedIndex());
			dataController.loadCountryCalendar(this.components.yearFilter.getValue());
			this.refreshCountryCalendar();
		},

	addNewDay:function() {
			var newCountryDay = dataController.newCountryDay();
			this.components.calendarTable.addRow(newCountryDay);
		},

	cbNewCalnDay:function(evt) {
			this.addNewDay();
		},

	delDay:function(day, tr) {
			dataController.delCountryDay(day);
			this.components.calendarTable.delRow(tr);
		},

	cbDelCalnDay:function(evt) {
			var tr = DomHelper.seekEventParent(evt, 'tr').domReference;
			var day = this.components.calendarTable.getRowRecord(tr);
			this.delDay(day, tr);
		},

	cbSaveCaln:function(evt) {
			this.components.calendarTable.updateRecords();
		}
};

function run() {
	dwr.engine.setAsync(false);
	lbl.loadPageLabels('countrycalnmaint');
	dataController.load();
	pageController.render('body');
}
</script>
</head>
<body id="body" onload="run();">
</body>
</html>