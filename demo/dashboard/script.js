angular.module('app')

.controller('DashboardCtrl', ['$scope', '$timeout',
	function($scope, $timeout) {
		$scope.gridsterOptions = {
			margins: [20, 20],
			sparse: true,
			columns: 12,
			draggable: {
				handle: '.box-header'
			}
		};

		var widgets = [];
		$scope.dashboards = {
			'1': {
				id: '1',
				name: 'Grid',
				widgets: widgets
			},
			'2': {
				id: '2',
				name: 'Home',
				widgets: [{
					col: 0,
					row: 0,
					sizeY: 2,
					sizeX: 3,
					name: "Widget 1"
				}, {
					col: 6,
					row: 1,
					sizeY: 2,
					sizeX: 3,
					name: "Widget 2"
				}]
			},
			'3': {
				id: '3',
				name: 'Other',
				widgets: [{
					col: 1,
					row: 1,
					sizeY: 1,
					sizeX: 2,
					name: "Other Widget 1"
				}, {
					col: 1,
					row: 3,
					sizeY: 1,
					sizeX: 1,
					name: "Other Widget 2"
				}]
			}
		};

		var connections = [1,6,8];
		for (var i = 0; i < 6; i++) {
			for (var j = 0; j < 4; j++) {
				widgets.push({col:i * 2, row:j, sizeY: 1, sizeX: 2, name: 'Widget ' + (i * 6 + j), 
					group: connections.indexOf(i*6+j) != -1 ? 1 : undefined});
			}
		}

		$scope.clear = function() {
			$scope.dashboard.widgets = [];
		};

		$scope.addWidget = function() {
			$scope.dashboard.widgets.push({
				name: "New Widget",
				sizeX: 1,
				sizeY: 1
			});
		};

		$scope.$watch('selectedDashboardId', function(newVal, oldVal) {
			if (newVal !== oldVal) {
				$scope.dashboard = $scope.dashboards[newVal];
			} else {
				$scope.dashboard = $scope.dashboards[1];
			}
		});

		// init dashboard
		$scope.selectedDashboardId = '1';

	}
])

.controller('CustomWidgetCtrl', ['$scope', '$modal',
	function($scope, $modal) {

		$scope.remove = function(widget) {
			$scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
		};

		$scope.openSettings = function(widget) {
			$modal.open({
				scope: $scope,
				templateUrl: 'demo/dashboard/widget_settings.html',
				controller: 'WidgetSettingsCtrl',
				resolve: {
					widget: function() {
						return widget;
					}
				}
			});
		};

	}
])

.controller('WidgetSettingsCtrl', ['$scope', '$timeout', '$rootScope', '$modalInstance', 'widget',
	function($scope, $timeout, $rootScope, $modalInstance, widget) {
		$scope.widget = widget;

		$scope.form = {
			name: widget.name,
			sizeX: widget.sizeX,
			sizeY: widget.sizeY,
			col: widget.col,
			row: widget.row
		};

		$scope.sizeOptions = [{
			id: '1',
			name: '1'
		}, {
			id: '2',
			name: '2'
		}, {
			id: '3',
			name: '3'
		}, {
			id: '4',
			name: '4'
		}];

		$scope.dismiss = function() {
			$modalInstance.dismiss();
		};

		$scope.remove = function() {
			$scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
			$modalInstance.close();
		};

		$scope.submit = function() {
			angular.extend(widget, $scope.form);

			$modalInstance.close(widget);
		};

	}
])

// helper code
.filter('object2Array', function() {
	return function(input) {
		var out = [];
		for (i in input) {
			out.push(input[i]);
		}
		return out;
	}
});
