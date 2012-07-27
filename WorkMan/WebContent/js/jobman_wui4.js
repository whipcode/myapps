function autoSave() {
	var appStatus = wui.getElement('appStatus');
	var offline = wui.getElement('offline');
	
	if (!offline.getValue() && data.updated) {
		if (appStatus)
			appStatus.setText("Saving...");
		
		setTimeout("autoSaveNow();", 1);
	}
	else
		setTimeout("autoSave();", data.pref.autoSaveInterval);
}

function autoSaveNow() {
	saveEditingItems();
	setTimeout("autoSave();", data.pref.autoSaveInterval);
}

function Application(htmlId) {
	this.setContext(htmlId);
	
	var appView = this.add(WuiWrapper, 'appView');
	if (appView) {
		appView.add(WuiLabel, 'appStatus');
		appView.add(AppMenu, 'appMenu');
		appView.add(TaskPlanner, 'taskPlanner');
		appView.add(WuiWrapper, 'm');
		
		/* Popup Forms */
		this.add(Settings, 'settings');
		this.add(CalendarMaint, 'calendarMaint');
	}
	
	/* Load data */
	dwr.engine.setAsync(false);
	data.load();
	refreshAll();
	
	/* Start Auto Save */
	setTimeout("autoSave();", data.pref.autoSaveInterval);
}
Application.prototype = new WuiElement();

function PopupForm(id) {
	this.newHtmlElement(id, 'div', 'Popup');
}
PopupForm.prototype = new WuiElement();

PopupForm.prototype.show = function(show) {
	if (show)
		this.setAttribute('show', 'yes');
	else
		this.setAttribute('show', 'no');
};

function AppMenu(id) {
	this.newHtmlElement(id, 'div', 'AppMenu');
	
	this.jobFileSelector = this.add(WuiSelection, 'jobFileSelector', null, {
		change:function(evt) {
			var jobFileSelector = wui.getElement('jobFileSelector');
			changeWorkingJobfile(jobFileSelector.getSelectedIdx());
		}
	});
	this.add(WuiCheckboxField, 'offline', {rearlabel:'Offline'});
	this.add(WuiButton, '', {text:'Save'}, {
		click:function(evt) {
			saveEditingItems();
		}
	});
	this.add(WuiButton, '', {text:'Settings'}, {
		click:function(evt) {
			showSettings(true);
		}
	});
}
AppMenu.prototype = new WuiElement();

AppMenu.prototype.render = function() {
	var options = this.jobFileSelector;
	options.removeChildElements();

	if (data.jobfiles.length > 0) {
		if (!data.workingJobfile) data.workingJobfile = data.jobfiles[0];
		
		for (var i=0; i<data.jobfiles.length; i++) {
			options.addOption('', {text:data.jobfiles[i].filename,userData:data.jobfiles[i]});
			if (data.jobfiles[i].id == data.workingJobfile.id)
				options.setSelectedIdx(i);
		}
		
		if (options.getSelectedIdx() == 0)
			data.workingJobfile = data.jobfiles[0];
	}
};

function TaskPlanner(id) {
	this.newHtmlElement(id, 'div', 'TaskPlanner', {attr:{view:'weekPlanner'}});
	
	this.weekPlanner = this.add(WeekPlanner, 'weekPlanner');
	this.plannerSwitch = this.add(PlannerSwitch, 'plannerSwitch');
	this.dayPlanner = this.add(DayPlanner, 'dayPlanner');
}
TaskPlanner.prototype = new WuiElement();

TaskPlanner.prototype.render = function() {
	this.weekPlanner.render();
//	this.plannerSwitch.render();
	this.dayPlanner.render();
};

function WeekPlanner(id) {
	this.newHtmlElement(id, 'div', 'WeekPlanner');
	
	this.menu = this.add(WeekPlannerMenu);
	this.calendar = this.add(WeekPlannerCalendar, 'weekPlannerCalendar');
}
WeekPlanner.prototype = new WuiElement();

WeekPlanner.prototype.render = function() {
	this.menu.render();
	this.calendar.render();
};

