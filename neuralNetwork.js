function randomW(input, output) {
    weight = [];
    for(var i = 0; i < input; i++) {
        weight.push(Array.from({length: output}, () => Math.random()+0.0001));
    }
    return weight;
}

function momentumZeros(input, output) {
    weight = [];
    for(var i = 0; i < input; i++) {
        weight.push(Array.from({length: output}, () => 0));
    }
    return weight;
}

function genereateW(){
	ww = [];
	loss = [];
	momentumWW = [];
	for(var i = nodeCount.length-1; i > 0; i--) {
        ww.push(randomW(nodeCount[i]+1, nodeCount[i-1]));
		momentumWW.push(momentumZeros(nodeCount[i]+1, nodeCount[i-1]));
    }
}

function relu(nodes) {
    for(var i = 0; i < nodes.length; i++) {
		for(var j = 0; j < nodes[0].length; j++) {
			if (nodes[i][j] < 0) {
				nodes[i][j] = 0;
			}
		}
    }
	return nodes;
}

function sigmoid(nodes){
	for(var i = 0; i < nodes.length; i++) {
		for(var j = 0; j < nodes[0].length; j++) {
			nodes[i][j] = 1 / (1 + Math.exp(-nodes[i][j]));
		}
    }
	return nodes;
}

function softmax(nodes){
	for(var i = 0; i < nodes.length; i++){
		var sum = 0;
		for(var j = 0; j < nodes[i].length; j++){
			sum += Math.exp(nodes[i][j]);
		}
		
		for(var j = 0; j < nodes[i].length; j++){
			nodes[i][j] = (Math.exp(nodes[i][j]) / sum);
		}
	}
	return nodes;
}

function sigmoidDer(nodes){
	
	var derivative = [];
	for(var i = 0; i < nodes.length; i++) {
		derivative.push(Array.apply(null, Array(nodes[0].length)).map(Number.prototype.valueOf,0));
	}
	
	for(var i = 0; i < nodes.length; i++) {
		for(var j = 0; j < nodes[0].length; j++) {
			derivative[i][j] = nodes[i][j] * (1 - nodes[i][j]);
		}
    }
	return derivative;
}

function shuffle(shuffleInput, shuffleOut) {
    var j, x;

    for (var i = shuffleInput.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = shuffleInput[i];
        shuffleInput[i] = shuffleInput[j];
        shuffleInput[j] = x;

		x = shuffleOut[i];
        shuffleOut[i] = shuffleOut[j];
        shuffleOut[j] = x;
    }
}

function addOnes(layer) {
	var one = [];
	for(var i = 0; i < layer.length; i++) {
		one.push(Array.apply(null, Array(layer[0].length)).map(Number.prototype.valueOf,1));
	}
	for(var i = 0; i < layer.length; i++) {
		for(var j = 0; j < layer[0].length; j++){
			one[i][j+1] = layer[i][j];
		}
	}
	return one;
}


function feedforward(weights, input_layer) {
	var layers = [];
	layers.push(input_layer);
	var lastlayerZ;
	for(var i = 0; i < weights.length; i++) {
		var temp = addOnes(layers[i]);
		var layer;
		if(isSoftmax && i == weights.length-1){
			var lastLZcal = math.multiply(temp, weights[i]);
			layer = softmax(lastLZcal);
			lastlayerZ = lastLZcal;
		}else if(isSigmoid){
			layer = sigmoid(math.multiply(temp, weights[i]));
		}else{
			layer = relu(math.multiply(temp, weights[i]));
		}
		layers.push(layer);
	}
    return layers;
}

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
	var numerator = [];
	for(var i = nodeCount.length-1; i > 0; i--) {
        gradAprox.push(randomW(4, nodeCount[i-1]));
		numerator.push(randomW(4, nodeCount[i-1]));
    }

	for(var j = 0; j < feedFwrdplus.length-1; j++){
		for(var i = 0; i < feedFwrdplus[j+1].length; i++) {
			for(var k = 0; k < feedFwrdplus[j+1][i].length-1; k++) {
				gradAprox[j][i][k] =  (feedFwrdplus[j+1][i][k] - feedFwrdminus[j+1][i][k]) / (2 * epsilon);
				numerator[j][i][k] = feedFwrd[j+1][i][k] - gradAprox[j][i][k];
			}
		}
	}
	
	var num = math.norm(numerator[0], 'fro');
	var den = math.norm(feedFwrd[1], 'fro') + math.norm(gradAprox[0], 'fro');
	var diff = num / den;
	console.log(diff);	
}

