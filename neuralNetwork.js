/** @author Marijus Gudiskis marijus.good@gmail.com*/

/** creates an 2d array of random weights from 0 to 1 
* if doLRoptimization is true then the weights are small and it helps to
* avoid vanishing or exploding gradient
* @param {number} the input size of the layer
* @param {number} the output size of the layer
* @return {(number|Array)} 2d random array
*/
function randomW(input, output) {
    let weight = [];
	let momentumWeights = [];
	
    for(let i = 0; i < input; i++) {
        weight.push(Array.from({length: output}, () => Math.random()));//generates row of weights
		momentumWeights.push(Array.from({length: output}, () => 0));//generates 0s for the momentum weights
    }
	
	if(doLRoptimization) {
		//makes the weights smaller thus protecting from exploding or vanishing gradient
		for(let i = 0; i  < weight.length; i++) {
			for(let j = 0; j < weight[i].length; j++) {
				weight[i][j] = weight[i][j] * Math.sqrt(1/input);
			}
		}
	}
	
    return weight;
}

/** creates an 2d array of 0s
* @param {number} the input size of the layer
* @param {number} the output size of the layer
* @return {(number|Array)} 2d array of 0s
*/
function momentumZeros(input, output) {
    let weight = [];
    for(let i = 0; i < input; i++) {
        weight.push(Array.from({length: output}, () => 0));
    }
    return weight;
}

/** generates new 3d array of weights, each weight layer gets a 2d array of weights
* the first row of weights in 2d array is for node0(bias), the the second layer if for 
* node1 and so on
*/
function genereateW(){
	ww = [];
	loss = [];
	momentumWW = [];
	for(let i = nodeCount.length-1; i > 0; i--) {
		//adds the 2d array to the arrays
        ww.push(randomW(nodeCount[i]+1, nodeCount[i-1]));
		momentumWW.push(momentumZeros(nodeCount[i]+1, nodeCount[i-1]));
    }
}

/** ReLU activation function
* @param {(number|Array)} 2d input array
* @return {(number|Array)} 2d array after ReLU
*/
function relu(nodes) {
    for(let i = 0; i < nodes.length; i++) {
		for(let j = 0; j < nodes[0].length; j++) {
			if (nodes[i][j] < 0) {
				nodes[i][j] = 0;
			}
		}
    }
	return nodes;
}

/** Sigmoid activation function
* @param {(number|Array)} 2d input array
* @return {(number|Array)} 2d array after Sigmoid
*/
function sigmoid(nodes){
	for(let i = 0; i < nodes.length; i++) {
		for(let j = 0; j < nodes[0].length; j++) {
			nodes[i][j] = 1 / (1 + Math.exp(-nodes[i][j]));//sigmoid calculation
		}
    }
	return nodes;
}

/** Softmax activation function and it calculates the derivatives of the
* softmax, I did it this way, because I dont output the forward pass layer
* before the activation functions, so i just calculate before the activation
* @param {(number|Array)} 2d input array
* @return {(number|Array)} 2d array after Softmax
*/
function softmax(nodes){
	 derNodes = randomW(nodes.length, nodes[0].length);
	
	for(var i = 0; i < nodes.length; i++){
		var sum = 0;
		for(var j = 0; j < nodes[i].length; j++){
			sum += Math.exp(nodes[i][j]);
		}
		
		for(var j = 0; j < nodes[i].length; j++){
			var temp = Math.exp(nodes[i][j]);
			derNodes[i][j] = (temp * (sum - temp)) / (sum**2);
			nodes[i][j] = (temp / sum);
		}
	}
	return nodes;
}

/** Sigmoid derivative calculation
* @param {(number|Array)} 2d input layer when feedFwrd was happening
* @param {(number|Array)} 2d derivative Layer without sigmoid derivative
* @return {(number|Array)} 2d array after Sigmoid derivative
*/
function sigmoidDer(nodes, derivativeLayer){
	for(let i = 0; i < nodes.length; i++) {
		for(let j = 0; j < nodes[0].length; j++) {
			derivativeLayer[i][j] = derivativeLayer[i][j] * (nodes[i][j] * (1 - nodes[i][j]));
		}
    }
	return derivativeLayer;
}

