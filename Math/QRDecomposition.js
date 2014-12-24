function QRDecomposition(mat) {
	this.m = mat.getRows();
	this.n = mat.getCols();
	this.diag = new Vector(this.n);
	this.Q = Matrix.CreateIdentity(this.n, this.n);
	this.R = new Matrix(this.m, this.n);
	
	var temp = mat.clone();
	for (var k = 0; k < this.n-1; k++) {
         // Compute 2-norm of k-th column without under/overflow.
    	var nrm = 0;
    	var x = temp.getCol(k).getSubVector(k, this.m-1);
    	var len = x.getDim();
    	var xbar = x.getSubVector(1, len-1);
    	var delta = xbar.dot(xbar);
    	var v = new Vector(len);
    	v.set(0, 1);
    	v.setSubVector(1, len-1, xbar);
    	var beta = 0;
    	if(Math.abs(delta) > 1e-8) {
    		var mu = Math.sqrt(x.get(0)*x.get(0) + delta);
    		if(x.get(0) <= 0) {
    			v.set(0, x.get(0) - mu);
    		} else {
    			v.set(0, -1*(delta / (x.get(0) + mu)));
    		}
    		beta = 2 * (v.get(0)*v.get(0)) / (delta + v.get(0)*v.get(0));
    		v.divideToSelf(v.get(0));
    	}
    	var vMat = new Matrix(1);
    	vMat.copyData(v);
    	var reflector = Matrix.CreateIdentity(this.m-k, this.m-k).minus(vMat.mul(vMat.transpose()).mulScale(beta));
        var temp2 = reflector.mul(temp.getSubMatrix(k, this.m-1, k, this.m-1));
        temp.setSubMatrix(k, this.m-1, k, this.m-1, temp2);
		var t = Matrix.CreateIdentity(this.n, this.n);
		t.setSubMatrix(k, this.m-1, k, this.m-1, reflector);
		this.Q = this.Q.mul(t.transpose());
	}
	this.R = temp.clone();
};

QRDecomposition.prototype.isFullRank = function () {
	for(var i=0; i<this.n; i++) {
		if(this.diag.get(i) == 0) {
			return false;
		}
	}
	return true;
};


QRDecomposition.prototype.getR = function() {
	return this.R;
};

QRDecomposition.prototype.getQ = function() {
	return this.Q;
};

QRDecomposition.prototype.solve = function(B) {
	if(B.getRows() != this.m) {
		console.log("[QRDecomposition - solve] Matrix dimension not match.");
		return null;
	}
	//Y = transpose(Q)*B
	var X = this.Q.transpose().mul(B);
	
	// Solve R*X = Y;
	for (var k = this.n - 1; k >= 0; k--) {
		for (var j = 0; j < B.getCols(); j++) {
			X.set(k, j, X.get(k, j) / this.R.get(k, k));
		}
		for (var i = 0; i < k; i++) {
			for (var j = 0; j < B.getCols(); j++) {
				X.set(i, j, X.get(i, j) - X.get(k, j) * this.R.get(i, k));
			}
		}
	}
	return X;
};
/*
function QRDecomposition(mat) {
	this.m = mat.getRows();
	this.n = mat.getCols();
	this.QR = new Matrix(this.m, this.n);
	this.diag = new Vector(this.n);
	
	for (var k = 0; k < this.n-1; k++) {
         // Compute 2-norm of k-th column without under/overflow.
    	var nrm = 0;
        for (var i = k; i < this.m; i++) {
        	nrm = Math.sqrt(nrm*nrm + this.QR.get(i, k)*this.QR.get(i, k));
        }

        if (nrm != 0.0) {
            // Form k-th Householder vector.
            if (this.QR.get(k, k) < 0) {
            	nrm = -nrm;
            }
            for (var i = k; i < this.m; i++) {
            	this.QR.set(i, k, this.QR.get(i, k) / nrm);
            }
            this.QR.set(k, k, this.QR.get(k, k) + 1);

            // Apply transformation to remaining columns.
            for (var j = k+1; j < this.n; j++) {
               	var s = 0.0; 
               	for (var i = k; i < this.m; i++) {
                  	s += this.QR.get(i, k) * this.QR.get(i, j);
               	}
               	s = -s/this.QR.get(k, k);
               	for (var i = k; i < this.m; i++) {
               		this.QR.set(i, j, this.QR.get(i, j) + s * this.QR.get(i, k));
               	}
            }
    	}
        this.diag.set(k, -nrm);
	}
};

QRDecomposition.prototype.isFullRank = function () {
	for(var i=0; i<this.n; i++) {
		if(this.diag.get(i) == 0) {
			return false;
		}
	}
	return true;
};


// return housholder matrix
QRDecomposition.prototype.getH = function() {
	var H = new Matrix(this.m, this.n);
	for(var i=0; i<this.m; i++) {
		for(var j=0; j<this.n; j++) {
			if (i >= j) {
				H.set(i, j, this.QR.get(i,j ));
			}
			else {
				H.set(i, j, 0.0);
			}
		}
	}
	return H;
};

QRDecomposition.prototype.getR = function() {
	var R = new Matrix(this.n, this.n);
	for(var i=0; i<this.n; i++) {
		for(var j=0; j<this.n; j++) {
			if (i < j) {
				R.set(i, j, this.QR.get(i,j ));
			}
			else if (i == j) {
				R.set(i, j, this.diag.get(i));
			}
			else {
				R.set(i, j, 0.0);
			}
		}
	}
	return R;
};

QRDecomposition.prototype.getQ = function() {
	var Q = new Matrix(this.m, this.n);
	for(var k=this.n-1; k>=0; k--) {
		for(var i=0; i<this.m; i++) {
			Q.set(i, k, 0.0);
		}
		Q.set(k, k, 1.0);
		for(var j=k; j<this.n; j++) {
			if(Q.get(k, k) != 0) {
				var s = 0.0;
				for(var i=k; i<this.m; i++) {
					s += Q.get(i, k) * Q.get(i, j);
				}
				s -= Q.get(k, k);
				for(var i=k; i<this.m; i++) {
					Q.set(i, j, Q.get(i, j) + s * Q.get(i, k));
				}
			}
		}
	}
	return Q;
};

QRDecomposition.prototype.solve = function(B) {
	if(B.getRows() != this.m) {
		console.log("[QRDecomposition - solve] Matrix dimension not match.");
		return null;
	}
	if(!this.isFullRank()) {
		console.log("[QRDecomposition - solve] Not full rank matrix.");
		return null;
	}
	
	//Y = transpose(Q)*B
	for (var k = this.n - 1; k >= 0; k--) {
		for (var j = 0; j < B.getCols(); j++) {
			var s = 0.0;
			for (var i = k; i < this.m; i++) {
				s += this.QR.get(i, k) * X.get(i, j);
			}
			s = -s/QR.get(k, k);
			for (var i = k; i < this.m; i++) {
				X.set(i, j, X.get(i, j) + s * this.QR.get(i, k));
			}
		}
	}
	
	// Solve R*X = Y;
	for (var k = this.n - 1; k >= 0; k--) {
		for (var j = 0; j < B.getCols(); j++) {
			X.set(k, j, X.get(k, j) / this.diag.get(k));
		}
		for (var i = 0; i < k; i++) {
			for (var j = 0; j < B.getCols(); j++) {
				X.set(i, j, X.get(i, j) - X.get(k, j) * this.QR.get(i, k));
			}
		}
	}
	return X.getSubMatrix(0, this.n-1, 0, B.getCols()-1);
};*/