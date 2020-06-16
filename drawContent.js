var canvs = document.getElementById("snow");//this is the canvas element in the HTML document
var ctx = canvs.getContext("2d");//
var ww = [];//this is where all the wights and biases are stored for each layer
var loss = [];//stores the loss of each iteration for Google graph to display
var learningRate = 0.05;//this is the learning rate of the gradient
var isSigmoid = false;//is sigmoid activation function on?
var isIdentity = false;//is Identity activation function on?
var isOwnInput = false;//is the user typing his own input?
var isTanh = false;//is ThaN activation function on?
var isSoftmax = false;//is softmax activation function on?
var isRelu = true;// is ReLU activation function on?
var numerOfIta = 1;// the number of iterations to do when the button "Backpropagations" is pressed
/*this is how many nodes are in a layer. The very last element is the input layer and the very
first element is the output and in between are the hidden layers*/
var nodeCount = [1, 2];
var inputData =  [[1, 1],//input data, inputData[i] is what goes to the input layer
				[1, 0],
				[0, 1],
				[0, 0]];
var expectedOutput = [[1],[0],[0],[0]];//expectedOutput[i] is what expected in output layer
var momentumSpeed = 0;//the momentum(speed) the gradient is allowed to go
var momentumWW = [];//this is identical to ww but it stores the past momentum of the gradient
/*this is the same as inputData and expectedOutput, but it is shuffled, because I couldn't then display the
input data and predicted data together in the table, the data would be changing every iteration
and it wouldn't look nice*/
var shuffleInput, shuffleOut;
var minibatch = inputData.length;//length of the mini batch
var derNodes;//this is bad implementation, but it is the derivative of the softmax 
var table = document.getElementById("tables");//tabel in HTML

/**
 *resize the canvas when the page is loaded, generate new weights, create the table
* and prepare the arrays for shuffling
*/
function resizeCanvas() {
    canvs.width = window.innerWidth * 0.78;
    canvs.height = window.innerHeight * 0.75;
	genereateW();
	tableChange(table);
	shuffleInput, shuffleOut = copyArrays(inputData, expectedOutput);
}
/**
* copies the input Data and expected Output to shuffleInput and shuffleOut
* @param {(number|Array)} inputArray input arrays
* @param {(number|Array)} outputArray output array
* @return {(number|Array)} shuffleInput copied input array
* @return {(number|Array)} shuffleOut copied output array
*/
function copyArrays(inputArray, outputArray){
	shuffleInput = Array.from(inputArray);
	shuffleOut = Array.from(outputArray);
	return shuffleInput, shuffleOut;
}
/** if the window resizes so dose the canvas*/
function updateCanvas(){
	canvs.width = window.innerWidth * 0.78;
    canvs.height = window.innerHeight * 0.75;
}
/** clears the canvas and draws the nodes and weights */
function draw() {
	ctx.clearRect(0, 0, canvs.width, canvs.height);
	lines(node());
}
/**
* draws nodes on canvas
* @return {(number|Array)} nodes is for storing where on the canvas the nodes are drawn and their size
*/
function node() {
	let tempHeight = canvs.height / (nodeCount.length + 1);//the height of each node
	let nodes = [];//this will be returned
	ctx.lineWidth = 1;
	
	for(let i = 0; i < nodeCount.length; i++) {
		//draws all of the nodes on the canvas
		let tempNodePos = [];//temporally stores each layers nodes position
		let widthTemp = canvs.width / (nodeCount[i] + 1);//spaces between each node in a layer
		ctx.strokeStyle = `hsl(0, 0%, 0%)`;//black
		
		for (let k = 0; k < nodeCount[i]; k++) {
			//draws each layers node
			let nodeX = widthTemp*(k+1);
			let nodeY = tempHeight*(i+1);
			let nodeSize = tempHeight/(nodeCount[i]+2);
			
			ctx.beginPath();
			ctx.arc(nodeX, nodeY, nodeSize,0,2*Math.PI);
			ctx.stroke();
			if(i == 0){
				//draws the arrows for the output layer out of the node
				ctx.beginPath();
				ctx.moveTo(nodeX, tempHeight-nodeSize);
				//these 1.7 and other number are just for making the arrows more dynamic with the window size
				ctx.lineTo(nodeX, tempHeight-(nodeSize*1.7));
				ctx.lineTo(nodeX - (nodeX*(0.03/(k+1))), tempHeight - (nodeSize * 1.4));
				ctx.moveTo(nodeX, tempHeight - (nodeSize * 1.7));
				ctx.lineTo(nodeX + (nodeX * (0.03 / (k+1))), tempHeight - (nodeSize*1.4));
				ctx.stroke();
			}else if(i == nodeCount.length-1){
				//draws the arrows for the input layer into the node
				ctx.beginPath();
				ctx.moveTo(nodeX, nodeY + (nodeSize*2));
				ctx.lineTo(nodeX, nodeY + (nodeSize*2) - nodeSize);
				ctx.lineTo(nodeX - (nodeX * (0.03/(k+1))), nodeY+(nodeSize*1.4));
				ctx.moveTo(nodeX, nodeY + (nodeSize*2) - nodeSize);
				ctx.lineTo(nodeX + (nodeX * (0.03/(k+1))), nodeY+(nodeSize*1.4));
				ctx.stroke();
			}
		
			tempNodePos.push([nodeX, nodeY, nodeSize]);
		}
		nodes.push(tempNodePos);//pushing all of the layers nodes to a single array
	}
	return nodes;
}
/**
* @param {(number|Array)} the array where we want to find the max value
* @return {number} biggest number in array 
*/
function getMax(a){
  return Math.max(...a.map(e => Array.isArray(e) ? getMax(e) : e));
}

