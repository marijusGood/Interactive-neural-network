var canvs = document.getElementById("snow");
var ctx = canvs.getContext("2d");
var nodes = [];
var ww = [];
var loss = [];
var height;
var learningRate = 0.05;
var isSigmoid = false;
var multiOutput = false;//nereikia sito kolkas
var isIdentity = false;
var isOwnInput = false;
var isTanh = false;
var isSoftmax = false;
var isRelu = true;
var numerOfIta = 1;
var nodeCount = [1, 2];
var inputData =  [[1, 1],
				[1, 0],
				[0, 1],
				[0, 0]];
var expectedOutput = [[1],[0],[0],[0]];
var momentumSpeed = 0;
var momentumWW = [];
var shuffleInput;
var shuffleOut;
var minibatch = inputData.length;
var derNodes;

function resizeCanvas() {
    
    canvs.width = window.innerWidth * 0.78;
    canvs.height = window.innerHeight * 0.75;
	height = canvs.height;
	genereateW();
	tableChange();
	copyArrays();
}

function copyArrays(){
	shuffleInput = new Array(inputData.length).fill(0).map(() => new Array(inputData[0].length).fill(0));
	shuffleOut = new Array(expectedOutput.length).fill(0).map(() => new Array(expectedOutput[0].length).fill(0));
	
	for(var i = 0; i < shuffleInput.length; i++){
		for(var j = 0; j < shuffleInput[0].length; j++){
			shuffleInput[i][j] = inputData[i][j];
		}
		for(var j = 0; j < expectedOutput[0].length; j++){
			shuffleOut[i][j] = expectedOutput[i][j];
		}
	}
}

function updateCanvas(){
	canvs.width = window.innerWidth * 0.78;
    canvs.height = window.innerHeight * 0.75;
	height = canvs.height;
}

function draw() {
	
	ctx.clearRect(0, 0, canvs.width, canvs.height);
	node();
	lines();
}

function node() {
	var tempHeight = height / (nodeCount.length + 1);
	nodes = [];
	for(var i = 0; i < nodeCount.length; i++) {
		var tempNodePos = [];
		var widthTemp = canvs.width / (nodeCount[i] + 1);
		ctx.lineWidth = 1;
		ctx.strokeStyle = `hsl(0, 0%, 0%)`;
		for (var k = 0; k < nodeCount[i]; k++) {
			
			ctx.beginPath();
			ctx.arc(widthTemp*(k+1),tempHeight*(i+1),tempHeight/(nodeCount[i]+2),0,2*Math.PI);
			ctx.stroke();
			if(i == 0){
				ctx.beginPath();
				ctx.moveTo(widthTemp*(k+1),tempHeight-tempHeight/(nodeCount[i]+2));
				ctx.lineTo(widthTemp*(k+1),tempHeight-(tempHeight/(nodeCount[i]+2)*1.7));
				ctx.lineTo(widthTemp*(k+1)-(widthTemp*(k+1)*(0.03/(k+1))),tempHeight-(tempHeight/(nodeCount[i]+2)*1.4));
				ctx.moveTo(widthTemp*(k+1),tempHeight-(tempHeight/(nodeCount[i]+2)*1.7));
				ctx.lineTo(widthTemp*(k+1)+(widthTemp*(k+1)*(0.03/(k+1))),tempHeight-(tempHeight/(nodeCount[i]+2)*1.4));
				ctx.stroke();
			}else if(i == nodeCount.length-1){
				ctx.beginPath();
				ctx.moveTo(widthTemp*(k+1),tempHeight*(i+1)+(tempHeight/(nodeCount[i]+2)*2));
				ctx.lineTo(widthTemp*(k+1),tempHeight*(i+1)+(tempHeight/(nodeCount[i]+2)*2)-tempHeight/(nodeCount[i]+2));
				ctx.lineTo(widthTemp*(k+1)-(widthTemp*(k+1)*(0.03/(k+1))),tempHeight*(i+1)+(tempHeight/(nodeCount[i]+2)*1.4));
				ctx.moveTo(widthTemp*(k+1),tempHeight*(i+1)+(tempHeight/(nodeCount[i]+2)*2)-tempHeight/(nodeCount[i]+2));
				ctx.lineTo(widthTemp*(k+1)+(widthTemp*(k+1)*(0.03/(k+1))),tempHeight*(i+1)+(tempHeight/(nodeCount[i]+2)*1.4));
				ctx.stroke();
			}
		
			tempNodePos.push([widthTemp*(k+1),tempHeight*(i+1),tempHeight/(nodeCount[i]+2)]);
		}
		nodes.push(tempNodePos);
	}
}


