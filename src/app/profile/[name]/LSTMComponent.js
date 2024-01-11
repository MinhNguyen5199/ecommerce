// Import necessary libraries
import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";

// Define a functional component named LSTMComponent
const LSTMComponent = () => {
  // State variable to store the prediction
  const [prediction, setPrediction] = useState(null);

  // useEffect hook runs the training and prediction logic when the component mounts
  useEffect(() => {
    // Define an asynchronous function for training and prediction
    const trainAndPredict = async () => {
      try {
        // Placeholder for your training data (replace with your actual data)
        const data = [
          [11, 13, 16, 18, 21],
          [5, 9, 18, 29, 39],
          [7, 12, 13, 17, 20],
          [6, 22, 26, 30, 35],
        ];

        // Prepare input sequences (xs) and output sequences (ys) for training
        const xs = [];
        const ys = [];
        for (let i = 0; i < data.length - 1; i++) {
          xs.push(data[i + 1].map((item) => [item])); // Input sequence
          ys.push(data[i]); // Output sequence
        }

        // Create TensorFlow tensors for input and output
        const xsTensor = tf.tensor3d(xs, [xs.length, 6, 1]);
        const ysTensor = tf.tensor2d(ys, [ys.length, 6]);

        // Define the LSTM model using TensorFlow.js
        const model = tf.sequential();
        model.add(
          tf.layers.lstm({
            units: 200,
            returnSequences: true,
            inputShape: [6, 1],
          })
        );
        model.add(tf.layers.lstm({ units: 100, returnSequences: false }));
        model.add(tf.layers.dense({ units: 6 }));

        // Compile the model with an optimizer and loss function
        model.compile({
          optimizer: tf.train.adam(0.01),
          loss: "meanSquaredError",
        });

        // Train the model using the prepared data
        await model.fit(xsTensor, ysTensor, { epochs: 200 });

        // Batch prediction for the next sequences based on the last element of the data
        const numPredictions = data.length;
        const input = data[data.length - 1];
        const reshapedInput = Array.from({ length: numPredictions }, () =>
          input.map((item) => [item])
        );
        const inputTensor = tf.tensor3d(reshapedInput, [numPredictions, 6, 1]);
        const predictionTensor = model.predict(inputTensor);
        const rawPredictions = predictionTensor.arraySync();
        
        // Post-process predictions to ensure uniqueness
        const uniquePredictions = rawPredictions.map((prediction) =>
          [...new Set(prediction.map(Math.round))]
        );

        // Update the component state with the predictions
        setPrediction(uniquePredictions);

        // Log the predictions and completion message
        console.log("Predictions:", uniquePredictions);
        console.log("Training and Prediction finished");
      } catch (error) {
        // Handle errors during training and prediction
        console.error("Error during training and prediction:", error);
      }
    };

    // Call the trainAndPredict function when the component mounts
    trainAndPredict();
  }, []); // The empty dependency array ensures the useEffect runs only once

  // Render the component with the prediction information
  return (
    <div>
      {prediction ? (
        // Display predictions if available
        <div>
          <p>Predictions:</p>
          {prediction.map((pred, index) => (
            <p key={index}>Prediction {index + 1}: {pred.join(", ")}</p>
          ))}
        </div>
      ): (
        // Display a loading message during training
        <p>Training...</p>
      )}
    </div>
  );
};

// Export the LSTMComponent as the default export of the module
export default LSTMComponent;