function WeekPlannerMenu(id) {
	this.newHtmlElement(id, 'div', 'WeekPlannerMenu');
	
	this.headerDiv = this.add(WuiWrapper, 'weekHeaderDiv', {className:'HeaderDiv'});
	this.add(WuiButton, '', {text:'Edit'}, {click:function(evt) {showCalendarMaint(true);}});
}
WeekPlannerMenu.prototype = new WuiElement();

WeekPlannerMenu.prototype.render = function() {
	this.headerDiv.removeChildElements();
	for (var i=0; i<7; i++) {
		this.headerDiv.add(WuiLabel, '', {text:data.weekdayLabels[i+data.pref.startingWeekday],className:'WeekdayLabel'});
	}
};

function WeekPlannerCalendar(id) {
	this.newHtmlElement(id, 'div', 'WeekPlannerCalendar');
	
	this.table = this.add(WuiTable);
	
}
WeekPlannerCalendar.prototype = new WuiElement();

WeekPlannerCalendar.prototype.render = function() {
	this.table.removeChildElements();
	
	var startDate = data.pref.startDate;
	for (var weekNum=0; weekNum<data.pref.numWeeks; weekNum++) {
		var week = this.table.add(WuiTableRow);
		if (week) {
			var date = new Date(startDate.toDateString());
			date.setDate(date.getDate() + 7 * weekNum);
			var refDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()+data.pref.refWeekDay-data.pref.startingWeekday);

			if (refDate.getMonth() % 2 == 0)
				week.addClass('OddMonth');
			else
				week.addClass('EvenMonth');
			
			var monthCell = week.add(WuiTableCell, '', {className:'MonthCell'});
			if (refDate.getDate() <= 7 || weekNum == 0)
				monthCell.setText(data.monthLabels[refDate.getMonth()]);
			
			for (var i=0; i<7; i++) {
				var dayCell = week.add(WuiTableCell, '', {className:'DayCell',userData:{date:new Date(date.toDateString())}});
				if (dayCell) {
					var today = wui.getToday();
					
					if (date < today) dayCell.addClass('Yesterday');
					else if (!(date > today)) dayCell.addClass('Today');
					
					switch (date.getDay()) {
					case 0:
						dayCell.setAttribute('weekend', 'sun');
						break;
					case 6:
						dayCell.setAttribute('weekend', 'sat');
						break;
					}
					
					dayCell.add(WuiLabel, '', {text:date.getDate(),className:'Day'});

					var ph = data.getPublicHoliday(date);
					if (ph) {
						dayCell.setAttribute('evt', 'ph');
						dayCell.add(WuiLabel, '', {text:ph.shortName,className:'PH'});
					}
					
					var evt = data.getDateEvent(date);
					if (evt) {
						dayCell.add(WuiLabel, '', {text:evt.event,className:'Evt'});
					}
					
					dayCell.addEventListener(
						'click',function(evt) {
							var currentTarget = evt.currentTarget;
							switchTaskPlannerView('dayPlanner');
							selectDate(currentTarget.userData.date);
						}
					);
				}
				date.setDate(date.getDate() + 1);
			}
			
			var refDate = evalWeekRefDate(startDate, weekNum);
			week.add(WuiTableCell, '', {className:'WeekFocusCell'}).add(WeekFocusEditor, '', {userData:{refDate:refDate,weekFocus:data.getWeekFocus(refDate)}});
			week.add(WuiTableCell, '', {className:'WeekTaskCell'}).add(WeekTaskEditor, '', {userData:{refDate:refDate,weekTask:data.getWeekTask(refDate)}});
		}
	}
};

WeekPlannerCalendar.prototype.setTempDateEvent = function(eventDate, event) {
	var startDate = data.pref.startDate;
	var date = new Date(startDate.toDateString());
	var table = this.table;

	for (var weekNum=0; weekNum<data.pref.numWeeks; weekNum++) {
		for (var i=0; i<7; i++) {
			if (date.valueOf() == eventDate.valueOf()) {
				var dayCell = new WuiTableCell();
				dayCell.setContext(table.htmlElement.childNodes[weekNum].childNodes[1+i]);
				
				for (var j=0; j<dayCell.htmlElement.childNodes.length; j++) {
					if (dayCell.htmlElement.childNodes[j].className == 'Evt') {
						dayCell.htmlElement.childNodes[j].textContent = event;
					}
				}
				
				if (j == dayCell.htmlElement.childNodes.length) {
					dayCell.add(WuiLabel, '', {text:event,className:'Evt'});
				}
			}
			date.setDate(date.getDate() + 1);
		}
	}
};

