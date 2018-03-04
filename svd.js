// Visual SVD
// Scott Clayton
var svd = {
	learningRate: 0.02,
	totalIterations: 0,
	rmse: 0,
	factorize: function (matrix, featWide, featTall, predictionMatrix, errorMatrix, learningIterations) {
		var regularizationTerm = 0.01;
		var features = featWide[0].length;
        for (var i = 0; i < learningIterations; i++) {
            var squaredError = 0.0;
            var count = 0;
            for (var row = 0; row < matrix.length; row++) {
                for (var col = 0; col < matrix[0].length; col++) {
                    if (matrix[row][col] != 0) {
                        var prediction = svd.dotProduct(featWide[row], featTall[col]);
                        var error = matrix[row][col] - prediction;

						predictionMatrix[row][col] = prediction;
						errorMatrix[row][col] = error;
						
                        squaredError += error * error;
                        count++;
						
                        for (var feat = 0; feat < features; feat++)
                        {
                            featWide[row][feat] += svd.learningRate * (error * featTall[col][feat] - regularizationTerm * featWide[row][feat]);
                            featTall[col][feat] += svd.learningRate * (error * featWide[row][feat] - regularizationTerm * featTall[col][feat]);
                        }
                    } else {
						// Predict unknown cells
						predictionMatrix[row][col] = svd.dotProduct(featWide[row], featTall[col]);
						errorMatrix[row][col] = 0;
					}
                }
            }
			svd.totalIterations++;

            svd.rmse = Math.sqrt(squaredError / count);
			console.log("Iteration: " + svd.totalIterations + " Error: " + svd.rmse);

            svd.learningRate *= 0.99;
        }
	},
	dotProduct: function (left, right) {
		var prod = 0;
		for (var i = 0; i < left.length; i++) {
			prod += left[i] * right[i];
		}
		return prod;
	}
};