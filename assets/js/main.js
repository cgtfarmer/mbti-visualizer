
var app = angular.module('myApp', []);

var preferenceGroups = [
	["preference-I", "preference-E"],
	["preference-S", "preference-N"],
	["preference-T", "preference-F"],
	["preference-J", "preference-P"]
]

var cognitiveFunctions = ["Si", "Se", "Ni", "Ne", "Ti", "Te", "Fi", "Fe"];

var functionGroups = [
	["function-Si", "function-Se", "function-Ni", "function-Ne"],
	["function-Ti", "function-Te", "function-Fi", "function-Fe"],
]

var functionRules = [
	[0, 3],
	[1, 2]
]

// initInputsToCorrectState();

app.controller('myCtrl', function($scope, $http) {
//
	$scope.preferences = ["I", "N", "T", "J"];
	$scope.functions = ["Ni", "Se", "Te", "Fi"];
	$scope.functionOrder = ["Ni", "Te", "Fi", "Se"];

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
	});
//
	$scope.toggleHelpTable = function() {
		var state = $("#help-btn").prop("value");
		if(state == "Show Help") {
			$("#help-tables-container").show();
			$("#help-btn").prop("value", "Hide Help");
		} else {
			$("#help-tables-container").hide();
			$("#help-btn").prop("value", "Show Help");
		}

		return;
	}

	$scope.updateState = function(event) {
		var selection = event.currentTarget.id
		console.log("Selection: " + selection);

		var changed;
		if(selection.indexOf("preference") != -1) {
			console.log("Chose a preference\n");
			console.log("Current preferences:");
			console.log($scope.preferences);

			changed = $scope.makePreferenceSelection(selection);
			if(changed) {
				$scope.propagatePreferenceSelections();
			}
		} else {
			console.log("Chose a function");
			console.log("Current functions:");
			console.log($scope.functions);

			changed = $scope.makeFunctionSelection(selection);
			if(changed) {
				$scope.propagateFunctionSelections();
			}
		}

		if(changed) {
			$scope.updateUi();
		}
		return;
	}

	$scope.propagatePreferenceSelections = function() {
		return;
	}

	$scope.propagateFunctionSelections = function() {
		return;
	}

	$scope.makePreferenceSelection = function(selection) {
		/*
			# Algorithm
			Go through each row
				If the row contains the selection,
					Delete every entry from the preferences which does not match the selection

			After going through each entry in the row, add the selection to the
		*/
		console.log("\nMaking preference selection...");

		if($scope.preferences.indexOf(selection.slice(selection.length-1)) != -1) {
			console.log("Selection already exists, exiting...");
			return false;
		}

		// $("#" + selection).toggleClass("selected");
		for(let group of preferenceGroups) {
			console.log(group);
			var indexOfSelection = group.indexOf(selection);
			// console.log("Index: " + index);
			if(indexOfSelection != -1) {
				console.log("Exists in this group. Continuing...");
				for(let i = 0; i < group.length; i++) {
					if(i != indexOfSelection ) {
						// console.log("thing2");
						// $("#" + group[i]).removeClass("selected");
						let removalItem = group[i].slice(selection.length-1);
						console.log("Removing item: " + removalItem);
						let indexOfRemovalItem = $scope.preferences.indexOf(removalItem);
						$scope.preferences.splice(indexOfRemovalItem, 1);
					}
				}

				let additionItem = selection.slice(selection.length-1);
				console.log("Addition item: " + additionItem);
				$scope.preferences.push(additionItem);
			} else {
				console.log("Does not exist in this group. Skipping...");
			}
		}
	//
		return true;
	}

	$scope.makeFunctionSelection = function(selection) {
		/*

		# Algorithm
		Find the row which contains the selection
			Go through the rules
				If the rule does not contain the selection
					Delete every entry which appears in the rule from the functions pool
				Else
					Add every entry which appears in the rule to the functions pool

		*/
		console.log("\nMaking function selection...");

		if($scope.functions.indexOf(selection.slice(selection.length-2)) != -1) {
			console.log("Selection already exists, exiting...");
			return false;
		}

		var functionGroup = findBelongingFunctionGroup(selection);

		for(let rule of functionRules) {
			var function1 = functionGroup[rule[0]]
			var function2 = functionGroup[rule[1]]
			console.log("F1: " + function1);
			console.log("F2: " + function2);
			if(function1 == selection || function2 == selection) {
				console.log("ADDING");
				$scope.functions.push(function1.slice(function1.length-2));
				$scope.functions.push(function2.slice(function1.length-2));
			} else {
				console.log("REMOVING");
				let removalIndex1 = $scope.functions.indexOf(function1.slice(function1.length-2))
				let removalIndex2 = $scope.functions.indexOf(function2.slice(function2.length-2))
				console.log("Index1: " + removalIndex1);
				console.log("Index2: " + removalIndex2);

				console.log("Functions before removal");
				console.log($scope.functions);

				if(removalIndex1 > removalIndex2) {
					$scope.functions.splice(removalIndex1, 1);
					$scope.functions.splice(removalIndex2, 1);
				} else {
					$scope.functions.splice(removalIndex2, 1);
					$scope.functions.splice(removalIndex1, 1);
				}

				console.log("Functions after removal");
				console.log($scope.functions);
			}
		}

		// for(let i = 0; i < group.length; i++) {
			// if(i != indexOfSelection ) {
				// // console.log("thing2");
				// // $("#" + group[i]).removeClass("selected");
				// let removalItem = group[i].slice(selection.length-2);
				// console.log("Removing item: " + removalItem);
				// let indexOfRemovalItem = $scope.functions.indexOf(removalItem);
				// $scope.functions.splice(indexOfRemovalItem, 1);
			// }
		// }
//
		// let additionItem = selection.slice(selection.length-2);
		// console.log("Addition item: " + additionItem);
		// $scope.functions.push(additionItem);
	//
		return true;
	}

	$scope.updateUi = function() {
		console.log("Updating UI according to preferences:");
		console.log($scope.preferences);

		updateUiPreferences($scope.preferences);

		console.log("Updating UI according to functions:");
		console.log($scope.functions);

		updateUiFunctions($scope.functions);
		// updateUiFunctionOrder($scope.functionOrder); // ???


		// if(contains($scope.preferences, "S") && contains($scope.preferences, "J")) {
			// $("#preference-S").addClass("selected");
			// $("#preference-J").addClass("selected");
//
			// $("#preference-N").removeClass("selected");
			// $("#preference-P").removeClass("selected");
		// } else if(contains($scope.preferences, "S") && contains($scope.preferences, "P")) {
			// $("#preference-S").addClass("selected");
			// $("#preference-P").addClass("selected");
//
			// $("#preference-N").removeClass("selected");
			// $("#preference-J").removeClass("selected");
		// } else if(contains($scope.preferences, "N") && contains($scope.preferences, "J")) {
			// $("#preference-N").addClass("selected");
			// $("#preference-J").addClass("selected");
//
			// $("#preference-S").removeClass("selected");
			// $("#preference-P").removeClass("selected");
		// } else if(contains($scope.preferences, "N") && contains($scope.preferences, "P")) {
			// $("#preference-N").addClass("selected");
			// $("#preference-P").addClass("selected");
//
			// $("#preference-S").removeClass("selected");
			// $("#preference-J").removeClass("selected");
		// }

		return;
	}

});

