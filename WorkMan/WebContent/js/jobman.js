function Application(htmlId) {
	wui.popUncaughtErrors(true);
	
	this.setContext(htmlId);
	wui.putElement('app', this);
	
	this.appView = this.add(WuiWrapper, 'AppView', {id:'appView',attr:{view:'planner'}});
	if (this.appView) {
		this.appStatus = this.appView.add(WuiLabel, 'AppStatus');
		this.appMenu = this.appView.add(AppMenu, '', {id:'appMenu'});
		this.taskPlanner = this.appView.add(TaskPlanner, '', {id:'taskPlanner'});
		this.handbook = this.appView.add(Handbook);
	}
	
	/* Popup Forms */
	this.settings = this.add(Settings, '', {id:'settings'});
	this.calendarMaint = this.add(CalendarMaint, '', {id:'calendarMaint'});
	this.jobForm = this.add(JobForm);
	this.stageForm = this.add(StageForm);
	this.taskForm = this.add(TaskForm);
	this.taskNoteForm = this.add(JobTaskNoteForm);
	
	/* Load data */
	dwr.engine.setAsync(false);
	data.load();
	this.render();
	
	/* Start Timers */
	setTimeout("wui.getElement('app').autoSave();", data.pref.autoSaveInterval);
	this.pollServer();
}
Application.prototype = new WuiElement();

Application.prototype.render = function() {
	this.appMenu.render();
	this.taskPlanner.render();
	this.handbook.render();

	this.switchTaskPlannerView(data.pref.plannerView==0?'weekPlanner':'dayPlanner');
};

Application.prototype.refresh = function(refreshList) {
	this.appMenu.refresh(refreshList);
	this.taskPlanner.refresh(refreshList);
	this.handbook.refresh(refreshList);
	this.taskNoteForm.refresh(refreshList);
};

Application.prototype.switchTaskPlannerView = function(view) {
	if (!view) {
		view = this.taskPlanner.getAttribute('view');
		if (view == 'weekPlanner') 
			view = 'dayPlanner'; 
		else 
			view = 'weekPlanner';
	}
	this.taskPlanner.setAttribute('view', view);
	this.taskPlanner.plannerSwitch.switchView(view);
};

Application.prototype.autoSave = function() {
	var appStatus = this.appStatus;
	var offline = this.appMenu.offline;
	
	if (!offline.getValue() && data.updated) {
		if (appStatus)
			appStatus.setText("Saving...");
		
		setTimeout("wui.getElement('app').autoSaveNow();", 1);
	}
	else
		setTimeout("wui.getElement('app').autoSave();", data.pref.autoSaveInterval);
};

Application.prototype.pollServer = function() {
	var offline = this.appMenu.offline;

	if (offline && offline.getValue() == false)
		data.pollServer();
	setTimeout("wui.getElement('app').pollServer();", data.pollServerInterval);
};

Application.prototype.autoSaveNow = function() {
	saveEditingItems();
	setTimeout("wui.getElement('app').autoSave();", data.pref.autoSaveInterval);
};

function PopupForm(className, attr, callbacks) {
	this.newHtmlElement('div', 'Popup');
}
PopupForm.prototype = new WuiElement();

PopupForm.prototype.show = function(show) {
	this.setAttribute('show', show?'yes':'no');
};

function AppMenu(className, attr, callbacks) {
	this.newHtmlElement('div', 'AppMenu');
	var _this = this;
	
	this.jobFileSelector = this.add(WuiSelection, 'JobFileSelector', null, {
		change:function(evt) {
			changeWorkingJobfile(_this.jobFileSelector.getSelectedIdx());
		}
	});
	
	this.offline = this.add(WuiCheckboxField, '', {rearlabel:'Offline'});
	
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
	if (data.jobfiles.length > 0) {
		if (!data.workingJobfile) data.workingJobfile = data.jobfiles[0];
		
		for (var i=0; i<data.jobfiles.length; i++) {
			options.addOption('', {text:data.jobfiles[i].filename,userData:data.jobfiles[i]});
			if (data.jobfiles[i].id == data.workingJobfile.id)
				options.setSelectedIdx(i);
		}
	}
};

AppMenu.prototype.refresh = function(refreshList) {
	if (!refreshList || refreshList.found(data.jobfiles)) {
		this.jobFileSelector.removeChildElements();
		this.render();
	}
};

function TaskPlanner(className, attr, callbacks) {
	this.newHtmlElement('div', 'TaskPlanner', {attr:{view:'weekPlanner'}});
}
TaskPlanner.prototype = new WuiElement();

TaskPlanner.prototype.render = function() {
	this.weekPlanner = this.add(WeekPlanner);
	this.plannerSwitch = this.add(PlannerSwitch);
	this.dayPlanner = this.add(DayPlanner);

	this.weekPlanner.render();
	this.plannerSwitch.render();
	this.dayPlanner.render();
};

TaskPlanner.prototype.refresh = function(refreshList) {
	if (!refreshList) {
		this.removeChildElements();
		this.render();
	}
	else {
		this.weekPlanner.refresh(refreshList);
		this.plannerSwitch.refresh(refreshList);
		this.dayPlanner.refresh(refreshList);
	}
};

function WeekPlanner(className, attr, callbacks) {
	this.newHtmlElement('div', 'WeekPlanner');
	
	this.menu = this.add(WeekPlannerMenu);
	this.calendar = this.add(WeekPlannerCalendar);
}
WeekPlanner.prototype = new WuiElement();

WeekPlanner.prototype.render = function() {
	this.menu.render();
	this.calendar.render();
};

WeekPlanner.prototype.refresh = function(refreshList) {
	if (!refreshList) {
		this.removeChildElements();
		this.render();
	}
	else {
		this.menu.refresh(refreshList);
		this.calendar.refresh(refreshList);
	}
};

function WeekPlannerMenu(className, attr, callbacks) {
	this.newHtmlElement('div', 'WeekPlannerMenu');
	
	this.headerDiv = this.add(WuiWrapper, 'HeaderDiv');
	this.add(WuiButton, '', {text:'Edit'}, {click:function(evt) {showCalendarMaint(true);}});
}
WeekPlannerMenu.prototype = new WuiElement();

WeekPlannerMenu.prototype.render = function() {
	for (var i=0; i<7; i++) {
		this.headerDiv.add(WuiLabel, 'WeekdayLabel', {text:data.weekdayLabels[i+data.pref.startingWeekday]});
	}
};

WeekPlannerMenu.prototype.refresh = function(refreshList) {
	if (!refreshList || refreshList.found(data.pref)) {
		this.headerDiv.removeChildElements();
		this.render();
	}
};

function WeekPlannerCalendar(className, attr, callbacks) {
	this.newHtmlElement('div', 'WeekPlannerCalendar');
	
	this.table = this.add(WuiTable);
	
}
WeekPlannerCalendar.prototype = new WuiElement();

