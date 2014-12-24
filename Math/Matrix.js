function Matrix(m, n) {
	this.data = new Array(m);
	this.rows = m;
	this.cols = n;
	for(var i=0; i<m; i++) {
		this.data[i] = new Array(n);
		for(var j=0; j<n; j++) {
			this.data[i][j] = 0.0;
		}
	}
}

Matrix.prototype.getRows = function() { return this.rows; };
Matrix.prototype.getCols =  function() { return this.cols; };
Matrix.prototype.get = function(row, col) {
	if(row > this.rows || col > this.cols) {
		console.log("[Matrix - get] Outside of matrix");
		return null;
	}
	return this.data[row][col]; 
};
Matrix.prototype.set = function(row, col, val) { 
	if(row > this.rows || col > this.cols) {
		console.log("[Matrix - set] Outside of matrix");
	}
	this.data[row][col] = val; 
};
Matrix.prototype.getRow = function(rowId) {
	if(rowId > this.rows) {
		console.log("[Matrix - getRow] Outside of matrix");
		return null;
	}
	var row = new Vector(this.cols);
	for(var i=0; i<this.cols; i++) {
		row.set(i, this.data[rowId][i]);
	}
	return row;
};

Matrix.prototype.getCol = function(colId) {
	if(colId > this.rows) {
		console.log("[Matrix - getRow] Outside of matrix");
		return null;
	}
	var col = new Vector(this.rows);
	for(var i=0; i<this.rows; i++) {
		col.set(i, this.data[i][colId]);
	}
	return col;
};

Matrix.prototype.getSubMatrix = function(startRow, endRow, startCol, endCol) {
	if(startRow >= 0 && endRow < this.rows && startCol >= 0 && endCol < this.cols) {
		var mat = new Matrix(endRow - startRow + 1, endCol - startCol + 1);
		for(var i=startRow; i<=endRow; i++) {
			for(var j=startCol; j<=endCol; j++) {
				mat.set(i-startRow, j-startCol, this.get(i, j));
			}
		}
		return mat;
	}
	else
	{
		console.log("[Matrix - getSubMatrix] Outside of matrix");
		return null;	// new Matrix(0,0);
	}
};

Matrix.prototype.setSubMatrix = function(startRow, endRow, startCol, endCol, mat) {
	if(startRow >= 0 && endRow < this.rows && startCol >= 0 && endCol < this.cols) {
		for(var i=startRow; i<=endRow; i++) {
			for(var j=startCol; j<=endCol; j++) {
				this.set(i, j, mat.get(i-startRow, j-startCol));
			}
		}
	}
	else
	{
		console.log("[Matrix - setSubMatrix] Outside of matrix");
	}
};

Matrix.prototype.toString = function() {
	return this.data.toString();
};

/* *
 * copyData function
 * copy data from matrix
 * The type of the matrix could be Matrix, Vector, Array
 * */		
Matrix.prototype.copyData = function(data) {
	if(Object.prototype.toString.call(data) == "[object Array]") {
		if(typeof(data[0][0]) != 'undefined') {
			this.rows = data.length;
			this.cols = data[0].length;
			this.data = new Array(this.rows);
			for(var i=0; i<this.rows; i++) {
				this.data[i] = data[i].slice(0);
			} 
		}
		else {
			this.rows = data.length;
			this.cols = 1;
			this.data = new Array(this.rows);
			for(var i=0; i<this.rows; i++) {
				this.data[i] = new Array(1);
				this.data[i][0] = data[i];	
			}
		}
	}
	else if(data.constructor == Matrix) {
		this.rows = data.rows;
		this.cols = data.cols;
		this.data = new Array(data.rows);
		for(var i=0; i<data.rows; i++) {
			this.data[i] = new Array(data.cols);
			for(var j=0; j<data.cols; j++) {
				this.data[i][j] = data.get(i, j);
			}
		}
	}
	// copy from vector
	else if(data.constructor == Vector) {
		this.rows = data.getDim();
		this.cols = 1;
		this.data = new Array(data.getDim());
		for(var i=0; i<this.rows; i++) {
			this.data[i] = new Array(1);
			this.data[i][0] = data.get(i);
		}
	}
	else {
		console.log("[Matrix - copyData] Error Parameter of copyData in Matrix.js");
	}
};

/* *
 * setDiag function
 * set diagnal of a matrix from a vector with other elements being set zero
 * The type of the matrix could be Vector, Array
 * */		