function findBelongingFunctionGroup(selection) {
	for(let group of functionGroups) {
		// console.log(group);
		var indexOfSelection = group.indexOf(selection);
		// console.log("Index: " + index);
		if(indexOfSelection != -1) {
			return group;
		}
	}

	return false;
}


// function makeFunctionSelection(selection) {
// /*
	// # Algorithm:
	// # --------------------------------------
	// find the row where the selection exists
	// find the index
	// find the function rule where the index exists
	// iterate through the group row and turn all the rule numbers on, and switch off all numbers which are not in the rules
// */
//
	// for(let group of functionGroups) {
		// var index = group.indexOf(selection);
		// if(index != -1) {
			// var rule = getRelevantRule(index);
			// // console.log(rule);
// //
			// for(let i = 0; i < group.length; i++) {
				// // console.log(i);
				// if(rule.indexOf(i) != -1) {
					// // console.log("selecting");
					// $("#" + group[i]).toggleClass("selected");
				// } else {
					// // console.log("de-selecting");
					// $("#" + group[i]).removeClass("selected");
				// }
			// }
		// }
	// }
// //
	// return;
// }


function updateUiFunctions(functions) {
	// $scope.functions = ["Ni", "Se", "Te", "Fi"];
	clearUiFunctions();

	if(contains(functions, "Si") || contains(functions, "Ne")) {
		$("#function-Si").addClass("selected");
		$("#function-Ne").addClass("selected");
	} else {
		$("#function-Se").addClass("selected");
		$("#function-Ni").addClass("selected");
	}

	if(contains(functions, "Ti") || contains(functions, "Fe")) {
		$("#function-Ti").addClass("selected");
		$("#function-Fe").addClass("selected");
	} else {
		$("#function-Te").addClass("selected");
		$("#function-Fi").addClass("selected");
	}

	return;
}

