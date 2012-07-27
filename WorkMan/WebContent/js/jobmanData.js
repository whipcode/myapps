function RefreshList() {
	this.list = [];
	for (var a in arguments)
		this.list.push(arguments[a]);
}

RefreshList.prototype.push = function(object) {
	this.list.push(object);
};

RefreshList.prototype.found = function(object) {
	for (var a in this.list) {
		if (this.list[a] == object)
			return object;
	}
	return null;
};

function PublicHoliday() {
	this.date = null;
	this.shortName = '';
}

function JobFile() {
	this.filename = '';
	this.status = '';
	this.startDate = null;
	this.endDate = null;
	this.remarks = '';
	this.jobs = [];
}

function DateEvent() {
	this.date = null;
	this.event = '';
}

function WeekFocus() {
	this.date = null;
	this.focus = '';
}

function WeekTask() {
	this.date = null;
	this.task = '';
}

function TodayTask() {
	this.date = null;
	this.task = '';
}

function NoteEntry(jobfile) {
	this.title = '';
	this.type = 0;
	this.jobfile = jobfile;	/* mandatory */
	this.links = [];
}
NoteEntry.TYPE = {TEXT:0};

function NoteLink(noteEntry) {
	this.noteEntry = noteEntry;	/* mandatory */
	this.objectType = 0;
	this.objectId = 0;
}

function TextNote(noteEntry) {
	this.text = '';
	this.noteEntry = noteEntry; /* not null */
	this.noteEntry.type = NoteEntry.TYPE.TEXT;
}

function Job(jobfile, job) {
	if (!job) job = {};
	
	this.name = job.name||'';
	this.startDate = job.startDate||wui.dateUtil.getToday();
	this.endDate = job.endDate||wui.dateUtil.getToday();
	this.remarks = job.remarks||'';
	this.stages = job.stages||[];
	this.tasks = job.tasks||[];
	this.jobfile = jobfile||null;
}

function JobStage(job, stage) {
	if (!stage) stage = {};
	
	this.name = stage.name||'';
	this.startDate = stage.startDate||wui.dateUtil.getToday();
	this.endDate = stage.endDate||wui.dateUtil.getToday();
	this.remarks = stage.remarks||'';
	this.job = job||null;
}

function JobTask(job, stage, task) {
	if (!task) task = {};
	
	this.desc = task.desc||'';
	this.refDate = task.refDate||wui.dateUtil.getToday();
	this.due = task.due||false;
	this.done = task.done||false;
	this.remarks = task.remarks||'';
	this.repeatKey = task.repeatKey||0;
	this.job = job||null;
	this.stage = stage||null;
	this.noteLinks = task.noteLinks||[];
}
JobTask.OBJECT_TYPE = 1;

function JobTaskNoteEntry(task, noteEntry) {
	this.task = task;
	this.noteEntry = noteEntry;
}

function UpdateList() {
	this.dateEvents = [];
	this.weekFocuses = [];
	this.weekTasks = [];
	this.todayTasks = [];
}

function evalWeekRefDate(date, weekNum) {
	var refDate = new Date(date.toDateString());
	refDate.setDate(refDate.getDate() - data.pref.startingWeekday + 1);	/* seek monday as ref date */
	if (weekNum)
		refDate.setDate(refDate.getDate() + 7 * weekNum);
	
	return refDate;
};

var data = {
	weekdayLabels: ['S','M','T','W','T','F','S','S'],
	weekdayLabels3: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
	monthLabels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
	monthIdx:{jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11},
	pref:{},
	publicHolidays:[],
	dateEvents:[],
	jobfiles:[],
	workingJobfile:null,
	workingJob:null,
	workingJobStage:null,
	updateList:new UpdateList(),
	updated:false,
	pollServerInterval:10*60*1000
};

data.pollServer = function() {
	JobmanDao.poll();
};

data.load = function() {
	JobmanDao.load(function(_data) {
		for (var a in _data)
			data[a] = _data[a];
		for (var i=0; i<data.jobfiles.length; i++) {
			if (data.jobfiles[i].id == data.pref.workingJobfile) {
				data.workingJobfile = data.jobfiles[i];
				break;
			}
		}
		data.pref.selectDate = wui.dateUtil.getToday();
	});
};

data.loadJobFileDetails = function(idx) {
	JobmanDao.loadJobFileDetails(data.jobfiles[idx].id, function(_jobfile) {data.jobfiles[idx] = _jobfile;});
};

data.loadPublicHolidays = function(frYr, toYr) {
	JobmanDao.loadPublicHolidays(frYr, toYr, function(publicHolidays) {data.publicHolidays = publicHolidays;});
};