Matrix.prototype.setDiag = function(vec) {
	if(Object.prototype.toString.call(vec) == "[object Array]") {
		this.rows = vec.length;
		this.cols = vec.length;
		this.data = new Array(vec.length*vec.length);
		for(var i=0; i<vec.length; i++) {
			for(var j=0; j<vec.length; j++) {
				this.data[i*vec.length+j] = 0;
			}
			this.data[i*vec.length+i] = vec[i];
		}
	}
	else if(vec.constructor == Vector){
		this.rows = vec.getDim();
		this.cols = vec.getDim();
		this.data = new Array(vec.getDim()*vec.getDim());
		for(var i=0; i<vec.getDim(); i++) {
			for(var j=0; j<vec.getDim(); j++) {
				this.data[i*vec.getDim()+j] = 0;
			}
			this.data[i*vec.getDim()+i] = vec.get(i);
		}
	}
};

/* *
 * clone function
 * clone the elements in the matrix and return it.
 * */	
Matrix.prototype.clone = function() {
	var mat = new Matrix(this.rows, this.cols);
	for(var i=0; i<mat.rows; i++) {
		for(var j=0; j<mat.cols; j++) {
			mat.set(i, j, this.data[i][j]);
		}
	}
	return mat;
};

/* *
 * add function
 * C = A + B; return C
 * */
Matrix.prototype.add = function(mat) {
	if(this.rows != mat.rows || this.cols != mat.cols) {
		console.log("[Matrix - add] Matrix dimension doesn't match.");
		return null;
	}
	var ret = new Matrix(this.rows, this.cols);
	for(var i=0; i<this.rows; i++) {
		for(var j=0; j<this.cols; j++) {
			ret.set(i, j, mat.get(i, j) + this.get(i, j));
		}
	}
	return ret;
};

/* *
 * addToSelf function
 * A = A + B;
 * */
Matrix.prototype.addToSelf = function(mat) {
	if(this.rows != mat.rows || this.cols != mat.cols) {
		console.log("[Matrix - addToSelf] Matrix dimension doesn't match.");
		return null;
	}
	for(var i=0; i<this.rows; i++) {
		for(var j=0; j<this.cols; j++) {
			this.set(i, j, mat.get(i, j) + this.get(i, j));
		}
	}
};

/* *
 * minus function
 * C = A - B; return C
 * */
Matrix.prototype.minus = function(mat) {
	if(this.rows != mat.rows || this.cols != mat.cols) {
		console.log("[Matrix - minus] Matrix dimension doesn't match.");
		return null;
	}
	var ret = new Matrix(this.rows, this.cols);
	for(var i=0; i<this.rows; i++) {
		for(var j=0; j<this.cols; j++) {
			ret.set(i, j, mat.get(i, j) - this.get(i, j));
		}
	}
	return ret;
};

/* *
 * minus function
 * A = A - B;
 * */
Matrix.prototype.minusToSelf = function(mat) {
	if(this.rows != mat.rows || this.cols != mat.cols) {
		console.log("[Matrix - minusToSelf] Matrix dimension doesn't match.");
		return null;
	}
	for(var i=0; i<this.rows; i++) {
		for(var j=0; j<this.cols; j++) {
			this.set(i, j, mat.get(i, j) - this.get(i, j));
		}
	}
};

/* *
 * negative function
 * B = -A;
 * */
Matrix.prototype.negative = function() {
	var ret = new Matrix(this.rows, this.cols);
	for(var i=0; i<this.rows; i++) {
		for(var j=0; j<this.cols; j++) {
			ret.set(i, j, -this.get(i, j));
		}
	}
	return ret;
};

/* *
 * negativeToSelf function
 * A = -A;
 * */
Matrix.prototype.negativeToSelf = function() {
	for(var i=0; i<this.rows; i++) {
		for(var j=0; j<this.cols; j++) {
			this.set(i, j, -this.get(i, j));
		}
	}
};

/* *
 * multiply function
 * C = A * s; return C
 * */
Matrix.prototype.mulScale = function(scale) {
	var ret = new Matrix(this.rows, this.cols);
	for(var i=0; i<this.rows; i++) {
		for(var j=0; j<this.cols; j++) {
			ret.set(i, j, scale * this.get(i, j));
		}
	}
	return ret;
};

/* *
 * multiply function
 * A = A * s;
 * */
Matrix.prototype.mulScaleToSelf = function(scale) {
	for(var i=0; i<this.rows; i++) {
		for(var j=0; j<this.cols; j++) {
			this.set(i, j, scale * this.get(i, j));
		}
	}
};

