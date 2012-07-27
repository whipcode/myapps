Main = View.extend({
	working:{
	},
	
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
		var appWrapper = this.append(Wrapper, {className:'AppWrapper'}, 'appWrapper');
		if (appWrapper) {
			appWrapper.append(this.PageMenu, {}, 'pageMenu');
			var taskViews = appWrapper.append(ViewsWrapper, {className:'TaskViews'}, 'taskViews');
			if (taskViews) {
				taskViews
					.addView(this.TransactionView, {}, 'transactionView')
					.addView(this.SummaryView, {}, 'summaryView')
					.setViewMode('normal');
			}
		}
		
		return this;
	},
	
	run:function() {
		datastore.loadAccounts(
			function /*success*/() {
				datastore.loadTransactions(page.getSelectedYear(), page.getSelectedAccount(), page.getSelectedMonth(),
					function /*success*/() {
					},
					function /*failed*/() {
					}
				);
			},
			function /*failed*/() {
			}
		);
	},
	
	getSelectedAccount:function() {
		return this.getView('appWrapper').getView('pageMenu').getView('accountPicker').getSelectedModel();
	},
	
	getSelectedYear:function() {
		return this.getView('appWrapper').getView('pageMenu').getView('year').val();
	},
	
	getSelectedMonth:function() {
		return this.getView('appWrapper').getView('taskViews').getView('transactionView').getView('menu').getView('monthPicker').getSelectedMonth();
	},
	
	editAccount:function(account) {
		this.append(this.AccountEditor, {model:account}, 'accountEditor');
	},
	
	editTransaction:function(transaction) {
		this.append(this.TransactionEditor, {model:transaction}, 'transactionEditor');
	},
	
	events:{
	},
	
	PageMenu:View.extend({
		tag:'div',
		className:'PageMenu',
		
		initialize:function() {
			this.append(CollectionPickerField, 
				{
					label:'Account', 
					className:'AccountPicker', 
					collection:datastore.getAccounts(), 
					displayField:'name'
				}, 
				'accountPicker');
			this.append(TextField, {label:'Year', className:'PickYear', text:new Date().getFullYear()}, 'year');
			this.append(Button, {label:'New',className:'BtnNewAcc'}, 'btnNewAcc');
			this.append(Button, {label:'Edit',className:'BtnEditAcc'}, 'btnEditAcc');
		},
		
		events:{
			'click .BtnNewAcc':'cbBtnNewAccClick',
			'click .BtnEditAcc':'cbBtnEditAccClick'
		},
		
		cbBtnNewAccClick:function() {
			page.editAccount(new Account());
		},
		
		cbBtnEditAccClick:function() {
			var accountPicker = this.getView('accountPicker');
			var account = accountPicker.getSelectedModel();
			
			page.editAccount(account);
		}
	}),
	
	TransactionView:View.extend({
		tag:'div',
		className:'TransactionView',
		
		initialize:function() {
			this.render();
		},
		
		render:function() {
			this.append(this.Menu, {}, 'menu');
			this.append(this.TransactionList, {}, 'transactionList');
			this.append(this.FootMenu, {}, 'footMenu');
			
			return this;
		},
		
		Menu:View.extend({
			tagName:'div',
			className:'Menu',
			
			initialize:function() {
				this.render();
			},
			
			render:function() {
				this.append(this.MonthPicker, {}, 'monthPicker');
				this.append(PickerField, {label:'Filter', className:'PickFilter', options:[]}, 'pickFilter');
				
				return this;
			},
			
			MonthPicker:View.extend({
				tagName:'div',
				className:'MonthPicker',
				
				initialize:function() {
					this.append(Label, {text:'Month'});
					this.append(Picker, {options:util.getMonthNames(), idx:new Date().getMonth()}, 'picker');
				},
				
				getSelectedMonth:function() {
					return this.getView('picker').getSelectedIdx();
				},
				
				events:{
				}
			})
		}),
		
		TransactionList:View.extend({
			tagName:'ul',
			className:'TransactionList',
			
			initialize:function() {
				this.collection = datastore.getListedTransactions();
				
				this.collection.bind('add', this.add, this);
				this.collection.bind('reset', this.refresh, this);
				this.collection.bind('remove', this.remove, this);
			},
			
			refresh:function() {
				this.html('');
				
				for (var i=0; i<this.collection.length; i++) {
					this.add(this.collection.at(i));
				}
			},
			
			add:function(transaction) {
				this.append(this.TransactionItem, {model:transaction});
			},
			
			TransactionItem:View.extend({
				tagName:'li',
				className:'Transaction',
				
				initialize:function() {
					this.model.bind('change', this.refresh, this);
					
					this.refresh();
				},
				
				refresh:function() {
					this.html('');
					
					this.append(Paragraph, {text:util.formatDate(this.model.get('tranDate'), "$(Mmm) $(dd)")}, 'tranDate');
					this.append(Paragraph, {text:this.model.get('desc')}, 'desc');
					this.append(Paragraph, {text:util.formatAmount(this.model.get('amount'))}, 'amount');
				}
			})
		}),
		
		FootMenu:View.extend({
			tagName:'div',
			className:'FootMenu',
			
			initialize:function() {
				this.append(Button, {label:'Add', className:'BtnAddTranx'}, 'btnAddTranx');
			},
			
			events:{
				'click .BtnAddTranx':'cbBtnAddTranxClick'
			},
			
			cbBtnAddTranxClick:function() {
				page.editTransaction(new Transaction);
			}
		})
	}),
	
	SummaryView:View.extend({
		tag:'div',
		className:'SummaryView',
		
		initialize:function() {
			this.render();
		},
		
		render:function() {
			this.append(this.Navigator, {}, 'navigator');
			this.append(ViewsWrapper, {className:'Summaries'}, 'summaries')
				.addView(this.AccountSummary, {}, 'accountSummary')
				.addView(this.AssetSummary, {}, 'assetSummary')
				.setActiveView('accountSummary');
			
			return this;
		},
		
		Navigator:View.extend({
			tagName:'div',
			className:'Navigator',
			
			initialize:function() {
				this.render();
			},
			
			render:function() {
				this.html('');
				
				this.append(Link, {label:'Account Summary', className:'LnkAccountSummary'}, 'lnkAccountSummary');
				this.append(Link, {label:'Asset Summary', className:'LnkAssetSummary'}, 'lnkAssetSummary');
				this.append(Link, {label:'Reminders', className:'LnkReminders'}, 'lnkReminders');
				
				return this;
			}
		}),
		
		AccountSummary:View.extend({
			tagName:'div',
			className:'AccountSummary',
			
			initialize:function() {
				this.render();
			},
			
			render:function() {
				this.html('');
				
				return this;
			},
			
			onActivate:function() {
			},
			
			onInactivate:function() {
			}
		}),
		
		AssetSummary:View.extend({
			tagName:'div',
			className:'AssetSummary',
			
			initialize:function() {
				this.render();
			},
			
			render:function() {
				this.html('');
				
				return this;
			},
			
			onActivate:function() {
			},
			
			onInactivate:function() {
			}
		})
	}),
	
	AccountEditor:View.extend({
		tagName:'div',
		className:'AccountEditor DialogBackground',
		
		initialize:function() {
			var _this = this;
			
			var editor = this.append(Editor, {}, 'editor');
			if (editor) {
				if (!this.model.get('id'))
					editor.setTitle('New Account');
				else
					editor.setTitle(this.model.get('name'));
				
				editor.add(TextField, {label:'Account Name', text:this.model.get('name')}, 'fldName');
				editor.add(PickerField, {label:'Account Type', options:bu.getAccTypes(), value:this.model.get('accType')}, 'fldAccType');
				editor.add(TextField, {label:'Asset Type', text:this.model.get('assetType')}, 'fldAssetType');
				editor.add(TextField, {label:'Description', text:this.model.get('desc')}, 'fldDesc');
				editor.add(TextField, {label:'Owner', text:this.model.get('accOwner')}, 'fldAccOwner');
				editor.add(CollectionPickerField, 
					{
						label:'Default Payment Settle Account', 
						collection:datastore.getAccounts(), 
						displayField:'name', 
						withBlank:true, 
						selectModel:this.model.get('defSettleAcc')
					}, 
					'fldDefSettleAcc');
				editor.add(CheckboxField, {label:'Delete?', checked:this.model.get('deleted')}, 'fldDelete');
				
				editor.onSave(function() {
					_this.validate(
						function /*ok*/() {
							_this.save(
								function /*success*/() {
									_this.remove();
								},
								function /*failed*/(msg) {
								}
							);
						},
						function /*failed*/() {}
					);
				});
				
				editor.onCancel(function() {
					_this.remove();
				});
			}
		},
		
		validate:function(cbOk, cbFailed) {
			if (cbOk) cbOk();
			else if (cbFailed) cbFailed();
		},
		
		save:function(cbSuccess, cbFailed) {
			var editor = this.getView('editor');
			var defSettleAcc = editor.get('fldDefSettleAcc').getSelectedModel();
			
			this.model.set({
				name:editor.get('fldName').val(),
				accType:editor.get('fldAccType').getSelectedIdx(),
				assetType:editor.get('fldAssetType').val(),
				desc:editor.get('fldDesc').val(),
				accOwner:editor.get('fldAccOwner').val(),
				defSettleAcc:(defSettleAcc?defSettleAcc.toJSON():null),
				deleted:editor.get('fldDelete').checked()
			});
			
			datastore.saveAccount(this.model, cbSuccess, cbFailed);
		}
	}),
	
	TransactionEditor:View.extend({
		tagName:'div',
		className:'TransactionEditor DialogBackground',
		
		initialize:function() {
			var _this = this;
			
			var editor = this.append(Editor, {}, 'editor');
			if (editor) {
				if (!this.model.get('id'))
					editor.setTitle('New Transaction');
				else
					editor.setTitle(this.model.get('desc'));
				
				editor.add(Paragraph, {tagName:'h2', text:page.getSelectedAccount().get('name')});
				editor.add(DateField, {label:'Transaction Date', date:this.model.get('tranDate')}, 'fldTranDate');
				editor.add(PickerField, {label:'Transaction Type', options:bu.getTranTypes(), value:this.model.get('tranType')}, 'fldTranType');
				editor.add(TextField, {label:'Category', text:this.model.get('tranxCatg')}, 'fldTranxCatg');
				editor.add(TextField, {label:'Description', text:this.model.get('desc')}, 'fldDesc');
				editor.add(AmountField, {label:'Amount', text:this.model.get('amount')}, 'fldAmount');
				editor.add(TextField, {label:'Remarks', text:this.model.get('remarks')}, 'fldRemarks');
				editor.add(CollectionPickerField, 
					{
						label:'Settle Account', 
						collection:datastore.getAccounts(), 
						displayField:'name', 
						withBlank:true, 
						selectModel:this.model.get('settleAcc')
					}, 
					'fldSettleAcc');
				editor.add(CheckboxField, {label:'Delete?', checked:this.model.get('deleted')}, 'fldDelete');
				
				editor.onSave(function() {
					_this.validate(
						function /*ok*/() {
							_this.save(
								function /*success*/() {
									_this.remove();
								},
								function /*failed*/(msg) {
								}
							);
						},
						function /*failed*/() {}
					);
				});
				
				editor.onCancel(function() {
					_this.remove();
				});
			}
		},
		
		validate:function(cbOk, cbFailed) {
			if (cbOk) cbOk();
			else if (cbFailed) cbFailed();
		},
		
		save:function(cbSuccess, cbFailed) {
			var editor = this.getView('editor');
			var tranxAcc = page.getSelectedAccount();
			var settleAcc = editor.get('fldSettleAcc').getSelectedModel();
			
			this.model.set({
				tranDate:editor.get('fldTranDate').val(),
				bankDate:editor.get('fldTranDate').val(),
				tranType:editor.get('fldTranType').getSelectedIdx(),
				amount:editor.get('fldAmount').val(),
				desc:editor.get('fldDesc').val(),
				tranxCatg:editor.get('fldTranxCatg').val(),
				remarks:editor.get('fldRemarks').val(),

				tranxAcc:(tranxAcc?tranxAcc.toJSON():null),
				settleAcc:(settleAcc?settleAcc.toJSON():null),
				deleted:editor.get('fldDelete').checked()
			});
			
			datastore.saveTransaction(this.model, cbSuccess, cbFailed);
		}
	})
});