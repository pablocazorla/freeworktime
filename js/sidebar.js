(function() {
	"use strict";

	/*
		var getSorted = function(arr, sortList) {
			var resultArr = [],
				sortArr = sortList[]
			for (var i = 0; i < arr.length; i++) {
				result[i] = arr[sortArr[i]];
			}
			return result;
		};
	*/
	var orderList = function(list, orderArray) {
		var sortFunction = function(a, b) {
			var indexA = orderArray.indexOf(a['id'] + '');
			var indexB = orderArray.indexOf(b['id'] + '');
			if (indexA < indexB) {
				return -1;
			} else if (indexA > indexB) {
				return 1;
			} else {
				return 0;
			}
		};
		list.sort(sortFunction);
	};



	var folderVM = function(data) {
		var vm = {
			id: data.id,
			titleFolder: ko.observable(data.title),
			listOrder: data.lists.split(','),

			//
			listFolder: ko.observableArray(),
			open: ko.observable(false),
			timeFolder: ko.observable(0)
		};

		vm.dragInfoVisible = ko.computed(function() {
			return (vm.listFolder().length <= 0);
		});


		var postOrderList = function() {
				var orderList = [],
					list = vm.listFolder()
				length = list.length;

				for (var i = 0; i < length; i++) {
					orderList.push(list[i].id);
				}
				vm.listOrder = orderList;
				FWT.post({
					'id': vm.id,
					'lists': vm.listOrder.join(',')
				});
			},
			ordering = false,
			onUpdate = true;

		vm.listFolder.subscribe(function() {
			if (!ordering && !onUpdate) {
				ordering = true;
				setTimeout(function() {
					postOrderList();
					ordering = false;
				}, 50);
			}
			onUpdate = false;
		});



		vm.toggleFolder = function() {
			var status = vm.open();
			vm.open(!status);
		};
		return vm;
	};



	var listVM = function(data) {
		var vm = {
			id: data.id,
			title: ko.observable(data.title),
			time: ko.observable(data.time),
			current: ko.observable(false)
		};

		vm.setCurrent = function() {

	FWT.sidebarVM.setCurrent(vm.id)
		};

		return vm;
	};



	// FWT.sidebarVM
	FWT.sidebarVM = (function() {
		var vm = {
			list: ko.observableArray()
		};


		var onUpdate = false,
			listOrder,
			listsArray = [];

		vm.update = function() {
			onUpdate = true;
			// GET Folder Order
			FWT.get('folder_order', function(data) {
				listOrder = data.order_folder.split(',');
				// GET Folders
				FWT.get('folders', function(data) {


					var folderCount = data.length,
						tempList = [];
					for (var i = 0; i < folderCount; i++) {
						var newFolder = folderVM(data[i]);
						tempList.push(newFolder);
					}
					orderList(tempList, listOrder);
					vm.list(tempList);
					onUpdate = false;

					// GET lists
					FWT.get('lists', function(data) {
						listsArray = [];
						var listCount = data.length,
							folderList = vm.list(),
							folderCount = folderList.length;
						for (var j = 0; j < folderCount; j++) {
							var tempFolder = folderList[j],
								tempFolderList = [];
							for (var i = 0; i < listCount; i++) {
								var li = data[i];
								if (tempFolder.listOrder.indexOf(li.id + '') >= 0) {

									var newListVM = listVM(li);

									tempFolderList.push(newListVM);
									listsArray.push(newListVM);
								}
							}
							orderList(tempFolderList, tempFolder.listOrder);
							folderList[j].listFolder(tempFolderList);
						}
					});
				});
			});

			var postOrderFolder = function() {
					var orderList = [],
						list = vm.list()
					length = list.length;

					for (var i = 0; i < length; i++) {
						orderList.push(list[i].id);
					}
					listOrder = orderList;
					FWT.post({
						'order_folder': listOrder.join(',')
					});
				},
				ordering = false;

			vm.list.subscribe(function() {
				if (!ordering && !onUpdate) {
					ordering = true;
					setTimeout(function() {
						postOrderFolder();
						ordering = false;
					}, 50);
				}
			});
		};

		vm.setCurrent = function(id) {

			var length = listsArray.length;
			for (var i = 0; i < length; i++) {

				if (listsArray[i].id == id) {
					listsArray[i].current(true);
				} else {
					listsArray[i].current(false);
				}
			}
		};



		vm.init = function() {
			ko.applyBindings(vm, document.getElementById('list-collection'));
			vm.update();
		};


		return vm;
	})();

})();