function WeekFocusEditor(id, attr) {
	wui.copyObjValues(attr,{contentEditable:'true'});
	wui.copyObjValues(attr.userData, {wuiElement:this,changed:false});
	this.newHtmlElement(id, 'div', 'WeekFocusEditor', attr, {
		keyup:function(evt) {
			var htmlElement = evt.currentTarget;
			if (!htmlElement.userData.changed) {
				htmlElement.userData.changed = true;
				data.updateList.weekFocuses.push(htmlElement.userData.wuiElement);
				data.updated = true;
				wui.getElement('appStatus').setText('Editing');
			}
		}
	});
	
	var userData = this.getUserData();
	if (!userData.weekFocus) {
		this.add(WuiList).add(WuiListItem);
	}
	else 
		this.htmlElement.innerHTML = userData.weekFocus.focus;
}
WeekFocusEditor.prototype = new WuiElement();

WeekFocusEditor.prototype.getWeekFocus = function() {
	var userData = this.getUserData();
	var weekFocus = userData.weekFocus;
	if (!weekFocus) {
		weekFocus = new WeekFocus();
		weekFocus.date = userData.refDate;
		weekFocus.jobfile = data.workingJobfile;
		userData.weekFocus = weekFocus;
	}
	weekFocus.focus = this.htmlElement.innerHTML;
	
	return weekFocus;
};

function WeekTaskEditor(id, attr) {
	wui.copyObjValues(attr,{contentEditable:'true'});
	wui.copyObjValues(attr.userData, {wuiElement:this,changed:false});
	this.newHtmlElement(id, 'div', 'WeekTaskEditor TaskEditor', attr, {
		keyup:function(evt) {
			var htmlElement = evt.currentTarget;
			if (!htmlElement.userData.changed) {
				htmlElement.userData.changed = true;
				data.updateList.weekTasks.push(htmlElement.userData.wuiElement);
				data.updated = true;
				wui.getElement('appStatus').setText('Editing');
			}
		},
		click:function(evt) {
			var srcElement = evt.srcElement;
			var currentTarget = evt.currentTarget;
			
			if (srcElement instanceof HTMLLIElement && evt.offsetX < 0) {
				if (srcElement.getAttribute('checked') == 'true')
					srcElement.setAttribute('checked', 'false');
				else
					srcElement.setAttribute('checked', 'true');

				currentTarget.userData.changed = true;
				data.updateList.weekTasks.push(currentTarget.userData.wuiElement);
				data.updated = true;
				wui.getElement('appStatus').setText('Editing');
			}
		}
	});
	
	var userData = this.getUserData();
	if (!userData.weekTask) {
		this.add(WuiList).add(WuiListItem);
	}
	else 
		this.htmlElement.innerHTML = userData.weekTask.task;
}
WeekTaskEditor.prototype = new WuiElement();

WeekTaskEditor.prototype.getWeekTask = function() {
	var userData = this.getUserData();
	var weekTask = userData.weekTask;
	if (!weekTask) {
		weekTask = new WeekTask();
		weekTask.date = userData.refDate;
		weekTask.jobfile = data.workingJobfile;
		userData.weekTask = weekTask;
	}
	weekTask.task = this.htmlElement.innerHTML;
	
	return weekTask;
};

function PlannerSwitch(id) {
	this.newHtmlElement(id, 'button', 'PlannerSwitch');
	this.addEventListener('click', function(evt) {
		switchTaskPlannerView();
	});
}
PlannerSwitch.prototype = new WuiElement();

PlannerSwitch.prototype.switchView = function(view) {
	if (view == 'weekPlanner')
		this.setText('<');
	else
		this.setText('>');
	
};

