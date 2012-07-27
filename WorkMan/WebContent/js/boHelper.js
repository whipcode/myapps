var boHelper = {
	newData:function(addn) {
		var newData = {id:0,verNo:0,ownerId:0,deleteMark:false,lastUpdateTs:null,lastUpdateUr:0};
		for (var f in addn)
			newData[f] = addn[f];
		return newData;
	},
	
	newCalendarDay:function() {
		return boHelper.newData({date:null,name:'',abv:'',checked:false});
	},
	
	newJobFile:function() {
		return boHelper.newData({name:'',status:'',beginDate:null,closeDate:null});
	},
	
	newNote:function() {
		return boHelper.newData({title:'',creationDate:null, rowIdx:0, colIdx:0, show:false, jobFileId:0, userId:0});
	}
};