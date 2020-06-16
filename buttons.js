/** @author Marijus Gudiskis marijus.good@gmail.com*/

/**
* generates new weights and re-draws the canvas and resets the cost
* and layerNum field
*/
function redrawNodesAndWeights(){
	genereateW();
	draw();
	$("#costNum").text("");
	$("#layerNum").text(nodeCount.length);
}

/** After switching datasets reset the miniBatch size*/
function setMiniBatch(){
	$("#miniBatch").val(inputData.length);
	minibatch = inputData.length;
}
/** */
function customDataManipulation(){
	expectedOutput = [];
	inputData = [];
	redrawNodesAndWeights();
	inputDataTable(table);
	shuffleInput, shuffleOut = copyArrays(inputData, expectedOutput);
}

function nodeAddAndSubCombination(){
	$("#nodeNum").text(nodeCount[nodeCount.length - $('#layers').val()]);
	redrawNodesAndWeights();
}

function removeInputs(){
	if(isOwnInput){
		for(var i = 0; i < nodeCount[0] + nodeCount[nodeCount.length-1]; i++){
			document.getElementById(i).remove();
		}
	}
}
function removeSoftmax(){
	isSoftmax = false;
	document.getElementById('yesSoft').checked = false;
	document.getElementById('noSoft').checked = true;
	var softRadioButtons = document.getElementById("softhide");
	softRadioButtons.style.display = "none";
}

function AND_ORdatas(){
	removeInputs();
	nodeCount = [1, 2];
	inputData =	[[1, 1],
				 [1, 0],
				 [0, 1],
				 [0, 0]];	
	tableChange(table);
	removeSoftmax();
	switchingBetweenDatas();
}
function switchingBetweenDatas(){
	setMiniBatch();
	redrawNodesAndWeights();
	shuffleInput, shuffleOut = copyArrays(inputData, expectedOutput);
	drawChart();
	document.getElementById("hideInput").style.display = "none";
	document.getElementById("addInfo").style.display = "none";
	isOwnInput = false;
	document.getElementById("layers").innerHTML = "";
	document.getElementById("nodeNum").innerHTML = "";
	document.getElementById('norml').disabled = false;
}

