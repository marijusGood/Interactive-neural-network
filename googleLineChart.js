      google.charts.load('current', {'packages':['line']});

    function drawChart() {

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'Num of itarations');
      data.addColumn('number', 'Cost');


      data.addRows(loss);
	  
		
      var options = {
		chart: {
          title: 'The Cost of the network',
        },
        width: window.innerWidth*0.4,
        height: window.innerHeight*0.2
		//backgroundColor: { fill:'transparent' }
      };

      var chart = new google.charts.Line(document.getElementById('line_top_x'));
	  //remove googles erorr that the loss array is empty
	  google.visualization.events.addListener(chart, 'error', function (googleError) {
		google.visualization.errors.removeError(googleError.id);
      });
	  
      chart.draw(data, google.charts.Line.convertOptions(options));
    }