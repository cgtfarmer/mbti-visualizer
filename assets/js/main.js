
var app = angular.module('myApp', []);

var functionGroups = {
	"perceiving": ["Si", "Se", "Ni", "Ne"],
	"judging": ["Ti", "Te", "Fi", "Fe"]
}

var preferenceImplications = {
	"Si": ["S", "J"],
	"Se": ["S", "P"],
	"Ni": ["N", "J"],
	"Ne": ["N", "P"],
	"Ti": ["T", "P"],
	"Te": ["T", "J"],
	"Fi": ["F", "P"],
	"Fe": ["F", "J"]
}

var couples = {
	"Si": ["Si", "Ne"],
	"Se": ["Se", "Ni"],
	"Ni": ["Ni", "Se"],
	"Ne": ["Ne", "Si"],
	"Ti": ["Ti", "Fe"],
	"Te": ["Te", "Fi"],
	"Fi": ["Fi", "Te"],
	"Fe": ["Fe", "Ti"]
}

var EMPTY_SELECTION = ["", "", "", ""];
var selectionNumber = 1;
var firstSelectionType = "";

app.controller('myCtrl', function($scope, $http) {
	$scope.preferences = EMPTY_SELECTION;

	// Throws duplicates error while all "" upon initializing
	$scope.functions = EMPTY_SELECTION;

	$http.get("assets/data.json",
		{
			cache: false,
			headers: {
				'Cache-Control': 'no-cache',
				'Pragma':'no-cache'
			}
		}
	).then(function(response) {
		console.log(response);
		$scope.data = response.data;
		return;
	});

	$scope.makeSelection = function(event) {
		var selection = event.currentTarget.id
		selection = selection.slice(selection.length - 2);
		console.log(selection);

		// If the function is not currently selected
		if($scope.functions.indexOf(selection) == -1) {
			if(selectionNumber == 1) {
				$scope.functions[0] = couples[selection][0];
				$scope.functions[3] = couples[selection][1];

				firstSelectionType = findFunctionType(selection);
				selectionNumber = 2;
			} else if(selectionNumber == 2) {
				if(findFunctionType(selection) != firstSelectionType) {
					$scope.functions[1] = couples[selection][0];
					$scope.functions[2] = couples[selection][1];
					selectionNumber = 3;
				}
			}
		} else {
			if(selectionNumber == 2) {
				$scope.functions[0] = "";
				$scope.functions[3] = "";
				selectionNumber = 1;
			} else if(selectionNumber == 3) {
				$scope.functions[1] = "";
				$scope.functions[2] = "";
				selectionNumber = 2;
			}
		}

		console.log($scope.functions);
		return;
	}

});

function findFunctionType(selection) {
	for(let groupType in functionGroups) {
		// If group contains selection
		if(functionGroups[groupType].indexOf(selection) != -1) {
			return groupType;
		}
	}

	return;
}

