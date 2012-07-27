function RemindersSection(id, callbackObjs, appData) {
	WuiComponent.call(this, id);
	
	this.callbackObjs = callbackObjs;
	this.appData = appData;

	var _this = this;
	var tableSetting = (new WuiTableSetting())
		.setClass('reminderTable')
		.addColumnDef('comm','',function() {return [{tag:'button', type:'button', text:'Edit'}];})
		.addColumnDef('reminderDate','Reminder Date')
		.addColumnDef('desc','Description') 
		.addColumnDef('amount','Amount')
		.addColumnDef('expenseSubcatg','Sub Catg')
		.addColumnDef('remarks','Remarks')
		;
	
	this.components = {
		reminderTable:new WuiTable('reminderTable', tableSetting)
	};
}

RemindersSection.prototype = new WuiComponent;

RemindersSection.prototype.getElementDef = function() {
	var initElements = {tag:'div',className:'reminders',elements:wui.toElements(
		this.components.reminderTable
		)};
	
	return initElements;
};

RemindersSection.prototype.refresh = function() {
	var reminderRecs = this.appData.getReminders(this.appData.getSelectedAccountIdx(), this.appData.getSelectedYear());
	this.components.reminderTable.refresh(reminderRecs);
};

RemindersSection.prototype.updateRow = function(tr) {
	var reminderTable = this.getComponent('reminderTable');
	reminderTable.updateRow(tr);
};