function clearUiFunctions() {
	for(let entry of cognitiveFunctions) {
		$("#function-" + entry).removeClass("selected");
	}
	return;
}

function updateUiPreferences(preferences) {
	if(contains(preferences, "I")) {
		$("#preference-I").addClass("selected");
		$("#preference-E").removeClass("selected");
	} else {
		$("#preference-E").addClass("selected");
		$("#preference-I").removeClass("selected");
	}

	if(contains(preferences, "S")) {
		$("#preference-S").addClass("selected");
		$("#preference-N").removeClass("selected");
	} else {
		$("#preference-N").addClass("selected");
		$("#preference-S").removeClass("selected");
	}

	if(contains(preferences, "T")) {
		$("#preference-T").addClass("selected");
		$("#preference-F").removeClass("selected");
	} else {
		$("#preference-F").addClass("selected");
		$("#preference-T").removeClass("selected");
	}

	if(contains(preferences, "J")) {
		$("#preference-J").addClass("selected");
		$("#preference-P").removeClass("selected");
	} else {
		$("#preference-P").addClass("selected");
		$("#preference-J").removeClass("selected");
	}


	return;
}

function contains(collection, item) {
	if(collection.indexOf(item) != -1) {
		return true;
	}

	return false;
}

function getRelevantRule(index) {
	for(let rule of functionRules) {
		if(rule.indexOf(index) != -1) {
			return rule;
		}
	}

	return -1;
}

// $.ajax({
	// mimeType: 'text/plain; charset=x-user-defined',
	// url: "assets/data.json",
	// type: "GET",
	// dataType: "json",
	// timeout: 10000,
	// cache: false,
	// success: function(data) {
		// console.log(data);
		// buildChoices(data);
	// },
	// error: function(jqXHR, textStatus, errorThrown) {
		// console.log(jqXHR, textStatus, errorThrown);
	// }
// });
//
// function buildChoices(data) {
	// buildPreferences(data.cognitivePreferences);
	// buildCognitiveFunctions(data.cognitiveFunctions);
	// return;
// }
//
// function buildCognitiveFunctions(cognitiveFunctions) {
	// var functionsContainer = $("#page-functions");
//
	// for(let i = 0; i < 8; i += 4) {
		// var row = $("<section></section>").addClass("hflex");
//
		// var preference1 = buildFunction(row, cognitiveFunctions[i]);
		// var preference2 = buildFunction(row, cognitiveFunctions[i+1]);
		// row.append(
			// $("<div></div>").addClass("hflex")
			// .append(
				// preference1,
				// preference2
			// )
		// );
//
		// var preference3 = buildFunction(row, cognitiveFunctions[i+2]);
		// var preference4 = buildFunction(row, cognitiveFunctions[i+3]);
		// row.append(
			// $("<div></div>").addClass("hflex")
			// .append(
				// preference3,
				// preference4
			// )
		// );
//
		// functionsContainer.append(row);
	// }
//
	// return;
// }
//
// function buildFunction(row, cognitiveFunction) {
	// return $("<div></div>").addClass("function-card")
		// .append(
			// $("<h2></h2>").text(cognitiveFunction.name + " - " + cognitiveFunction.abbreviation),
			// $("<p></p>").text(cognitiveFunction["primary-roles"]),
			// $("<p></p>").text(cognitiveFunction["most-prominent-in"]),
			// $("<p></p>").text(cognitiveFunction["associated-with"]),
			// $("<p></p>").text(cognitiveFunction["famous-examples"])
		// );
// }
//
// function buildPreferences(preferences) {
//
	// var preferencesContainer = $("#page-preferences");
//
	// for(let i = 0; i < 8; i += 2) {
		// var row = $("<section></section>").addClass("hflex");
//
		// var preference1 = buildPreference(row, preferences[i]);
		// var preference2 = buildPreference(row, preferences[i+1]);
		// row.append(preference1);
		// row.append(preference2);
		// preferencesContainer.append(row);
	// }
//
	// return;
// }
//
// function buildPreference(row, preferenceData) {
//
	// var list = $("<ul></ul>");
//
	// for(let trait of preferenceData.traits) {
		// list.append(
			// $("<li></li>").append(
				// $("<p></p>").text(trait)
			// )
		// );
	// }
//
	// row.append(
		// $("<div></div>").addClass("preference-card")
		// .append(
			// $("<h2></h2>").text(preferenceData.name + " (" + preferenceData.abbreviation + ")"),
			// list
		// )
	// );
//
	// return;
// }
//
// function buildFunctions(functions) {
	// return;
// }

