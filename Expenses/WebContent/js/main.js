Main = View.extend({
	pagestate:new Model(),
	
	initialize:function() {
		var _this = this;
		bu.init(
			function /*success*/() {
				datastore.init();
				_this.render();
				_this.run();
			}
		);
	},
	
	render:function() {
		var appWrapper = this.append(Wrapper, {className:'AppWrapper', viewName:'appWrapper'});
		if (appWrapper) {
			appWrapper.append(this.PageMenu, {viewName:'pageMenu'});
			var taskViews = appWrapper.append(ViewsWrapper, {className:'TaskViews', viewName:'taskViews'});
			if (taskViews) {
				taskViews
					.addView(this.TransactionView, {viewName:'transactionView'})
					.addView(this.SummaryView, {viewName:'summaryView'})
					.setViewMode('normal');
			}
		}
		
		return this;
	},
	
	run:function() {
		page.pagestate.bind('change:selectedYear', this.reload, this);

		datastore.loadAccounts(
			function /*success*/() {
				var selectAcc = datastore.getAccounts().at(0);
				var selectAccId = selectAcc?selectAcc.get('id'):0;
				
				page.pagestate.set({
					selectedYear:util.getToday().getFullYear(), 
					selectedMonth:util.getToday().getMonth(),
					selectedAccId:selectAccId});
		});
	},
	
	reload:function() {
		datastore.load(page.pagestate.get('selectedYear'));
	},
	
	editAccount:function(account) {
		this.append(this.AccountEditor, {model:account, viewName:'accountEditor'});
	},
	
	editTransaction:function(transaction) {
		this.append(this.TransactionEditor, {model:transaction, viewName:'transactionEditor'});
	},
	
	editAsset:function(asset) {
		this.append(this.AssetEditor, {model:asset, viewName:'assetEditor'});
	},
	
	events:{
	},
	
	PageMenu:Wrapper.extend({
		className:'PageMenu',
		
		initialize:function() {
			this.append(AmountField, {label:'Year', className:'YearPicker', model:page.pagestate, fieldName:'selectedYear', viewName:'yearPicker'});
			this.append(PickerField, 
				{
					label:'Account', 
					className:'AccountPicker',
					collection:datastore.getAccounts(), 
					formatFn:function(model) {
						return model.get('name')+' ('+model.get('accOwner')+')';
					}, 
					model:page.pagestate,
					parseFn:function(model) {
						return {selectedAccId:model?model.get('id'):0};
					},
					selectedIdx:0,
					viewName:'accountPicker'
				});
			this.append(Button, {text:'New',className:'BtnNewAcc'});
			this.append(Button, {text:'Edit',className:'BtnEditAcc'});
		},
		
		events:{
			'click .BtnNewAcc':'cbBtnNewAccClick',
			'click .BtnEditAcc':'cbBtnEditAccClick'
		},
		
		cbChangeAccountPicker:function(option) {
			console.log(option);
		},
		
		cbBtnNewAccClick:function() {
			page.editAccount(new Account());
		},
		
		cbBtnEditAccClick:function() {
			var account = datastore.getAccount(page.pagestate.get('selectedAccId'));
			
			page.editAccount(account);
		}
	}),
	
	TransactionView:Wrapper.extend({
		className:'TransactionView',
		
		initialize:function() {
			this.append(this.Menu, {viewName:'menu'});
			this.append(this.TransactionList, {viewName:'transactionList'});
			this.append(this.FootMenu, {viewName:'footMenu'});
		},
		
		Menu:Wrapper.extend({
			className:'Menu',
			
			initialize:function() {
				this.append(Picker, {className:'MonthPicker', options:util.getMonthNames(), model:page.pagestate, parseFn:function(model, idx) {return {selectedMonth:idx};}, viewName:'monthPicker'});
			}
		}),
		
		TransactionList:List.extend({
			className:'TransactionList',
			
			initialize:function() {
				this.viewModel = new Collection();
				
				this.viewModel.bind('reset', this.refresh, this);
				
				datastore.bind('transactions', 'reset', this.digestTransactions, this);
				datastore.bind('transactions', 'change', this.digestTransactions, this);
				datastore.bind('transactions', 'add', this.digestTransactions, this);
				datastore.bind('transactions', 'remove', this.digestTransactions, this);
			},
			
			refresh:function() {
				this.removeChild();

				for (var i=0; i<this.viewModel.length; i++) {
					this.append(this.TransactionItem, {viewModel:this.viewModel.at(i)});
				}
			},
			
			digestTransactions:function() {
				var selectedYear = page.pagestate.get('selectedYear');
				var selectedAccId = page.pagestate.get('selectedAccId');
				var selectedMonth = page.pagestate.get('selectedMonth');
				
				var transactions = datastore.getTransactionsOfYearOfAccountOfMonth(selectedYear, selectedAccId, selectedMonth);
				var _faceTransactions = [];
				for (var i=0; i<transactions.length; i++) {
					var transaction = transactions[i];
					var __faceTransactions = bu.getFaceTransactions(transaction, selectedAccId, selectedYear, selectedMonth);
					
					for (var j=0; j<__faceTransactions.length; j++) {
						var temp = __faceTransactions[j];
						var faceTransaction = new Model({date:temp.date, desc:temp.desc, amount:temp.amount, transaction:transaction});
						_faceTransactions.push(faceTransaction);
					}
				}
				
				this.viewModel.reset(_faceTransactions);
			},
			
			TransactionItem:ListItem.extend({
				className:'Transaction',
				
				initialize:function() {
					this.viewModel = this.options.viewModel;
					
					this.append(TextView, {className:'Date', model:this.viewModel, formatFn:function(model) {return util.formatDate(model.get('date'), '$(dd) $(Mmm)');}});
					this.append(TextView, {className:'Desc', model:this.viewModel, fieldName:'desc'});
					this.append(AmountView, {className:'Amount', model:this.viewModel, fieldName:'amount', dp:2});
				},
				
				events:{
					'click':'cbClick'
				},
				
				cbClick:function() {
					page.editTransaction(this.viewModel.get('transaction'));
				}
			})
		}),
		
		FootMenu:Wrapper.extend({
			className:'FootMenu',
			
			initialize:function() {
				this.append(Button, {text:'Add', className:'BtnAddTranx', viewName:'btnAddTranx'});
			},
			
			events:{
				'click .BtnAddTranx':'cbBtnAddTranxClick'
			},
			
			cbBtnAddTranxClick:function() {
				page.editTransaction(new Transaction({tranxAcc:datastore.getAccount(page.pagestate.get('selectedAccId')).toJSON(), tranDate:util.getToday()}));
			}
		})
	}),
	
	SummaryView:Wrapper.extend({
		className:'SummaryView',
		
		initialize:function() {
			this.append(this.Navigator, {viewName:'navigator'});
			this.append(ViewsWrapper, {className:'Summaries', viewName:'summaries'})
				.addView(this.AccountSummary, {viewName:'accountSummary'})
				.addView(this.AssetSummary, {viewName:'assetSummary'})
				.setActiveView('accountSummary');
		},
		
		switchView:function(id) {
			this.findView('summaries').setActiveView(id);
		},
		
		Navigator:Wrapper.extend({
			className:'Navigator',
			
			initialize:function() {
				this.append(Link, {text:'Account Summary', className:'LnkAccountSummary', viewName:'lnkAccountSummary'});
				this.append(Link, {text:'Asset Summary', className:'LnkAssetSummary', viewName:'lnkAssetSummary'});
			},
			
			events:{
				'click .LnkAccountSummary':'cbLnkAccountSummaryClick',
				'click .LnkAssetSummary':'cbLnkAssetSummaryClick'
			},
			
			cbLnkAccountSummaryClick:function() {
				var summaryView = this.findParent('SummaryView');
				if (summaryView)
					summaryView.switchView('accountSummary');
			},
			
			cbLnkAssetSummaryClick:function() {
				var summaryView = this.findParent('SummaryView');
				if (summaryView)
					summaryView.switchView('assettSummary');
			}
		}),
		
		AccountSummary:Wrapper.extend({
			className:'AccountSummary',
			
			initialize:function() {
				this.viewModel = new ViewModel({openings:new Collection(), tranTypes:new Collection(), closings:new Collection()});
				
				datastore.bind('closings', 'ready', this.digestClosings, this);
				datastore.bind('transactions', 'reset', this.digestTransactions, this);
				datastore.bind('transactions', 'change', this.digestTransactions, this);
				datastore.bind('transactions', 'add', this.digestTransactions, this);
				datastore.bind('transactions', 'remove', this.digestTransactions, this);
				
				var table = this.append(Table);
				if (table) {
					table.append(this.Header);
					table.append(this.Opening, {viewModel:this.viewModel.get('openings')});

					var tranTypeSeq = [bu.TRANTYPE.INCOME, bu.TRANTYPE.EXPENDITURE, bu.TRANTYPE.INVESTMENT, bu.TRANTYPE.TRANSFER];
					for (var i=0; i<tranTypeSeq.length; i++) {
						var tranType = new Model({name:bu.getTranType(tranTypeSeq[i]), subtotals:null, tranxCatgs:null});
						this.viewModel.get('tranTypes').add(tranType);
						table.append(this.TranTypeSection, {viewModel:tranType});
					}
					table.append(this.Closing, {viewModel:this.viewModel.get('closings')});
					table.append(this.Difference, {viewModel:this.viewModel.get('closings')});
				}
			},
			
			digestClosings:function() {
				var _openings = [];
				var _closings = [];
				var account = datastore.getAccount(page.pagestate.get('selectedAccId'));
				var year = page.pagestate.get('selectedYear');
				
				var closing = datastore.getClosingOfAccountOfYearOfMonth(account, year-1, 11);
				for (var i=0; i<12; i++) {
					_openings.push(closing);
					closing = datastore.getClosingOfAccountOfYearOfMonth(account, year, i);
					_closings.push(closing);
				}
				
				this.viewModel.get('openings').reset(_openings);
				this.viewModel.get('closings').reset(_closings);
			},
			
			digestTransactions:function() {
				var selectedYear = page.pagestate.get('selectedYear');
				var selectedAccId = page.pagestate.get('selectedAccId');
				var transactionsByTranTypeByTranxCatg = datastore.getTransactionsOfYearOfAccountByTranTypeByTranxCatg(selectedYear, selectedAccId);
				
				var tranTypeSeq = [bu.TRANTYPE.INCOME, bu.TRANTYPE.EXPENDITURE, bu.TRANTYPE.INVESTMENT, bu.TRANTYPE.TRANSFER];
				
				for (var s=0; s<tranTypeSeq.length; s++) {
					var _tranTypeSubtotals = [{amount:0.00}, {amount:0.00}, {amount:0.00}, {amount:0.00}, {amount:0.00}, {amount:0.00}, {amount:0.00}, {amount:0.00}, {amount:0.00}, {amount:0.00}, {amount:0.00}, {amount:0.00}];
					var _tranxCatgs = [];
					
					for (var catg in transactionsByTranTypeByTranxCatg[tranTypeSeq[s]]) {
						var tranxCatg = new Model({name:catg, subtotals:new Collection(), faceTransactions:new Collection()});
						if (tranxCatg) {
							var _tranxCatgSubtotals = [{amount:0.00}, {amount:0.00}, {amount:0.00}, {amount:0.00}, {amount:0.00}, {amount:0.00}, {amount:0.00}, {amount:0.00}, {amount:0.00}, {amount:0.00}, {amount:0.00}, {amount:0.00}];
							var _faceTransactions = [];

							var transactions = transactionsByTranTypeByTranxCatg[tranTypeSeq[s]][catg];
							for (var i=0; i<transactions.length; i++) {
								var transaction = transactions[i];
								var __faceTransactions = bu.getFaceTransactions(transaction, selectedAccId, selectedYear);
								
								for (var j=0; j<__faceTransactions.length; j++) {
									var temp = __faceTransactions[j];
									var month = temp.date.getMonth();
									_tranTypeSubtotals[month].amount += temp.amount;
									_tranxCatgSubtotals[month].amount += temp.amount;
									var faceTransaction = new Model({date:temp.date, desc:temp.desc, amount:temp.amount, transaction:transaction});
									_faceTransactions.push(faceTransaction);
								}
							}
							
							tranxCatg.get('subtotals').reset(_tranxCatgSubtotals);
							tranxCatg.get('faceTransactions').reset(_faceTransactions);
							_tranxCatgs.push(tranxCatg);
						}
					}
					
					this.viewModel.get('tranTypes').at(s).set({subtotals:new Collection(_tranTypeSubtotals), tranxCatgs:new Collection(_tranxCatgs)});
				}
			},
			
			Header:TableHeader.extend({
				initialize:function() {
					this.append(TableCell, {className:'Name'});
					for (var i=0; i<12; i++) {
						this.append(TableCell, {className:'Month', text:util.getMonthName(i)});
					}
				}
			}),
			
			Opening:TableBody.extend({
				initialize:function() {
					this.viewModel = this.options.viewModel;
					
					this.viewModel.bind('reset', this.refresh, this);
				},
				
				refresh:function() {
					this.removeChild();
					
					this.append(TableCell, {className:'Name', text:'Opening'});
					for (var i=0; i<12; i++) {
						this.append(TableCell, {className:'Month'}).append(AmountView, {model:this.viewModel.at(i), fieldName:'amount', dp:2, withSep:true, attr:{contentEditable:'true'}});
					}
				}
			}),
			
			TranTypeSection:TableBody.extend({
				initialize:function() {
					this.viewModel = this.options.viewModel;
					
					this.viewModel.bind('change', this.refresh, this);
				},
				
				refresh:function() {
					this.removeChild();
					
					var tr = this.append(TableRow, {className:'SectionSubtotal'});
					if (tr) {
						tr.append(TableCell, {className:'Name'}).append(TextView, {model:this.viewModel, fieldName:'name'});
						
						for (var i=0; i<this.viewModel.get('subtotals').length; i++) {
							tr.append(TableCell, {className:'Month'}).append(AmountView, {model:this.viewModel.get('subtotals').at(i), fieldName:'amount', dp:2, withSep:true});
						}
					}
					
					for (var i=0; i<this.viewModel.get('tranxCatgs').length; i++) {
						this.append(this.TranxCatg, {viewModel:this.viewModel.get('tranxCatgs').at(i)});
					}
				},
				
				TranxCatg:TableRow.extend({
					initialize:function() {
						this.viewModel = this.options.viewModel;
						
						this.append(TableCell, {className:'Name'}).append(TextView, {model:this.viewModel, fieldName:'name'});
						
						for (var i=0; i<this.viewModel.get('subtotals').length; i++) {
							this.append(TableCell, {className:'Month'}).append(AmountView, {model:this.viewModel.get('subtotals').at(i), fieldName:'amount', dp:2, withSep:true});
						}
					}
				})
			}),
			
			Closing:TableBody.extend({
				initialize:function() {
					this.viewModel = this.options.viewModel;
					
					this.viewModel.bind('reset', this.refresh, this);
				},
				
				refresh:function() {
					this.removeChild();
					
					this.append(TableCell, {className:'Name', text:'Closing'});
					for (var i=0; i<12; i++) {
						this.append(TableCell, {className:'Month'}).append(AmountView, {model:this.viewModel.at(i), fieldName:'amount', dp:2, withSep:true, attr:{contentEditable:'true'}});
					}
				}
			}),
			
			Difference:TableFooter.extend({
				initialize:function() {
					this.viewModel = this.options.viewModel;
					
					this.viewModel.bind('reset', this.refresh, this);
				},
				
				refresh:function() {
					this.removeChild();
					
					this.append(TableCell, {className:'Name', text:'Difference'});
					for (var i=0; i<12; i++) {
						this.append(TableCell, {className:'Month'}).append(AmountView, {model:this.viewModel.at(i), fieldName:'diff', dp:2, withSep:true});
					}
				}
			})
		}),
		
		AssetSummary:Wrapper.extend({
			className:'AssetSummary'
		})
	}),
	
	AccountEditor:Wrapper.extend({
		className:'DialogBackground',
		
		initialize:function() {
			this.attr('tabindex','99');
			
			this.append(this.Editor, util.copyObj(this.options, {viewName:'editor'}));
		},
		
		Editor:Wrapper.extend({
			className:'AccountEditor',
			
			initialize:function() {
				var menu = this.append(Wrapper, {className:'Menu'}, 'menu');
				if (menu) {
					menu.append(Button, {className:'BtnCancel', text:'Cancel'});
					menu.append(Button, {className:'BtnSave', text:'Save'});
					menu.append(TextView, {className:'Title', text:(this.model.has('id')?this.model.get('name') + ' (' + this.model.get('accOwner') + ')':'New Account')});
				}
				
				this.stagingModel = this.model.clone();
				
				var body = this.append(Wrapper, {className:'EditArea'});
				if (body) {
					body.append(TextField, {label:'Account Name', model:this.stagingModel, fieldName:'name'});
					body.append(TextField, {label:'Asset Type', model:this.stagingModel, fieldName:'assetType'});
					body.append(TextField, {label:'Description', del:this.stagingModel, fieldName:'desc'});
					body.append(TextField, {label:'Owner', model:this.stagingModel, fieldName:'accOwner'});
					body.append(PickerField, 
						{
							label:'Default Payment Settle Account', 
							collection:datastore.getAccounts(), 
							fieldName:'name', 
							withBlank:true, 
							model:this.stagingModel,
							parseFn:function(model) {return {defSettleAcc:model?model.toJSON():null};}
						});
					body.append(CheckboxField, {label:'Delete?', model:this.stagingModel, fieldName:'deleted'});
				}
			},
		
			events:{
				'click .BtnSave':'cbClickSave',
				'click .BtnCancel':'cbClickCancel',
				'keyup':'cbKeypress'
			},
			
			cbClickSave:function() {
				var _this = this;
				
				if (this.validate()) {
					this.save(
						function /*success*/() {
							_this.parent.remove();
						},
						function /*failed*/(msg) {
						}
					);
				}
			},
			
			cbClickCancel:function() {
				this.parent.remove();
			},
			
			cbKeypress:function(evt) {
				if (evt.keyCode == 27) {
					this.parent.remove();
				}
			},
			
			validate:function(cbOk, cbFailed) {
				return true;
			},
			
			save:function(cbSuccess, cbFailed) {
				this.model.set(this.stagingModel);
							
				datastore.saveAccount(this.model, cbSuccess, cbFailed);
			}
		})
	}),
	
	TransactionEditor:Wrapper.extend({
		className:'DialogBackground',
		
		initialize:function() {
			this.attr('tabindex','99');
			
			this.append(this.Editor, util.copyObj(this.options, {viewName:'editor'}));
		},
		
		Editor:Wrapper.extend({
			className:'TransactionEditor',
			
			initialize:function() {
				var menu = this.append(Wrapper, {className:'Menu'}, 'menu');
				if (menu) {
					menu.append(Button, {className:'BtnCancel', text:'Cancel'});
					menu.append(Button, {className:'BtnSave', text:'Save'});
					menu.append(TextView, {className:'Title', text:(this.model.has('id')?this.model.get('desc'):'New Transaction')});
				}
				
				this.stagingModel = this.model.clone();
				this.repeatDtl = new Model({times:0, months:0, auto:false});
				
				var body = this.append(Wrapper, {className:'EditArea'});
				if (body) {
					body.append(PickerField, {
						label:'Account', 
						collection:datastore.getAccounts(),
						formatFn:function(model) {return model.get('name') + ' (' + model.get('accOwner') + ')';}, 
						withBlank:false,
						model:this.stagingModel,
						parseFn:function(model) {return {tranxAcc:model?model.toJSON():null};}
					});
					body.append(DateField, {label:'Transaction Date', model:this.stagingModel, fieldName:'tranDate'});
					body.append(PickerField, {
						label:'Transaction Type', 
						options:bu.getTranTypes(), 
						model:this.stagingModel, 
						parseFn:function(model, idx) {
							return {tranType:idx};
							},
						selectedIdx:0
					});
					body.append(TextField, {label:'Category', model:this.stagingModel, fieldName:'tranxCatg'});
					body.append(TextField, {label:'Description', model:this.stagingModel, fieldName:'desc'});
					body.append(AmountField, {label:'Amount', model:this.stagingModel, fieldName:'amount', dp:2, withSep:true});
					body.append(TextField, {label:'Remarks', model:this.stagingModel, fieldName:'remarks'});
					body.append(PickerField, {
						label:'Settle Account', 
						collection:datastore.getAccounts(), 
						formatFn:function(model) {return model.get('name') + ' (' + model.get('accOwner') + ')';}, 
						withBlank:true, 
						model:this.stagingModel,
						parseFn:function(model) {
							return {settleAcc:model?model.toJSON():null};
						}
					})
						.append(Label, {text:'Date'}).append(DateInput, {model:this.stagingModel, fieldName:'settleDate'});
					body.append(PickerField, {
						label:'Claim Account', 
						collection:datastore.getAccounts(), 
						formatFn:function(model) {return model.get('name') + ' (' + model.get('accOwner') + ')';}, 
						withBlank:true, 
						model:this.stagingModel,
						parseFn:function(model) {return {claimAcc:model?model.toJSON():null};}
					})
						.append(Label, {text:'Date'}).append(DateInput, {model:this.stagingModel, fieldName:'claimDate'});
					body.append(PickerField, {
						label:'Transfer to Account', 
						collection:datastore.getAccounts(), 
						formatFn:function(model) {return model.get('name') + ' (' + model.get('accOwner') + ')';}, 
						withBlank:true, 
						model:this.stagingModel,
						parseFn:function(model) {return {transferAcc:model?model.toJSON():null};}
					});
					body.append(CheckboxField, {label:'Delete?', model:this.stagingModel, fieldName:'deleted'});
					
					body.append(Line);
					
					var repeatDiv = body.append(Wrapper, {className:'RepeatFields'});
					if (repeatDiv) {
						if (this.stagingModel.get('repeatKey')) 
							repeatDiv.append(CheckboxField, {label:'Auto Repeat?', className:'AutoRepeat', model:this.repeatDtl, fieldName:'auto', checked:true});

						var repeatDtl = repeatDiv.append(Wrapper);
						if (repeatDtl) {
							repeatDtl.append(Label, {text:'Repeat:'});
							repeatDtl.append(AmountInput, {className:'InputRepeatTimes', viewName:'fldRepeatTimes', model:this.repeatDtl, fieldName:'times'});
							repeatDtl.append(Label, {text:'Times, Every'});
							repeatDtl.append(AmountInput, {className:'InputRepeatMonths', viewName:'fldRepeatMonths', model:this.repeatDtl, fieldName:'months'});
							repeatDtl.append(Label, {text:'Months'});
						}

						if (this.repeatDtl.get('auto')) {
							repeatDtl.findView('fldRepeatTimes').attr('disabled','disabled');
							repeatDtl.findView('fldRepeatMonths').attr('disabled','disabled');
						}
					}
				}
			},
		
			events:{
				'click .BtnSave':'cbClickSave',
				'click .BtnCancel':'cbClickCancel',
				'keyup':'cbKeypress'
			},
			
			cbClickSave:function() {
				var _this = this;
				
				if (this.validate()) {
					this.save(
						function /*success*/() {
							_this.parent.remove();
						},
						function /*failed*/(msg) {
						}
					);
				}
			},
			
			cbClickCancel:function() {
				this.parent.remove();
			},
			
			cbKeypress:function(evt) {
				if (evt.keyCode == 27) {
					this.parent.remove();
				}
			},
			
			validate:function(cbOk, cbFailed) {
				return true;
			},
			
			save:function(cbSuccess, cbFailed) {
				this.model.set(this.stagingModel);
							
				if (this.repeatDtl.get('auto') || this.repeatDtl.get('times'))
					datastore.saveTransactionRepeat(this.model, this.repeatDtl.toJSON(), cbSuccess, cbFailed);
				else
					datastore.saveTransaction(this.model, cbSuccess, cbFailed);
			}
		})
	}),

	AssetEditor:Wrapper.extend({
		className:'DialogBackground',
		
		initialize:function() {
			this.attr('tabindex','99');
			
			this.append(this.Editor, util.copyObj(this.options, {viewName:'editor'}));
		},
		
		Editor:Wrapper.extend({
			className:'AssetEditor',
			
			initialize:function() {
				var menu = this.append(Wrapper, {className:'Menu'}, 'menu');
				if (menu) {
					menu.append(Button, {className:'BtnCancel', text:'Cancel'});
					menu.append(Button, {className:'BtnSave', text:'Save'});
					menu.append(TextView, {className:'Title', text:(this.model.has('id')?this.model.get('name'):'New Asset')});
				}
				
				this.stagingModel = this.model.clone();
				
				var body = this.append(Wrapper, {className:'EditArea'});
				if (body) {
					body.append(TextField, {label:'Asset Type', model:this.model, fieldName:'type'});
					body.append(TextField, {label:'Asset Name', model:this.model, fieldName:'name'});
					body.append(CheckboxField, {label:'Discontinue?', model:this.model, fieldName:'discontinued'});
				}
			},
		
			events:{
				'click .BtnSave':'cbClickSave',
				'click .BtnCancel':'cbClickCancel',
				'keyup':'cbKeypress'
			},
			
			cbClickSave:function() {
				var _this = this;
				
				if (this.validate()) {
					this.save(
						function /*success*/() {
							_this.parent.remove();
						},
						function /*failed*/(msg) {
						}
					);
				}
			},
			
			cbClickCancel:function() {
				this.parent.remove();
			},
			
			cbKeypress:function(evt) {
				if (evt.keyCode == 27) {
					this.parent.remove();
				}
			},
			
			validate:function(cbOk, cbFailed) {
				return true;
			},
			
			save:function(cbSuccess, cbFailed) {
				this.model.set(this.stagingModel);
							
				datastore.saveAsset(this.model, cbSuccess, cbFailed);
			}
		})
	})
});