$(document).ready(function(){
	
	/** add a layer to the network*/
	$("#layersAdd").click(function(){
		if(nodeCount.length < 6) {//allows max 6 layers
			nodeCount.splice(1,0, 1);//adding 1 layer near the output layer
			redrawNodesAndWeights();
			//adds an option to select the layer
			$("#layers").append(new Option(nodeCount.length -1, nodeCount.length -1));
		}
		//this is for user experience, but it just displays a 1 to show that you
		//can change the nodes in a layer if there are more then 2 layers
		if(nodeCount.length == 3){
		$("#nodeNum").text("1");
		}
	});
	
	/** removes a layer from the network */
	$("#layersSub").click(function(){
		if(nodeCount.length > 2) {//this is so not to remove input and output layer
			//removes an option to select the layer
			document.getElementById("layers").remove(nodeCount.length-3);
		
			nodeCount.splice(1, 1);
			redrawNodesAndWeights();
		}
		if(nodeCount.length == 2) {//the same as adding the layer but it removes the number if its 2 layrs
		$("#nodeNum").text("");
		}
	});
	
	/** change the nodeNum label when selecting the networks layer*/
	$('#layers').change(function () {
		$("#nodeNum").text(nodeCount[nodeCount.length - $('#layers').val()]);
	})

	/** whenever you type different learning rate in lrRate it will change the learningRate*/
	$('#lrRate').on('input', function() {
		learningRate = parseFloat($('#lrRate').val());
	});
	
	/** set the mini batch whenever you type something different it will change minibatch, also it protects from
	writing to high number*/
	$('#miniBatch').on('input', function() {
		if(inputData.length >= parseInt($('#miniBatch').val())){
			minibatch = parseInt($('#miniBatch').val());
		}else if(inputData.length < parseInt($('#miniBatch').val())){
			setMiniBatch();
		}
	});
	
	/** pressing "Do data normalization" normalizes the data input and displays it on the table*/
	$("#norml").click(function(){
		let arrayColumn = (n) => inputData.map(x => x[n]);//take a column of input array
		
		//do the Rescaling (min-max normalization)
		for(let i = 0; i < inputData[0].length; i++){
			let colum = arrayColumn(i);
			let max = Math.max.apply(null, colum);
			let min = Math.min.apply(null, colum);
			let div = max - min;
		
			for(let j = 0; j < inputData.length; j++) {
				inputData[j][i] = (inputData[j][i] - min) / div;
			}
		}
		
		//copy to the shuffle arrays and remove ability to press the button, becauce you do normalization once
		shuffleInput, shuffleOut = copyArrays(inputData, expectedOutput);
		document.getElementById('norml').disabled = true;
		
		//this is bad implementation, but if its 150 elements then it is Iris database, I dont 
		//think anyone will enter 150 elements by hand
		if(inputData.length >= 150){
			tableChangeIris(table);
		}else {
			tableChange(table);//if its less then 150 elements then use simple table population function
		}
	});
	
	/** whenever you type different gradient momentum in gradMomentum it will change the momentumSpeed*/
	$('#gradMomentum').on('input', function() {
		momentumSpeed = parseFloat($('#gradMomentum').val());
	});
	
	/** whenever you type different number of iterations in numIta it will change the numerOfIta*/
	$('#numIta').on('input', function() {
		numerOfIta = $('#numIta').val();
	});
	
	/** add a node to the selected layer*/
	$("#nodeAdd").click(function(){
		//if not null and there are less then 6 nodes in a layer 
		if($('#layers').val() != null && nodeCount[nodeCount.length - $('#layers').val()] < 6) {
			nodeCount[nodeCount.length - $('#layers').val()]++;//add a node
			nodeAddAndSubCombination();
		}
	});
	
	/** lunches backpropogation, updates line graph and updates costNum*/
	$("#backProp").click(function(){
		let ans = combine();
		updatePredictedTable(ans, table);
		if(loss.length < 6000){
			drawChart();
		}else{//if the chart has more then 6000 elements, remove half of it
			loss = loss.slice(loss.length*0.5, loss.length+1);
			drawChart();
		}
		draw();
		$("#costNum").text(loss[loss.length-1][1]);
	});
	
	/** remove a node to the selected layer*/
	$("#nodeSub").click(function(){
		//if not null and there are less then 6 nodes in a layer 
		if($('#layers').val() != null && nodeCount[nodeCount.length - $('#layers').val()] > 1) {
			nodeCount[nodeCount.length - $('#layers').val()]--;
			nodeAddAndSubCombination();
		}
	});
	
	/** adds info from each input field to the input and output array*/
	$("#addInfo").click(function(){
		let temp = [];//this holds temporary array data
		for(let i = 0; i < nodeCount[nodeCount.length-1]; i++){
			temp.push(parseFloat($('#' + i.toString()).val()));//add input value to the temp array
			$('#' + i.toString()).val("");
		}
		inputData.push(temp);//push temp array to the end of the input array
		
		//the same just for output array
		temp = [];
		for(let i = nodeCount[nodeCount.length-1]; i < nodeCount[0] + nodeCount[nodeCount.length-1]; i++){
			temp.push(parseFloat($('#' + i.toString()).val()));
			$('#' + i.toString()).val("");
		}
		expectedOutput.push(temp);
		
		updateInputTable(inputData[inputData.length-1], expectedOutput[expectedOutput.length-1], expectedOutput[expectedOutput.length-1].length, table);
		shuffleInput, shuffleOut = copyArrays(inputData, expectedOutput);
		setMiniBatch();
	});
	
	/**make the dataset buttons change class when pressed*/
	$('.chooseData').click(function(e) {
		if (!$(this).hasClass("active")) {
			$('.chooseData').not(this).removeClass('active');		
			$(this).toggleClass('active');
			e.preventDefault();
	}
	});

	/**when the user presses on "Your own data" prepares the data arrays, shows additional parameters
	* and redraws the table
	*/
	$("#ownData").click(function(){
		document.getElementById("hideInput").style.display = "block";		
		document.getElementById("addInfo").style.display = "block";
		document.getElementById('norml').disabled = false;
		nodeCount = [1,1];
		customDataManipulation();
		setMiniBatch();
		isOwnInput = true;
		removeSoftmax();
		drawChart();
	});
	
	/** removes a node and a column from the input layer and table when you press the "-" button next to
	* Number of different inputs:
	*/
	$("#inputMin").click(function(){
		if(nodeCount[nodeCount.length-1] > 1){//if more then one input
			removeInputs();
			nodeCount[nodeCount.length-1]--;//remove the node
			$("#inputNum").text(nodeCount[nodeCount.length - 1]);
			customDataManipulation();
		}
	});
	
	/** adds a node and a column from the input layer and table when you press the "+" button next to
	* Number of different inputs:
	*/
	$("#inputAdd").click(function(){
		removeInputs();
		nodeCount[nodeCount.length-1]++;//adds the node
		$("#inputNum").text(nodeCount[nodeCount.length - 1]);
		customDataManipulation();
	});
	
	/** removes a node and a column from the output layer and table when you press the "-" button next to
	* Number of different outputs:
	*/
	$("#outputMin").click(function(){
		if(nodeCount[0] > 1){//if more then one output
			removeInputs();
			nodeCount[0]--;//removes a node
			$("#outputNum").text(nodeCount[0]);
			customDataManipulation();
		} 
		if(nodeCount[0] < 2){//if there is less then 2 outputs softmax is not needed
			removeSoftmax();
		}
	});
	
	/** adds a node and a column from the output layer and table when you press the "+" button next to
	* Number of different outputs:
	*/
	$("#outputAdd").click(function(){
		removeInputs();
		nodeCount[0]++;//adds a node
		$("#outputNum").text(nodeCount[0]);
		customDataManipulation();
		if(nodeCount[0] > 1){//if there is more then 1 output you can use softmax
			document.getElementById("softhide").style.display = "block";
		}
	});
	
	/**when the user presses on "AND" button prepares the data arrays, weights, table and other nuances*/
	$("#AND").click(function(){		
	expectedOutput = [[1],[0],[0],[0]];
	AND_ORdatas();
	});
	
	/**when the user presses on "OR" button prepares the data arrays, weights, table and other nuances*/
	$("#OR").click(function(){
	expectedOutput = [[1],[1],[1],[0]];
	
	AND_ORdatas();
	});
	
	/**when the user presses on "Iris flower dataset" button prepares the data arrays,
	* weights, table, enables softmax and other nuances
	*/
	$("#flower").click(function(){
		removeInputs();
		nodeCount = [3, 4];
		inputData =	[[6.1, 2.8, 4.7, 1.2],
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
 
		tableChangeIris(table);
		document.getElementById("softhide").style.display = "block";//shows softmax options
		switchingBetweenDatas();
	});
	
	/** if relu is selected the make isRelu true and any other false*/
	$("#relu").change(function(){
		if( $(this).is(":checked") ){
			isIdentity = false;
			isTanh = false;
			isSigmoid = false;
			isRelu = true;
			loss = [];
		}
	});
	
	/** if Sigmoid is selected the make isSigmoid true and any other false*/
	$("#Sigmoid").change(function(){
		if( $(this).is(":checked") ){
			isIdentity = false;
			isTanh = false;
			isSigmoid = true;
			isRelu = false;
			loss = [];
		}
	});
	
	/** if identity is selected the make isIdentity true and any other false*/
	$("#identity").change(function(){
		if( $(this).is(":checked") ){
			isIdentity = true;
			isTanh = false;
			isSigmoid = false;
			isRelu = false;
			loss = [];
		}
	});
	
	/** if tanh is selected the make isTanh true and any other false*/
	$("#tanh").change(function(){
		if( $(this).is(":checked") ){
			isIdentity = false;
			isTanh = true;
			isSigmoid = false;
			isRelu = false;
			loss = [];
		}
	});
	
	/** if Softmax is not selected make isSoftmax false*/
	$("#noSoft").change(function(){
		if( $(this).is(":checked") ){
			isSoftmax = false;
		}
	});
	
	/** if Softmax is selected make isSoftmax true*/
	$("#yesSoft").change(function(){
		if( $(this).is(":checked") ){
			isSoftmax = true;
		}
	});
	
});

