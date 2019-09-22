

var functionGroups = {
	"perceiving": ["Si", "Se", "Ni", "Ne"],
	"judging": ["Ti", "Te", "Fi", "Fe"]
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

const EMPTY_SELECTION = ["", "", "", ""];
var selectionNumber = 1;
var firstSelectionType = "";
var firstSelectionOrientation = "";

var app = angular.module('myApp', []);

app.controller('myCtrl', function($scope, $http) {
	$scope.preferences = Array.from(EMPTY_SELECTION);

	// Throws duplicates error while all "" upon initializing
	$scope.functions = Array.from(EMPTY_SELECTION);

	$http.get("assets/data.json",
		{
			cache: false,
			headers: {
				'Cache-Control': 'no-cache',
				'Pragma':'no-cache'
			}
		}
	).then(function(response) {
		// console.log(response);
		$scope.data = response.data;
		return;
	});

	$scope.makeSelection = function(event) {
		var selection = event.currentTarget.id
		selection = selection.slice(selection.length - 2);
		// console.log(selection);

		// If the function is not currently selected
		if($scope.functions.indexOf(selection) == -1) {
			if(selectionNumber == 1) {
				$scope.functions[0] = couples[selection][0];
				$scope.functions[3] = couples[selection][1];

				firstSelectionType = findFunctionType(selection);
				firstSelectionOrientation = selection.includes("i") ? "i" : "e";
				selectionNumber = 2;
			} else if(selectionNumber == 2) {
				if(findFunctionType(selection) != firstSelectionType) {
					if((firstSelectionOrientation == "e" &&
						couples[selection][0][1] == "e") ||
						(firstSelectionOrientation == "i" &&
						couples[selection][0][1] == "i")) {
						$scope.functions[1] = couples[selection][1];
						$scope.functions[2] = couples[selection][0];
					} else {
						$scope.functions[1] = couples[selection][0];
						$scope.functions[2] = couples[selection][1];
					}
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

		// console.log("Functions:");
		// console.log($scope.functions);
		// console.log("Printed functions");

		$scope.updatePreferences(); // TODO: Breaking here?
		$scope.updateUiState();
		return;
	}

	$scope.updatePreferences = function() {
		$scope.preferences = Array.from(EMPTY_SELECTION);

		var firstFunction = $scope.functions[0];
		// console.log(firstFunction);

		if(firstFunction == "") {
			return;
		}

		if(firstFunction.indexOf("i") != -1) {
			$scope.preferences[0] = "I";
			if(findFunctionType(firstFunction) == "perceiving") {
				$scope.preferences[1] = firstFunction[0];
				$scope.preferences[3] = "J";
			} else if(findFunctionType(firstFunction) == "judging") {
				$scope.preferences[1] = firstFunction[0];
				$scope.preferences[3] = "P";
			}

		} else if(firstFunction.indexOf("e") != -1) {
			$scope.preferences[0] = "E";
			if(findFunctionType(firstFunction) == "perceiving") {
				$scope.preferences[1] = firstFunction[0];
				$scope.preferences[3] = "P";
			} else if(findFunctionType(firstFunction) == "judging") {
				$scope.preferences[1] = firstFunction[0];
				$scope.preferences[3] = "J";
			}
		}

		var secondFunction = $scope.functions[1];

		if(secondFunction != "") {
			// console.log(secondFunction);
			$scope.preferences[2] = secondFunction[0];
		}

		// console.log("Preferences:");
		// console.log($scope.preferences);
		return;
	}

	$scope.updateUiState = function() {
		$("div.selected-primary").removeClass("selected-primary");
		$("div.selected-secondary").removeClass("selected-secondary");

		for(let i = 0; i < $scope.functions.length; i++) {
			let f = $scope.functions[i];
			if(f != "") {
				let selector1 = "#function-help-" + f;
				let selector2 = "#function-" + f;
				if(i <= 1) {
					$(selector1).addClass("selected-primary");
					$(selector2).addClass("selected-primary");
				} else {
					$(selector1).addClass("selected-secondary");
					$(selector2).addClass("selected-secondary");
				}
			}
		}

		for(let i = 0; i < $scope.preferences.length; i++) {
			let f = $scope.preferences[i];
			if(f != "") {
				let selector1 = "#preference-help-" + f;
				let selector2 = "#preference-" + f;
				$(selector1).addClass("selected-secondary");
				$(selector2).addClass("selected-secondary");
			}
		}

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