/** TanH activation function
* @param {(number|Array)} 2d input array
* @return {(number|Array)} 2d array after TanH
*/
function tanh(nodes) {
	for(let i = 0; i < nodes.length; i++) {
		for(let j = 0; j < nodes[0].length; j++) {
			nodes[i][j] = (Math.exp(nodes[i][j]) - Math.exp(-nodes[i][j]))/(Math.exp(nodes[i][j]) + Math.exp(-nodes[i][j]));
		}
    }
	return nodes;
}

/** TanH derivative calculation
* @param {(number|Array)} 2d input layer when feedFwrd was happening
* @param {(number|Array)} 2d derivative Layer without TanH derivative
* @return {(number|Array)} 2d array after TanH derivative
*/
function tanhDer(nodes, derivativeLayer){	
	for(let i = 0; i < nodes.length; i++) {
		for(let j = 0; j < nodes[0].length; j++) {
			derivativeLayer[i][j] = derivativeLayer[i][j] * (1 - (nodes[i][j]**2));
		}
    }
	return derivativeLayer;
}

/** I need to shuffle the Input and expected output layer identical so that the network
* would learn correctly
* @param {(number|Array)} 2d input layer to shuffle
* @param {(number|Array)} 2d output layer to shuffle
*/
function shuffle(shuffleInput, shuffleOut) {
    let j, x;

    for (let i = shuffleInput.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));//random position
		//switch variable places
        x = shuffleInput[i];
        shuffleInput[i] = shuffleInput[j];
        shuffleInput[j] = x;

		x = shuffleOut[i];
        shuffleOut[i] = shuffleOut[j];
        shuffleOut[j] = x;
    }
}

/** add a column of ones at the beginning of the array for the bias, because weight * 1
* is the same as bias
* @param {(number|Array)} 2d input layer
* @return {(number|Array)} 2d input layer after adding ones
*/
function addOnes(layer) {//I might be able to optimize this
	//this is so that the original layer wont be changed
	let one = [];
	for(let i = 0; i < layer.length; i++) {
		one.push(Array.apply(null, Array(layer[0].length)).map(Number.prototype.valueOf,1));
	}
	//copying the array
	for(let i = 0; i < layer.length; i++) {
		for(let j = 0; j < layer[0].length; j++){
			one[i][j+1] = layer[i][j];
		}
	}
	return one;
}

/** 
* this dose the forward pass with the selected activation function
* @param {(number|Array)} weights for all the layers
* @param {(number|Array)} input layer
* @return {(number|Array)} all of the layers after the activation functions
*/
function feedforward(weights, input_layer) {
	let layers = [];
	layers.push(input_layer);
	
	for(let i = 0; i < weights.length; i++) {
		let temp = addOnes(layers[i]);
		if(isSoftmax && i == weights.length-1){//if is softmax and is last layer
			//this dose dot product with input layer and weights, then action function, then pushes it to the layers array
			layers.push(softmax(math.multiply(temp, weights[i])));
		}else if(isSigmoid){
			//identical as above, just sigmoid
			layers.push(sigmoid(math.multiply(temp, weights[i])));
		}else if(isRelu){
			layers.push(relu(math.multiply(temp, weights[i])));
		}else if(isIdentity) {
			layers.push(math.multiply(temp, weights[i]));
		}else if(isTanh){
			layers.push(tanh(math.multiply(temp, weights[i])));
		}
	}
	
    return layers;
}