function DayPlanner(id) {
	this.newHtmlElement(id, 'div', 'DayPlanner');
	
	this.dayHighlight = this.add(WuiWrapper, '', {className:'DayHighlight'});
	if (this.dayHighlight) {
		this.dayHighlight.date = this.dayHighlight.add(WuiLabel, '', {className:'Date'});
		this.dayHighlight.weekday = this.dayHighlight.add(WuiLabel, '', {className:'Weekday'});
		this.dayHighlight.ph = this.dayHighlight.add(WuiLabel, '', {className:'PH'});
		this.dayHighlight.evt = this.dayHighlight.add(WuiText, '', {className:'Evt',attr:{contentEditable:'true'},userData:{date:null,dateEvent:null,changed:false,wuiElement:this}}, {
			keyup:function(evt) {
				var srcElement = evt.srcElement;
				var userData = srcElement.userData;
				
				if (!userData.changed) {
					userData.changed = true;
					data.updateList.dateEvents.push(srcElement.userData.wuiElement);
					data.updated = true;
					wui.getElement('appStatus').setText('Editing');
				}
			},
			blur:function(evt) {
				var srcElement = evt.srcElement;
				var weekPlannerCalendar = wui.getElement('weekPlannerCalendar');
				weekPlannerCalendar.setTempDateEvent(srcElement.userData.date, srcElement.innerText);
			}
		});
	}
	
	this.taskEditor = this.add(WuiWrapper, '', {className:'TaskEditor',contentEditable:'true',userData:{date:null,changed:false,wuiElement:this}}, {
		keyup:function(evt) {
			var htmlElement = evt.currentTarget;
			if (!htmlElement.userData.changed) {
				htmlElement.userData.changed = true;
				data.updateList.todayTasks.push(htmlElement.userData.wuiElement);
				data.updated = true;
				wui.getElement('appStatus').setText('Editing');
			}
		},
		click:function(evt) {
			var srcElement = evt.srcElement;
			var currentTarget = evt.currentTarget;
			
			if (srcElement instanceof HTMLLIElement && evt.offsetX < 0) {
				if (srcElement.getAttribute('checked') == 'true')
					srcElement.setAttribute('checked', 'false');
				else
					srcElement.setAttribute('checked', 'true');
	
				currentTarget.userData.changed = true;
				data.updateList.todayTasks.push(currentTarget.userData.wuiElement);
				data.updated = true;
				wui.getElement('appStatus').setText('Editing');
			}
		}
	});
}
DayPlanner.prototype = new WuiElement();

DayPlanner.prototype.render = function() {
	this.dayHighlight.date.setText(data.pref.selectDate.getDate() + ' ' + data.monthLabels[data.pref.selectDate.getMonth()]);
	this.dayHighlight.weekday.setText(data.weekdayLabels3[data.pref.selectDate.getDay()]);
	
	var ph = data.getPublicHoliday(data.pref.selectDate);
	if (ph) {
		this.dayHighlight.ph.setText(ph.shortName);
		this.dayHighlight.setAttribute('evt', 'ph');
	}
	else {
		this.dayHighlight.ph.setText('');
		this.dayHighlight.setAttribute('evt', '');
	}
	
	var evt = data.getDateEvent(data.pref.selectDate);
	this.dayHighlight.evt.putUserData('dateEvent', evt);
	this.dayHighlight.evt.putUserData('changed', false);
	this.dayHighlight.evt.putUserData('date', data.pref.selectDate);
	if (evt) 
		this.dayHighlight.evt.setText(evt.event);
	else
		this.dayHighlight.evt.setText('');
	
	this.taskEditor.removeChildElements();
	this.taskEditor.putUserData('changed', false);
	this.taskEditor.putUserData('date', data.pref.selectDate);
	
	var todayTask = data.getTodayTask(data.pref.selectDate);
	if (todayTask) {
		this.taskEditor.putUserData('todayTask', todayTask);
		this.taskEditor.htmlElement.innerHTML = todayTask.task;
	}
	else {
		this.taskEditor.putUserData('todayTask', null);
		this.taskEditor.add(WuiList).add(WuiListItem);
	}
};

