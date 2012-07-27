var config = {
	resultsPerPage:20,
	classFields:{
		Food:['deletedMark','id','selected','name','foodTypes','foodIngredients','descriptions','pictures','lastUpdUr','lastUpdTs']
	},
	fieldLabel:{
		/* Generic Fields */
		id:'ID',
		deletedMark:'Deleted',
		lastUpdUr:'Last Upd User',
		lastUpdTs:'Last Upd Ts',
		
		/* Food */
		selected:'Selected',
		name:'name',
		foodTypes:'Food Types',
		foodIngredients:'Food Ingredients',
		descriptions:'Descriptions',
		pictures:'Pictures'
	}
};

function Application(htmlId) {
	this.setContext(htmlId);
	
	var view = this.add(WuiWrapper, 'appView');
	if (view) {
		view.add(CommandDiv, '', {id:'commandDiv'});
		view.add(ResultDiv, '', {id:'resultDiv'});
		view.add(PaginateDiv, '', {id:'paginateDiv'});
	}
}
Application.prototype = new WuiElement();

function CommandDiv(id) {
	this.newHtmlElement('div', 'CommandDiv');
	var _this = this;
	
	this.domainField = this.add(WuiTextField, '', {text:'Domain'});
	this.classField = this.add(WuiTextField, '', {text:'Class'});
	this.criteriaField = this.add(WuiTextField, '', {text:'Criteria'});
	this.resultsPerPageField = this.add(WuiTextField, '', {text:'Results Per Page'});
	this.resultsPerPageField.setValue(config.resultsPerPage);
	this.add(WuiButton, '', {text:'Query'}, {click:function(evt) {query();}});
	
	this.sqlDiv = this.add(WuiWrapper);
	if (this.sqlDiv) {
		this.sqlDiv.sql = this.sqlDiv.add(WuiTextField, '', {label:'SQL'});
		this.sqlDiv.add(WuiButton, '', {text:'Submit'}, {click:function(evt) {sql(_this.sqlDiv.sql.getValue());}});
	}
}
CommandDiv.prototype = new WuiElement();

CommandDiv.prototype.getClassName = function() {
	return this.classField.getValue();
};

CommandDiv.prototype.getCriteria = function() {
	return this.criteriaField.getValue();
};

CommandDiv.prototype.getResultsPerPage = function() {
	return this.resultsPerPageField.getValue();
};

function ResultDiv(id) {
	this.newHtmlElement('div', 'ResultDiv');
}
ResultDiv.prototype = new WuiElement();

function PaginateDiv(id) {
	this.newHtmlElement('div', 'PaginateDiv');
}
PaginateDiv.prototype = new WuiElement();

function query() {
	var commandDiv = wui.getElement('commandDiv');
	var className = commandDiv.getClassName();
	var criteria = commandDiv.getCriteria();
	var resultsPerPage = commandDiv.getResultsPerPage();
	
	if (className) {
		QueryDao.query(className, criteria, resultsPerPage, 1, function(result) {showResult(className, result);});
	}
}

function getClassFields(className, result) {
	var fields = [];
	
	if (config.classFields[className])
		fields = config.classFields[className];
	else {
		if (result)
			for (var fieldName in result.records[0])
				fields.push(fieldName);
	}
	
	return fields;
}

function getFieldLabel(fieldName) {
	return config.fieldLabel[fieldName]||fieldName;
}

function showResult(className, result) {
	var resultDiv = wui.getElement('resultDiv');
	resultDiv.removeChildElements();
	
	if (result) {
		resultDiv.add(WuiText, '', {text:'Total ' + result.totalRecs + ' Records'});
		
		var fields = getClassFields(className, result);
		var table = resultDiv.add(WuiTable);
		if (table) {
			var headerRow = table.add(WuiTableHeader).add(WuiTableRow);
			for (var field=0; field<fields.length; field++) {
				headerRow.add(WuiTableCell, '', {text:getFieldLabel(fields[field])});
			}
			
			var body = table.add(WuiTableBody,'', {contentEditable:'true'});
			for (var r=0; r<result.records.length; r++) {
				var tr = body.add(WuiTableRow);
				
				for (var c=0; c<fields.length; c++) {
					var td = tr.add(WuiTableCell);
					
					var value = result.records[r][fields[c]];
					if (value) {
						switch (typeof value) {
						case 'object':
							if (value instanceof Date)
								td.setText(value.toString());
							else
								td.setText('(Object)');
							break;
						default:
							td.setText(value);
						}
					}
					else
						td.setText('(null)');
				}
			}
		}
	}
	else {
		resultDiv.add(WuiText, '', {text:'Error'});
	}
}

function sql(sqlStatement) {
	QueryDao.sql(sqlStatement);
}