/** I checked if the gradient is correct, this is not important to the working code */
function gradientCheck(input, weights){
	var epsilon = 0.0000001;
	var feedFwrd = feedforward(ww, inputData);
	wwPlus = [];
	wwMinus = [];
	for(var i = nodeCount.length-1; i > 0; i--) {
        wwPlus.push(randomW(nodeCount[i]+1, nodeCount[i-1]));
		wwMinus.push(randomW(nodeCount[i]+1, nodeCount[i-1]));
    }
	
	for(var i = 0; i < ww.length; i++) {
		for(var j = 0; j < ww[i].length; j++){
			for(var k = 0; k < ww[i][j].length; k++){
				wwPlus[i][j][k] = ww[i][j][k] + epsilon;
				wwMinus[i][j][k] = ww[i][j][k] - epsilon;
			}
		}
	}
	var feedFwrdplus = feedforward(wwPlus, inputData);
	var feedFwrdminus= feedforward(wwMinus, inputData);
	
	var gradAprox = [];
	var temp = [];
	for(var i = nodeCount.length-1; i > 0; i--) {
        gradAprox.push(randomW(4, nodeCount[i-1]));
		temp.push(randomW(4, nodeCount[i-1]));
    }
	
	var combination = backpropagation(ww, inputData, feedFwrd, expectedOutput);
	var grad = combination[0];
	var lossCount = combination[1];
	
	for(var j = 0; j < feedFwrdplus.length-1; j++){
		for(var i = 0; i < feedFwrdplus[j+1].length; i++) {
			for(var k = 0; k < feedFwrdplus[j+1][i].length-1; k++) {
				gradAprox[j][i][k] =  (feedFwrdplus[j+1][i][k] - feedFwrdminus[j+1][i][k]) / (2 * epsilon);
				temp[j][i][k] = grad[j][i][k] - gradAprox[j][i][k];
			}
		}
	}
	

	
	
	
	var numerator = math.norm(temp[0]);
    var denominator = math.norm(grad[0]) + math.norm(gradAprox[0]);
    var difference = numerator / denominator           ;                
	
	console.log(diff);	
}

/** 
* this is the backpropagation of the network
* @param {(number|Array)} weights for all the layers
* @param {(number|Array)} input layer
* @param {(number|Array)} layers after activation function
* @param {(number|Array)} the expected output layer
* @return {(number|Array)} all of the layers after the activation functions
*/
function backpropagation(weights, inputs, layers, expectedOut) {
	let deltas = [];//derivative of each layer
	let loss = 0;//the loss of the current mini batch
	
	//temporary derivative of output layer, I use randomW because it can generate the right size array
	let delts = randomW(layers[layers.length-1].length, layers[layers.length-1][0].len);
	
	for(let i = 0; i < expectedOut.length; i++) {	
		
		for(let j = 0; j < expectedOut[i].length; j++) {
			//calculates the derivative of output layer
			let cost;
			//cost = -(expectedOut[i][j] * Math.log(Math.abs(layers[layers.length-1][i][j])) + (1 - expectedOut[i][j]) * Math.log(Math.abs((1 - layers[layers.length-1][i][j]))));
			//cost = -1 * (expectedOut[i][j] * (1/layers[layers.length-1][i][j])) + (1 - expectedOut[i][j]) * (1/(1-layers[layers.length-1][i][j]));
			//cost = -1* (expectedOut[i][j] * Math.log(layers[layers.length-1][i][j]) + (1 - expectedOut[i][j]) * Math.log(1 - layers[layers.length-1][i][j]));
			//loss += cost;
			let cTemp = layers[layers.length-1][i][j] - expectedOut[i][j];//temp cost
			cost = 2*cTemp;//cost derivative
			loss += cTemp**2;//loss of the current output
			
			if(isSoftmax){//softmax derivative
				delts[i][j] = cost * derNodes[i][j];//this is bad implementation, fix this
			}else if(isSigmoid){//sigmoid derivative
				delts[i][j] = cost * (layers[layers.length-1][i][j] * (1 - layers[layers.length-1][i][j]));
			} else if(isIdentity || isRelu){//Identity and Ralu derivative
				delts[i][j] = cost;
			} else if(isTanh) {//Than derivative
				delts[i][j] = cost * (1 - (layers[layers.length-1][i][j]**2));
			}
		}
	}
	
	deltas.push(delts);//push output layer derivative
	
	let derivativeLayerCount = 0;
	//calculate the derivative of the layers and the gradient of the weights
	for(let i = weights.length-1; i >= 0 ; i--) {
		var temp;
		if(i == 0) {
			temp = inputData;//if its last layer then this will be multiplied by the it
		} else {
			
			temp = math.multiply(deltas[derivativeLayerCount], math.transpose(weights[i]));//derivative of the layer
			
			var derivativeLayer = temp.map(function(val){//remove the first(bias) column
				return val.slice(1, temp[0].length);
			});
			if(isSigmoid){
				derivativeLayer = sigmoidDer(layers[i], derivativeLayer);//derivative of sigmoid
			}else if(isTanh){
				derivativeLayer = tanhDer(layers[i], derivativeLayer);//derivative of Than
			}
		}
		
		deltas.push(derivativeLayer);//push derivativeLayer layer

		temp = addOnes(layers[i]);// add bias, the ones
		

		let gradientLayer = math.multiply(math.transpose(temp), deltas[derivativeLayerCount]);
		
		for(let u = 0; u < gradientLayer.length; u++) {
			for(let j = 0; j < gradientLayer[u].length; j++){
				gradientLayer[u][j] /= inputs.length;//divide by the input size
				//calculating the momentum, momentumWW is a global variable, not good, but ye
				momentumWW[i][u][j] = (momentumSpeed * momentumWW[i][u][j]) + (1 - momentumSpeed) * gradientLayer[u][j];
			}
		}
		
		derivativeLayerCount++;
	}
    return loss;
}

