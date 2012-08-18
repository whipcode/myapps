Main = View.extend({
	viewModels:{},
	working:{
	},
	
	initialize:function() {
		var _this = this;
		bu.init(
			function /*success*/() {
				datastore.init();
				_this.initViewModels();
				_this.render();
				_this.run();
			}
		);
	},
	
	initViewModels:function() {
		this.setupAssetSummaryViewModel();
	},
	
	setViewModel:function(modelName, ModelType, data) {
		this.viewModels[modelName] = new ModelType(data);
	},
	
	getViewModel:function(modelName) {
		return this.viewModels[modelName];
	},
	
	setupAssetSummaryViewModel:function() {
		this.setViewModel('assetSummary', Model, {
			assetOwners:new Collection([{name:'Home'},{name:'Papa'},{name:'Mama'},{name:'Lok Lok'}]),
			accountAssetTypes:new Collection(),
			individualAssetTypes:new Collection(),
			ownerTotals:new Model({Home:0.00, Papa:0.00, Mama:0.00, 'Lok Lok':0.00}),
			total:new Model({amount:0.00})
		});
		
		datastore.bind('accounts', 'reset', this.resetAccountAssetTypes, this);
		datastore.bind('accounts', 'change', this.resetAccountAssetTypes, this);
		datastore.bind('transactions', 'reset', this.resetAccountAssetTypes, this);
		datastore.bind('transactions', 'change', this.resetAccountAssetTypes, this);
		datastore.bind('closings', 'reset', this.resetAccountAssetTypes, this);
		datastore.bind('closings', 'change', this.resetAccountAssetTypes, this);
		
		datastore.bind('assets', 'reset', this.resetIndividualAssetTypes, this);
		datastore.bind('assets', 'change', this.resetIndividualAssetTypes, this);
		datastore.bind('assetRates', 'reset', this.resetIndividualAssetTypes, this);
		datastore.bind('assetRates', 'change', this.resetIndividualAssetTypes, this);
		datastore.bind('assetAmounts', 'reset', this.resetIndividualAssetTypes, this);
		datastore.bind('assetAmounts', 'change', this.resetIndividualAssetTypes, this);
	},
	
	resetAccountAssetTypes:function() {
		var _accountAssetTypes = {};
		var selectedYear = page.getSelectedYear();
		var selectedMonth = page.getSelectedMonth();
		
		var accounts = datastore.getAccounts();
		for (var i=0; i<accounts.length; i++) {
			var account = accounts.at(i);
			var assetType = account.get('assetType');
			var accOwner = account.get('accOwner');

			if (assetType && accOwner) {
				var closing = datastore.getClosing(account, selectedYear, selectedMonth);
				
				if (!_accountAssetTypes[assetType]) 
					_accountAssetTypes[assetType] = {
						name:assetType, 
						ownerTotals:{Home:null,Papa:null,Mama:null,'Lok Lok':null},
						total:0.0,
						assets:[]
					};
				
				_accountAssetTypes[assetType].ownerTotals[accOwner] += closing.get('amount');
				_accountAssetTypes[assetType].total += closing.get('amount');
				_accountAssetTypes[assetType].assets.push({account:account, closing:closing, total:closing.get('amount')});
			}
		}
		
		page.getViewModel('assetSummary').get('accountAssetTypes').reset(util.toArray(_accountAssetTypes));
	},
	
	resetIndividualAssetTypes:function() {
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
				datastore.loadTransactions(page.getSelectedYear(),
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
		return this.findView('pageMenu').findView('accountPicker').getSelectedModel();
	},
	
	getSelectedYear:function() {
		return this.findView('pageMenu').findView('year').val();
	},
	
	getSelectedMonth:function() {
		return this.findView('taskViews').findView('transactionView').findView('menu').findView('monthPicker').getSelectedMonth();
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
			this.append(TextField, {label:'Year', className:'PickYear', text:new Date().getFullYear()}, 'year');
			this.append(CollectionPickerField, 
				{
					label:'Account', 
					className:'AccountPicker', 
					collection:datastore.getAccounts(), 
					displayField:'name'
				}, 
				'accountPicker');
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
			var accountPicker = this.findView('accountPicker');
			var account = accountPicker.getSelectedModel();
			
			page.editAccount(account);
		}
	}),
	
	TransactionView:View.extend({
		tag:'div',
		className:'TransactionView',
		
		initialize:function() {
			this.append(this.Menu, {}, 'menu');
			this.append(this.TransactionList, {}, 'transactionList');
			this.append(this.FootMenu, {}, 'footMenu');
		},
		
		Menu:View.extend({
			tagName:'div',
			className:'Menu',
			
			initialize:function() {
				this.append(this.MonthPicker, {}, 'monthPicker');
			},
			
			MonthPicker:View.extend({
				tagName:'div',
				className:'MonthPicker',
				
				initialize:function() {
					this.append(Label, {text:'Month'});
					this.append(Picker, {options:util.getMonthNames(), idx:new Date().getMonth()}, 'picker');
				},
				
				getSelectedMonth:function() {
					return this.findView('picker').getSelectedIdx();
				},
				
				events:{
					'change':'cbChange'
				},
				
				cbChange:function() {
					var transactionView = this.findParent('transactionView');
					if (transactionView)
						transactionView.findView('transactionList').refresh();
				}
			})
		}),
		
		TransactionList:View.extend({
			tagName:'ul',
			className:'TransactionList',
			
			initialize:function() {
				this.collection = datastore.getTransactions();
				
				this.collection.bind('reset', this.refresh, this);
				this.collection.bind('add', this.refresh, this);
				this.collection.bind('remove', this.refresh, this);
			},
			
			refresh:function() {
				this.html('');

				for (var i=0; i<this.collection.length; i++) {
					this.add(this.collection.at(i));
				}
			},
			
			add:function(transaction) {
				if (bu.isSelectedMonthAccount(transaction, page.getSelectedAccount(), page.getSelectedMonth()))
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
				},
				
				events:{
					'click':'cbClick'
				},
				
				cbClick:function() {
					page.editTransaction(this.model);
				}
			})
		}),
		
		FootMenu:View.extend({
			tagName:'div',
			className:'FootMenu',
			
			initialize:function() {
				this.append(Button, {label:'Add', className:'BtnAddTranx'}, 'btnAddTranx');
				this.append(Button, {label:'Find', className:'BtnFindTranx'}, 'btnFindTranx');
			},
			
			events:{
				'click .BtnAddTranx':'cbBtnAddTranxClick'
			},
			
			cbBtnAddTranxClick:function() {
				page.editTransaction(new Transaction({tranxAcc:page.getSelectedAccount().toJSON()}));
			}
		})
	}),
	
	SummaryView:View.extend({
		tag:'div',
		className:'SummaryView',
		
		initialize:function() {
			this.append(this.Navigator, {}, 'navigator');
			this.append(ViewsWrapper, {className:'Summaries'}, 'summaries')
				.addView(this.AccountSummary, {}, 'accountSummary')
				.addView(this.AssetSummary, {}, 'assetSummary')
				.setActiveView('accountSummary');
		},
		
		switchView:function(id) {
			this.findView('summaries').setActiveView(id);
		},
		
		Navigator:View.extend({
			tagName:'div',
			className:'Navigator',
			
			initialize:function() {
				this.append(Link, {label:'Account Summary', className:'LnkAccountSummary'}, 'lnkAccountSummary');
				this.append(Link, {label:'Asset Summary', className:'LnkAssetSummary'}, 'lnkAssetSummary');
			},
			
			events:{
				'click .LnkAccountSummary':'cbLnkAccountSummaryClick',
				'click .LnkAssetSummary':'cbLnkAssetSummaryClick'
			},
			
			cbLnkAccountSummaryClick:function() {
				var summaryView = this.findParent('summaryView');
				if (summaryView)
					summaryView.switchView('accountSummary');
			},
			
			cbLnkAssetSummaryClick:function() {
				var summaryView = this.findParent('summaryView');
				if (summaryView)
					summaryView.switchView('assettSummary');
			}
		}),
		
		AccountSummary:View.extend({
			tagName:'div',
			className:'AccountSummary',
			
			initialize:function() {
				var table = this.append(Table, {}, 'table');
				if (table) {
					table.append(this.AccountSummaryHeader, {}, 'header');
					table.append(this.AccountSummaryOpening, {}, 'opening');
					table.append(this.AccountSummarySection, {tranType:bu.TRANTYPE.INCOME}, 'incomes');
					table.append(this.AccountSummarySection, {tranType:bu.TRANTYPE.EXPENDITURE}, 'expenditures');
					table.append(this.AccountSummarySection, {tranType:bu.TRANTYPE.INVESTMENT}, 'investments');
					table.append(this.AccountSummarySection, {tranType:bu.TRANTYPE.TRANSFER}, 'transfers');
					table.append(this.AccountSummaryClosing, {}, 'closing');
				}
			},
			
			onActivate:function() {
			},
			
			onInactivate:function() {
			},
			
			AccountSummaryHeader:View.extend({
				tagName:'thead',
				className:'Header',
				
				initialize:function() {
					var row = this.append(TableRow);
					
					row.append(TableCell, {className:'ColName'});
					
					for (var i=0; i<12; i++)
						row.append(TableCell, {className:'ColMonth'}).html(util.getMonthName(i));
				}
			}),
			
			AccountSummaryOpening:View.extend({
				tagName:'thead',
				className:'Opening',
				
				initialize:function() {
					this.collection = datastore.getClosings();
					
					this.collection.bind('reset', this.refresh, this);
					
				},
				
				refresh:function() {
					this.html('');

					var row = this.append(TableRow, {}, 'row');
					if (row) {
						row.append(TableHeaderCell, {className:'ColName',text:'Opening'});
						
						var opening = datastore.getClosing(page.getSelectedAccount(), page.getSelectedYear()-1, 11);
						row.append(this.OpeningCell, {model:opening});
						
						for (var i=0; i<11; i++) {
							opening = datastore.getClosing(page.getSelectedAccount(), page.getSelectedYear(), i);
							row.append(this.OpeningCell, {model:opening});
						}
					}
				},
				
				OpeningCell:View.extend({
					tagName:'td',
					className:'ColMonth',
					
					initialize:function() {
						this.model.bind('change', this.refresh, this);
						
						this.append(AmountInput, {amount:this.model.get('amount')}, 'input');
					},
					
					refresh:function() {
						var amount = this.findView('input');
						amount.val(this.model.get('amount'));
					},
					
					events:{
						'change':'cbChange'
					},
					
					cbChange:function() {
						var amount = this.findView('input').val();
						this.model.set({amount:amount, overriden:true});
						datastore.saveClosing(this.model);
					}
				})
			}),
			
			AccountSummarySection:View.extend({
				tagName:'tbody',
				className:'Section',
				
				initialize:function() {
					this.collection = datastore.getTransactions();
					
					this.collection.bind('reset', this.refresh, this);
					this.collection.bind('add', this.refresh, this);
					this.collection.bind('remove', this.refresh, this);
					
					this.subtotals = [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00];
				},
				
				refresh:function() {
					this.html('');

					/* initialize summary tables variables */
					var transactions = this.collection;
					this.subtotals = [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00];
					var categories = {};
					
					/* formulate summary table contents */
					for (var i=0; i<transactions.length; i++) {
						var transaction = transactions.at(i);

						if (transaction.get('tranType')==this.options.tranType && bu.isSelectedAccount(transaction, page.getSelectedAccount())) {
							var tranxCatg = transaction.get('tranxCatg');
							var tranMonth = bu.getSelectedAccountTranDate(transaction, page.getSelectedAccount()).getMonth();
							var amount = transaction.get('amount');
							
							if (!categories[tranxCatg])
								categories[tranxCatg] = [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00];
							
							categories[tranxCatg][tranMonth] += amount;
							this.subtotals[tranMonth] += amount;
						}
					}
					
					/* render category summary row */
					var row = this.append(TableRow);
					if (row) {
						row.append(TableHeaderCell, {className:'ColName',text:bu.getTranType(this.options.tranType)});
						
						for (var i=0; i<12; i++) {
							row.append(TableCell, {className:'ColMonth', text:util.formatAmount(this.subtotals[i],2)});
						}
					}
					
					/* render category summary detail rows */
					for (var a in categories) {
						var row = this.append(TableRow);
						if (row) {
							row.append(TableHeaderCell, {className:'ColName',text:a});
							
							for (var i=0; i<categories[a].length; i++) {
								row.append(TableCell, {className:'ColMonth', text:util.formatAmount(categories[a][i],2)});
							}
						}
					}
				},
				
				getSubtotals:function() {
					return this.subtotals;
				}
			}),
			
			AccountSummaryClosing:View.extend({
				tagName:'tfoot',
				className:'Closing',
				
				initialize:function() {
					this.collection = datastore.getClosings();
					
					this.collection.bind('reset', this.refresh, this);
				},
				
				refresh:function() {
					this.html('');
					
					/* Closing row */
					var row = this.append(TableRow, {}, 'row');
					if (row) {
						row.append(TableHeaderCell, {className:'ColName',text:'Closing'});
						
						for (var i=0; i<12; i++) {
							var closing = datastore.getClosing(page.getSelectedAccount(), page.getSelectedYear(), i);
							row.append(this.ClosingCell, {model:closing});
						}
					}

					/* Diff row */
					row = this.append(TableRow, {}, 'row');
					if (row) {
						row.append(TableHeaderCell, {className:'ColName',text:'Differences'});
						
						for (var i=0; i<12; i++) {
							var closing = datastore.getClosing(page.getSelectedAccount(), page.getSelectedYear(), i);
							row.append(this.DiffCell, {model:closing});
						}
					}
				},
				
				ClosingCell:View.extend({
					tagName:'td',
					className:'ColMonth',
					
					initialize:function() {
						this.model.bind('change', this.refresh, this);
						
						this.append(AmountInput, {amount:this.model.get('amount')}, 'input');
					},
					
					refresh:function() {
						var amount = this.findView('input');
						amount.val(this.model.get('amount'));
					},
					
					events:{
						'change':'cbChange'
					},
					
					cbChange:function() {
						var amount = this.findView('input').val();
						this.model.set({amount:amount, overriden:true});
						datastore.saveClosing(this.model);
					}
				}),
				
				DiffCell:View.extend({
					tagName:'td',
					className:'ColMonth',
					
					initialize:function() {
						this.model.bind('change', this.refresh, this);
						
						this.append(Amount, {amount:this.model.get('diff')}, 'amount');
					},
					
					refresh:function() {
						var amount = this.findView('amount');
						amount.val(this.model.get('diff'));
					}
				})
			})
		}),
		
		AssetSummary:View.extend({
			tagName:'div',
			className:'AssetSummary',
			
			initialize:function() {
				var table = this.append(Table);
				if (table) {
					table.append(this.Header);
					table.append(this.AccountAssetSection);
					table.append(this.IndividualAssetSection);
					table.append(this.Total);
				}
			},
			
			onActivate:function() {
			},
			
			onInactivate:function() {
			},
			
			Header:View.extend({
				tagName:'thead',
				
				initialize:function() {
					this.collection = page.getViewModel('assetSummary').get('assetOwners');
					this.collection.bind('reset', this.refresh, this);
					
					this.refresh();
				},
				
				refresh:function() {
					this.html('');
					
					var tr = this.append(TableRow);
					if (tr) {
						tr.append(TableHeaderCell, {className:'AssetCol'});
						for (var i=0; i<this.collection.length; i++) {
							tr.append(TableHeaderCell, {text:this.collection.at(i).get('name')});
						}
						tr.append(TableHeaderCell, {className:'TotalCol', text:'Total'});
					}
				}
			}),
			
			AccountAssetSection:View.extend({
				tagName:'tbody',
				
				initialize:function() {
					this.collection = page.getViewModel('assetSummary').get('accountAssetTypes');
					this.collection.bind('reset', this.refresh, this);
					
					this.refresh();
				},
				
				refresh:function() {
					this.html('');
					
					var assetOwners = page.getViewModel('assetSummary').get('assetOwners');
					
					for (var i=0; i<this.collection.length; i++) {
						var accountAssetType = this.collection.at(i);
						var assetTypeName = accountAssetType.get('name');
						var ownerTotals = accountAssetType.get('ownerTotals');
						var total = accountAssetType.get('total');
						var assets = accountAssetType.get('assets');
						
						/* render assetType row */
						var tr = this.append(TableRow, {className:'AssetType'});
						if (tr) {
							tr.append(TableHeaderCell, {className:'AssetCol', text:assetTypeName});
							
							for (var o=0; o<assetOwners.length; o++) {
								var ownerTotal = ownerTotals[assetOwners.at(o).get('name')];
								if (ownerTotal != null)
									tr.append(TableCell).append(Amount, {value:ownerTotal});
								else
									tr.append(TableCell);
							}

							if (total != null)
								tr.append(TableHeaderCell, {className:'TotalCol'}).append(Amount, {value:total});
							else
								tr.append(TableHeaderCell, {className:'TotalCol'});
						}
						
						/* render account rows */
						for (var j=0; j<assets.length; j++) {
							var asset = assets[j];
							var account = asset.account;
							var closing = asset.closing;
							var total = asset.total;
							
							var tr = this.append(TableRow, {className:'Account'});
							if (tr) {
								tr.append(TableHeaderCell, {className:'AssetCol', text:account.get('name')});
								
								for (var o=0; o<assetOwners.length; o++) {
									if (account.get('accOwner') == assetOwners.at(o).get('name'))
										tr.append(TableCell).append(Amount, {value:closing.get('amount')});
									else
										tr.append(TableCell);
								}

								tr.append(TableHeaderCell, {className:'TotalCol'}).append(Amount, {value:total});
							}
							
						}
					}
				}
			}),
			
			IndividualAssetSection:View.extend({
			}),
			
			Total:View.extend({
			})
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
			var editor = this.findView('editor');
			var defSettleAcc = editor.get('fldDefSettleAcc').getSelectedModel();
			
			this.model.set({
				name:editor.get('fldName').val(),
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
				
				editor.add(Paragraph, {tagName:'h2', text:this.model.get('tranxAcc').name});
				editor.add(CollectionPickerField, 
					{
						label:'Account', 
						collection:datastore.getAccounts(), 
						displayField:'name', 
						withBlank:false, 
						selectedId:this.model.get('tranxAcc')?this.model.get('tranxAcc').id:0
					}, 
					'fldTranxAcc');
				editor.add(DateField, {label:'Transaction Date', date:this.model.get('tranDate')}, 'fldTranDate');
				editor.add(PickerField, {label:'Transaction Type', options:bu.getTranTypes(), value:this.model.get('tranType')}, 'fldTranType');
				editor.add(TextField, {label:'Category', text:this.model.get('tranxCatg')}, 'fldTranxCatg');
				editor.add(TextField, {label:'Description', text:this.model.get('desc')}, 'fldDesc');
				editor.add(AmountField, {label:'Amount', amount:this.model.get('amount')}, 'fldAmount');
				editor.add(TextField, {label:'Remarks', text:this.model.get('remarks')}, 'fldRemarks');
				editor.add(CollectionPickerField, 
					{
						label:'Settle Account', 
						collection:datastore.getAccounts(), 
						displayField:'name', 
						withBlank:true, 
						selectedId:this.model.get('settleAcc')?this.model.get('settleAcc').id:0
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
			var editor = this.findView('editor');
			var tranxAcc = editor.get('fldTranxAcc').getSelectedModel();
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