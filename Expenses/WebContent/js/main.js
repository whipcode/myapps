Main = View.extend({
	pageState:new Model(),
	viewModels:{},
	working:{
	},
	
	initialize:function() {
		var _this = this;
		bu.init(
			function /*success*/() {
				datastore.init();
				viewmodels.init();
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
		return util.get(this.viewModels, modelName);
	},
	
	setupAssetSummaryViewModel:function() {
		this.setViewModel('assetSummary', Model, {
			accountAssetTypes:new Collection(),
			individualAssetTypes:new Collection(),
			ownerTotals:new Model({'Home':0.00, 'Papa':0.00, 'Mama':0.00, 'Lok Lok':0.00, 'Total':0.00})
		});
		
		datastore.bind('accounts', 'reset', this.resetAccountAssetTypes, this);
		datastore.bind('accounts', 'change', this.resetAccountAssetTypes, this);
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
			var accountName = account.get('name');
			var accOwner = account.get('accOwner');

			if (assetType && accOwner) {
				if (!_accountAssetTypes[assetType]) 
					_accountAssetTypes[assetType] = {
						name:assetType, 
						ownerTotals:{Home:null,Papa:null,Mama:null,'Lok Lok':null},
						total:0.00,
						accounts:{}
					};
				
				var accountAssetType = _accountAssetTypes[assetType];
				var closing = datastore.getClosing(account, selectedYear, selectedMonth);
				
				accountAssetType.ownerTotals[accOwner] += closing.get('amount');
				accountAssetType.total += closing.get('amount');
				
				if (!accountAssetType.accounts[accountName]) {
					accountAssetType.accounts[accountName] = {
						account:account,
						closings:{},
						total:0.00
					};
				}

				accountAssetType.accounts[accountName].closings[accOwner] = closing;
				accountAssetType.accounts[accountName].total += closing.get('amount');
			}
		}
		
		page.getViewModel('assetSummary.accountAssetTypes').reset(util.toArray(_accountAssetTypes));
		this.resetAssetTotals();
	},
	
	resetIndividualAssetTypes:function() {
		var _individualAssetTypes = {};
		var selectedYear = page.getSelectedYear();
		var selectedMonth = page.getSelectedMonth();
		
		var assets = datastore.getAssets();
		for (var i=0; i<assets.length; i++) {
			var asset = assets.at(i);
			var assetName = asset.get('name');
			var assetType = asset.get('type');
			
			if (!_individualAssetTypes[assetType]) {
				_individualAssetTypes[assetType] = {
					name:assetType,
					ownerTotals:{Home:null,Papa:null,Mama:null,'Lok Lok':null},
					assets:{},
					total:0.00
				};
			}
			
			if (!_individualAssetTypes[assetType].assets[assetName]) {
				_individualAssetTypes[assetType].assets[assetName] = {
					asset:asset,
					assetRate:datastore.getAssetRate(asset, selectedYear, selectedMonth),
					assetAmounts:{},
					total:0.00
				};
			}
			
			for (var ownerName in _individualAssetTypes[assetType].ownerTotals) {
				var assetAmount = datastore.getAssetAmount(_individualAssetTypes[assetType].assets[assetName].assetRate, ownerName);
				_individualAssetTypes[assetType].assets[assetName].assetAmounts[ownerName] = assetAmount;
				_individualAssetTypes[assetType].assets[assetName].total += assetAmount.get('amount');
				_individualAssetTypes[assetType].total += assetAmount.get('amount');
			}
		}
		
		page.getViewModel('assetSummary.individualAssetTypes').reset(util.toArray(_individualAssetTypes));
		this.resetAssetTotals();
	},
	
	resetAssetTotals:function() {
		var assetSummary = page.getViewModel('assetSummary');

		var _ownerTotals = {Home:0.00, Papa:0.00, Mama:0.00, 'Lok Lok':0.00, 'Total':0.00};

		var accountAssetTypes = assetSummary.get('accountAssetTypes');
		for (var i=0; i<accountAssetTypes.length; i++) {
			var accountAssetType = accountAssetTypes.at(i);
			var ownerTotals = accountAssetType.get('ownerTotals');
			
			for (var ownerName in ownerTotals)
				_ownerTotals[ownerName] += ownerTotals[ownerName];
			_ownerTotals['Total'] += accountAssetType.get('total');
		}

		var individualAssetTypes = assetSummary.get('individualAssetTypes');
		for (var i=0; i<individualAssetTypes.length; i++) {
			var individualAssetType = individualAssetTypes.at(i);
			var ownerTotals = individualAssetType.get('ownerTotals');
			
			for (var ownerName in ownerTotals)
				_ownerTotals[ownerName] += ownerTotals[ownerName];
			_ownerTotals['Total'] += individualAssetType.get('total');
		}

		assetSummary.get('ownerTotals').set(_ownerTotals);
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
		datastore.load(page.getSelectedYear(),
			function /*success*/() {
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
	
	editAsset:function(asset) {
		this.append(this.AssetEditor, {model:asset}, 'assetEditor');
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
					this.append(Picker, {options:util.getMonthNames(), idx:new Date().getMonth()}, 'picker');
				},
				
				getSelectedMonth:function() {
					return this.findView('picker').getSelectedIdx();
				},
				
				events:{
					'change':'cbChange'
				},
				
				cbChange:function() {
					var transactionView = this.findParent('TransactionView');
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
					
					var displayDate = bu.getTranDateOfSelectedAcc(this.model, page.getSelectedAccount());
					this.append(Paragraph, {className:'Date', text:util.formatDate(displayDate, "$(dd) $(Mmm)")}, 'tranDate');
					this.append(Paragraph, {className:'Desc', text:this.model.get('desc')}, 'desc');
					this.append(Paragraph, {className:'Amount', text:util.formatAmount(this.model.get('amount'))}, 'amount');
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
			},
			
			events:{
				'click .BtnAddTranx':'cbBtnAddTranxClick'
			},
			
			cbBtnAddTranxClick:function() {
				page.editTransaction(new Transaction({tranxAcc:page.getSelectedAccount().toJSON(), tranDate:util.getToday()}));
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
					
					row.append(TableCell, {className:'Name'});
					
					for (var i=0; i<12; i++)
						row.append(TableCell, {className:'Month'}).html(util.getMonthName(i));
				}
			}),
			
			AccountSummaryOpening:View.extend({
				tagName:'thead',
				className:'Opening',
				
				initialize:function() {
					this.collection = datastore.getClosings();
					
					this.collection.bind('reset', this.refresh, this);
					this.collection.bind('change', this.refresh, this);
				},
				
				refresh:function() {
					this.html('');

					var row = this.append(TableRow, {}, 'row');
					if (row) {
						row.append(TableCell, {className:'Name',text:'Opening'});
						
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
					className:'Month',
					
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
					this.collection.bind('change', this.refresh, this);
					
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
						row.append(TableCell, {className:'Name',text:bu.getTranType(this.options.tranType)});
						
						for (var i=0; i<12; i++) {
							row.append(TableCell, {className:'Month', text:util.formatAmount(this.subtotals[i],2)});
						}
					}
					
					/* render category summary detail rows */
					for (var a in categories) {
						var row = this.append(TableRow);
						if (row) {
							row.append(TableCell, {className:'Name',text:a});
							
							for (var i=0; i<categories[a].length; i++) {
								row.append(TableCell, {className:'Month', text:util.formatAmount(categories[a][i],2)});
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
					this.collection.bind('change', this.refresh, this);
				},
				
				refresh:function() {
					this.html('');
					
					/* Closing row */
					var row = this.append(TableRow, {}, 'row');
					if (row) {
						row.append(TableCell, {className:'Name',text:'Closing'});
						
						for (var i=0; i<12; i++) {
							var closing = datastore.getClosing(page.getSelectedAccount(), page.getSelectedYear(), i);
							row.append(this.ClosingCell, {model:closing});
						}
					}

					/* Diff row */
					row = this.append(TableRow, {}, 'row');
					if (row) {
						row.append(TableCell, {className:'Name',text:'Differences'});
						
						for (var i=0; i<12; i++) {
							var closing = datastore.getClosing(page.getSelectedAccount(), page.getSelectedYear(), i);
							row.append(this.DiffCell, {model:closing});
						}
					}
				},
				
				ClosingCell:View.extend({
					tagName:'td',
					className:'Month',
					
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
					className:'Month',
					
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
					table.append(this.AssetTotal);
				}
			},
			
			onActivate:function() {
			},
			
			onInactivate:function() {
			},
			
			Header:View.extend({
				tagName:'thead',
				
				initialize:function() {
					var ownerTotals = page.getViewModel('assetSummary.ownerTotals');
					
					var tr = this.append(TableRow);
					if (tr) {
						tr.append(TableCell, {className:'Name'}).append(Button, {className:'BtnNew', label:'New'});
						for (var ownerName in ownerTotals.attributes) {
							tr.append(TableCell, {text:ownerName});
						}
					}
				},
				
				events:{
					'click .BtnNew':'cbClickBtnNew'
				},
				
				cbClickBtnNew:function() {
					page.editAsset(new Asset());
				}
			}),
			
			AccountAssetSection:View.extend({
				tagName:'tbody',
				
				initialize:function() {
					this.collection = page.getViewModel('assetSummary.accountAssetTypes');
					this.collection.bind('reset', this.refresh, this);
					
					this.refresh();
				},
				
				refresh:function() {
					this.html('');
					
					var ownerTotals = page.getViewModel('assetSummary.ownerTotals');
					
					for (var i=0; i<this.collection.length; i++) {
						var accountAssetType = this.collection.at(i);
						var assetTypeName = accountAssetType.get('name');
						var ownerTotals = accountAssetType.get('ownerTotals');
						var total = accountAssetType.get('total');
						var accounts = accountAssetType.get('accounts');
						
						/* render assetType row */
						var tr = this.append(TableRow, {className:'AssetType'});
						if (tr) {
							tr.append(TableCell, {className:'Name', text:assetTypeName});
							
							for (var ownerName in ownerTotals.attributes) {
								var ownerTotal = ownerTotals[ownerName];
								if (ownerTotal != null)
									tr.append(TableCell).append(Amount, {value:ownerTotal});
								else
									tr.append(TableCell);
							}

							if (total != null)
								tr.append(TableCell, {className:'Total'}).append(Amount, {value:total});
							else
								tr.append(TableCell, {className:'Total'});
						}
						
						/* render account rows */
						for (var accName in accounts) {
							var account = accounts[accName].account;
							var closings = accounts[accName].closings;
							var total = accounts[accName].total;
							
							var tr = this.append(TableRow, {className:'Account'});
							if (tr) {
								tr.append(TableCell, {className:'Name', text:account.get('name')});
								
								for (var ownerName in ownerTotals.attributes) {
									var closing = closings[ownerName];
									if (closing != null)
										tr.append(TableCell).append(Amount, {value:closing.get('amount')});
									else
										tr.append(TableCell);
								}

								tr.append(TableCell, {className:'Total'}).append(Amount, {value:total});
							}
							
						}
					}
				}
			}),
			
			IndividualAssetSection:View.extend({
				tagName:'tbody',
				
				initialize:function() {
					this.collection = page.getViewModel('assetSummary.individualAssetTypes');
					this.collection.bind('reset', this.refresh, this);
					this.collection.bind('add', this.refresh, this);
					this.collection.bind('remove', this.refresh, this);
					this.collection.bind('change', this.refresh, this);
					
					this.refresh();
				},
				
				refresh:function() {
					this.html('');
					
					for (var i=0; i<this.collection.length; i++) {
						var individualAssetType = this.collection.at(i);
						var assetTypeName = individualAssetType.get('name');
						var ownerTotals = individualAssetType.get('ownerTotals');
						var total = individualAssetType.get('total');
						var assets = individualAssetType.get('assets');
						
						/* render assetType row */
						var tr = this.append(TableRow, {className:'AssetType'});
						if (tr) {
							tr.append(TableCell, {className:'Name', text:assetTypeName});
							
							for (var ownerName in ownerTotals) {
								var ownerTotal = ownerTotals[ownerName];
								if (ownerTotal != null)
									tr.append(TableCell).append(Amount, {value:ownerTotal});
								else
									tr.append(TableCell);
							}

							if (total != null)
								tr.append(TableCell, {className:'Total'}).append(Amount, {value:total});
							else
								tr.append(TableCell, {className:'Total'});
						}
						
						/* render asset rows */
						for (var assetName in assets) {
							var asset = assets[assetName].asset;
							var assetRate = assets[assetName].assetRate;
							var assetAmounts = assets[assetName].assetAmounts;
							var total = assets[assetName].total;
							
							var tr = this.append(TableRow, {className:'Asset'});
							if (tr) {
								var td = tr.append(TableCell, {className:'Name'});
								td.append(this.AssetView, {model:asset});
								td.append(this.AssetRateView, {model:assetRate}, 'assetRateView');
								
								for (var ownerName in assetAmounts) {
									var assetAmount = assetAmounts[ownerName];
									var td = tr.append(TableCell);
									if (assetAmount != null)
										td.append(this.AssetAmountView, {model:assetAmount});
								}

								tr.append(TableCell, {className:'Total'}).append(Amount, {value:total});
							}
							
						}
					}
				},
				
				AssetView:View.extend({
					tagName:'span',
					
					initialize:function() {
						this.model.bind('change', this.refresh, this);
						
						this.refresh();
					},
					
					refresh:function() {
						this.html('');
						this.text(this.model.get('name'));
					}
				}),
				
				AssetRateView:Amount.extend({
					initialize:function() {
						this.setPrefix('@');
						this.attr('contentEditable', 'true');
						this.model.bind('change', this.refresh, this);
						
						this.refresh();
					},
					
					refresh:function() {
						this.val(this.model.get('rate'));
					},
					
					events:{
						'focus':'cbFocus',
						'blur':'cbBlur'
					},
					
					cbFocus:function() {
						this.setPrefix('');
						this.val(this.model.get('rate'));
					},
					
					cbBlur:function() {
						this.setPrefix('@');
						var oldValue = this.model.get('rate');
						var value = this.val();
						this.model.set({rate:value});
						if (oldValue != value)
							datastore.saveAssetRate(this.model);
						else
							this.val(oldValue);
					},
					
					save:function(cbSuccess, cbFailed) {
						datastore.saveAssetRate(this.model, cbSuccess, cbFailed);
					}
				}),
				
				AssetAmountView:Amount.extend({
					initialize:function() {
						this.attr('contentEditable', 'true');
						this.model.bind('change', this.refresh, this);
						
						this.refresh();
					},
					
					refresh:function() {
						this.val(this.model.get('amount'));
					},
					
					events:{
						'focus':'cbFocus',
						'blur':'cbBlur'
					},
					
					cbFocus:function() {
						this.val(this.model.get('units'));
					},
					
					cbBlur:function() {
						var _this = this;
						var oldValue = this.model.get('units');
						var value = this.val();
						this.model.set({units:value});
						if (oldValue != value) {
							if (!this.model.get('rate').id) {
								var assetRateView = this.findParent('Asset').findView('assetRateView');
								assetRateView.save(
									function /*success*/(rate) {
										_this.model.set({rate:rate.toJSON()}, {silent:true});
										datastore.saveAssetAmount(_this.model);
									}
								);
							}
							else
								datastore.saveAssetAmount(this.model);
						}
						else
							this.val(this.model.get('amount'));
					}
				})
			}),
			
			AssetTotal:View.extend({
				tagName:'tfoot',
				className:'AssetTotal',
				
				initialize:function() {
					this.model = page.getViewModel('assetSummary.ownerTotals');
					
					this.model.bind('change:Home', this.cbHomeChanged, this);
					this.model.bind('change:Papa', this.cbPapaChanged, this);
					this.model.bind('change:Mama', this.cbMamaChanged, this);
					this.model.bind('change:"Lok Lok"', this.cbLokLokChanged, this);
					this.model.bind('change:Total', this.cbTotalChanged, this);
					
					var tr = this.append(TableRow);
					if (tr) {
						tr.append(TableCell, {className:'Name', text:'Total'});
						tr.append(TableCell).append(Amount, {value:this.model.get('Home')}, 'homeTotal');
						tr.append(TableCell).append(Amount, {value:this.model.get('Papa')}, 'papaTotal');
						tr.append(TableCell).append(Amount, {value:this.model.get('Mama')}, 'mamaTotal');
						tr.append(TableCell).append(Amount, {value:this.model.get('Lok Lok')}, 'loklokTotal');
						tr.append(TableCell).append(Amount, {value:this.model.get('Total')}, 'grandTotal');
					}
				},
				
				cbHomeChanged:function() {
					this.findView('homeTotal').val(this.model.get('Home'));
				},
				
				cbPapaChanged:function() {
					this.findView('papaTotal').val(this.model.get('Papa'));
				},
				
				cbMamaChanged:function() {
					this.findView('mamaTotal').val(this.model.get('Mama'));
				},
				
				cbLokLokChanged:function() {
					this.findView('loklookTotal').val(this.model.get('Lok Lok'));
				},
				
				cbTotalChanged:function() {
					this.findView('grandTotal').val(this.model.get('Total'));
				}
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
				
				editor.body.append(TextField, {label:'Account Name', text:this.model.get('name')}, 'fldName');
				editor.body.append(TextField, {label:'Asset Type', text:this.model.get('assetType')}, 'fldAssetType');
				editor.body.append(TextField, {label:'Description', text:this.model.get('desc')}, 'fldDesc');
				editor.body.append(TextField, {label:'Owner', text:this.model.get('accOwner')}, 'fldAccOwner');
				editor.body.append(CollectionPickerField, 
					{
						label:'Default Payment Settle Account', 
						collection:datastore.getAccounts(), 
						displayField:'name', 
						withBlank:true, 
						selectModel:this.model.get('defSettleAcc')
					}, 
					'fldDefSettleAcc');
				editor.body.append(CheckboxField, {label:'Delete?', checked:this.model.get('deleted')}, 'fldDelete');
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
	
	TransactionEditor:View.extend({
		tagName:'div',
		className:'TransactionEditor DialogBackground',
		
		initialize:function() {
			this.attr('tabindex','99');
			var editor = this.append(Editor, {}, 'editor');
			if (editor) {
				if (!this.model.get('id'))
					editor.setTitle('New Transaction');
				else
					editor.setTitle(this.model.get('desc'));
				
				editor.body.append(CollectionPickerField, 
					{
						label:'Account', 
						collection:datastore.getAccounts(), 
						displayField:'name', 
						withBlank:false, 
						selectedId:this.model.get('tranxAcc')?this.model.get('tranxAcc').id:0
					}, 
					'fldTranxAcc');
				editor.body.append(DateField, {label:'Transaction Date', date:this.model.get('tranDate')}, 'fldTranDate');
				editor.body.append(PickerField, {label:'Transaction Type', options:bu.getTranTypes(), value:this.model.get('tranType')}, 'fldTranType');
				editor.body.append(TextField, {label:'Category', text:this.model.get('tranxCatg')}, 'fldTranxCatg');
				editor.body.append(TextField, {label:'Description', text:this.model.get('desc')}, 'fldDesc');
				editor.body.append(AmountField, {label:'Amount', amount:this.model.get('amount')}, 'fldAmount');
				editor.body.append(TextField, {label:'Remarks', text:this.model.get('remarks')}, 'fldRemarks');
				editor.body.append(CollectionPickerField, 
					{
						label:'Settle Account', 
						collection:datastore.getAccounts(), 
						displayField:'name', 
						withBlank:true, 
						selectedId:this.model.get('settleAcc')?this.model.get('settleAcc').id:0
					}, 
					'fldSettleAcc').append(Label, {text:'Date'}).append(DateInput, {}, 'fldSettleDate');
				editor.body.append(CollectionPickerField, 
					{
						label:'Claim Account', 
						collection:datastore.getAccounts(), 
						displayField:'name', 
						withBlank:true, 
						selectedId:this.model.get('claimAcc')?this.model.get('claimAcc').id:0
					}, 
					'fldClaimAcc').append(Label, {text:'Date'}).append(DateInput, {}, 'fldClaimDate');
				editor.body.append(CheckboxField, {label:'Delete?', checked:this.model.get('deleted')}, 'fldDelete');
				
				editor.body.append(Line);
				
				var repeatDiv = editor.body.append(Wrapper, {className:'RepeatFields'});
				if (repeatDiv) {
					if (this.model.get('repeatKey')) 
						repeatDiv.append(CheckboxField, {label:'Auto Repeat?', className:'AutoRepeat', checked:true}, 'fldAutoRepeat');

					var repeatDtl = repeatDiv.append(Wrapper);
					if (repeatDtl) {
						repeatDtl.append(Label, {text:'Repeat:'});
						repeatDtl.append(AmountInput, {className:'InputRepeatTimes'}, 'fldRepeatTimes');
						repeatDtl.append(Label, {text:'Times, Every'});
						repeatDtl.append(AmountInput, {className:'InputRepeatMonths'}, 'fldRepeatMonths');
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
	}),
	
	AssetEditor:View.extend({
		tagName:'div',
		className:'AssetEditor DialogBackground',
		
		initialize:function() {
			var _this = this;
			
			var editor = this.append(Editor, {}, 'editor');
			if (editor) {
				if (!this.model.get('id'))
					editor.setTitle('New Asset');
				else
					editor.setTitle(this.model.get('name'));
				
				editor.body.append(TextField, {label:'Asset Type', text:this.model.get('type')}, 'fldAssetType');
				editor.body.append(TextField, {label:'Asset Name', text:this.model.get('name')}, 'fldName');
				editor.body.append(CheckboxField, {label:'Discontinue?', checked:this.model.get('discontinued')}, 'fldDiscontinued');
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