/**
* @param {(number|Array)} the array where we want to find the minimum value
@return {number} smallest number in array */
function getMin(a){
  return Math.min(...a.map(e => Array.isArray(e) ? getMin(e) : e));
}

/** draw weights with corresponding color in between the nodes
* @param {(number|Array)} the position and size of all the nodes on the canvas
*/
function lines(nodes) {
	//finding the biggest and the smallest weight
	var highest = getMax(ww);
	var lowest = getMin(ww);
	
	ctx.lineWidth = 3;
	for(let i = 0; i < nodeCount.length-1; i++){
		for (let j = 0; j < nodeCount[i]; j++) {
			for (let k = 0; k < nodeCount[i+1]; k++) {
			//draws the weight and their color	
			
				//choses the color for the weight
				if(ww[ww.length-i-1][k+1][j] > 0){
					//how red it is
					 let brightness = (60 - (ww[ww.length-i-1][k+1][j] / highest) * 60) + 30;
					 ctx.strokeStyle = `hsl(0, 100%, ` + brightness + `%)`;
				} else if(ww[ww.length-i-1][k+1][j] < 0) {
					//how blue it is
					let brightness = (60 - (ww[ww.length-i-1][k+1][j] / lowest) * 60) + 30;
					ctx.strokeStyle = `hsl(240, 100%, ` + brightness + `%)`;
				} else{//if all fails, black
					ctx.strokeStyle = `hsl(0, 0%, 0%)`;
				}

				//draw
				ctx.beginPath();
				ctx.moveTo(nodes[i][j][0],nodes[i][j][1]+nodes[i][j][2]);
				ctx.lineTo(nodes[i+1][k][0],nodes[i+1][k][1]-nodes[i+1][k][2]);
				ctx.stroke();
				
				if(k == 0) {
					//print the bias into the node
					let fontSize = nodes[i][j][2]/2;
					ctx.font = fontSize + "px Arial";
					ctx.fillText(ww[ww.length-i-1][k][j].toFixed(2),nodes[i][j][0]-fontSize,nodes[i][j][1]+(fontSize/3));
				}
				
			}
		
		}
	}
}

/** updates the table with the input and expected output values 
* @param {(number|Array)} inputLayer 2d input arrays, one of the inputs
* @param {(number|Array)} outputlayer 2d output array, one of the outputs
* @param {table} the table in the HTML file
*/
function updateInputTable(inputLayer, outputlayer, table){
	let row = table.insertRow(table.rows.length);
	
	for(let j = 0; j < inputLayer.length; j++) {
		//crates input fields and writes data
		let cell = row.insertCell(j);
		cell.innerHTML = parseFloat(inputLayer[j].toFixed(4));
	}
	for(let j = 0; j < outputlayer.length; j++) {
		//crates output fields and writes data
		let cell = row.insertCell(inputLayer.length + j);
		cell.innerHTML = parseFloat(outputlayer[j].toFixed(4));
	}
	
	for(let j = outputlayer.length + inputLayer.length; j < outputlayer.length*2 + inputLayer.length; j++) {
		//crates predicted output fields
		row.insertCell(j);
	}
	
}

/** 
* this is for writing the herded for the table values
* @param {table} the table in the HTML file
 */