DayPlanner.prototype.getTodayTask = function() {
	var userData = this.taskEditor.getUserData();
	var todayTask = userData.todayTask;
	if (!todayTask) {
		todayTask = new TodayTask();
		todayTask.date = userData.date;
		todayTask.jobfile = data.workingJobfile;
		userData.todayTask = todayTask;
	}
	todayTask.task = this.taskEditor.htmlElement.innerHTML;
	
	return todayTask;
};

DayPlanner.prototype.getDateEvent = function() {
	var userData = this.dayHighlight.evt.getUserData();
	var dateEvent = userData.dateEvent;
	if (!dateEvent) {
		dateEvent = new DateEvent();
		dateEvent.date = userData.date;
		userData.dateEvent = dateEvent;
	}
	dateEvent.event = this.dayHighlight.evt.getInnerHtml();
	
	return dateEvent;
};

function Settings(id) {
	this.addClass('Settings');
	
	var view = this.add(WuiWrapper, '', {className:'View'});
	if (view) {
		var menu = view.add(WuiWrapper, '', {className:'Menu'});
		if (menu) {
			menu.add(WuiWrapper, '', {className:'CloseBtn'}, {click:function(evt) {showSettings(false);}});
		}
		
		var sections = view.add(WuiWrapper, '', {className:'Sections'});
		if (sections) {
			sections.add(JobFileMaint, 'jobfileMaint');
			sections.add(PrefMaint, 'prefMaint');
		}
	}
	
	this.add(JobFileForm, 'jobfileForm');
}
Settings.prototype = new PopupForm();

function JobFileMaint(id) {
	this.newHtmlElement(id, 'div', 'JobFileMaint');
	
	this.add(WuiText, '', {text:'Job File Maintenance', tag:'h2'});
	this.add(WuiButton, '', {text:'New'}, {
		click:function(evt) {
			showJobFileForm(true, new JobFile());
		}
	});
	
	this.table = this.add(WuiTable);
	var headerRow = this.table.add(WuiTableHeader).add(WuiTableRow);
	headerRow.add(WuiTableCell, '', {text:'Show',className:'colShow'});
	headerRow.add(WuiTableCell, '', {text:'Job File Name',className:'colJobFileName'});
	headerRow.add(WuiTableCell, '', {text:'Remarks',className:'colRemarks'});
	
	this.table.tbody = this.table.add(WuiTableBody);
}
JobFileMaint.prototype = new WuiElement();

JobFileMaint.prototype.render = function() {
	this.table.tbody.removeChildElements();
	
	for (var i=0; i<data.jobfiles.length; i++) {
		var jobfile = data.jobfiles[i];
		
		var tr = this.table.tbody.add(WuiTableRow);
		if (tr) {
			var td = tr.add(WuiTableCell);
			var checkbox = td.add(WuiCheckbox);
			checkbox.setValue(false);
			
			var td = tr.add(WuiTableCell);
			td.setText(jobfile.filename);
			
			var td = tr.add(WuiTableCell);
			td.setText(jobfile.remarks);
		}
	}
};

function JobFileForm(id) {
	this.addClass('JobFileForm');
	
	var view = this.add(WuiWrapper, '', {className:'View'});
	if (view) {
		view.add(WuiText, '', {text:'New Job File', tag:'h2'});
		this.fieldJobFileName = view.add(WuiTextField, '', {label:'Job File Name'});
		this.fieldRemarks = view.add(WuiTextAreaField, '', {label:'Remarks'});
		this.fieldDeleted = view.add(WuiCheckboxField, '', {label:'Delete?'});
		view.add(WuiButton, '', {text:'Save'}, {click:function(evt) {saveJobFile();}});
		view.add(WuiButton, '', {text:'Cancel'}, {click:function(evt) {showJobFileForm(false);}});
	}
}
JobFileForm.prototype = new PopupForm();

JobFileForm.prototype.setJobFile = function(jobfile) {
	this.jobfile = jobfile;
	this.fieldJobFileName.setValue(jobfile.filename);
	this.fieldRemarks.setValue(jobfile.remarks);
	this.fieldDeleted.setValue(jobfile.deleted);
};

