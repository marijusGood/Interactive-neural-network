# Interactive neural network
This is an interactive neural network where you can see how it works and change multiple settings!

## Visit to experiment yourself:

https://neuralnetworkmodel.000webhostapp.com/

## The website in acion
![](show.gif)


## About the project itself:
There are 3 loaded datasets: AND, OR and Iris flower datasets, press on the there buttons at the very top to load the datasets.

You can train this network with your own data, press on "Your own data" and below network diagram select input and output size.
Then write your own data into the table in the input fields and press "Add data to the table".

The canvas displays the neural network, in the middle of the node the bias is shown. If the weight between the nodes is positive it will be
red, the bigger the number, the more red it is. If the weight is blue then is is negative and the more blue it is, the bigger
the negative is. Also it shows which nodes and input layer(the arrows are pointing to the nodes) and which one is output layer(the arrows are
pointing from the nodes).

You can add more or less layers in an network or nodes in a layer.

You have a whole set of parameters you can tweak to see which one dose what and train your model faster.

The table below shows inputs, expected outputs and predicted outputs.

The graph shows how this model preformed with each iteration.


## About the code:
I used HTML, CSS and Javascript.
Everything is commented so you can go and take a look at it but I will give a quick summary of it.

[buttons.js](buttons.js) - it holds all of the code for responding to the buttons(I know right!?), it holds datasets, manipulates the data like normalization,
hides or shows specific parameters from the user when switching between datasets, changes the weight size. So when you press Iris dataset it will call functions
that change the table, redraw the network, regenerates the weights, displays correct labels for the new network and hides certain parameters.

[drawContent.js](https://github.com/marijusGood/Interactive-neural-network/blob/master/drawContent.js) - it draws all of the graphics(I'm good at creating file names) and it modifies the table that shows how the network
is doing. Also it stores all of the variables.

[googleLineChart.js](https://github.com/marijusGood/Interactive-neural-network/blob/master/googleLineChart.js) - makes a linear chart that shows networks loss over each iteration.

[neuralNetwork.js](https://github.com/marijusGood/Interactive-neural-network/blob/master/neuralNetwork.js) - This makes all of the calculations. It generates the weights, dose the forward pass of the network, calculates the loss for the Google 
graph, calculates the gradient and changes the new weights. It also dose forward pass or backpropagation dependent on what activation function is selected, 
what mini-batch is selected, whats the networks size and the gradients momentum.


Author Marijus Gudiskis marijus.good@gmail.com