data.savePublicHoliday = function(publicHoliday) {
	var isNew = !publicHoliday.id;
	var isDeleted = publicHoliday.deleted;
	
	JobmanDao.savePublicHoliday(publicHoliday, function(_publicHoliday) {if (isNew) data.publicHolidays.push(publicHoliday); wui.objUtil.copyObjValues(publicHoliday, _publicHoliday);});
	
	if (isNew || isDeleted)
		return new RefreshList(data.publicHolidays);
	else
		return new RefreshList(publicHoliday);
};

data.getPublicHoliday = function(date) {
	for (var i=0; i<this.publicHolidays.length; i++) {
		if (this.publicHolidays[i].date.toDateString() == date.toDateString()) {
			return this.publicHolidays[i];
		}
	}
	
	return null;
};

data.saveJobFile = function(jobfile) {
	var isNew = !jobfile.id;
	var isDeleted = jobfile.deleted;
	
	JobmanDao.saveJobFile(wui.objUtil.mold(jobfile,2), function(_jobfile) {if (isNew) data.jobfiles.push(jobfile); wui.objUtil.copyObjValues(jobfile, _jobfile);});
	
	if (isNew || isDeleted)
		return new RefreshList(data.jobfiles);
	else
		return new RefreshList(jobfile);
};

data.saveItems = function(saveList) {
	function updateSaved(ds, dataName, savedData) {
		for (var i=0; i<savedData.length; i++) {
			if (!saveList[dataName][i].id) {
				saveList[dataName][i].id = savedData[i].id;
				ds[dataName].push(saveList[dataName][i]);
			}
		}
	}
	
	if (saveList.dateEvents.length > 0) JobmanDao.saveDateEvents(saveList.dateEvents, function(savedDateEvents) {updateSaved(data, 'dateEvents', savedDateEvents);});
	if (saveList.weekFocuses.length > 0) JobmanDao.saveWeekFocuses(saveList.weekFocuses, function(savedWeekFocuses) {updateSaved(data.workingJobfile, 'weekFocuses', savedWeekFocuses);});
	if (saveList.weekTasks.length > 0) JobmanDao.saveWeekTasks(saveList.weekTasks, function(savedWeekTasks) {updateSaved(data.workingJobfile, 'weekTasks', savedWeekTasks);});
	if (saveList.todayTasks.length > 0) JobmanDao.saveTodayTasks(saveList.todayTasks, function(savedTodayTasks) {updateSaved(data.workingJobfile, 'todayTasks', savedTodayTasks);});
};

data.saveJob = function(job) {
	var isNew = !job.id;
	var isDeleted = job.deleted;

	JobmanDao.saveJob(wui.objUtil.mold(job,2), function(_job) {if (isNew) job.jobfile.jobs.push(job); wui.objUtil.copyObjValues(job, _job);});

	if (isNew || isDeleted)
		return new RefreshList(job.jobfile.jobs);
	else
		return new RefreshList(job.jobfile.jobs);
};

data.saveJobStage = function(stage) {
	var isNew = !stage.id;
	var isDeleted = stage.deleted;

	JobmanDao.saveJobStage(wui.objUtil.mold(stage,2), function(_stage) {if (isNew) stage.job.stages.push(stage); wui.objUtil.copyObjValues(stage, _stage);});

	if (isNew || isDeleted)
		return new RefreshList(stage.job.stages);
	else
		return new RefreshList(stage);
};

data.saveJobTask = function(task) {
	var isNew = !task.id;
	var isDeleted = task.deleted;

	JobmanDao.saveJobTask(wui.objUtil.mold(task,2), function(_task) {if (isNew) task.job.tasks.push(task); wui.objUtil.copyObjValues(task, _task);});

	if (isNew || isDeleted)
		return new RefreshList(task.job.tasks);
	else
		return new RefreshList(task);
};

data.getDateEvent = function(refDate) {
	for (var i=0; i<this.dateEvents.length; i++) {
		if (this.dateEvents[i].date.valueOf() == refDate.valueOf()) {
			return this.dateEvents[i];
		}
	}
	
	return null;
};

data.getWeekFocus = function(refDate) {
	if (this.workingJobfile) {
		for (var i=0; i<this.workingJobfile.weekFocuses.length; i++) {
			if (this.workingJobfile.weekFocuses[i].date.valueOf() == refDate.valueOf()) {
				return this.workingJobfile.weekFocuses[i];
			}
		}
	}
	
	return null;
};

