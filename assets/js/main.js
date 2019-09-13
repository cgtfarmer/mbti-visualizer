
var app = angular.module('myApp', []);

var preferenceGroups = [
	["preference-I", "preference-E"],
	["preference-S", "preference-N"],
	["preference-T", "preference-F"],
	["preference-J", "preference-P"]
]

var functionGroups = [
	["function-SJ", "function-SP", "function-NJ", "function-NP"],
	["function-TP", "function-TJ", "function-FP", "function-FJ"],
]

var functionRules = [
	[0, 3],
	[1, 2]
]

// initInputsToCorrectState();

app.controller('myCtrl', function($scope, $http) {
//
	$scope.preferences = [];
	$scope.functions = [];
	$scope.functionOrder = [];

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

	$scope.makePreferenceSelection = function(event) {
		console.log(event.currentTarget.id);
		var selection = event.currentTarget.id;

		$("#" + selection).toggleClass("selected");
		for(let group of preferenceGroups) {
			var index = group.indexOf(selection);
			if(index != -1) {
				for(let i = 0; i < group.length; i++) {
					if(i == index) {
						// $("#" + selection).toggleClass("selected");
						continue;
					}

					$("#" + group[i]).removeClass("selected");
				}
			}
		}

		return;
	}

	$scope.makeFunctionSelection = function(event) {
	/*
		# Algorithm:
		# --------------------------------------
		find the row where the selection exists
		find the index
		find the function rule where the index exists
		iterate through the group row and turn all the rule numbers on, and switch off all numbers which are not in the rules
	*/

		// console.log(event.currentTarget.id);
		var selection = event.currentTarget.id;

		for(let group of functionGroups) {
			var index = group.indexOf(selection);
			if(index != -1) {
				var rule = getRelevantRule(index);
				// console.log(rule);

				for(let i = 0; i < group.length; i++) {
					// console.log(i);
					if(rule.indexOf(i) != -1) {
						// console.log("selecting");
						$("#" + group[i]).toggleClass("selected");
					} else {
						// console.log("de-selecting");
						$("#" + group[i]).removeClass("selected");
					}
				}
			}
		}

		return;
	}

});

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

function initInputsToCorrectState() {
	$("#chord-type-options input:first").prop("checked", "true");
	$("#mode-options input:first").prop("checked", "true");
	$("#key-options input").prop("checked", "");
	$("#key-options input:first").prop("checked", "true");
	return;
}

