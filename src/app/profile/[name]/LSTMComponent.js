import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";

const LSTMComponent = () => {
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const train = async () => {
      const data = [
        [11,13,16,18,21,43],
        [5,9,18,29,39,42],
        [7, 12, 13, 17, 20, 36],
        [6, 22, 26, 30, 35, 36],
        [16, 20, 23, 32, 37, 39],
        [3, 17, 25, 26, 41, 42],
        [25, 29, 37, 43, 46, 48],
        [1, 10, 15, 17, 35, 45],
        [7, 12, 31, 34, 41, 48],
        [4, 9, 17, 30, 36, 43],
        [1, 4, 16, 22, 29, 47],
        [1, 12, 17, 19, 23, 39],
        [3, 4, 9, 27, 30, 37],
        [15, 17, 23, 32, 37, 47],
        [9, 17, 22, 28, 37, 43],
        [4, 6, 20, 40, 45, 46],
        [18, 19, 26, 27, 29, 30],
        [30, 31, 34, 43, 45, 47],
        [9, 17, 25, 30, 38, 48],
        [5, 18, 22, 26, 28, 45],
        [10, 14, 17, 22, 25, 38],
        [5, 9, 14, 29, 37, 38],
        [8, 10, 18, 32, 33, 42],
        [8, 17, 20, 26, 42, 44],
        [3, 10, 31, 38, 39, 41],
        [12, 13, 30, 33, 35, 43],
        [3, 16, 22, 25, 27, 46],
        [6, 10, 11, 22, 32, 43],
        [3, 13, 14, 19, 26, 36],
        [22, 23, 25, 35, 36, 41],
        [2, 3, 6, 7, 17, 27],
        [2, 5, 7, 12, 31, 44],
        [17, 35, 37, 40, 45, 47],
        [1, 5, 10, 20, 28, 39],
        [4, 7, 9, 25, 34, 48],
        [2, 7, 8, 18, 33, 36],
        [10, 19, 20, 30, 38, 45],
        [3, 7, 8, 25, 35, 48],
        [15, 25, 30, 31, 40, 48],
        [17, 24, 31, 32, 35, 47],
        [9, 18, 22, 23, 28, 46],
        [10, 11, 23, 30, 44, 49],
        [3, 4, 10, 12, 30, 34],
        [10, 21, 30, 32, 35, 49],
        [8, 13, 16, 40, 42, 47],
        [5, 7, 15, 18, 21, 29],
        [4, 5, 13, 14, 33, 35],
        [16, 31, 42, 44, 45, 48],
        [12, 18, 22, 24, 25, 47],
        [14, 23, 26, 31, 32, 42],
        [1, 15, 19, 24, 32, 44],
        [22, 31, 33, 34, 43, 49],
        [9, 22, 23, 25, 30, 37],
        [11, 20, 26, 38, 44, 45],
        [3, 7, 37, 43, 45, 46],
        [4, 6, 23, 27, 41, 48],
        [16, 25, 28, 40, 47, 49],
        [13, 14, 27, 29, 31, 42],
        [27, 34, 36, 41, 44, 47],
        [3, 19, 23, 30, 37, 42],
        [7, 15, 21, 34, 46, 48],
        [6, 11, 28, 29, 39, 43],
        [5, 9, 25, 29, 39, 48],
        [4, 8, 21, 38, 46, 49],
        [1, 6, 13, 17, 43, 44],
        [1, 20, 30, 35, 36, 44],
        [9, 10, 19, 23, 32, 37],
        [8, 13, 16, 27, 31, 46],
        [10, 17, 21, 22, 41, 42],
        [5, 11, 23, 31, 45, 49],
        [9, 10, 12, 17, 30, 45],
        [11, 12, 13, 16, 22, 28],
        [2, 7, 9, 11, 39, 41],
        [4, 7, 8, 15, 34, 45],
        [4, 9, 26, 27, 28, 33],
        [6, 13, 21, 29, 33, 49],
        [6, 9, 25, 34, 36, 43],
        [3, 9, 19, 22, 37, 43],
        [3, 8, 10, 14, 34, 35],
        [2, 23, 24, 25, 39, 40],
        [3, 19, 24, 25, 27, 43],
        [3, 5, 7, 10, 26, 39],
        [1, 3, 8, 37, 41, 43],
        [4, 17, 21, 27, 32, 42],
        [6, 12, 19, 24, 38, 47],
        [11, 13, 29, 31, 42, 47],
        [8, 22, 23, 24, 34, 38],
        [5, 12, 15, 26, 46, 48],
        [5, 13, 24, 33, 35, 41],
        [8, 11, 27, 35, 38, 45],
        [6, 13, 25, 31, 41, 47],
        [1, 10, 11, 13, 29, 37],
        [13, 17, 22, 30, 31, 47],
        [5, 6, 14, 16, 45, 48],
        [4, 17, 21, 22, 31, 38],
        [2, 5, 7, 11, 15, 21],
        [2, 10, 16, 17, 24, 26],
        [10, 11, 21, 22, 24, 30],
        [29, 34, 37, 38, 42, 49],
        [11, 18, 20, 23, 29, 42],
        [9, 21, 34, 37, 41, 44],
        [10, 14, 20, 35, 37, 40],
        [22, 23, 38, 41, 44, 48],
        [4, 18, 26, 36, 41, 42],
        [4, 11, 16, 19, 27, 35],
        [18, 26, 32, 37, 42, 43],
        [3, 14, 19, 20, 28, 47],
        [12, 16, 21, 32, 38, 45],
        [4, 6, 12, 20, 41, 44],
        [1, 20, 24, 32, 36, 37],
        [21, 23, 30, 34, 41, 49],
        [2, 20, 31, 40, 48, 49],
        [19, 25, 38, 40, 47, 48],
      ];

      let xs = [];
      let ys = [];
      for (let i = 0; i < data.length - 1; i++) {
        xs.push(data[i + 1].map((item) => [item])); // reshaping each data[i+1] into a 2D array
        ys.push(data[i]);
      }

      const xsTensor = tf.tensor3d(xs, [xs.length, 6, 1]);
      const ysTensor = tf.tensor2d(ys, [ys.length, 6]);

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

      model.compile({
        optimizer: tf.train.adam(0.01),
        loss: "meanSquaredError",
      });

      try {
        await model.fit(xsTensor, ysTensor, { epochs: 200 });

        const input = data[data.length - 1]; // Use the last sequence in the data
        const reshapedInput = [input.map(item => [item])]; // Reshape the input to be a 3D array
        const inputTensor = tf.tensor3d(reshapedInput, [1, 6, 1]);
        const predictionTensor = model.predict(inputTensor);
        const rawPrediction = predictionTensor.dataSync();
        const reshapedPrediction = tf.tensor(rawPrediction, [1, 6]).arraySync();
        const uniquePrediction = [...new Set(reshapedPrediction[0].map(Math.round))];

        setPrediction(uniquePrediction);
      } catch (error) {
        console.error('Error during training:', error);
      }
    };

    train();
  }, []);
  if (prediction) {
    console.log(prediction);
    console.log("finished");
  }
  return <div>{prediction && <p>Prediction: {prediction.join(", ")}</p>}</div>;
};

export default LSTMComponent;
