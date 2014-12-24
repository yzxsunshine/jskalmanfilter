function LUDecomposition(mat) {
	this.LU = mat.clone();	// internal storage
	this.m = mat.getRows();	// dimension of rows
    this.n = mat.getCols();	// dimension of cols
    this.piv = new Array(this.m);	// remenber the row exchanges, equal to the permutation matrix
    for (var i = 0; i < this.m; i++) {
    	this.piv[i] = i;
    }
    this.pivsign = 1;
    
	for (var k = 0; k < this.n; k++) {
		// Find pivot.
		var p = k;
        for (var i = k+1; i < this.m; i++) {
            if (Math.abs(this.LU.get(i, k)) > Math.abs(this.LU.get(p, k))) {
               p = i;
            }
        }
        // Exchange if necessary.
        if (p != k) {
            for (var j = 0; j < this.n; j++) {
               var t = this.LU.get(p, j); 
               this.LU.set(p, j, this.LU.get(k, j)); 
               this.LU.set(k, j, t);
            }
            var t = this.piv[p]; 
            this.piv[p] = this.piv[k]; 
            this.piv[k] = t;
            this.pivsign = -this.pivsign;
        }
        // Compute multipliers and eliminate k-th column.
        if (this.LU.get(k, k) != 0.0) {
            for (var i = k+1; i < this.m; i++) {
               	this.LU.set(i, k, this.LU.get(i, k) / this.LU.get(k, k));
               	for (var j = k+1; j < this.n; j++) {
                  	this.LU.set(i, j, this.LU.get(i, j) - this.LU.get(i, k) * this.LU.get(k, j));
               	}
            }
        }
	}
}

LUDecomposition.prototype.getL = function() {
	var L = new Matrix(this.m, this.n);
	for (var i = 0; i < this.m; i++) {
		for (var j = 0; j < this.n; j++) {
			if (i > j) {
               L.set(i, j, this.LU.get(i, j));
            } else if (i == j) {
               L.set(i, j, 1.0);
            } else {
               L.set(i, j, 0.0);
            }
		}
	}
	return L;
};

LUDecomposition.prototype.getU = function() {
	var U = new Matrix(this.n, this.n);
	for (var i = 0; i < this.n; i++) {
		for (var j = 0; j < this.n; j++) {
			if (i <= j) {
               U.set(i, j, this.LU.get(i, j));
            } else {
               U.set(i, j, 0.0);
            }
		}
	}
	return U;
};

LUDecomposition.prototype.getPivot = function() {
	var p = this.piv.slice(0, this.m);
	return p;
};

LUDecomposition.prototype.det = function() {
	if(this.m != this.n) {
		console.log("[LUDecomposition - det] Not avaliable for non square matrix.");
		return null;
	}
	var d = this.pivsign;
	for(var i=0; i<this.n; i++) {
		d *= this.LU.get(i, i);
	}
	return d;
};

LUDecomposition.prototype.isNonSingular = function() {
	for(var i=0; i<this.n; i++) {
		if(this.LU.get(i, i) == 0)
			return false;
	}
	return true;
};

// A*X = B
LUDecomposition.prototype.solve = function(B) {
	if(!this.isNonSingular()) {
		console.log("[LUDecomposition - solve] Sigular matrix.");
		return null;
	}
	if(B.getRows() != this.m) {
		console.log("[LUDecomposition - solve] Matrix dimension not match.");
		return null;
	}
	var XMat = new Matrix(this.n, B.getCols());
	// get permutated matrix
	var PMat = Matrix.getPermutationMatrix(this.piv);
	XMat = PMat.mul(B);
	
	// L*Y = P*B
	for (var k = 0; k < this.n; k++) {
		for (var i = k+1; i < this.n; i++) {
			for (var j = 0; j < B.getCols(); j++) {
				XMat.set(i, j, XMat.get(i, j) - XMat.get(k, j) * this.LU.get(i, k));
			}
		}
	}
	
	// U*X = Y
	for (var k = this.n - 1; k >= 0; k--) {
		for (var j = 0; j < B.getCols(); j++) {
			XMat.set(k, j, XMat.get(k, j) / this.LU.get(k, k));
		}
		for (var i = 0; i < k; i++) {
			for (var j = 0; j < B.getCols(); j++) {
				XMat.set(i, j, XMat.get(i, j) - XMat.get(k, j) * this.LU.get(i, k));
			}
		}
	}
	return XMat;
};