JobFileForm.prototype.getJobFile = function() {
	this.jobfile.filename = this.fieldJobFileName.getValue();
	this.jobfile.remarks = this.fieldRemarks.getValue();
	this.jobfile.deleted = this.fieldDeleted.getValue();
	return this.jobfile;
};

function PrefMaint(id) {
	this.newHtmlElement(id, 'div', 'PrefMaint');

	this.add(WuiText, '', {text:'Preferences', tag:'h2'});
}
PrefMaint.prototype = new WuiElement();

function CalendarMaint(id) {
	this.newHtmlElement(id, 'div', 'CalendarMaint Popup');
	
	this.view = this.add(WuiWrapper, 'calendarMaintView');
	this.add(PublicHolidayEditForm, 'publicHolidayEditForm');
	
}
CalendarMaint.prototype = new WuiElement();

CalendarMaint.prototype.show = function(show) {
	if (show)
		this.setAttribute('show', 'yes');
	else
		this.setAttribute('show', 'no');
};

CalendarMaint.prototype.render = function() {
	this.view.removeChildElements();
	
	for (var year=2011; year<=2012; year++) {
		this.view.add(WuiText, '', {text:year,tag:'h2'});
		
		for (var month=0; month<12; month++) {
			var monthDiv = this.view.add(WuiWrapper, '', {className:'MonthDiv'});
			if (monthDiv) {
				monthDiv.add(WuiText, '', {text:data.monthLabels[month],tag:'h3'});
				var weekDiv = monthDiv.add(WuiWrapper, '', {className:'WeekDiv'});
				for (var day=0; day<7; day++) {
					weekDiv.add(WuiLabel, '', {text:data.weekdayLabels[day],className:'WeekDayLabel'});
				}
								
				var date = new Date(year, month, 1);
				
				while (date.getMonth() == month) {
					var weekDiv = monthDiv.add(WuiWrapper, '', {className:'WeekDiv'});
					for (var day=0; day<7 && date.getMonth() == month; day++) {
						var publicHoliday = data.getPublicHoliday(date);
						if (!publicHoliday) {
							publicHoliday = new PublicHoliday();
							publicHoliday.date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
						}
						
						var dayLabel = weekDiv.add(WuiLabel, '', {className:'DayLabel'}, {
							click:function(evt) {
								var e = evt.currentTarget;
								var publicHolidayEditForm = wui.getElement('publicHolidayEditForm');
								publicHolidayEditForm.edit(e.userData);
							}
						});
						dayLabel.setUserData({wuiElement:dayLabel,publicHoliday:publicHoliday});
						
						if (date.getDay() == day) {
							dayLabel.setText(date.getDate());
							if (data.getPublicHoliday(date))
								dayLabel.addClass('PH');
							date.setDate(date.getDate()+1);
						}
					}
				}
			}
		}
	}
};

function PublicHolidayEditForm(id) {
	this.newHtmlElement(id, 'div', 'PublicHolidayEditForm Popup');
	
	this.view = this.add(WuiWrapper);
	if (this.view) {
		this.view.date = this.view.add(WuiText);
		this.view.shortName = this.view.add(WuiTextField, '', {label:'Short Name'});
		this.view.deleted = this.view.add(WuiCheckboxField, '', {label:'Delete?'});
		this.view.add(WuiButton, '', {text:'Save'}, {
			click:function (evt) {
				var publicHolidayEditForm = wui.getElement('publicHolidayEditForm');
				publicHolidayEditForm.getValues(publicHolidayEditForm.userData.publicHoliday);
				data.savePublicHoliday(publicHolidayEditForm.userData.publicHoliday);
				publicHolidayEditForm.userData.wuiElement.addClass('PH');
				publicHolidayEditForm.show(false);
			}
		});
		this.view.add(WuiButton, '', {text:'Cancel'}, {
			click:function(evt) {
				var publicHolidayEditForm = wui.getElement('publicHolidayEditForm');
				publicHolidayEditForm.show(false);
			}
		});
	}
}
PublicHolidayEditForm.prototype = new WuiElement();

PublicHolidayEditForm.prototype.show = function(show) {
	this.setAttribute('show', show?'yes':'no');
};