data.getWeekTask = function(refDate) {
	if (this.workingJobfile) {
		for (var i=0; i<this.workingJobfile.weekTasks.length; i++) {
			if (this.workingJobfile.weekTasks[i].date.valueOf() == refDate.valueOf()) {
				return this.workingJobfile.weekTasks[i];
			}
		}
	}
	
	return null;
};

data.getTodayTask = function(date) {
	if (this.workingJobfile) {
		for (var i=0; i<this.workingJobfile.todayTasks.length; i++) {
			if (this.workingJobfile.todayTasks[i].date && this.workingJobfile.todayTasks[i].date.valueOf() == date.valueOf()) {
				return this.workingJobfile.todayTasks[i];
			}
		}
	}
	
	return null;
};

data.format = function(data, format) {
	var rtn = null;
	
	switch (typeof data) {
	case 'object':
		if (!data)
			rtn = '';
		else if (data instanceof Date)
			rtn = data.getDate() + ' ' + this.monthLabels[data.getMonth()] + ' ' + data.getFullYear();
		else
			rtn = data;
		break;
	case 'number':
		if (data == 0)
			rtn = '0.00';
		else if (Math.abs(data) < 1) {
			if (data < 0) {
				rtn = Math.round((data-1)*100)+'';
				var regexp = /(\d+)(\d{2})/;
				rtn = rtn.replace(regexp,'0.$2');
			}
			else {
				rtn = Math.round((data+1)*100)+'';
				var regexp = /(\d+)(\d{2})/;
				rtn = rtn.replace(regexp,'0.$2');
			}
		}
		else
		{
			rtn = Math.round(data*100)+'';
			var regexp = /(\d+)(\d{2})/;
			rtn = rtn.replace(regexp,'$1.$2');

			var regexp = /(\d+)(\d{3})/;
			while (regexp.test(rtn))
				rtn = rtn.replace(regexp,'$1,$2');
		}
		break;
	default:
		rtn = data;
	}
	
	return rtn;
};

data.parseString = function(obj, string) {
	var rtn;
	
	switch (typeof obj) {
	case 'object':
		if (obj instanceof Date) {
			if (string) {
				/* dd mmm yyyy */
				var s = string.split(' ');
				obj.setFullYear(s[2]);
				if (parseInt(s[1]) > 0)
					obj.setMonth(parseInt(s[1])-1);
				else
					obj.setMonth(this.monthIdx[s[1].toLowerCase()]);
				obj.setDate(s[0]);
				obj.setHours(0);
				obj.setMinutes(0);
				obj.setSeconds(0);
				obj.setMilliseconds(0);
				
				rtn = obj;
			}
			else
				rtn = null;
		} else 
			rtn = string;
		break;
	case 'number':
		rtn = Number(string.replace(/,/g,''));
		break;
	case 'boolean':
		rtn = (string == 'true' || string == 'yes');
		break;
	case 'string':
		rtn = string;
		break;
	default:
		alert('wui.parseString: undefined parser for obj type "' + typeof obj +'"');
	}
	
	return rtn;
};

data.getJobs = function(jobfile, fromDate, toDate) {
	var jobs = [];
	
	if (jobfile && jobfile.jobs) {
		for (var a in jobfile.jobs) {
			if (!jobfile.jobs[a].deleted) {
				if (
					(!toDate || jobfile.jobs[a].startDate.valueOf() <= toDate.valueOf()) &&
					(!fromDate || jobfile.jobs[a].endDate.valueOf() >= fromDate.valueOf())
					)
					jobs.push(jobfile.jobs[a]);
			}
		}
	}
	
	jobs.sort(
		function(a,b) {
			if (a.endDate.valueOf()-b.endDate.valueOf() != 0)
				return a.endDate.valueOf()-b.endDate.valueOf();
			else if (a.startDate.valueOf()-b.startDate.valueOf() != 0)
				return a.startDate.valueOf()-b.startDate.valueOf();
			else
				return a.id-b.id;
		});

	return jobs;
};

data.getJobStages = function(jobs, fromDate, toDate) {
	var stages = [];
	
	for (var i=0; i<jobs.length; i++) {
		var job = jobs[i];
		
		if (job && job.stages) {
			for (var a in job.stages) {
				if (!job.stages[a].deleted) {
					if (
						(!toDate || job.stages[a].startDate.valueOf() <= toDate.valueOf()) &&
						(!fromDate || job.stages[a].endDate.valueOf() >= fromDate.valueOf())
						)
						stages.push(job.stages[a]);
				}
			}
		}
	}
	
	stages.sort(
		function(a,b) {
			if (a.endDate.valueOf()-b.endDate.valueOf() != 0)
				return a.endDate.valueOf()-b.endDate.valueOf();
			else if (a.startDate.valueOf()-b.startDate.valueOf() != 0)
				return a.startDate.valueOf()-b.startDate.valueOf();
			else
				return a.id-b.id;
		});

	return stages;
};