WeekPlannerCalendar.prototype.render = function() {
	this.weekRows = [];
	
	var startDate = data.pref.startDate;
	for (var weekNum=0; weekNum<data.pref.numWeeks; weekNum++) {
		var weekFromDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + weekNum*7);
		var weekToDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + weekNum*7 + 6);

		var weekRow = this.table.add(WeekRow);
		weekRow.render(weekNum, weekFromDate, weekToDate);
		this.weekRows.push(weekRow);
	}
};

WeekPlannerCalendar.prototype.refresh = function(refreshList) {
	if (!refreshList || refreshList.found(data.pref)) {
		this.table.removeChildElements();
		this.render();
	}
	else {
		for (var a in this.weekRows)
			this.weekRows[a].refresh(refreshList);
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
					dayCell.add(WuiLabel, 'Evt', {text:event});
				}
			}
			date.setDate(date.getDate() + 1);
		}
	}
};

function WeekRow(className, attr, callbacks) {
	this.newHtmlElement('tr', 'WeekRow', attr);
}
WeekRow.prototype = new WuiElement();

WeekRow.prototype.render = function(weekIdx, fromDate, toDate) {
	var today = wui.dateUtil.getToday();
	this.fromDate = fromDate;
	this.toDate = toDate;
	
	var refDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate()+data.pref.refWeekDay-data.pref.startingWeekday);
	if (refDate.getMonth() % 2 == 0)
		this.addClass('OddMonth');
	else
		this.addClass('EvenMonth');

	var monthCell = this.add(MonthCell);
	monthCell.render(refDate, weekIdx);
	
	for (var i=0; i<7; i++) {
		var date = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate()+i);
		
		var dayCell = this.add(DayCell);
		dayCell.render(date);
	}
	
	this.weekFocus = this.add(WuiTableCell, 'WeekFocusCell').add(WeekFocus);
	this.weekFocus.render(fromDate, toDate);

	this.weekTask = this.add(WuiTableCell, 'WeekTaskCell').add(WeekTask);
	this.weekTask.render(fromDate, toDate);
};

WeekRow.prototype.refresh = function(refreshList) {
	this.weekFocus.refresh(refreshList);
	this.weekTask.refresh(refreshList);
};

function MonthCell(className, attr, callbacks) {
	this.newHtmlElement('td', 'MonthCell');
}
MonthCell.prototype = new WuiElement();

MonthCell.prototype.render = function(refDate, weekIdx) {
	if (refDate.getDate() <= 7 || weekIdx == 0)
		this.setText(data.monthLabels[refDate.getMonth()]);
};

MonthCell.prototype.refresh = function(refreshList) {
};

function DayCell(className, attr, callbacks) {
	this.newHtmlElement('td', 'DayCell');
}
DayCell.prototype = new WuiElement();

DayCell.prototype.render = function(date) {
	var _this = this;
	this.date = date;
	
	var ph = data.getPublicHoliday(date);
	if (ph) {
		this.setAttribute('evt', 'ph');
		this.add(WuiLabel, 'PH', {text:ph.shortName});
	}
	
	var evt = data.getDateEvent(date);
	if (evt) {
		this.add(WuiLabel, 'Evt', {text:evt.event});
	}
	
	var today = wui.dateUtil.getToday();
	if (date.valueOf() < today.valueOf()) this.addClass('Yesterday');
	else if (date.valueOf() == today.valueOf()) this.addClass('Today');
	
	switch (date.getDay()) {
	case 0:
		this.setAttribute('weekend', 'sun');
		break;
	case 6:
		this.setAttribute('weekend', 'sat');
		break;
	}
	
	this.add(WuiLabel, 'Day', {text:date.getDate()});

	this.addEventListener('click',function(evt) {
		var app = _this.findParent(Application);
		app.switchTaskPlannerView('dayPlanner');
		selectDate(_this.date);
	});
};

DayCell.prototype.refresh = function(refreshList) {
	if (!refreshList) {
		this.removeChildElements();
		this.render();
	}
};

function WeekFocus(className, attr, callbacks) {
	this.newHtmlElement('ul', 'WeekFocus');
}
WeekFocus.prototype = new WuiElement();

WeekFocus.prototype.render = function(fromDate, toDate) {
	if (fromDate) this.fromDate = fromDate;	else fromDate = this.fromDate;
	if (toDate) this.toDate = toDate; else toDate = this.toDate;
	
	var jobs = data.getJobs(data.workingJobfile, fromDate, toDate);
	var stages = data.getJobStages(data.workingJobfile.jobs, fromDate, toDate);
	var _this = this;
	var focuses = [];
	
	/* insert jobs that has no stage */
	for (var a in jobs) {
		if (jobs[a].stages.length == 0)
			focuses.push({startDate:jobs[a].startDate,endDate:jobs[a].endDate,job:jobs[a]});
	}
	
	/* insert job stages */
	for (b in stages) {
		focuses.push({startDate:stages[b].startDate,endDate:stages[b].endDate,stage:stages[b]});
	}
	
	focuses.sort(
		function(a,b) {
			if (a.endDate.valueOf()-b.endDate.valueOf() != 0)
				return a.endDate.valueOf()-b.endDate.valueOf();
			else
				return a.startDate.valueOf()-b.startDate.valueOf();
		});
	
	this.items = [];
	for (var i in focuses) {
		var item = this.add(WeekFocusItem);
		item.render(focuses[i]);
		this.items.push(item);
	}
};

WeekFocus.prototype.refresh = function(refreshList) {
	/* cannot apply refreshList because the elements are date sensitive */
	this.removeChildElements();
	this.render();
};

function WeekFocusItem(className, attr, callbacks) {
	this.newHtmlElement('li', 'WeekFocusItem');
}
WeekFocusItem.prototype = new WuiElement();

WeekFocusItem.prototype.render = function(focus) {
	var _this = this;
	if (focus) this.weekFocus = focus; else focus = this.weekFocus;
	
	this.desc = this.add(WuiText, '', {tag:'span'});
	if (focus.stage)
		this.desc.setText(focus.stage.job.name + ' ' + focus.stage.name);
	else
		this.desc.setText(focus.job.name);

	var addTask = this.add(WuiLink, 'AddTask');
	if (addTask) {
		addTask.addEventListener('click',
			function(evt) {
				var focus = _this.weekFocus;
				var app = _this.findParent(Application);
				var weekRow = _this.findParent(WeekRow);
				var refDate = new Date(weekRow.fromDate.getFullYear(), weekRow.fromDate.getMonth(), weekRow.fromDate.getDate());
				if (wui.dateUtil.getToday().valueOf() > weekRow.fromDate.valueOf() && wui.dateUtil.getToday().valueOf() <= weekRow.toDate.valueOf())
					refDate = wui.dateUtil.getToday();
				
				var newJob = new JobTask(focus.job?focus.job:focus.stage.job, focus.stage);
				newJob.refDate = refDate;
				app.taskForm.edit(newJob);
			});
	}
};