/**
*combines all of the feedFwrd and backrpopgation and if the doLRoptimization
* is selected then optimize the learning rate and momentum speed
*@return {(number|Array)} returns the networks output after leaning
*/
function combine() {
	//gradientCheck(inputData, ww);

	for(let u = 0; u < numerOfIta; u++){//this is the iteration loop
		let lossCount = 0;//sum of the loss in each mini batch
		shuffle(shuffleInput, shuffleOut);//shuffles the data
		for(let o = 0; o < inputData.length; o += minibatch) {//this is the mini batch loop
			
			let shuffleInputBatch = shuffleInput.slice(o, o+minibatch);//divides the array into batch size
			let shuffleOutBatch = shuffleOut.slice(o, o+minibatch);
			
			let feedFwrd = feedforward(ww, shuffleInputBatch);
			lossCount += backpropagation(ww, shuffleInputBatch, feedFwrd, shuffleOutBatch);//the momentumWW is global
			
			for(let i = 0; i < ww.length; i++) {
				for(let j = 0; j < ww[i].length; j++){
					for(let k = 0; k < ww[i][j].length; k++){
						ww[i][j][k] -= (momentumWW[i][j][k] * learningRate);//changing the weights
					}
				}
			}
		}
		//lossCount /= shuffleInput.length;
		//add the loss to the loss array to be displayed on the graph
		if(loss.length > 0){
			loss.push([loss[loss.length-1][0]+1, lossCount]);
		} else {
			loss.push([0, lossCount]);
		}
		
		if(doLRoptimization){
			//increase the learning rate over time if the gradient is to small
			
			if(isSigmoid || isTanh){
				//add all of the gradient outputs
				let tempindicator = 0;
				for(let h = 0; h < momentumWW[momentumWW.length-1][0].length; h++){
					tempindicator += Math.abs(momentumWW[momentumWW.length-1][0][h])
				}
				//increase the learning rate if the gradient is too small
				if(tempindicator * learningRate < 0.01) {
					
					learningRate += (0.015/nodeCount[0]);
				}
			}
			if(isRelu || isIdentity){
				//the same as above but for Relu and identity
				let tempindicator = 0;
				for(let h = 0; h < momentumWW[momentumWW.length-1][0].length; h++){
					tempindicator += Math.abs(momentumWW[momentumWW.length-1][0][h])
				}
				
				if(tempindicator * learningRate < 0.0001) {
					
					learningRate += (0.0001/nodeCount[0]);
				}
			}
		}
	}
	
	//if learning rate or momentum speed change show its change
	document.getElementById('lrRate').value = learningRate;
	document.getElementById('gradMomentum').value = momentumSpeed;
	
	let feedFwrd = feedforward(ww, inputData);//this is the unshuffled  array, so that I could display on the table
	
    return feedFwrd[feedFwrd.length-1];
}