/* *
 * divide function
 * C = A / s; return C
 * */
Matrix.prototype.divideScale = function(scale) {
	var ret = new Matrix(this.rows, this.cols);
	for(var i=0; i<this.rows; i++) {
		for(var j=0; j<this.cols; j++) {
			ret.set(i, j, this.get(i, j) / scale);
		}
	}
	return ret;
};

/* *
 * divide function
 * A = A / s;
 * */
Matrix.prototype.divideScaleToSelf = function(scale) {
	for(var i=0; i<this.rows; i++) {
		for(var j=0; j<this.cols; j++) {
			this.set(i, j, this.get(i, j) / scale);
		}
	}
};

/* *
 * mul function
 * C = A*B; return C
 * the input type could be Matrix or Vector, and it will return Matrix or Vector according to the result
 * */
Matrix.prototype.mul = function(mat) {
	if(mat.constructor == Matrix){
		if(this.cols != mat.getRows()) {
			console.log("[Matrix - mul] Matrix dimension doesn't match.");
			return null;
		}
		var ret = new Matrix(this.rows, mat.getCols());
		for(var i=0; i<this.rows; i++) {
			for(var j=0; j<mat.getCols(); j++) {
				var val = 0;
				for(var k=0; k<this.cols; k++)
					val += this.get(i, k) * mat.get(k, j);
				ret.set(i, j, val);
			}
		}
		return ret;
	}
	else if(mat.constructor == Vector){
		if(this.cols != mat.getDim()) {
			console.log("[Matrix - mul] Matrix dimension doesn't match.");
			return null;
		}
		var ret = new Vector(this.rows);
		for(var i=0; i<this.rows; i++) {
			var val = 0;
			for(var j=0; j<this.cols; j++)
				val += this.get(i, j)*mat.get(j);
			mat.set(i, val);
		}
		return ret;
	}
};

/* *
 * transpose function
 * A = AT;
 * return the transpose matrix 
 * */
Matrix.prototype.transpose = function() {
	var ret = new Matrix(this.cols, this.rows);
	for(var i=0; i<this.cols; i++) {
		for(var j=0; j<this.rows; j++) {
			ret.set(i, j, this.get(j, i));
		}
	}
	return ret;
};

/* *
 * trace function
 * return the trace of a square matrix 
 * */
Matrix.prototype.trace = function() {
	if(this.cols != this.rows) {
		console.log("[Matrix - trace] Not square matrix");
	}
	var tr = 0;
	for(var i=0; i<this.rows; i++) {
		tr += this.get(i, i);
	}
	return tr;
};

Matrix.getPermutationMatrix = function(data) {
	if(Object.prototype.toString.call(data) == "[object Array]") {
		var mat = new Matrix(data.length, data.length);
		for(var i=0; i<mat.getRows(); i++) {
			for(var j=0; j<mat.getCols(); j++) {
				mat.set(i, j, 0.0);
			}
			mat.set(i, data[i], 1.0);
		}
		return mat;
	}
	else if(data.constructor == Vector){
		var mat = new Matrix(data.getDim(), data.getDim());
		for(var i=0; i<mat.getRows(); i++) {
			for(var j=0; j<mat.getCols(); j++) {
				mat.set(i, j, 0.0);
			}
			mat.set(i, data.get(i), 1.0);
		}
		return mat;
	}
	else {
		console.log("[Matrix - getPermutationMatrix] Wrong input type, only Vector and Array are avaliable.");
		return null;
	}
};

Matrix.Create = function(arr) {
	if(Object.prototype.toString.call(arr) == "[object Array]") {
		var mat = new Matrix(arr.length, 1);	// it doesn't matter that the matrix size is not correct, it will be fine after copydata
		mat.copyData(arr);
		return mat;
	} else {
		return null;	
	}
};

Matrix.CreateZero = function(m, n) {
	if(n == undefined) {
		n = m;
	}
	var mat = new Matrix(m, n);
	for(var i=0; i<m; i++) {
		for(var j=0; j<n; j++) {
			mat.data[i][j] = 0.0;
		}
	}
	return mat;
};

Matrix.CreateIdentity = function(m, n) {
	if(n == undefined) {
		n = m;
	}
	var mat = new Matrix(m, n);
	for(var i=0; i<m; i++) {
		for(var j=0; j<n; j++) {
			mat.data[i][j] = 0.0;
		}
		if(i < m && i < n) {
			mat.data[i][i] = 1.0;
		}
	}
	return mat;
};