PublicHolidayEditForm.prototype.edit = function(userData) {
	this.userData = userData;
	this.view.date.setText(userData.publicHoliday.date.toDateString());
	this.view.shortName.setValue(userData.publicHoliday.shortName);
	this.view.deleted.setValue(userData.publicHoliday.deleted);
	this.show(true);
};

PublicHolidayEditForm.prototype.getValues = function(publicHoliday) {
	publicHoliday.shortName = this.view.shortName.getValue();
	publicHoliday.deleted = this.view.deleted.getValue();
};

function refreshAll() {
	wui.getElement('appMenu').render();
	wui.getElement('taskPlanner').render();
	switchTaskPlannerView(data.pref.plannerView==0?'weekPlanner':'dayPlanner');
}

function switchTaskPlannerView(view) {
	if (!view) {
		view = wui.getElement('taskPlanner').getAttribute('view');
		if (view == 'weekPlanner') 
			view = 'dayPlanner'; 
		else 
			view = 'weekPlanner';
	}
	wui.getElement('taskPlanner').setAttribute('view', view);
	wui.getElement('plannerSwitch').switchView(view);
}

function selectDate(date) {
	/* Call saveEditingItems to save Today Task if it is changed */
	saveEditingItems();

	data.pref.selectDate = date;
	wui.getElement('dayPlanner').render();
}

function changeWorkingJobfile(idx) {
	saveEditingItems();
	data.loadJobFileDetails(idx);
	data.workingJobfile = data.jobfiles[idx];
	refreshAll();
}

function showSettings(show) {
	var settings = wui.getElement('settings');
	var jobfileMaint = wui.getElement('jobfileMaint');
	
	jobfileMaint.render();
	settings.show(show);
}

function showJobFileForm(show, jobfile) {
	var jobfileForm = wui.getElement('jobfileForm');
	
	if (jobfile)
		jobfileForm.setJobFile(jobfile);
	jobfileForm.show(show);
}

function saveJobFile() {
	var jobfileForm = wui.getElement('jobfileForm');
	var jobfile = jobfileForm.getJobFile();
	var tmpId = jobfile.id;
	
	data.saveJobFile(jobfile);
	if (!tmpId) {
		refreshJobFiles();
	}
	
	jobfileForm.show(false);
}

function saveEditingItems() {
	if (data.updated) {
		var currentUpdateList = data.updateList;
		data.updateList = new UpdateList();
		data.updated = false;
		
		var saveList = {};
	
		/* Date Events */
		saveList.dateEvents = [];
		for (var i=0; i<currentUpdateList.dateEvents.length; i++) {
			saveList.dateEvents.push(currentUpdateList.dateEvents[i].getDateEvent());
			currentUpdateList.dateEvents[i].putUserData('changed', false);
		}
	
		/* Week Focuses */
		saveList.weekFocuses = [];
		for (var i=0; i<currentUpdateList.weekFocuses.length; i++) {
			saveList.weekFocuses.push(currentUpdateList.weekFocuses[i].getWeekFocus());
			currentUpdateList.weekFocuses[i].putUserData('changed', false);
		}
	
		/* Week Tasks */
		saveList.weekTasks = [];
		for (var i=0; i<currentUpdateList.weekTasks.length; i++) {
			saveList.weekTasks.push(currentUpdateList.weekTasks[i].getWeekTask());
			currentUpdateList.weekTasks[i].putUserData('changed', false);
		}
	
		/* Today Tasks */
		saveList.todayTasks = [];
		for (var i=0; i<currentUpdateList.todayTasks.length; i++) {
			saveList.todayTasks.push(currentUpdateList.todayTasks[i].getTodayTask());
			currentUpdateList.todayTasks[i].taskEditor.putUserData('changed', false);
		}
		
		data.saveItems(saveList);
			
		var appStatus = wui.getElement('appStatus');
		if (appStatus)
			appStatus.setText("");
		
	}
}

function refreshJobFiles() {
	var jobfileMaint = wui.getElement('jobfileMaint');
	jobfileMaint.render();
}

function showCalendarMaint(show) {
	var calendarMaint = wui.getElement('calendarMaint');
	
	data.loadPublicHolidays(2011,2012);
	calendarMaint.render();
	calendarMaint.show(show);
}