WeekFocusItem.prototype.refresh = function(refreshList) {
	if (!refreshList) {
		this.removeChildElements();
		this.render();
	}
	else if (refreshList.found(this.weekFocus.job) || refreshList.found(this.weekFocus.stage) || refreshList.found(this.weekFocus.stage?this.weekFocus.stage.job:null)) {
		var focus = this.weekFocus;
		if (focus.stage)
			this.desc.setText(focus.stage.job.name + ' ' + focus.stage.name);
		else
			this.desc.setText(focus.job.name);
	}
};

function WeekTask(className, attr, callbacks) {
	this.newHtmlElement('div', 'WeekTask');
}
WeekTask.prototype = new WuiElement();

WeekTask.prototype.render = function(fromDate, toDate) {
	if (fromDate) this.fromDate = fromDate; else fromDate = this.fromDate;
	if (toDate) this.toDate = toDate; else toDate = this.toDate;
	var tasks = data.getJobTasks(data.workingJobfile.jobs, null, fromDate, toDate);
	var _this = this;
	var app = this.findParent(Application);

	this.taskList = this.add(WuiList);

	/* insert job stages */
	for (a in tasks) {
		var item = this.taskList.add(WuiListItem, '', {userData:{task:tasks[a]}});
		if (item) {
			item.add(WuiCheckbox, 'Done', {checked:tasks[a].done},{
				click:function(evt) {
					var task = evt.currentTarget.parentElement.userData.task;
					task.done = evt.currentTarget.checked;
					var refreshList = data.saveJobTask(task);
					app.refresh(refreshList);
				}
			});
			if (tasks[a].due)
				item.add(WuiText, 'DueDate', {text:tasks[a].refDate.getDate()+'/'+(tasks[a].refDate.getMonth()+1),attr:{contentEditable:'false'}});
			else
				item.add(WuiText, 'DueDate', {text:'',attr:{contentEditable:'false'}});
			var text = item.add(WuiText, 'TaskDesc', {text:tasks[a].desc,attr:{contentEditable:'false'}}, {
				click:function(evt) {
					if (evt.srcElement == evt.currentTarget) {
						var app = _this.findParent(Application);
						var task = evt.currentTarget.parentElement.userData.task;
						app.taskForm.edit(task);
					}
				}});
			if (text) {
				var noteLink = text.add(WuiLink, 'NoteLink', {userData:{task:tasks[a]}});
				if (noteLink) {
					var noteLinks = data.getJobTaskNoteLinks(tasks[a]);
					if (noteLinks.length > 0) {
						noteLink.setAttribute('withNote','yes');
					}
					else {
						noteLink.setAttribute('withNote','no');
					}
					noteLink.addEventListener('click', function(evt) {
						if (evt.srcElement == evt.currentTarget) {
							var task = evt.currentTarget.userData.task;
							var app = _this.findParent(Application);
							app.taskNoteForm.show(task);
						}
				});
				}
			}
//			item.add(WuiLink, 'EditTask', null, {
//				click:function(evt) {
//					var app = _this.findParent(Application);
//					var task = evt.currentTarget.parentElement.userData.task;
//					app.taskForm.edit(task);
//				}
//			});
//			item.add(WuiLink, 'DelTask');
		}
	}
};

WeekTask.prototype.refresh = function(refreshList) {
	/* refreshList not applicable because the elements are date sensitive */
	this.removeChildElements();
	this.render();
};

function PlannerSwitch(className, attr, callbacks) {
	this.newHtmlElement('button', 'PlannerSwitch');
	this.addEventListener('click', function(evt) {
		wui.getElement('app').switchTaskPlannerView();
	});
}
PlannerSwitch.prototype = new WuiElement();

PlannerSwitch.prototype.render = function() {
};

PlannerSwitch.prototype.refresh = function(refreshList) {
};

PlannerSwitch.prototype.switchView = function(view) {
	if (view == 'weekPlanner')
		this.setText('<');
	else
		this.setText('>');
	
};

function DayPlanner(className, attr, callbacks) {
	this.newHtmlElement('div', 'DayPlanner');
}
DayPlanner.prototype = new WuiElement();