function updateNameTable(table) {
	table.innerHTML = "";
	let rows = table.insertRow(0);
	
	for(let i = 0; i < nodeCount[nodeCount.length-1]; i++){
		//creating the cell and inputing the "Input" or "Input i" into the cell
		let cell = rows.insertCell(i);
		
		if(nodeCount[nodeCount.length-1] == 1){
			cell.innerHTML = "Input";
		}else {
			cell.innerHTML = "Input "+(i+1);
		}
	}
	
	for(let i = 0; i < nodeCount[0]; i++){
		//creating the cell and inputing the "Expected Output" or "Expected Output i" into the cell
		let cell = rows.insertCell(i+nodeCount[nodeCount.length-1]);
		
		if(nodeCount[0] == 1){
			cell.innerHTML = "Expected Output";
		}else {
			cell.innerHTML = "Expected Output "+(i+1);
		}
	}
	
	for(let i = 0; i < nodeCount[0]; i++){
		//creating the cell and inputing the "Predicted Output" or "Predicted Output i" into the cell
		let cell = rows.insertCell(i+nodeCount[nodeCount.length-1] + nodeCount[0]);
		
		if(nodeCount[0] == 1){
			cell.innerHTML = "Predicted Output";
		}else {
			cell.innerHTML = "Predicted Output "+(i+1);
		}
	}
}

/**
* creating input fields for the table and relocating the button
* @param {table} the table in the HTML file
 */
function inputDataTable(table){
	updateNameTable(table);
	
	let buttonPos = 0;//where the button will be after all the input fields
	for(let i = 0; i < nodeCount[0] + nodeCount[nodeCount.length-1]; i++){
		//creating input fields for the table
		buttonPos += table.rows[0].cells[i].offsetWidth-7;//input fields width
		let x = document.createElement("INPUT");
		x.setAttribute("type", "number");
		x.id = i;
		x.style.width = (table.rows[0].cells[i].offsetWidth-7) + 'px';
		document.body.appendChild(x);
	}
	
	buttonPos += (nodeCount[0] + 2 + nodeCount[nodeCount.length-1]) *7;//input width borders
	document.getElementById("addInfo").style.left = buttonPos +'px';//button position
}

/** 
* Populates the table with labels and values
* @param {table} the table in the HTML file
*/
function tableChange(table) {
	updateNameTable(table);
	
	for(let i = 0; i < inputData.length; i++) {
		//putting one input and output row at a time
		updateInputTable(inputData[i], expectedOutput[i], table);
	}
}

/**
* create table for the Iris flower dataset. Because the table is quinine this is the best
* optimization I can do
* @param {table} the table in the HTML file
 */
function tableChangeIris(table) {
	table.innerHTML = "";//cleaning the table
	//crating labels for each column
	let rows = table.insertRow(0);
	let cells1 = rows.insertCell(0);
	let cells2 = rows.insertCell(1);
	let cells3 = rows.insertCell(2);
	let cells4 = rows.insertCell(3);
	let cells5 = rows.insertCell(4);
	let cells6 = rows.insertCell(5);
	let cells7 = rows.insertCell(6);
	let cells8 = rows.insertCell(7);
	cells1.innerHTML = "Sepal Length Cm";
	cells2.innerHTML = "Sepal Width Cm";
	cells3.innerHTML = "Petal Length Cm";
	cells4.innerHTML = "Petal Width Cm";
	cells5.innerHTML = "Species";
	cells6.innerHTML = "predicted Iris-setosa";
	cells7.innerHTML = "predicted Iris-versicolor";
	cells8.innerHTML = "predicted Iris-virginica";
	
	for(let i = 0; i < inputData.length; i++) {
		let row = table.insertRow(i+1);//creating a new row
		let cell;
		for(let j = 0; j < inputData[i].length; j++) {
			//crating the input cells and populating them
			cell = row.insertCell(j);
			cell.innerHTML = inputData[i][j];
		}
		
		//creating the expected output and populating it
		cell = row.insertCell(inputData[i].length);
		//look in what position the 1 is and write the name
		if(expectedOutput[i][0] == 1){
			cell.innerHTML = "Iris-setosa";
		}else if(expectedOutput[i][1] == 1){
			cell.innerHTML = "Iris-versicolor";
		}else if(expectedOutput[i][2] == 1){
			cell.innerHTML = "Iris-virginica";
		}
		
		//adding the cells for predicted output
		cell = row.insertCell(inputData[i].length+1);
		cell = row.insertCell(inputData[i].length+2);
		cell = row.insertCell(inputData[i].length+3);
	}
}

/**
* Goes throw the Predicted Output fields and populates or changes the values for the cells 
* @param {(number|Array)} the predicted output
* @param {table} the table in the HTML file
*/
function updatePredictedTable(ans, table){
	let tableLen = table.rows[0].cells.length;
	
	for(let i = 0; i < ans.length; i++) {
		let cell = table.rows[i+1].cells;//get number of cells are in a row
		
		for(let j = 0; j < ans[i].length; j++){
			//populating the predicted values
			cell[tableLen-(ans[i].length - j)].innerHTML = ans[i][j];
		}
	}
}