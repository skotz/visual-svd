// Visual SVD
// Scott Clayton
$(document).ready(function() {
	
	var rows = 5;
	var cols = 5;
	var features = 3;
	
	var matrix = [
		[0,9,0,0,10],
		[3,0,0,5,0],
		[0,1,0,0,0],
		[0,5,1,0,3],
		[0,0,0,0,7]
	];
	
	var predictions = [
		[0,0,0,0,0],
		[0,0,0,0,0],
		[0,0,0,0,0],
		[0,0,0,0,0],
		[0,0,0,0,0]
	];
	
	var error = [
		[0,0,0,0,0],
		[0,0,0,0,0],
		[0,0,0,0,0],
		[0,0,0,0,0],
		[0,0,0,0,0]
	];
	
	var latentWide = [
		[0.899, 0.762, 0.870],
		[0.922, 0.771, 0.439],
		[0.767, 0.939, 0.877],
		[0.498, 0.691, 0.301],
		[0.985, 0.067, 0.241]
	];
	
	var latentTall = [
		[0.571, 0.171, 0.634],
		[0.466, 0.181, 0.921],
		[0.841, 0.648, 0.492],
		[0.728, 0.671, 0.091],
		[0.649, 0.721, 0.699]
	];
	
	var $matrixActual = $("#matrixActual");
	var $matrixPredict = $("#matrixPredict");
	var $matrixError = $("#matrixError");
	var $rmse = $("#rmse");
	var $iterations = $("#iterations");
	
	CreateMatrixElements($matrixActual, rows, cols, 0);
	CreateMatrixElements($matrixPredict, rows, cols, features);
	CreateMatrixElements($matrixError, rows, cols, 0);
	
	var RefreshMatrices = function () {
		
		// Update the known values matrix
		for (var r = 0; r < rows; r++) {
			for (var c = 0; c < cols; c++) {
				UpdateMatrixValue($matrixActual, r, c, matrix[r][c]);
			}
		}	
		
		// Update the latent feature matrices
		for (var r = rows; r < rows + features; r++) {
			for (var c = 0; c < cols; c++) {
				UpdateMatrixValue($matrixPredict, r, c, latentWide[c][r - rows]);
			}
		}
		for (var r = 0; r < rows; r++) {
			for (var c = cols; c < cols + features; c++) {
				UpdateMatrixValue($matrixPredict, r, c, latentTall[r][c - cols]);
			}
		}
		
		// Update the predictions matrix
		for (var r = 0; r < rows; r++) {
			for (var c = 0; c < cols; c++) {
				UpdateMatrixValue($matrixPredict, r, c, predictions[r][c]);
				if (matrix[r][c] == 0) {
					AddMatrixClass($matrixPredict, r, c, "m-predict");
				}
			}
		}
		
		// Update the error matrix
		for (var r = 0; r < rows; r++) {
			for (var c = 0; c < cols; c++) {
				ChangeMatrixValue($matrixError, r, c, error[r][c]);
				if (error[r][c] != 0) {
					RemoveMatrixClass($matrixError, r, c, "m-empty");
					AddMatrixClass($matrixError, r, c, "m-error");
				}
			}
		}	
	};
	
	RefreshMatrices();
	
	var maxTraining = 50;
	
	var loop = setInterval(function() {
		svd.factorize(matrix, latentWide, latentTall, predictions, error, 1);
		RefreshMatrices();
		
		$rmse.html(svd.rmse);
		$iterations.html(svd.totalIterations);
		
		if (svd.totalIterations >= maxTraining) {
			clearInterval(loop);
			console.log("Done!");
		}
	}, 1000);
});

// Create the <div> elements that make up a matrix
var CreateMatrixElements = function ($matrix, rows, cols, features) {
	for (var r = 0; r < rows; r++) {
		var newRow = $("<div></div>");
		for (var c = 0; c < cols + features; c++) {
			var newCol = $("<div class=\"m-cell" + (c >= cols ? " m-feat" : " m-empty") + "\">x</div>");
			newRow.append(newCol);
		}
		$matrix.append(newRow);
	}
	for (var r = 0; r < features; r++) {
		var newRow = $("<div></div>");
		for (var c = 0; c < cols; c++) {
			var newCol = $("<div class=\"m-cell m-feat\">x</div>");
			newRow.append(newCol);
		}
		$matrix.append(newRow);
	}
};

// Set the value and appropriate class of a cell in the matrix
var UpdateMatrixValue = function ($matrix, row, col, value) {
	ChangeMatrixValue($matrix, row, col, value);
	RemoveMatrixClass($matrix, row, col, "m-empty");
	AddMatrixClass($matrix, row, col, value != 0 ? "m-good" : "m-empty");
};

// Set the value of a specific cell in a matrix
var ChangeMatrixValue = function ($matrix, row, col, value) {
	$matrix.children().eq(row).children().eq(col).html(+value.toFixed(2));
};

// Set a class of a specific cell in a matrix
var AddMatrixClass = function ($matrix, row, col, value) {
	$matrix.children().eq(row).children().eq(col).addClass(value);
};

// Remove a class of a specific cell in a matrix
var RemoveMatrixClass = function ($matrix, row, col, value) {
	$matrix.children().eq(row).children().eq(col).removeClass(value);
};