DayPlanner.prototype.render = function() {
	var _this = this;
	
	this.dayHighlight = this.add(WuiWrapper, 'DayHighlight');
	if (this.dayHighlight) {
		this.dayHighlight.date = this.dayHighlight.add(WuiLabel, 'Date');
		this.dayHighlight.weekday = this.dayHighlight.add(WuiLabel, 'Weekday');
		this.dayHighlight.ph = this.dayHighlight.add(WuiLabel, 'PH');
		this.dayHighlight.evt = this.dayHighlight.add(WuiText, 'Evt', {attr:{contentEditable:'true'},userData:{date:null,dateEvent:null,changed:false,wuiElement:this}}, {
			keyup:function(evt) {
				var srcElement = evt.srcElement;
				var userData = srcElement.userData;
				
				if (!userData.changed) {
					userData.changed = true;
					data.updateList.dateEvents.push(srcElement.userData.wuiElement);
					data.updated = true;
					var app = _this.findParent(Application);
					app.appStatus.setText('Editing');
				}
			},
			blur:function(evt) {
				var srcElement = evt.srcElement;
				var taskPlanner = _this.findParent(TaskPlanner);
				var weekPlannerCalendar = taskPlanner.weekPlanner.calendar;
				weekPlannerCalendar.setTempDateEvent(srcElement.userData.date, srcElement.innerText);
			}
		});
	}
	
	this.taskEditor = this.add(WuiWrapper, 'TaskEditor', {contentEditable:'true',userData:{date:null,changed:false,wuiElement:this}}, {
		keyup:function(evt) {
			var htmlElement = evt.currentTarget;
			if (!htmlElement.userData.changed) {
				htmlElement.userData.changed = true;
				data.updateList.todayTasks.push(htmlElement.userData.wuiElement);
				data.updated = true;
				var app = _this.findParent(Application);
				app.appStatus.setText('Editing');
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
				var app = _this.findParent(Application);
				app.appStatus.setText('Editing');
			}
		}
	});

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

DayPlanner.prototype.refresh = function(refreshList) {
	this.removeChildElements();
	this.render();
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

function Settings(className, attr, callbacks) {
	this.addClass('Settings');
	
	var view = this.add(WuiWrapper, 'View');
	if (view) {
		var menu = view.add(WuiWrapper, 'Menu');
		if (menu) {
			menu.add(WuiWrapper, 'CloseBtn', null, {click:function(evt) {showSettings(false);}});
		}
		
		var sections = view.add(WuiWrapper, 'Sections');
		if (sections) {
			sections.add(JobFileMaint, '', {id:'jobfileMaint'});
			sections.add(PrefMaint, '', {id:'prefMaint'});
		}
	}
	
	this.add(JobFileForm, '', {id:'jobfileForm'});
}
Settings.prototype = new PopupForm();

function JobFileMaint(className, attr, callbacks) {
	this.newHtmlElement('div', 'JobFileMaint');
	
	this.add(WuiText, '', {text:'Job File Maintenance', tag:'h2'});
	this.add(WuiButton, '', {text:'New'}, {
		click:function(evt) {
			showJobFileForm(true, new JobFile());
		}
	});
	
	this.table = this.add(WuiTable);
	var headerRow = this.table.add(WuiTableHeader).add(WuiTableRow);
	headerRow.add(WuiTableCell, 'ColShow', {text:'Show'});
	headerRow.add(WuiTableCell, 'ColJobFileName', {text:'Job File Name'});
	headerRow.add(WuiTableCell, 'ColRemarks', {text:'Remarks'});
	
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

function JobFileForm(className, attr, callbacks) {
	var _this = this;
	this.addClass('JobFileForm');
	
	var view = this.add(WuiWrapper, 'View');
	if (view) {
		view.add(WuiText, '', {text:'New Job File', tag:'h2'});
		this.fieldJobFileName = view.add(WuiTextField, '', {label:'Job File Name'});
		this.fieldRemarks = view.add(WuiTextAreaField, '', {label:'Remarks'});
		this.fieldDeleted = view.add(WuiCheckboxField, '', {label:'Delete?'});
		view.add(WuiButton, '', {text:'Save'}, {click:function(evt) {_this.saveJobFile();}});
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

JobFileForm.prototype.saveJobFile = function() {
	var jobfile = this.getJobFile();
	var tmpId = jobfile.id;
	
	var refreshList = data.saveJobFile(jobfile);
	var app = this.findParent(Application);
	app.refresh(refreshList);
	
	this.show(false);
};

function PrefMaint(className, attr, callbacks) {
	this.newHtmlElement('div', 'PrefMaint');

	this.add(WuiText, '', {text:'Preferences', tag:'h2'});
}
PrefMaint.prototype = new WuiElement();

function CalendarMaint(className, attr, callbacks) {
	this.newHtmlElement('div', 'CalendarMaint Popup');
	
	this.view = this.add(WuiWrapper, 'CalendarMaintView');
	this.publicHolidayEditForm = this.add(PublicHolidayEditForm);
	
}
CalendarMaint.prototype = new WuiElement();

CalendarMaint.prototype.show = function(show) {
	if (show)
		this.setAttribute('show', 'yes');
	else
		this.setAttribute('show', 'no');
};

CalendarMaint.prototype.render = function() {
	var _this = this;
	var today = new Date();
	this.view.removeChildElements();
	
	for (var y=0; y<2; y++) {
		var year = today.getFullYear() + y;
		
		this.view.add(WuiText, '', {text:year,tag:'h2'});
		
		for (var month=0; month<12; month++) {
			var monthDiv = this.view.add(WuiWrapper, 'MonthDiv');
			if (monthDiv) {
				monthDiv.add(WuiText, '', {text:data.monthLabels[month],tag:'h3'});
				var weekDiv = monthDiv.add(WuiWrapper, 'WeekDiv');
				for (var day=0; day<7; day++) {
					weekDiv.add(WuiLabel, 'WeekDayLabel', {text:data.weekdayLabels[day]});
				}
								
				var date = new Date(year, month, 1);
				
				while (date.getMonth() == month) {
					var weekDiv = monthDiv.add(WuiWrapper, 'WeekDiv');
					for (var day=0; day<7 && date.getMonth() == month; day++) {
						var publicHoliday = data.getPublicHoliday(date);
						if (!publicHoliday) {
							publicHoliday = new PublicHoliday();
							publicHoliday.date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
						}
						
						var dayLabel = weekDiv.add(WuiLabel, 'DayLabel', null, {
							click:function(evt) {
								var e = evt.currentTarget;
								var publicHolidayEditForm = _this.publicHolidayEditForm;
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

function PublicHolidayEditForm(className, attr, callbacks) {
	this.newHtmlElement('div', 'PublicHolidayEditForm Popup');
	var _this = this;
	
	this.view = this.add(WuiWrapper);
	if (this.view) {
		this.view.date = this.view.add(WuiText);
		this.view.shortName = this.view.add(WuiTextField, '', {label:'Short Name'});
		this.view.deleted = this.view.add(WuiCheckboxField, '', {label:'Delete?'});
		this.view.add(WuiButton, '', {text:'Save'}, {
			click:function (evt) {
				_this.getValues(_this.userData.publicHoliday);
				var refreshList = data.savePublicHoliday(_this.userData.publicHoliday);
				_this.userData.wuiElement.addClass('PH');
				_this.show(false);
				var app = _this.findParent(Application);
				app.refresh(refreshList);
			}
		});
		this.view.add(WuiButton, '', {text:'Cancel'}, {
			click:function(evt) {
				_this.show(false);
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

function selectDate(date) {
	/* Call saveEditingItems to save Today Task if it is changed */
	saveEditingItems();

	data.pref.selectDate = date;
	var app = wui.getElement('app');
	app.taskPlanner.dayPlanner.refresh();
}

function changeWorkingJobfile(idx) {
	saveEditingItems();
	data.loadJobFileDetails(idx);
	data.workingJobfile = data.jobfiles[idx];
	
	var app = wui.getElement('app');
	app.refresh();
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
		
		var refreshList = data.saveItems(saveList);
			
		var app = wui.getElement('app');
		var appStatus = app.appStatus;
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

function Handbook(className, attr, callbacks) {
	this.newHtmlElement('div', 'Handbook', {attr:{activeSection:'none'}});
}
Handbook.prototype = new WuiElement();

Handbook.prototype.render = function() {
	var _this = this;
	
	this.menu = this.add(HandbookMenu);
	this.sections = this.add(WuiWrapper, 'HandbookSections');
	if (this.sections) {
		this.jobbook = this.sections.add(Jobbook);
		this.notebook = this.sections.add(Notebook);
	}

	this.menu.render();
	this.jobbook.render();
	this.notebook.render();
};

Handbook.prototype.refresh = function(refreshList) {
	if (!refreshList) {
		this.removeChildElements();
		this.render();
	}
	else {
		this.menu.refresh(refreshList);
		this.jobbook.refresh(refreshList);
		this.notebook.refresh(refreshList);
	}
};

Handbook.prototype.switchSection = function(section) {
	this.setAttribute('activeSection', section);
};

Handbook.prototype.editJob = function(job) {
	var app = this.findParent(Application);
	app.jobForm.edit(job);
};

function HandbookMenu(className, attr, callbacks) {
	this.newHtmlElement('div', 'HandbookMenu');
	var _this = this;
	
	this.add(WuiLink, 'SectionSwitch Planner', {text:'Planner'}, {click:function(evt) {_this.switchSection('planner');}});
	this.add(WuiLink, 'SectionSwitch Jobs', {text:'Jobs'}, {click:function(evt) {_this.switchSection('jobbook');}});
	this.add(WuiLink, 'SectionSwitch Notes', {text:'Notes'}, {click:function(evt) {_this.switchSection('notebook');}});
}
HandbookMenu.prototype = new WuiElement();

HandbookMenu.prototype.switchSection = function(section) {
	var app = this.findParent(Application);
	var handbook = this.findParent(Handbook);
	
	appViews = {'planner':'planner','jobbook':'normal','notebook':'normal'};
	
	app.appView.setAttribute('view',appViews[section]);
	handbook.switchSection(section);
};

function Jobbook(className, attr, callbacks) {
	this.newHtmlElement('div', 'Jobbook');
}
Jobbook.prototype = new WuiElement();

Jobbook.prototype.render = function() {
	this.jobList = this.add(JobList);
	this.jobList.render();

	this.stageList = this.add(StageList);
	this.stageList.render();

	this.taskList = this.add(TaskList);
	this.taskList.render();
};

Jobbook.prototype.refresh = function(refreshList) {
	if (!refreshList) {
		this.removeChildElements();
		this.render();
	}
	else {
		this.jobList.refresh(refreshList);
		this.stageList.refresh(refreshList);
		this.taskList.refresh(refreshList);
	}
};

function JobList(className, attr, callbacks) {
	this.newHtmlElement('div', 'JobList');
	var _this = this;
	
	this.title = this.add(WuiText, '', {tag:'h2',text:'Jobs'});
	this.add(WuiButton, 'BtnNew', {text:'New'}, {click:function(evt) {_this.editJob(new Job(data.workingJobfile));}});
	this.list = this.add(WuiList);
}
JobList.prototype = new WuiElement();

JobList.prototype.render = function() {
	var app = this.findParent(Application);
	var jobs = data.getJobs(data.workingJobfile);
	
	if (jobs.length>0) data.workingJob = jobs[0]; else data.workingJob = null;
	
	this.items = [];
	for (var a in jobs) {
		var job = jobs[a];
		
		var item = this.list.add(JobListItem);
		if (item) {
			item.render(job);
			this.items.push(item);
		}
	}
};

JobList.prototype.refresh = function(refreshList) {
	if (!refreshList || refreshList.found(data.workingJobfile.jobs)) {
		this.list.removeChildElements();
		this.render();
	}
	else {
		for (var a in this.items)
			this.items[a].refresh(refreshList);
	}
};

JobList.prototype.editJob = function(job) {
	var app = this.findParent(Application);
	app.jobForm.edit(job);
};

function JobListItem(className, attr, callbacks) {
	this.newHtmlElement('li', 'JobListItem');
}
JobListItem.prototype = new WuiElement();

JobListItem.prototype.render = function(job) {
	this.data = {job:job};
	var _this = this;

	this.radio = this.add(WuiRadioButton, '', {name:'job',checked:job.id == data.workingJob.id});
	this.text = this.add(WuiText, '', {text:job.name + ' (' + data.format(job.endDate) + ')'});
	this.add(WuiWrapper, 'BtnEdit', null, {click:function(evt) {_this.editJob();}});

	this.addEventListener('click', function(evt) {
		if (evt.srcElement instanceof HTMLParagraphElement || evt.srcElement instanceof HTMLInputElement)
			_this.selectMe();
	});
};

JobListItem.prototype.refresh = function(refreshList) {
	if (!refreshList || refreshList.found(this.data.job)) {
		var job = this.data.job;
		this.text.setText(job.name + ' (' + data.format(job.endDate) + ')');
	}
};

JobListItem.prototype.editJob = function() {
	var app = this.findParent(Application);
	app.jobForm.edit(this.data.job);
};

JobListItem.prototype.selectMe = function() {
	this.radio.setValue(true);
	data.workingJob = this.data.job;
	data.workingJobStage = null;

	var jobbook = this.findParent(Jobbook);
	jobbook.stageList.refresh(null);
	jobbook.taskList.refresh(null);
};

function StageList(className, attr, callbacks) {
	this.newHtmlElement('div', 'StageList');
	var _this = this;
	
	this.title = this.add(WuiText, '', {tag:'h2',text:'Stages'});
	this.add(WuiButton, 'BtnNew', {text:'New'}, {click:function(evt) {_this.editJobStage(new JobStage(data.workingJob));}});
	this.list = this.add(WuiList);
}
StageList.prototype = new WuiElement();

StageList.prototype.render = function() {
	var app = this.findParent(Application);
	
	if (data.workingJob) {
		this.title.setText('Stages (' + data.workingJob.name + ')');

		var stages = data.getJobStages([data.workingJob]);
		this.items = [];
		for (var a in stages) {
			var stage = stages[a];
			var item = this.list.add(StageListItem);
			item.render(stage);
			this.items.push(item);
		}
	}
	else {
		this.title.setText('Stages');
	}
};

StageList.prototype.refresh = function(refreshList) {
	if (!refreshList || refreshList.found(data.workingJob.stages)) {
		this.list.removeChildElements();
		this.render();
	}
	else {
		for (var a in this.items)
			this.items[a].refresh(refreshList);
	}
};

StageList.prototype.editJobStage = function(stage) {
	var app = this.findParent(Application);
	app.stageForm.edit(stage);
};

function StageListItem(className, attr, callbacks) {
	this.newHtmlElement('li', 'StageListItem');
}
StageListItem.prototype = new WuiElement();

StageListItem.prototype.render = function(stage) {
	this.data = {stage:stage};
	var _this = this;

	this.radio = this.add(WuiRadioButton, '', {name:'stage',checked:data.workingJobStage && stage.id == data.workingJobStage.id});
	this.text = this.add(WuiText, '', {text:stage.name + ' (' + data.format(stage.startDate) + '~' + data.format(stage.endDate) + ')'});
	this.add(WuiWrapper, 'BtnEdit', null, {click:function(evt) {_this.editStage();}});

	this.addEventListener('click', function(evt) {
		if (evt.srcElement instanceof HTMLParagraphElement || evt.srcElement instanceof HTMLInputElement)
			_this.selectMe();
	});
};

StageListItem.prototype.refresh = function(refreshList) {
	if (!refreshList || refreshList.found(this.data.stage)) {
		var stage = this.data.stage;
		this.text.setText(stage.name + ' (' + data.format(stage.startDate) + '~' + data.format(stage.endDate) + ')');
	}
};

StageListItem.prototype.editStage = function() {
	var app = this.findParent(Application);
	app.stageForm.edit(this.data.stage);
};

StageListItem.prototype.selectMe = function() {
	this.radio.setValue(true);
	data.workingJobStage = this.data.stage;

	var jobbook = this.findParent(Jobbook);
	jobbook.taskList.refresh(null);
};

function TaskList(className, attr, callbacks) {
	this.newHtmlElement('div', 'TaskList');
}
TaskList.prototype = new WuiElement();

TaskList.prototype.render = function() {
	var app = this.findParent(Application);
	
	var _this = this;
	
	this.title = this.add(WuiText, '', {tag:'h2',text:'Tasks'});
	this.add(WuiButton, 'BtnNew', {text:'New'}, {click:function(evt) {_this.editTask(new JobTask(data.workingJob, data.workingJobStage));}});
	this.list = this.add(WuiList);

	if (data.workingJob) {
		this.title.setText('Tasks (' + data.workingJob.name + (data.workingJobStage?' ' + data.workingJobStage.name:'') + ')');

		var tasks = data.getJobTasks([data.workingJob], data.workingJobStage?[data.workingJobStage]:null);
		for (var a in tasks) {
			var task = tasks[a];
			var item = this.list.add(WuiListItem);
			if (item) {
				item.checkbox = item.add(WuiCheckbox, '', {checked:task.done});
				item.add(WuiText, '', {text:task.desc + ' (' + data.format(task.refDate) + ')'});
				item.add(WuiWrapper, 'BtnEdit');
				
				item.setUserData({task:task,wuiElement:item});
				item.addEventListener('click', function(evt) {
					if (evt.srcElement instanceof HTMLDivElement) {
						app.taskForm.edit(evt.currentTarget.userData.task);
					}
					else {
						var item = evt.currentTarget.userData.wuiElement;
						var task = evt.currentTarget.userData.task;
						task.done = !task.done;
						item.checkbox.setValue(task.done);
						
						var refreshList = data.saveJobTask(task);
						app.refresh(refreshList);
					}
				});
			}
		}
	}
	else {
		this.title.setText('Tasks');
	}
};

TaskList.prototype.refresh = function(refreshList) {
	this.removeChildElements();
	this.render();
};

TaskList.prototype.editTask = function(jobTask) {
	var app = this.findParent(Application);
	app.taskForm.edit(jobTask);
};

function JobForm(className, attr, callbacks) {
	var _this = this;
	
	this.form = this.add(WuiWrapper, 'JobForm');
	if (this.form) {
		this.form.title = this.form.add(WuiText, '', {tag:'h2',text:'Job'});
		this.form.name = this.form.add(WuiTextField, '', {label:'Name'});
		this.form.startDate = this.form.add(WuiTextField, '', {label:'Start Date'});
		this.form.endDate = this.form.add(WuiTextField, '', {label:'End Date'});
		this.form.remarks = this.form.add(WuiTextField, '', {label:'Remarks'});
		this.form.jobfile = this.form.add(WuiTextField, '', {label:'Job File'});
		this.form.deleted = this.form.add(WuiCheckboxField, '', {label:'Delete?'});
		
		var buttonDiv = this.form.add(WuiWrapper, 'Buttons');
		if (buttonDiv) {
			buttonDiv.add(WuiButton, '', {text:'Save'}, {
				click:function(evt) {
					_this.save();
				}	
			});
			
			buttonDiv.add(WuiButton, '', {text:'Cancel'}, {
				click:function(evt) {
					_this.cancel();
				}
			});
		}
	}
}
JobForm.prototype = new PopupForm();

JobForm.prototype.edit = function(job) {
	this.job = job;
	
	this.form.title.setText('Job ' + (job.id?'(Edit)':'(New)'));
	this.form.name.setValue(job.name);
	this.form.startDate.setValue(data.format(job.startDate));
	this.form.endDate.setValue(data.format(job.endDate));
	this.form.remarks.setValue(job.remarks);
	this.form.jobfile.setValue(job.jobfile.filename);
	this.form.deleted.setValue(job.deleted);

	this.show(true);
};

JobForm.prototype.save = function() {
	var isNew = !this.job.id;
	
	this.job.name = this.form.name.getValue();
	this.job.startDate = data.parseString(new Date(0), this.form.startDate.getValue());
	this.job.endDate = data.parseString(new Date(0), this.form.endDate.getValue());
	this.job.remarks = this.form.remarks.getValue();
	this.job.deleted = this.form.deleted.getValue();
	
	var refreshList = data.saveJob(this.job);
	
	this.show(false);
	
	var app = this.findParent(Application);
	app.refresh(refreshList);
};

JobForm.prototype.cancel = function() {
	this.show(false);
};

function StageForm(className, attr, callbacks) {
	var _this = this;
	
	this.form = this.add(WuiWrapper, 'StageForm');
	if (this.form) {
		this.form.title = this.form.add(WuiText, '', {tag:'h2',text:'Job Stage'});
		this.form.name = this.form.add(WuiTextField, '', {label:'Name'});
		this.form.startDate = this.form.add(WuiTextField, '', {label:'Start Date'});
		this.form.endDate = this.form.add(WuiTextField, '', {label:'End Date'});
		this.form.remarks = this.form.add(WuiTextField, '', {label:'Remarks'});
		this.form.job = this.form.add(WuiTextField, '', {label:'Job'});
		this.form.deleted = this.form.add(WuiCheckboxField, '', {label:'Delete?'});
		
		var buttonDiv = this.form.add(WuiWrapper, 'Buttons');
		if (buttonDiv) {
			buttonDiv.add(WuiButton, '', {text:'Save'}, {
				click:function(evt) {
					_this.save();
				}	
			});
			
			buttonDiv.add(WuiButton, '', {text:'Cancel'}, {
				click:function(evt) {
					_this.cancel();
				}
			});
		}
	}
}
StageForm.prototype = new PopupForm();

StageForm.prototype.edit = function(stage) {
	this.stage = stage;
	
	this.form.title.setText('Job Stage ' + (stage.id?'(Edit)':'(New)'));
	this.form.name.setValue(stage.name);
	this.form.startDate.setValue(data.format(stage.startDate));
	this.form.endDate.setValue(data.format(stage.endDate));
	this.form.remarks.setValue(stage.remarks);
	this.form.job.setValue(stage.job.name);
	this.form.deleted.setValue(stage.deleted);

	this.show(true);
};

StageForm.prototype.save = function() {
	this.stage.name = this.form.name.getValue();
	this.stage.startDate = data.parseString(new Date(0), this.form.startDate.getValue());
	this.stage.endDate = data.parseString(new Date(0), this.form.endDate.getValue());
	this.stage.remarks = this.form.remarks.getValue();
	this.stage.deleted = this.form.deleted.getValue();
	
	var refreshList = data.saveJobStage(this.stage);
	
	this.show(false);
	
	var app = this.findParent(Application);
	app.refresh(refreshList);
};

StageForm.prototype.cancel = function() {
	this.show(false);
};

function TaskForm(className, attr, callbacks) {
	var _this = this;
	
	this.form = this.add(WuiWrapper, 'TaskForm');
	if (this.form) {
		this.form.title = this.form.add(WuiText, '', {tag:'h2',text:'Job Task'});
		this.form.job = this.form.add(WuiTextField, '', {label:'Job'});
		this.form.stage = this.form.add(WuiTextField, '', {label:'Stage'});
		this.form.desc = this.form.add(WuiTextField, 'Desc', {label:'Description'});
		this.form.refDate = this.form.add(WuiTextField, '', {label:'Ref Date'});
		this.form.due = this.form.add(WuiCheckboxField, '', {label:'Due Date?'});
		this.form.done = this.form.add(WuiCheckboxField, '', {label:'Done?'});
		this.form.remarks = this.form.add(WuiTextField, '', {label:'Remarks'});
		this.form.deleted = this.form.add(WuiCheckboxField, '', {label:'Delete?'});
		
		var buttonDiv = this.form.add(WuiWrapper, 'Buttons');
		if (buttonDiv) {
			buttonDiv.add(WuiButton, '', {text:'Save'}, {
				click:function(evt) {
					_this.save();
				}	
			});
			
			buttonDiv.add(WuiButton, '', {text:'Cancel'}, {
				click:function(evt) {
					_this.cancel();
				}
			});
		}
	}
}
TaskForm.prototype = new PopupForm();

TaskForm.prototype.edit = function(task) {
	this.task = task;
	
	this.form.title.setText('Job Task ' + (task.id?'(Edit)':'(New)'));
	this.form.desc.setValue(task.desc);
	this.form.refDate.setValue(data.format(task.refDate));
	this.form.due.setValue(task.due);
	this.form.done.setValue(task.done);
	this.form.remarks.setValue(task.remarks);
	this.form.job.setValue(task.job.name);
	this.form.stage.setValue(task.stage?task.stage.name:'');
	this.form.deleted.setValue(task.deleted);

	this.show(true);
	this.form.desc.focus();
};

TaskForm.prototype.save = function() {
	this.task.desc = this.form.desc.getValue();
	this.task.refDate = data.parseString(new Date(0), this.form.refDate.getValue());
	this.task.due = this.form.due.getValue();
	this.task.done = this.form.done.getValue();
	this.task.remarks = this.form.remarks.getValue();
	this.task.deleted = this.form.deleted.getValue();
	
	var refreshList = data.saveJobTask(this.task);
	
	this.show(false);
	
	var app = this.findParent(Application);
	app.refresh(refreshList);
};

TaskForm.prototype.cancel = function() {
	this.show(false);
};

function Notebook(className, attr, callbacks) {
	this.newHtmlElement('div','Notebook');
}
Notebook.prototype = new WuiElement();

Notebook.prototype.render = function() {
	var _this = this;
	
	var noteEntryListDiv = this.add(WuiWrapper, 'NoteEntryListDiv');
	if (noteEntryListDiv) {
		this.notebookMenu = noteEntryListDiv.add(WuiWrapper, 'NotebookMenu');
		if (this.notebookMenu) {
			this.notebookMenu = this.notebookMenu.add(WuiButton, 'BtnNew', {text:'New'}, {
				click:function(evt) {
					var noteEntry = new NoteEntry(data.workingJobfile);
					var noteContent = new TextNote(noteEntry);
					_this.editNote(noteContent);
				}
			});
		}
		
		this.noteEntryList = noteEntryListDiv.add(WuiList, 'NoteEntryList');
	}
	
	this.noteDiv = this.add(WuiWrapper, 'NoteEditDiv', {attr:{show:'no'}});
	if (this.noteDiv) {
		this.noteEntry = this.noteDiv.add(WuiWrapper, 'NoteEntry');
		if (this.noteEntry) {
			this.noteEntry.title = this.noteEntry.add(WuiTextField, 'Title', {label:'Title'});
			this.noteEntry.type = this.noteEntry.add(WuiSelectionField, 'Type', {label:'Type',options:['Text']});
			this.noteEntry.deleted = this.noteEntry.add(WuiCheckboxField, 'Deleted', {label:'Delete?'});
			this.noteEntry.lastUpdate = this.noteEntry.add(WuiLabel, 'LastUpdate');
		}
		
		this.noteArea = this.noteDiv.add(WuiWrapper, 'NoteArea');
		
		this.noteMenu = this.noteDiv.add(WuiWrapper, 'NoteMenu');
		if (this.noteMenu) {
			this.noteMenu.add(WuiButton, 'BtnSave', {text:'Save'}, {
				click:function(evt) {
					_this.saveNote();
				}
			});
			this.noteMenu.add(WuiButton, 'BtnCancel', {text:'Cancel'}, {
				click:function(evt) {
					_this.cancelEdit();
				}
			});
		}
	}

	var noteEntries = data.getNotes(data.workingJobfile);
	for (var a in noteEntries) {
		this.noteEntryList.add(NoteEntryItem).render(noteEntries[a]);
	}
};

Notebook.prototype.refresh = function(refreshList) {
	this.removeChildElements();
	this.render();
};

Notebook.prototype.editNote = function(noteContent) {
	this.noteEntry.title.setValue(noteContent.noteEntry.title);
	this.noteEntry.type.setSelectedIdx(noteContent.noteEntry.type);

	switch (noteContent.noteEntry.type) {
	case NoteEntry.TYPE.TEXT:
		this.noteArea.setAttribute('type','text');
		this.noteArea.removeChildElements();
		this.noteArea.note = this.noteArea.add(WuiTextArea);
		this.noteArea.note.setValue(noteContent.text);
		break;
	}
	
	this.noteDiv.setAttribute('show','yes');
	this.noteEntry.title.focus();

	this.edittingNote = noteContent;
};

Notebook.prototype.saveNote = function() {
	this.edittingNote.noteEntry.title = this.noteEntry.title.getValue();
	this.edittingNote.noteEntry.type = this.noteEntry.type.getSelectedIdx();
	this.edittingNote.noteEntry.deleted = this.noteEntry.deleted.getValue();
	
	for (var a in this.edittingNote.noteEntry.links) {
		this.edittingNote.noteEntry.links[a].deleted = this.noteEntry.deleted.getValue();
	}
	
	switch (this.edittingNote.noteEntry.type) {
	case NoteEntry.TYPE.TEXT:
		this.edittingNote.text = this.noteArea.note.getValue();
		break;
	}
	this.edittingNote.deleted = this.noteEntry.deleted.getValue();
	
	var refreshList = data.saveNote(this.edittingNote);
	var app = this.findParent(Application);
	app.refresh(refreshList);
};

Notebook.prototype.cancelEdit = function() {
	this.noteDiv.setAttribute('show','no');
};

function NoteEntryItem(className, attr, callbacks) {
	this.newHtmlElement('li', 'NoteEntryItem');
}
NoteEntryItem.prototype = new WuiElement();

NoteEntryItem.prototype.render = function(noteEntry) {
	var _this = this;
	var sTimestamp = wui.dateUtil.format(noteEntry.lastUpdateTs, '$(d) $(Mmm) $(yyyy) $(HH):$(mm)');
	this.setText(noteEntry.title);
	this.add(WuiText, 'Timestamp', {text:sTimestamp});
	
	this.noteEntry = noteEntry;
	this.addEventListener('click',function(evt) {
		var noteContent = data.getNoteContent(_this.noteEntry);
		var notebook = _this.findParent(Notebook);
		notebook.editNote(noteContent);
	});
};

function JobTaskNoteForm(className, attr, callbacks) {
}
JobTaskNoteForm.prototype = new PopupForm();

JobTaskNoteForm.prototype.render = function(jobTask) {
	if (jobTask) this.jobTask = jobTask; else jobTask = this.jobTask;
	var _this = this;
	
	this.form = this.add(WuiWrapper, 'JobTaskNoteForm');
	if (this.form) {
		var listDiv = this.form.add(WuiWrapper, 'NoteEntryListDiv');
		if (listDiv) {
			this.taskDesc = listDiv.add(WuiText, 'TaskDesc', {tag:'h3'});

			this.noteEntryList = listDiv.add(WuiList, 'NoteEntryList');
			
			var entryMenu = listDiv.add(WuiWrapper, 'NoteEntryMenu');
			if (entryMenu) {
				entryMenu.add(WuiButton, 'BtnNew', {text:'New'}, {
					click:function(evt) {
						_this.newNote();
					}
				});
			}
		}
		
		var noteDiv = this.form.add(WuiWrapper, 'NoteDiv');
		if (noteDiv) {
			this.noteEntry = noteDiv.add(WuiWrapper, 'NoteEntry');
			if (this.noteEntry) {
				this.noteEntry.title = this.noteEntry.add(WuiTextField, '', {label:'Title'});
				this.noteEntry.deleted = this.noteEntry.add(WuiCheckboxField, '', {label:'Delete?'});
			}
			
			this.noteArea = noteDiv.add(WuiWrapper, 'NoteArea');
			
			var noteMenu = noteDiv.add(WuiWrapper, 'NoteMenu');
			if (noteMenu) {
				noteMenu.add(WuiButton, 'BtnSave', {text:'Save'}, {
					click:function(evt) {
						_this.saveNote();
					}
				});
				noteMenu.add(WuiButton, 'BtnRevert', {text:'Revert'}, {
					click:function(evt) {
						_this.revert();
					}
				});
				noteMenu.add(WuiButton, 'BtnClose', {text:'Close'}, {
					click:function(evt) {
						_this.close();
					}
				});
			}
		}
	}

	
	this.taskDesc.setText(jobTask.desc + ' (' + jobTask.job.name + (jobTask.stage?' '+jobTask.stage.name:'') + ')');
	
	var noteLinks = data.getJobTaskNoteLinks(jobTask);
	this.noteEntryList.items = [];
	for (var a in noteLinks) {
		var item = this.noteEntryList.add(JobTaskNoteEntryItem);
		item.render(noteLinks[a].noteEntry);
		
		this.noteEntryList.items.push(item);
	}
};

JobTaskNoteForm.prototype.refresh = function(refreshList) {
	var show = this.getAttribute('show');
	if (show == 'yes') {
		this.noteEntryList.removeChildElements();
		
		var noteLinks = data.getJobTaskNoteLinks(this.jobTask);
		this.noteEntryList.items = [];
		for (var a in noteLinks) {
			var item = this.noteEntryList.add(JobTaskNoteEntryItem);
			item.render(noteLinks[a].noteEntry);
			
			this.noteEntryList.items.push(item);
		}
		
		if (this.noteEntry.deleted.getValue() == true) {
			if (noteLinks.length > 0)
				this.editNote(data.getNoteContent(noteLinks[0].noteEntry));
			else 
				this.newNote();
		}
	}
};

JobTaskNoteForm.prototype.newNote = function() {
	var noteContent = new TextNote(new NoteEntry(data.workingJobfile));
	var noteLink = new NoteLink(noteContent.noteEntry);
	noteLink.objectType = JobTask.OBJECT_TYPE;
	noteLink.objectId = this.jobTask.id;
	noteContent.noteEntry.links.push(noteLink);
	this.editNote(noteContent);
};

JobTaskNoteForm.prototype.editNote = function(noteContent) {
	this.edittingNote = noteContent;
	this.noteEntry.title.setValue(noteContent.noteEntry.title);
	this.noteEntry.deleted.setValue(noteContent.noteEntry.deleted);

	switch (noteContent.noteEntry.type) {
	case NoteEntry.TYPE.TEXT:
		this.noteArea.setAttribute('type','text');
		this.noteArea.removeChildElements();
		this.noteArea.note = this.noteArea.add(WuiTextArea);
		this.noteArea.note.setValue(noteContent.text);
		break;
	}
	
	this.noteEntry.title.focus();
};

JobTaskNoteForm.prototype.saveNote = function() {
	this.edittingNote.noteEntry.title = this.noteEntry.title.getValue();
	if (this.noteEntry.deleted.getValue()) {
		this.edittingNote.noteEntry.deleted = true;
		this.edittingNote.deleted = true;
		for (var a in this.edittingNote.noteEntry.links)
			this.edittingNote.noteEntry.links[a].deleted = true;
	}
	
	switch (this.edittingNote.noteEntry.type) {
	case NoteEntry.TYPE.TEXT:
		this.edittingNote.text = this.noteArea.note.getValue();
		break;
	}
	
	var refreshList = data.saveNote(this.edittingNote, this.jobTask);
	var app = this.findParent(Application);
	app.refresh(refreshList);
};

JobTaskNoteForm.prototype.revert = function() {
	this.editNote(this.edittingNote);
};

JobTaskNoteForm.prototype.close = function() {
	this.setAttribute('show', 'no');
};

JobTaskNoteForm.prototype.show = function(jobTask) {
	this.removeChildElements();
	this.render(jobTask);
	this.setAttribute('show', 'yes');
	
	if (this.noteEntryList.items.length > 0) {
		var noteContent = data.getNoteContent(this.noteEntryList.items[0].noteEntry);
		this.editNote(noteContent);
	}
	else {
		var textNote = new TextNote(new NoteEntry(data.workingJobfile));
		var noteLink = new NoteLink(textNote.noteEntry);
		noteLink.objectType = JobTask.OBJECT_TYPE;
		noteLink.objectId = jobTask.id;
		textNote.noteEntry.links = [noteLink];
		this.editNote(textNote);
	}
};

function JobTaskNoteEntryItem(className, attr, callbacks) {
	this.newHtmlElement('li', 'JobTaskNoteEntryItem');
}
JobTaskNoteEntryItem.prototype = new WuiElement();

JobTaskNoteEntryItem.prototype.render = function(noteEntry) {
	this.noteEntry = noteEntry;
	var _this = this;
	var sTimestamp = wui.dateUtil.format(noteEntry.lastUpdateTs, '$(d) $(Mmm) $(yyyy) $(HH):$(mm)');
	this.setText(noteEntry.title);
	this.add(WuiText, 'Timestamp', {text:sTimestamp});
	
	this.addEventListener('click',function(evt) {
		var noteContent = data.getNoteContent(_this.noteEntry);
		var jobTaskNoteForm = _this.findParent(JobTaskNoteForm);
		jobTaskNoteForm.editNote(noteContent);
	});
};