function backpropagation(weights, inputs, layers, expectedOut) {
	var deltas = [];
	var gradientsW = [];
	
	var delts = randomW(layers[layers.length-1].length, layers[layers.length-1][0].len);
	
	for(var i = 0; i < expectedOut.length; i++) {	
		
		for(var j = 0; j < expectedOut[i].length; j++) {
			var cost = 2*(layers[layers.length-1][i][j] - expectedOut[i][j]);
			if(isSoftmax){
				delts[i][j] = cost * (layers[layers.length-1][i][j] * (1 - layers[layers.length-1][i][j]));
				//delts[i][j] = layers[layers.length-1][i][j] - (layers[layers.length-1][i][j] * layers[layers.length-1][i][j]);
			}else if(isSigmoid){
				delts[i][j] = cost * (layers[layers.length-1][i][j] * (1 - layers[layers.length-1][i][j]));
			} else{
				delts[i][j] = cost;
			}
		}
	}
	
	deltas.push(delts);
	
	var q = 0;
	for(var i = weights.length-1; i >= 0 ; i--) {
		var temp;
		if(i == 0) {
			temp = inputData;
		} else {

			var aa = math.transpose(weights[i]);
			
			temp = math.multiply(deltas[q], aa);
			
			var x = temp.map(function(val){
			return val.slice(1, temp[0].length);
			});
			if(isSigmoid){
				sigmodiDerivative = sigmoidDer(layers[i]);
				
				for(var u = 0; u < x.length; u++) {
					for(var j = 0; j < x[0].length; j++) {
						x[u][j] = sigmodiDerivative[u][j] * x[u][j];
					}
				}
			}
		}
		
		deltas.push(x);

		temp = addOnes(layers[i]);
		

		var skr = math.multiply(math.transpose(temp), deltas[q]);
		
		for(var u = 0; u < skr.length; u++) {
			for(var j = 0; j < skr[u].length; j++){
				skr[u][j] /= inputs.length;
				//skr[u][j] *= learningRate;
				momentumWW[i][u][j] = (momentumSpeed * momentumWW[i][u][j]) + (1 - momentumSpeed)*skr[u][j];
			}
		}
		
		gradientsW.push(skr);
		
		q++;
	}
   

   
    return gradientsW;
}

function combine() {
	//gradientCheck(inputData, ww);
	for(var u = 0; u < numerOfIta; u++){
		var lossCount = 0;
		shuffle(shuffleInput, shuffleOut);
		for(var o = 0; o < inputData.length; o += minibatch) {
			
			var shuffleInputBatch = shuffleInput.slice(o, o+minibatch);
			var shuffleOutBatch = shuffleOut.slice(o, o+minibatch);
			
			var feedFwrd = feedforward(ww, shuffleInputBatch);
			var gradientsW = backpropagation(ww, shuffleInputBatch, feedFwrd, shuffleOutBatch);
			
			for(var i = 0; i < shuffleOutBatch.length; i++) {
		
				for(var j = 0; j < shuffleOutBatch[i].length; j++) {
					lossCount += (feedFwrd[feedFwrd.length-1][i][j] - shuffleOutBatch[i][j])**2;
				}
			}
			
			for(var i = 0; i < ww.length; i++) {
				for(var j = 0; j < ww[i].length; j++){
					for(var k = 0; k < ww[i][j].length; k++){
						ww[i][j][k] -= (momentumWW[i][j][k] * learningRate);
					}
				}
			}
			
		}
		lossCount /= shuffleInput.length;
		if(loss.length > 0){
			loss.push([loss[loss.length-1][0]+1, lossCount]);
		} else {
			loss.push([0, lossCount]);
		}
		
	}
	
	var feedFwrd = feedforward(ww, inputData);
	for(var i = 0; i < feedFwrd[feedFwrd.length-1].length; i++){
		for(var j = 0; j < feedFwrd[feedFwrd.length-1][i].length; j++){
			feedFwrd[feedFwrd.length-1][i][j] = Math.round(feedFwrd[feedFwrd.length-1][i][j] * 10000) / 10000
		}
	}
	
    return feedFwrd[feedFwrd.length-1];
}