function lines() {
	
	var highest = ww[0][0][0];
	var lowest = ww[0][0][0];
	
	for(var i = 0; i < ww.length; i++) {
		for(var j = 1; j < ww[i].length; j++) {
			for(var k = 0; k < ww[i][j].length; k++){
				if(highest < ww[i][j][k]) {
					highest = ww[i][j][k];
				}else if(lowest > ww[i][j][k]) {
					lowest = ww[i][j][k];
				}
			}
		}
	}

	for(var i = 0; i < nodeCount.length-1; i++){
		for (var j = 0; j < nodeCount[i]; j++) {
			for (var k = 0; k < nodeCount[i+1]; k++) {
				
				
				
				var brightness;
				if(ww[ww.length-i-1][k+1][j] > 0){
					 brightness = (60 - (ww[ww.length-i-1][k+1][j] / highest) * 60) + 30;
					 ctx.strokeStyle = `hsl(0, 100%, ` + brightness + `%)`;
				} else if(ww[ww.length-i-1][k+1][j] < 0) {
					brightness = (60 - (ww[ww.length-i-1][k+1][j] / lowest) * 60) + 30;
					ctx.strokeStyle = `hsl(240, 100%, ` + brightness + `%)`;
				} else{
					ctx.strokeStyle = `hsl(0, 0%, 0%)`;
				}
				
				//ctx.lineWidth = 2.25;              // gives some space for lightness
				//ctx.setTransform(1,0,0,1,0.5,0.5); // not so useful for the curve itself

				
				ctx.beginPath();
				ctx.moveTo(nodes[i][j][0],nodes[i][j][1]+nodes[i][j][2]);
				ctx.lineTo(nodes[i+1][k][0],nodes[i+1][k][1]-nodes[i+1][k][2]);
				ctx.stroke();
				
				if(k == 0) {
					var fontSize = nodes[i][j][2]/2;
					ctx.font = fontSize + "px Arial";
					ctx.fillText(ww[ww.length-i-1][k][j].toFixed(2),nodes[i][j][0]-fontSize,nodes[i][j][1]+(fontSize/3));
				}

				ctx.lineWidth = 3;
				
				
			}
		
		}
	}
	
}
function updateInputTable(){
	var table = document.getElementById("tables");
	var row = table.insertRow(table.rows.length);
	
	for(var j = 0; j < nodeCount[nodeCount.length-1]; j++) {
		var cell = row.insertCell(j);
		cell.innerHTML = inputData[inputData.length-1][j];
	}
	for(var j = 0; j < expectedOutput[expectedOutput.length-1].length; j++) {
		var cell = row.insertCell(nodeCount[nodeCount.length-1]+j);
		cell.innerHTML = expectedOutput[expectedOutput.length-1][j];
	}
	
	for(var j = nodeCount[0] + nodeCount[nodeCount.length-1]; j < nodeCount[0]*2 + nodeCount[nodeCount.length-1]; j++) {
		var cell = row.insertCell(j);
	}
	
}
function inputDataTable(){
	var table = document.getElementById("tables");
	table.innerHTML = "";
	var rows = table.insertRow(0);
	
	for(var i = 0; i < nodeCount[nodeCount.length-1]; i++){
		var cell = rows.insertCell(i);
		cell.innerHTML = "Input "+(i+1);
	}
	
	for(var i = 0; i < nodeCount[0]; i++){
		var cell = rows.insertCell(i+nodeCount[nodeCount.length-1]);
		cell.innerHTML = "Expected Output "+(i+1);
	}
	
	for(var i = 0; i < nodeCount[0]; i++){
		var cell = rows.insertCell(i+nodeCount[nodeCount.length-1] + nodeCount[0]);
		cell.innerHTML = "Predicted Output "+(i+1);
	}

	var buttonPos = 0;
	for(var i = 0; i < nodeCount[0] + nodeCount[nodeCount.length-1]; i++){
		buttonPos += table.rows[0].cells[i].offsetWidth-7;
		var x = document.createElement("INPUT");
		x.setAttribute("type", "number");
		x.id = i;
		x.style.width = (table.rows[0].cells[i].offsetWidth-7) + 'px';
		document.body.appendChild(x);
		 
	}
	document.getElementById("addInfo").style.left = buttonPos + (nodeCount[0] + 2 + nodeCount[nodeCount.length-1]) *7 +'px';
}

