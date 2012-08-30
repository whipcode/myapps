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
		
		page.pagestate.set('selectedYear', util.getToday().getFullYear());
		page.pagestate.set('selectedMonth', util.getToday().getMonth());
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
						return {selectedAccId:model.get('id')};
					},
					viewName:'accountPicker'
				});
			this.append(Button, {text:'New',className:'BtnNewAcc', viewName:'btnNewAcc'});
			this.append(Button, {text:'Edit',className:'BtnEditAcc', viewName:'btnEditAcc'});
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
			var accountPicker = this.findView('accountPicker');
			var account = accountPicker.getSelectedModel();
			
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
				this.collection = datastore.getTransactions();
				
				this.collection.bind('reset', this.refresh, this);
				this.collection.bind('add', this.refresh, this);
				this.collection.bind('remove', this.refresh, this);
			},
			
			refresh:function() {
				this.removeChild();

				for (var i=0; i<this.collection.length; i++) {
					this.add(this.collection.at(i));
				}
			},
			
			add:function(transaction) {
				if (bu.isSelectedMonthAccount(transaction, page.pagestate.get('selectedAccId'), page.pagestate.get('selectedMonth')))
					this.append(this.TransactionItem, {model:transaction});
			},
			
			TransactionItem:ListItem.extend({
				className:'Transaction',
				
				initialize:function() {
					this.model.bind('change', this.refresh, this);
					
					this.refresh();
				},
				
				refresh:function() {
					this.removeChild();
					
					var displayDate = bu.getTranDateOfSelectedAcc(this.model, page.pagestate.get('selectedAccId'));
					this.append(DateView, {className:'Date', date:displayDate, dateFormat:'$(dd) $(Mmm)', viewName:'tranDate'});
					this.append(TextView, {className:'Desc', text:this.model.get('desc'), viewName:'desc'});
					this.append(AmountView, {className:'Amount', amount:this.model.get('amount'), dp:2, viewName:'amount'});
				},
				
				events:{
					'click':'cbClick'
				},
				
				cbClick:function() {
					page.editTransaction(this.model);
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
				datastore.bind('transactions', 'change', this.digestTransactions, this);
				
				var table = this.append(Table);
				if (table) {
					table.append(this.Header);
					table.append(this.Opening, {viewModel:this.viewModel.get('openings')});
					table.append(this.TranTypeSections, {viewModel:this.viewModel.get('tranTypes')});
					table.append(this.Closing, {viewModel:this.viewModel.get('closings')});
					table.append(this.Difference, {viewModel:this.viewModel.get('closings')});
				}
			},
			
			digestClosings:function() {
				var _openings = [];
				var _closings = [];
				var account = datastore.getAccount(page.pagestate.get('selectedAccId'));
				var year = page.pagestate.get('selectedYear');
				
				var closing = datastore.getClosing(account, year-1, 11);
				for (var i=0; i<12; i++) {
					_openings.push(closing);
					closing = datastore.getClosing(account, year, i);
					_closings.push(closing);
				}
				
				this.viewModel.get('openings').reset(_openings);
				this.viewModel.get('closings').reset(_closings);
			},
			
			digestTransactions:function() {
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
			
			TranTypeSections:TableBody.extend({
				initialize:function() {
					this.viewModel = this.options.viewModel;
					
					this.viewModel.bind('reset', this.refresh, this);
				},
				
				refresh:function() {
					this.removeChild();
					
					for (var i=0; i<this.viewModel.length; i++) {
						this.append(this.TranTypeSection, {viewModel:this.viewModel.at(i)});
					}
				},
				
				TranTypeSection:TableBody.extend({
					initialize:function() {
						this.viewModel = this.options.viewModel;
						
						this.append(TableCell, {className:'Name'}).append(TextView, {model:this.viewModel, fieldName:'name'});
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
	
	AccountEditor:View.extend({
		tagName:'div',
		className:'AccountEditor DialogBackground',
		
		initialize:function() {
			var _this = this;
			
			var editor = this.append(Editor, {viewName:'editor'});
			if (editor) {
				if (!this.model.get('id'))
					editor.setTitle('New Account');
				else
					editor.setTitle(this.model.get('name'));
				
				editor.body.append(TextField, {label:'Account Name', text:this.model.get('name'), viewName:'fldName'});
				editor.body.append(TextField, {label:'Asset Type', text:this.model.get('assetType'), viewName:'fldAssetType'});
				editor.body.append(TextField, {label:'Description', text:this.model.get('desc'), viewName:'fldDesc'});
				editor.body.append(TextField, {label:'Owner', text:this.model.get('accOwner'), viewName:'fldAccOwner'});
				editor.body.append(PickerField, 
					{
						label:'Default Payment Settle Account', 
						collection:datastore.getAccounts(), 
						displayField:'name', 
						withBlank:true, 
						selectModel:this.model.get('defSettleAcc')
					}, 
					'fldDefSettleAcc');
				editor.body.append(CheckboxField, {label:'Delete?', checked:this.model.get('deleted'), viewName:'fldDelete'});
			}
		},
		
		events:{
			'click .BtnSave':'cbClickSave',
			'click .BtnCancel':'cbClickCancel'
		},
		
		cbClickSave:function() {
			var _this = this;
			
			if (this.validate())
				this.save(
					function /*success*/() {
						_this.remove();
					},
					function /*failed*/(msg) {
					}
				);
		},
		
		cbClickCancel:function() {
			this.remove();
		},
		
		validate:function(cbOk, cbFailed) {
			return true;
		},
		
		save:function(cbSuccess, cbFailed) {
			var editor = this.findView('editor');
			var defSettleAcc = editor.findView('fldDefSettleAcc').getSelectedModel();
			
			this.model.set({
				name:editor.findView('fldName').val(),
				assetType:editor.findView('fldAssetType').val(),
				desc:editor.findView('fldDesc').val(),
				accOwner:editor.findView('fldAccOwner').val(),
				defSettleAcc:(defSettleAcc?defSettleAcc.toJSON():null),
				deleted:editor.findView('fldDelete').checked()
			});
			
			datastore.saveAccount(this.model, cbSuccess, cbFailed);
		}
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
				
				var body = this.append(Wrapper, {className:'EditArea'});
				if (body) {
					body.append(PickerField, {
						label:'Account', 
						collection:datastore.getAccounts(),
						formatFn:function(model) {return model.get('name') + ' (' + model.get('accOwner') + ')';}, 
						withBlank:false,
						model:this.model,
						parseFn:function(model) {return {tranxAcc:model.toJSON()};}
					});
					body.append(DateField, {label:'Transaction Date', model:this.model, fieldName:'tranDate'});
					body.append(PickerField, {
						label:'Transaction Type', 
						options:bu.getTranTypes(), 
						model:this.model, 
						parseFn:function(model, idx) {return {tranType:idx};}
					});
					body.append(TextField, {label:'Category', model:this.model, fieldName:'tranxCatg'});
					body.append(TextField, {label:'Description', model:this.model, fieldName:'desc'});
					body.append(AmountField, {label:'Amount', model:this.model, fieldName:'amount'});
					body.append(TextField, {label:'Remarks', model:this.model, fieldName:'remarks'});
					body.append(PickerField, {
						label:'Settle Account', 
						collection:datastore.getAccounts(), 
						formatFn:function(model) {return model.get('name') + ' (' + model.get('accOwner') + ')';}, 
						withBlank:true, 
						model:this.model,
						parseFn:function(model) {return {settleAcc:model.toJSON()};}
					})
						.append(Label, {text:'Date'}).append(DateInput, {model:this.model, fieldName:'settleDate'});
					body.append(PickerField, {
						label:'Claim Account', 
						collection:datastore.getAccounts(), 
						formatFn:function(model) {return model.get('name') + ' (' + model.get('accOwner') + ')';}, 
						withBlank:true, 
						model:this.model,
						parseFn:function(model) {return {settleAcc:model.toJSON()};}
					})
						.append(Label, {text:'Date'}).append(DateInput, {model:this.model, fieldName:'claimDate'});
					body.append(CheckboxField, {label:'Delete?', model:this.model, fieldName:'deleted'});
					
					body.append(Line);
					
					var repeatDiv = body.append(Wrapper, {className:'RepeatFields'});
					if (repeatDiv) {
						if (this.model.get('repeatKey')) 
							repeatDiv.append(CheckboxField, {label:'Auto Repeat?', className:'AutoRepeat', checked:true, viewName:'fldAutoRepeat'});

						var repeatDtl = repeatDiv.append(Wrapper);
						if (repeatDtl) {
							repeatDtl.append(Label, {text:'Repeat:'});
							repeatDtl.append(AmountInput, {className:'InputRepeatTimes', viewName:'fldRepeatTimes'});
							repeatDtl.append(Label, {text:'Times, Every'});
							repeatDtl.append(AmountInput, {className:'InputRepeatMonths', viewName:'fldRepeatMonths'});
							repeatDtl.append(Label, {text:'Months'});
						}

						if (this.model.get('repeatKey')) {
							repeatDtl.findView('fldRepeatTimes').attr('disabled','disabled');
							repeatDtl.findView('fldRepeatMonths').attr('disabled','disabled');
						}
					}
				}
			},
		
			events:{
				'click .BtnSave':'cbClickSave',
				'click .BtnCancel':'cbClickCancel',
				'click .AutoRepeat':'cbClickAutoRepeat',
				'keyup':'cbKeypress'
			},
			
			cbClickSave:function() {
				var _this = this;
				
				if (this.validate()) {
					this.save(
						function /*success*/() {
							_this.remove();
						},
						function /*failed*/(msg) {
						}
					);
				}
			},
			
			cbClickCancel:function() {
				this.remove();
			},
			
			cbClickAutoRepeat:function() {
				var autoRepeat = this.findView('fldAutoRepeat').checked();
				if (!autoRepeat) {
					this.findView('fldRepeatTimes').$el.removeAttr('disabled');
					this.findView('fldRepeatMonths').$el.removeAttr('disabled');
				}
				else {
					this.findView('fldRepeatTimes').$el.attr('disabled','disabled');
					this.findView('fldRepeatMonths').$el.attr('disabled','disabled');
				}
			},
			
			cbKeypress:function(evt) {
				if (evt.keyCode == 27) {
					this.remove();
				}
			},
			
			validate:function(cbOk, cbFailed) {
				return true;
			},
			
			save:function(cbSuccess, cbFailed) {
				var editor = this.findView('editor');
				var tranxAcc = editor.body.findView('fldTranxAcc').getSelectedModel();
				var settleAcc = editor.body.findView('fldSettleAcc').getSelectedModel();
				var claimAcc = editor.body.findView('fldClaimAcc').getSelectedModel();
				var repeatTimes = editor.body.findView('fldRepeatTimes').val();
				var repeatMonths = editor.body.findView('fldRepeatMonths').val();
				var autoRepeat = editor.body.findView('fldAutoRepeat')?editor.body.findView('fldAutoRepeat').checked():false;
				
				this.model.set({
					tranDate:editor.body.findView('fldTranDate').val(),
					tranType:editor.body.findView('fldTranType').getSelectedIdx(),
					amount:editor.body.findView('fldAmount').val(),
					desc:editor.body.findView('fldDesc').val(),
					tranxCatg:editor.body.findView('fldTranxCatg').val(),
					remarks:editor.body.findView('fldRemarks').val(),
	
					tranxAcc:(tranxAcc?tranxAcc.toJSON():null),
					settleAcc:(settleAcc?settleAcc.toJSON():null),
					claimAcc:(claimAcc?claimAcc.toJSON():null),
					deleted:editor.body.findView('fldDelete').checked()
				});
							
				if (autoRepeat)
					datastore.saveTransactionRepeat(this.model, {auto:true}, cbSuccess, cbFailed);
				else if (repeatTimes > 1)
					datastore.saveTransactionRepeat(this.model, {times:repeatTimes, months:repeatMonths, auto:false}, cbSuccess, cbFailed);
				else
					datastore.saveTransaction(this.model, cbSuccess, cbFailed);
			}
		})
	}),
	
	AssetEditor:View.extend({
		tagName:'div',
		className:'AssetEditor DialogBackground',
		
		initialize:function() {
			var _this = this;
			
			var editor = this.append(Editor, {viewName:'editor'});
			if (editor) {
				if (!this.model.get('id'))
					editor.setTitle('New Asset');
				else
					editor.setTitle(this.model.get('name'));
				
				editor.body.append(TextField, {label:'Asset Type', text:this.model.get('type'), viewName:'fldAssetType'});
				editor.body.append(TextField, {label:'Asset Name', text:this.model.get('name'), viewName:'fldName'});
				editor.body.append(CheckboxField, {label:'Discontinue?', checked:this.model.get('discontinued'), viewName:'fldDiscontinued'});
			}
		},
		
		events:{
			'click .BtnSave':'cbClickSave',
			'click .BtnCancel':'cbClickCancel'
		},
		
		cbClickSave:function() {
			var _this = this;
			
			if (this.validate())
				this.save(
					function /*success*/() {
						_this.remove();
					},
					function /*failed*/(msg) {
					}
				);
		},
		
		cbClickCancel:function() {
			this.remove();
		},
		
		validate:function(cbOk, cbFailed) {
			return true;
		},
		
		save:function(cbSuccess, cbFailed) {
			var editor = this.findView('editor');
			
			this.model.set({
				type:editor.findView('fldAssetType').val(),
				name:editor.findView('fldName').val(),
				discontinued:editor.findView('fldDiscontinued').checked()
			});
						
			datastore.saveAsset(this.model, cbSuccess, cbFailed);
		}
	})
});