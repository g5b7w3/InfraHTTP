$(function(){

	console.log("Loading city");


	function loadStudents(){
	$.getJSON( "/api/students/", function( city ){
		console.log(city);
		var message ="Nobody is here";
		if (city.students > 0){
		message = city[0];
		}
		$(".skills").text(city);
	});
	};

	loadStudents();
	setInterval( loadStudents, 2000 );

});
