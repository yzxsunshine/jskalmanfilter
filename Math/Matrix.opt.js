/**
 * @author yzx
 */

/* *
 * det function
 * return determinant of a matrix 
 * */
Matrix.prototype.det = function() {
	var LU = new LUDecomposition(this);
	return LU.det();
};

/* *
 * inverse function
 * return inverse of a matrix 
 * */
Matrix.prototype.inv = function() {
	if(this.rows == this.cols) {
		var LU = new LUDecomposition(this);
		var inv = LU.solve(Matrix.CreateIdentity(this.rows, this.cols));
		return inv;
	} else {
		var QR = new QRDecomposition(this);
		var inv = QR.solve(Matrix.CreateIdentity(this.rows, this.cols));
		return inv;
	}
	
};

Matrix.prototype.pinv = function() {
	
	
};
