
// var app = angular.module('myApp', []);

// initInputsToCorrectState();

// app.controller('myCtrl', function($scope, $http) {
//
	// $http.get("data.json")
		// .then(function(response) {
			// console.log(response);
			// $scope.data = response.data;
		// });
//
	// $scope.toggleHelpTable = function() {
		// var state = $("#help-btn").prop("value");
		// if(state == "Show Help") {
			// $("#help-tables-container").show();
			// $("#help-btn").prop("value", "Hide Help");
		// } else {
			// $("#help-tables-container").hide();
			// $("#help-btn").prop("value", "Show Help");
		// }
//
		// return;
	// }
//
// });

$.ajax({
	mimeType: 'text/plain; charset=x-user-defined',
	url: "assets/data.json",
	type: "GET",
	dataType: "json",
	timeout: 10000,
	cache: false,
	success: function(data) {
		console.log(data);
		buildChoices(data);
	},
	error: function(jqXHR, textStatus, errorThrown) {
		console.log(jqXHR, textStatus, errorThrown);
	}
});

function buildChoices(data) {
	buildPreferences(data.cognitivePreferences);
	buildCognitiveFunctions(data.cognitiveFunctions);
	return;
}

function buildCognitiveFunctions(cognitiveFunctions) {
	var functionsContainer = $("#page-functions");

	for(let i = 0; i < 8; i += 4) {
		var row = $("<section></section>").addClass("hflex");

		var preference1 = buildFunction(row, cognitiveFunctions[i]);
		var preference2 = buildFunction(row, cognitiveFunctions[i+1]);
		row.append(
			$("<div></div>").addClass("hflex")
			.append(
				preference1,
				preference2
			)
		);

		var preference3 = buildFunction(row, cognitiveFunctions[i+2]);
		var preference4 = buildFunction(row, cognitiveFunctions[i+3]);
		row.append(
			$("<div></div>").addClass("hflex")
			.append(
				preference3,
				preference4
			)
		);

		functionsContainer.append(row);
	}

	return;
}

function buildFunction(row, cognitiveFunction) {
	return $("<div></div>").addClass("function-card")
		.append(
			$("<h2></h2>").text(cognitiveFunction.name + " - " + cognitiveFunction.abbreviation),
			$("<p></p>").text(cognitiveFunction["primary-roles"]),
			$("<p></p>").text(cognitiveFunction["most-prominent-in"]),
			$("<p></p>").text(cognitiveFunction["associated-with"]),
			$("<p></p>").text(cognitiveFunction["famous-examples"])
		);
}

function buildPreferences(preferences) {

	var preferencesContainer = $("#page-preferences");

	for(let i = 0; i < 8; i += 2) {
		var row = $("<section></section>").addClass("hflex");

		var preference1 = buildPreference(row, preferences[i]);
		var preference2 = buildPreference(row, preferences[i+1]);
		row.append(preference1);
		row.append(preference2);
		preferencesContainer.append(row);
	}

	return;
}

function buildPreference(row, preferenceData) {

	var list = $("<ul></ul>");

	for(let trait of preferenceData.traits) {
		list.append(
			$("<li></li>").append(
				$("<p></p>").text(trait)
			)
		);
	}

	row.append(
		$("<div></div>").addClass("preference-card")
		.append(
			$("<h2></h2>").text(preferenceData.name + " (" + preferenceData.abbreviation + ")"),
			list
		)
	);

	return;
}

function buildFunctions(functions) {
	return;
}

function initInputsToCorrectState() {
	$("#chord-type-options input:first").prop("checked", "true");
	$("#mode-options input:first").prop("checked", "true");
	$("#key-options input").prop("checked", "");
	$("#key-options input:first").prop("checked", "true");
	return;
}