data.getJobTasks = function(jobs, stages, fromDate, toDate) {
	var tasks = [];
	
	for (var i=0; i<jobs.length; i++) {
		var job = jobs[i];
		
		if (job && job.tasks) {
			for (var a in job.tasks) {
				if (!job.tasks[a].deleted) {
					if (
						(!toDate || job.tasks[a].refDate.valueOf() <= toDate.valueOf()) &&
						(!fromDate || job.tasks[a].refDate.valueOf() >= fromDate.valueOf())
						) {
						if (!stages || stages.length == 0)
							tasks.push(job.tasks[a]);
						else {
							for (var j=0; j<stages.length; j++) {
								if (job.tasks[a].stage && job.tasks[a].stage.id==stages[j].id)
									tasks.push(job.tasks[a]);
							}
						}
					}
				}
				
			}
		}
	}
	
	tasks.sort(
		function(a,b) {
			if (a.due != b.due)
				return a.due?1:-1;
			else if (a.refDate.valueOf()-b.refDate.valueOf() != 0)
				return a.refDate.valueOf()-b.refDate.valueOf();
			else
				return a.id-b.id;
		});
	
	return tasks;
};

data.saveNote = function(note, linkedObj) {
	var refreshList = new RefreshList();
	var isNoteNew = !note.id;
	var isNoteDeleted = note.deleted;
	var isNoteEntryNew = isNoteNew;
	var isNoteEntryDeleted = isNoteDeleted;
	
	var moldNote = wui.objUtil.mold(note,2);
	moldNote.noteEntry = wui.objUtil.mold(note.noteEntry,2);
	moldNote.noteEntry.links = wui.objUtil.mold(note.noteEntry.links,2);
	
	switch (note.noteEntry.type) {
	case NoteEntry.TYPE.TEXT:
		JobmanDao.saveTextNote(moldNote, function(_note) {
			if (isNoteEntryNew) {
				note.noteEntry.jobfile.noteEntries.push(note.noteEntry);
				refreshList.push(note.noteEntry.jobfile.noteEntries);
			}
			else if (isNoteEntryDeleted)
				refreshList.push(note.noteEntry.jobfile.noteEntries);
			
			wui.objUtil.copyObjValues(note, _note); 
			wui.objUtil.copyObjValues(note.noteEntry, _note.noteEntry);
			for (var a in note.noteEntry.links) {
				if (!note.noteEntry.links[a].id && linkedObj) {
					linkedObj.noteLinks.push(note.noteEntry.links[a]);
					refreshList.push(linkedObj.noteLinks);
				}
				wui.objUtil.copyObjValues(note.noteEntry.links[a], _note.noteEntry.links[a]);
				note.noteEntry.links[a].noteEntry = note.noteEntry;
			}
			refreshList.push(note.noteEntry);
			refreshList.push(note.noteEntry.links);
		});
		break;
	}
	
	return refreshList;
};

data.getNotes = function(jobfile) {
	var noteEntries = [];
	
	for (var a in jobfile.noteEntries) {
		if (!jobfile.noteEntries[a].deleted)
			noteEntries.push(jobfile.noteEntries[a]);
	}
	
	noteEntries.sort(function(a,b) {if (a.lastUpdateTs && b.lastUpdateTs) return b.lastUpdateTs.valueOf() - a.lastUpdateTs.valueOf(); return b.id-a.id;});
	
	return noteEntries;
};

data.getNoteContent = function(noteEntry) {
	var noteContent = null;
	
	switch (noteEntry.type) {
	case NoteEntry.TYPE.TEXT:
		JobmanDao.getTextNote(noteEntry.id, function(_textNote) {noteContent = _textNote;});
		break;
	}
	
	if (noteContent) noteContent.noteEntry = noteEntry;
	
	return noteContent;
};

data.getJobTaskNoteLinks = function(jobTask) {
	var noteLinks = [];
	
	for (var a in jobTask.noteLinks) {
		if (!jobTask.noteLinks[a].deleted)
			noteLinks.push(jobTask.noteLinks[a]);
	}
	
	noteLinks.sort(function(a,b) {return b.lastUpdateTs.valueOf()-a.lastUpdateTs.valueOf()});
	
	return noteLinks;
};