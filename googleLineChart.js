/** @author Marijus Gudiskis marijus.good@gmail.com*/

google.charts.load('current', {'packages':['line']});//loads the graph

/** displays the graph when called with specif size*/
function drawChart() {
	//creates x and y axis and names them
	var data = new google.visualization.DataTable();
	data.addColumn('number', 'Num of itarations');
	data.addColumn('number', 'Cost');

	data.addRows(loss);//add the loss array which holds how the network is preforming
	  
	//gives the chart a name and changes its size
	var options = {
		chart: {
			title: 'The Cost of the network',
		},
		width: window.innerWidth*0.4,
		height: window.innerHeight*0.2
	};
	
	//crates the chart
	var chart = new google.charts.Line(document.getElementById('line_top_x'));
	
	//remove goggles error when the loss array is empty
	google.visualization.events.addListener(chart, 'error', function (googleError) {
		google.visualization.errors.removeError(googleError.id);
	});
	//shows the chart
	chart.draw(data, google.charts.Line.convertOptions(options));
   }