function tableChange() {
	var table = document.getElementById("tables");
	table.innerHTML = "";
	var rows = table.insertRow(0);
	var cells1 = rows.insertCell(0);
	var cells2 = rows.insertCell(1);
	var cells3 = rows.insertCell(2);
	var cells4 = rows.insertCell(3);
	cells1.innerHTML = "Input 1";
	cells2.innerHTML = "Input 2";
	cells3.innerHTML = "Expected Output";
	cells4.innerHTML = "Predicted Output";
	
	for(var i = 0; i < inputData.length; i++) {
		var row = table.insertRow(i+1);
		for(var j = 0; j < inputData[i].length; j++) {
			var cell = row.insertCell(j);
			cell.innerHTML = inputData[i][j];
		}
		var cell = row.insertCell(inputData[i].length);
		cell.innerHTML = expectedOutput[i];
		var cell = row.insertCell(inputData[i].length+1);
	}
}

function tableChangeIris() {
	var table = document.getElementById("tables");	
	table.innerHTML = "";
	var rows = table.insertRow(0);
	var cells1 = rows.insertCell(0);
	var cells2 = rows.insertCell(1);
	var cells3 = rows.insertCell(2);
	var cells4 = rows.insertCell(3);
	var cells5 = rows.insertCell(4);
	var cells6 = rows.insertCell(5);
	var cells7 = rows.insertCell(6);
	var cells8 = rows.insertCell(7);
	cells1.innerHTML = "Sepal Length Cm";
	cells2.innerHTML = "Sepal Width Cm";
	cells3.innerHTML = "Petal Length Cm";
	cells4.innerHTML = "Petal Width Cm";
	cells5.innerHTML = "Species";
	cells6.innerHTML = "predicted Iris-setosa";
	cells7.innerHTML = "predicted Iris-versicolor";
	cells8.innerHTML = "predicted Iris-virginica";
	
	for(var i = 0; i < inputData.length; i++) {
		var row = table.insertRow(i+1);
		for(var j = 0; j < inputData[i].length; j++) {
			var cell = row.insertCell(j);
			cell.innerHTML = inputData[i][j];
		}
		var cell = row.insertCell(inputData[i].length);
		
		if(expectedOutput[i][0] == 1){
			cell.innerHTML = "Iris-setosa";
		}else if(expectedOutput[i][1] == 1){
			cell.innerHTML = "Iris-versicolor";
		}else if(expectedOutput[i][2] == 1){
			cell.innerHTML = "Iris-virginica";
		}
		
		var cell = row.insertCell(inputData[i].length+1);
		var cell = row.insertCell(inputData[i].length+2);
		var cell = row.insertCell(inputData[i].length+3);
	}

}

function updateTable(ans){

	var table = document.getElementById("tables");
	var tableLen = document.getElementById('tables').rows[0].cells.length;
	for(var i = 0; i < ans.length; i++) {
		for(var j = 0; j < ans[i].length; j++){
			var row = table.rows[i+1].cells;
			row[tableLen-(ans[i].length - j)].innerHTML = ans[i][j];
		}
	}
}