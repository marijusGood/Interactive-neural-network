//variables for displaying nets size
var nodeLayer = document.getElementById("layers");
var nodeLayerNum = document.getElementById("nodeNum");

/**
* generates new weights and re-draws the canvas and resets the cost
* and layerNum field
* 
*/
function redrawAndNodes(){
	genereateW();
	draw();
	$("#costNum").text("");
	$("#layerNum").text(nodeCount.length);
}

function removeSoftmax(){
	isSoftmax = false;
	document.getElementById('yesSoft').checked = false;
	document.getElementById('noSoft').checked = true;
	var softRadioButtons = document.getElementById("softhide");
	softRadioButtons.style.display = "none";
}

function AND_ORdatas(){
	nodeCount = [1, 2];
	inputData =  [[1, 1],
				 [1, 0],
				 [0, 1],
				 [0, 0]];	
	redrawAndNodes();
	tableChange();
	removeSoftmax();
	nodeLayer.innerHTML = "";
	nodeLayerNum.innerHTML = "";
	copyArrays();
}

$(document).ready(function(){
  //add a node
  $("#layersAdd").click(function(){
  if(nodeCount.length < 5) {//allows max 5 nodes
		nodeCount.splice(1,0, 1);//adding 1 node
		redrawAndNodes();
		$("#layers").append(new Option(nodeCount.length -1, nodeCount.length -1));
	}
	if(nodeCount.length == 3){
	$("#nodeNum").text("1");
	}
  });
  
  $("#layersSub").click(function(){
	if(nodeCount.length > 2) {

		var x = document.getElementById("layers");
		x.remove(nodeCount.length-3);
		
		nodeCount.splice(1, 1);
		redrawAndNodes();
	}
	if(nodeCount.length == 2) {
	$("#nodeNum").text("");
	}
  });
  
  $('#layers').change(function () {
	var value =  $('#layers').val();
	$("#nodeNum").text(nodeCount[nodeCount.length - $('#layers').val()]);
  })

  $('#lrRate').on('input', function() {
	learningRate = parseFloat($('#lrRate').val());
  });
  
  $('#miniBatch').on('input', function() {
	  if(inputData.length >= parseInt($('#miniBatch').val())){
		minibatch = parseInt($('#miniBatch').val());
	  }else if(inputData.length < parseInt($('#miniBatch').val())){
		  $("#miniBatch").val(inputData.length);
		  minibatch = inputData.length;
	  }
  });
  
  $('#gradSpeed').on('input', function() {
		momentumSpeed = parseFloat($('#gradSpeed').val());
  });
  
  $('#numIta').on('input', function() {
	numerOfIta = $('#numIta').val();
  });
  
  $("#nodeAdd").click(function(){
	if($('#layers').val() != null && nodeCount[nodeCount.length - $('#layers').val()] < 6) {
		nodeCount[nodeCount.length - $('#layers').val()]++;
		$("#nodeNum").text(nodeCount[nodeCount.length - $('#layers').val()]);
		redrawAndNodes();
	}
  });
  
  $("#backProp").click(function(){
	var ans = combine();
	updateTable(ans);
	if(loss.length < 6000){
		drawChart();
	}else{
		loss = loss.slice(loss.length*0.5, loss.length+1);
		drawChart();
	}
	draw();
	$("#costNum").text(loss[loss.length-1][1]);
  });
  
  $("#nodeSub").click(function(){
	if($('#layers').val() != null && nodeCount[nodeCount.length - $('#layers').val()] > 1) {
	nodeCount[nodeCount.length - $('#layers').val()]--;
	$("#nodeNum").text(nodeCount[nodeCount.length - $('#layers').val()]);
	redrawAndNodes();
	}
  });
  
  $('.chooseData').click(function(e) {
    if (!$(this).hasClass("active")) {
		$('.chooseData').not(this).removeClass('active');    
		$(this).toggleClass('active');
		e.preventDefault();
	}
  });

  $("#AND").click(function(){		
	expectedOutput = [[1],[0],[0],[0]];
	AND_ORdatas();
  });
  
  $("#OR").click(function(){
	expectedOutput = [[1],[1],[1],[0]];
	
	AND_ORdatas();
  });
  
  $("#flower").click(function(){
  
	nodeCount = [3, 4];
	inputData =  [[6.1, 2.8, 4.7, 1.2],
       [5.7, 3.8, 1.7, 0.3],
       [7.7, 2.6, 6.9, 2.3],
       [6.0, 2.9, 4.5, 1.5],
       [6.8, 2.8, 4.8, 1.4],
       [5.4, 3.4, 1.5, 0.4],
       [5.6, 2.9, 3.6, 1.3],
       [6.9, 3.1, 5.1, 2.3],
       [6.2, 2.2, 4.5, 1.5],
       [5.8, 2.7, 3.9, 1.2],
       [6.5, 3.2, 5.1, 2.0],
       [4.8, 3.0, 1.4, 0.1],
       [5.5, 3.5, 1.3, 0.2],
       [4.9, 3.1, 1.5, 0.1],
       [5.1, 3.8, 1.5, 0.3],
       [6.3, 3.3, 4.7, 1.6],
       [6.5, 3.0, 5.8, 2.2],
       [5.6, 2.5, 3.9, 1.1],
       [5.7, 2.8, 4.5, 1.3],
       [6.4, 2.8, 5.6, 2.2],
       [4.7, 3.2, 1.6, 0.2],
       [6.1, 3.0, 4.9, 1.8],
       [5.0, 3.4, 1.6, 0.4],
       [6.4, 2.8, 5.6, 2.1],
       [7.9, 3.8, 6.4, 2.0],
       [6.7, 3.0, 5.2, 2.3],
       [6.7, 2.5, 5.8, 1.8],
       [6.8, 3.2, 5.9, 2.3],
       [4.8, 3.0, 1.4, 0.3],
       [4.8, 3.1, 1.6, 0.2],
       [4.6, 3.6, 1.0, 0.2],
       [5.7, 4.4, 1.5, 0.4],
       [6.7, 3.1, 4.4, 1.4],
       [4.8, 3.4, 1.6, 0.2],
       [4.4, 3.2, 1.3, 0.2],
       [6.3, 2.5, 5.0, 1.9],
       [6.4, 3.2, 4.5, 1.5],
       [5.2, 3.5, 1.5, 0.2],
       [5.0, 3.6, 1.4, 0.2],
       [5.2, 4.1, 1.5, 0.1],
       [5.8, 2.7, 5.1, 1.9],
       [6.0, 3.4, 4.5, 1.6],
       [6.7, 3.1, 4.7, 1.5],
       [5.4, 3.9, 1.3, 0.4],
       [5.4, 3.7, 1.5, 0.2],
       [5.5, 2.4, 3.7, 1.0],
       [6.3, 2.8, 5.1, 1.5],
       [6.4, 3.1, 5.5, 1.8],
       [6.6, 3.0, 4.4, 1.4],
       [7.2, 3.6, 6.1, 2.5],
       [5.7, 2.9, 4.2, 1.3],
       [7.6, 3.0, 6.6, 2.1],
       [5.6, 3.0, 4.5, 1.5],
       [5.1, 3.5, 1.4, 0.2],
       [7.7, 2.8, 6.7, 2.0],
       [5.8, 2.7, 4.1, 1.0],
       [5.2, 3.4, 1.4, 0.2],
       [5.0, 3.5, 1.3, 0.3],
       [5.1, 3.8, 1.9, 0.4],
       [5.0, 2.0, 3.5, 1.0],
       [6.3, 2.7, 4.9, 1.8],
       [4.8, 3.4, 1.9, 0.2],
       [5.0, 3.0, 1.6, 0.2],
       [5.1, 3.3, 1.7, 0.5],
       [5.6, 2.7, 4.2, 1.3],
       [5.1, 3.4, 1.5, 0.2],
       [5.7, 3.0, 4.2, 1.2],
       [7.7, 3.8, 6.7, 2.2],
       [4.6, 3.2, 1.4, 0.2],
       [6.2, 2.9, 4.3, 1.3],
       [5.7, 2.5, 5.0, 2.0],
       [5.5, 4.2, 1.4, 0.2],
       [6.0, 3.0, 4.8, 1.8],
       [5.8, 2.7, 5.1, 1.9],
       [6.0, 2.2, 4.0, 1.0],
       [5.4, 3.0, 4.5, 1.5],
       [6.2, 3.4, 5.4, 2.3],
       [5.5, 2.3, 4.0, 1.3],
       [5.4, 3.9, 1.7, 0.4],
       [5.0, 2.3, 3.3, 1.0],
       [6.4, 2.7, 5.3, 1.9],
       [5.0, 3.3, 1.4, 0.2],
       [5.0, 3.2, 1.2, 0.2],
       [5.5, 2.4, 3.8, 1.1],
       [6.7, 3.0, 5.0, 1.7],
       [4.9, 3.1, 1.5, 0.1],
       [5.8, 2.8, 5.1, 2.4],
       [5.0, 3.4, 1.5, 0.2],
       [5.0, 3.5, 1.6, 0.6],
       [5.9, 3.2, 4.8, 1.8],
       [5.1, 2.5, 3.0, 1.1],
       [6.9, 3.2, 5.7, 2.3],
       [6.0, 2.7, 5.1, 1.6],
       [6.1, 2.6, 5.6, 1.4],
       [7.7, 3.0, 6.1, 2.3],
       [5.5, 2.5, 4.0, 1.3],
       [4.4, 2.9, 1.4, 0.2],
       [4.3, 3.0, 1.1, 0.1],
       [6.0, 2.2, 5.0, 1.5],
       [7.2, 3.2, 6.0, 1.8],
       [4.6, 3.1, 1.5, 0.2],
       [5.1, 3.5, 1.4, 0.3],
       [4.4, 3.0, 1.3, 0.2],
       [6.3, 2.5, 4.9, 1.5],
       [6.3, 3.4, 5.6, 2.4],
       [4.6, 3.4, 1.4, 0.3],
       [6.8, 3.0, 5.5, 2.1],
       [6.3, 3.3, 6.0, 2.5],
       [4.7, 3.2, 1.3, 0.2],
       [6.1, 2.9, 4.7, 1.4],
       [6.5, 2.8, 4.6, 1.5],
       [6.2, 2.8, 4.8, 1.8],
       [7.0, 3.2, 4.7, 1.4],
       [6.4, 3.2, 5.3, 2.3],
       [5.1, 3.8, 1.6, 0.2],
       [6.9, 3.1, 5.4, 2.1],
       [5.9, 3.0, 4.2, 1.5],
       [6.5, 3.0, 5.2, 2.0],
       [5.7, 2.6, 3.5, 1.0],
       [5.2, 2.7, 3.9, 1.4],
       [6.1, 3.0, 4.6, 1.4],
       [4.5, 2.3, 1.3, 0.3],
       [6.6, 2.9, 4.6, 1.3],
       [5.5, 2.6, 4.4, 1.2],
       [5.3, 3.7, 1.5, 0.2],
       [5.6, 3.0, 4.1, 1.3],
       [7.3, 2.9, 6.3, 1.8],
       [6.7, 3.3, 5.7, 2.1],
       [5.1, 3.7, 1.5, 0.4],
       [4.9, 2.4, 3.3, 1.0],
       [6.7, 3.3, 5.7, 2.5],
       [7.2, 3.0, 5.8, 1.6],
       [4.9, 3.1, 1.5, 0.1],
       [6.7, 3.1, 5.6, 2.4],
       [4.9, 3.0, 1.4, 0.2],
       [6.9, 3.1, 4.9, 1.5],
       [7.4, 2.8, 6.1, 1.9],
       [6.3, 2.9, 5.6, 1.8],
       [5.7, 2.8, 4.1, 1.3],
       [6.5, 3.0, 5.5, 1.8],
       [6.3, 2.3, 4.4, 1.3],
       [6.4, 2.9, 4.3, 1.3],
       [5.6, 2.8, 4.9, 2.0],
       [5.9, 3.0, 5.1, 1.8],
       [5.4, 3.4, 1.7, 0.2],
       [6.1, 2.8, 4.0, 1.3],
       [4.9, 2.5, 4.5, 1.7],
       [5.8, 4.0, 1.2, 0.2],
       [5.8, 2.6, 4.0, 1.2],
       [7.1, 3.0, 5.9, 2.1]];		
	expectedOutput = [[1., 0., 0.],
       [0., 1., 0.],
       [0., 0., 1.],
       [1., 0., 0.],
       [1., 0., 0.],
       [0., 1., 0.],
       [1., 0., 0.],
       [0., 0., 1.],
       [1., 0., 0.],
       [1., 0., 0.],
       [0., 0., 1.],
       [0., 1., 0.],
       [0., 1., 0.],
       [0., 1., 0.],
       [0., 1., 0.],
       [1., 0., 0.],
       [0., 0., 1.],
       [1., 0., 0.],
       [1., 0., 0.],
       [0., 0., 1.],
       [0., 1., 0.],
       [0., 0., 1.],
       [0., 1., 0.],
       [0., 0., 1.],
       [0., 0., 1.],
       [0., 0., 1.],
       [0., 0., 1.],
       [0., 0., 1.],
       [0., 1., 0.],
       [0., 1., 0.],
       [0., 1., 0.],
       [0., 1., 0.],
       [1., 0., 0.],
       [0., 1., 0.],
       [0., 1., 0.],
       [0., 0., 1.],
       [1., 0., 0.],
       [0., 1., 0.],
       [0., 1., 0.],
       [0., 1., 0.],
       [0., 0., 1.],
       [1., 0., 0.],
       [1., 0., 0.],
       [0., 1., 0.],
       [0., 1., 0.],
       [1., 0., 0.],
       [0., 0., 1.],
       [0., 0., 1.],
       [1., 0., 0.],
       [0., 0., 1.],
       [1., 0., 0.],
       [0., 0., 1.],
       [1., 0., 0.],
       [0., 1., 0.],
       [0., 0., 1.],
       [1., 0., 0.],
       [0., 1., 0.],
       [0., 1., 0.],
       [0., 1., 0.],
       [1., 0., 0.],
       [0., 0., 1.],
       [0., 1., 0.],
       [0., 1., 0.],
       [0., 1., 0.],
       [1., 0., 0.],
       [0., 1., 0.],
       [1., 0., 0.],
       [0., 0., 1.],
       [0., 1., 0.],
       [1., 0., 0.],
       [0., 0., 1.],
       [0., 1., 0.],
       [0., 0., 1.],
       [0., 0., 1.],
       [1., 0., 0.],
       [1., 0., 0.],
       [0., 0., 1.],
       [1., 0., 0.],
       [0., 1., 0.],
       [1., 0., 0.],
       [0., 0., 1.],
       [0., 1., 0.],
       [0., 1., 0.],
       [1., 0., 0.],
       [1., 0., 0.],
       [0., 1., 0.],
       [0., 0., 1.],
       [0., 1., 0.],
       [0., 1., 0.],
       [1., 0., 0.],
       [1., 0., 0.],
       [0., 0., 1.],
       [1., 0., 0.],
       [0., 0., 1.],
       [0., 0., 1.],
       [1., 0., 0.],
       [0., 1., 0.],
       [0., 1., 0.],
       [0., 0., 1.],
       [0., 0., 1.],
       [0., 1., 0.],
       [0., 1., 0.],
       [0., 1., 0.],
       [1., 0., 0.],
       [0., 0., 1.],
       [0., 1., 0.],
       [0., 0., 1.],
       [0., 0., 1.],
       [0., 1., 0.],
       [1., 0., 0.],
       [1., 0., 0.],
       [0., 0., 1.],
       [1., 0., 0.],
       [0., 0., 1.],
       [0., 1., 0.],
       [0., 0., 1.],
       [1., 0., 0.],
       [0., 0., 1.],
       [1., 0., 0.],
       [1., 0., 0.],
       [1., 0., 0.],
       [0., 1., 0.],
       [1., 0., 0.],
       [1., 0., 0.],
       [0., 1., 0.],
       [1., 0., 0.],
       [0., 0., 1.],
       [0., 0., 1.],
       [0., 1., 0.],
       [1., 0., 0.],
       [0., 0., 1.],
       [0., 0., 1.],
       [0., 1., 0.],
       [0., 0., 1.],
       [0., 1., 0.],
       [1., 0., 0.],
       [0., 0., 1.],
       [0., 0., 1.],
       [1., 0., 0.],
       [0., 0., 1.],
       [1., 0., 0.],
       [1., 0., 0.],
       [0., 0., 1.],
       [0., 0., 1.],
       [0., 1., 0.],
       [1., 0., 0.],
       [0., 0., 1.],
       [0., 1., 0.],
       [1., 0., 0.],
       [0., 0., 1.]];
 
	redrawAndNodes();
	copyArrays();
	tableChangeIris();
	
	var softRadioButtons = document.getElementById("softhide");
	softRadioButtons.style.display = "block";
	
	nodeLayer.innerHTML = "";
	nodeLayerNum.innerHTML = "";
  });
  
  $("#relu")
    .change(function(){
        if( $(this).is(":checked") ){
            isSigmoid = false;
			loss = [];
        }
    });
	
	$("#Sigmoid")
    .change(function(){
        if( $(this).is(":checked") ){
            isSigmoid = true;
			loss = [];
        }
    });
	
	 $("#noSoft")
    .change(function(){
        if( $(this).is(":checked") ){
            isSoftmax = false;
        }
    });
	
	$("#yesSoft")
    .change(function(){
        if( $(this).is(":checked") ){
            isSoftmax = true;
        }
    });
	
});

