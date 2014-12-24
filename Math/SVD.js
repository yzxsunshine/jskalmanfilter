/**
* This file is used for SVD, 
* the code is ported from Jama library into Javascript.
* Before calling this js file, Matrix.js and Vector.js should be referenced
*/
function SVD(mat) {
	this.rows = mat.rows;
	this.cols = mat.cols;
	
	var m = this.rows;
	var n = this.cols;
	var nu = Math.min(m, n);
	
	this.U = new Matrix(m, nu);
	this.V = new Matrix(n, n);
	this.s = new Vector(Math.min(m+1, n));
	
	var e = Vector(n);
	var rowk = new Vector(m);
	var wantu = true;
	var wantv = true;
	
	var nct = Math.min(m-1, n);
	var nrt = Math.max(0, Math.min(n-2, m));
	var A = mat.clone();
	
	// Reduce A to bidiagonal form, storing the diagonal elements
    // in s and the super-diagonal elements in e.
	for(var k=0; k<Math.max(nct, nrt); k++) {
		if(k < nct) {
			// Compute the transformation for the k-th column and
            // place the k-th diagonal in s[k].
            // Compute 2-norm of k-th column without under/overflow.
			s.set(k, 0);
			for(var i=k; i<m; i++) {
				s.set(k, Math.sqrt(s.get(k)*s.get(k) + A.get(i,k)*A.get(i,k)));
			}
			if(s.get(k) != 0.0) {
				if(A.get(k, k) < 0.0) {
					s.set(k, -s.get(k));
				}
				for(var i=k; i<m; i++) {
					A.set(i, k, A.get(i, k) / s.get(k));
				}
				A.set(k, k, A.get(k, k)+1);
			}
			s.set(k, -s.get(k));
		}
		for(var j=k+1; j<n; j++) {
			if ((k < nct) && (s.get(k) != 0.0))  {
				var t = 0;
				for (var i = k; i < m; i++) {
					t += A[i][k]*A[i][j];
				}
				t = -t/A.get(k, k);
				for (var i = k; i < m; i++) {
					A.set(i, j, A.get(i, j) + t*A.get(i, k));
				}
			}
			// Place the k-th row of A into e for the
            // subsequent calculation of the row transformation.

            e.set(j, A.get(k, j));
		}
		if( wantu && (k<nct) ) {
			U.set(i, k, A.get(i, k));
		}
		if (k < nrt) {

            // Compute the k-th row transformation and place the
            // k-th super-diagonal in e[k].
            // Compute 2-norm without under/overflow.
            e.set(k, 0);
            for (var i = k+1; i < n; i++) {
				e.set(k, Math.sqrt(e.get(k)*e.get(k),e.get(i)*e.get(i)));
            }
            if (e.get(k) != 0.0) {
			    if (e.get(k+1) < 0.0) {
					e.set(k, -1*e.get(k));
				}
				for (var i = k+1; i < n; i++) {
					e.set(i, e.get(i)/e.get(k));
				}
				e.set(k+1, e.get(k+1)+1.0);
            }
            e.set(k, -1*e.get(k));
            if ((k+1 < m) & (e.get(k) != 0.0)) {
            // Apply the transformation.
				for (var i = k+1; i < m; i++) {
					work.set(i, 0.0);
				}
				for (var j = k+1; j < n; j++) {
					for (var i = k+1; i < m; i++) {
						work.set(i, work.get(i) + e.get(j) * A.get(i, j));
					}
				}
               for (var j = k+1; j < n; j++) {
                  var t = -e.get(j)/e.get(k+1);
                  for (var i = k+1; i < m; i++) {
                     A.set(i, j, A.get(i, j)+t*work.get(i));
                  }
               }
            }
            if (wantv) {

            // Place the transformation in V for subsequent
            // back multiplication.

               for (var i = k+1; i < n; i++) {
                  V.set(i, k, e.get(i));
               }
            }
        }
    }
	// Set up the final bidiagonal matrix or order p.

	var p = Math.min(n, m+1);
	if (nct < n) {
		s.set(nct, A.get(nct, nct));
	}
	if (m < p) {
		s.set(p-1, 0.0);
	}
	if (nrt+1 < p) {
		e.set(nrt, A.get(nrt, p-1));
	}
	e.set(p-1, 0.0);
	
	// If required, generate U.

    if (wantu) {
        for (var j = nct; j < nu; j++) {
            for (var i = 0; i < m; i++) {
				U.set(i, j, 0.0);
            }
            U.set(j, j, 1.0);
        }
        for (var k = nct-1; k >= 0; k--) {
            if (s.get(k) != 0.0) {
                for (var j = k+1; j < nu; j++) {
					var t = 0;
					for (var i = k; i < m; i++) {
						t += U.get(i, k)*U.get(i, j);
					}
					t = -t/U.get(k, k);
					for (var i = k; i < m; i++) {
						U.set(i, j, t*U.get(i, k));
					}
				}
				for (var i = k; i < m; i++) {
					U.set(i, k, -1*U.get(i, k));
				}
				U.set(k, k, 1.0+U.get(k, k));
                for (var i = 0; i < k-1; i++) {
					U.set(i, k, 0.0);
                }
            } 
			else {
                for (var i = 0; i < m; i++) {
                    U.set(i, k, 0.0);
                }
                U.set(k, k, 1.0);
            }
        }
    }
	
	// If required, generate V.

    if (wantv) {
        for (var k = n-1; k >= 0; k--) {
            if ((k < nrt) && (e.get(k) != 0.0)) {
                for (var j = k+1; j < nu; j++) {
					var t = 0;
					for (var i = k+1; i < n; i++) {
						t += V.get(i, k)*V.get(i, j);
					}
					t = -t/V.get(k+1, k);
					for (var i = k+1; i < n; i++) {
						V.set(i, j, V.get(i, j) + t*V.get(i, k));
					}
				}
            }
            for (var i = 0; i < n; i++) {
				V.set(i, k, 0.0);
            }
            V.set(k, k, 1.0);
        }
    }
	
	// Main iteration loop for the singular values.

    var pp = p-1;
    var iter = 0;
    var eps = Math.pow(2.0,-52.0);
    var tiny = Math.pow(2.0,-966.0);
    while (p > 0) {
        var k, caseType;
		// Here is where a test for too many iterations would go.
		// This section of the program inspects for
        // negligible elements in the s and e arrays.  On
        // completion the variables case and k are set as follows.

        // caseType = 1     if s(p) and e[k-1] are negligible and k<p
        // caseType = 2     if s(k) is negligible and k<p
        // caseType = 3     if e[k-1] is negligible, k<p, and
        //              s(k), ..., s(p) are not negligible (qr step).
        // caseType = 4     if e(p-1) is negligible (convergence).

        for (k = p-2; k >= -1; k--) {
            if (k == -1) {
               break;
            }
            if (Math.abs(e.get(k)) <=
                  tiny + eps*(Math.abs(s.get(k)) + Math.abs(s.get(k+1)))) {
               e.set(k, 0.0);
               break;
            }
        }
		
		if (k == p-2) {
            caseType = 4;
        } else {
            var ks;
            for (ks = p-1; ks >= k; ks--) {
                if (ks == k) {
					break;
                }
                var t;
				if(ks != p) {
					t = Math.abs(e.get(ks));
				}
				else {
					t = 0.0;
				}
				if (ks != k+1)
					t += Math.abs(e.get(ks-1));
				else
					t += 0.0;
                if (Math.abs(s.get(ks)) <= tiny + eps*t)  {
                    s.set(ks, 0.0);
                    break;
                }
            }
            if (ks == k) {
                caseType = 3;
            } else if (ks == p-1) {
                caseType = 1;
            } else {
                caseType = 2;
                k = ks;
            }
        }
        k++;
		
		// Perform the task indicated by kase.

        switch (caseType) {

            // Deflate negligible s(p).

            case 1: {
				var f = e.get(p-2);
				e.set(p-2, 0.0);
				for (var j = p-2; j >= k; j--) {
					var t = Math.sqrt(s.get(j)*s.get(j) + f*f);
					var cs = s.get(j)/t;
					var sn = f/t;
					s.set(j, t);
					if (j != k) {
						f = -sn*e.get(j-1);
						e.set(j-1, cs*e.get(j-1));
					}
					if (wantv) {
						for (var i = 0; i < n; i++) {
							t = cs*V.get(i, j) + sn*V.get(i, p-1);
							V.set(i, p-1, -sn*V.get(i, j) + V.get(i, p-1));
							V.set(i, j, t);
						}
					}
               }
            }
            break;

            // Split at negligible s(k).

            case 2: {
               var f = e.get(k-1);
               e.set(k-1, 0.0);
               for (var j = k; j < p; j++) {
                  var t = Math.sqrt(s.get(j)*s.get(j) + f*f);
                  var cs = s.get(j)/t;
                  var sn = f/t;
                  s.set(j, t);
                  f = -sn*e.get(j);
                  e.set(j, cs*e.get(j));
                  if (wantu) {
                     for (var i = 0; i < m; i++) {
                        t = cs*U.get(i, j) + sn*U.get(i, k-1);
                        U.set(i, k-1, -sn*U.get(i, j) + cs*U.get(i, k-1));
                        U.set(i, j, t);
                     }
                  }
               }
            }
            break;
			
			// Perform one qr step.

            case 3: {

               // Calculate the shift.
   
                var scale = Math.max(Math.max(Math.max(Math.max(
							Math.abs(s.get(p-1)),Math.abs(s.get(p-2))),Math.abs(e.get(p-2))), 
							Math.abs(s.get(k))),Math.abs(e.get(k)));
                var sp = s.get(p-1)/scale;
				var spm1 = s.get(p-2)/scale;
                var epm1 = e.get(p-2)/scale;
                var sk = s.get(k)/scale;
                var ek = e.get(k)/scale;
                var b = ((spm1 + sp)*(spm1 - sp) + epm1*epm1)/2.0;
                var c = (sp*epm1)*(sp*epm1);
                var shift = 0.0;
                if ((b != 0.0) | (c != 0.0)) {
					shift = Math.sqrt(b*b + c);
					if (b < 0.0) {
						shift = -shift;
					}
					shift = c/(b + shift);
				}
                var f = (sk + sp)*(sk - sp) + shift;
                var g = sk*ek;
   
				// Chase zeros.
   
				for (var j = k; j < p-1; j++) {
					var t = Math.sqrt(f*f+g*g);
					var cs = f/t;
					var sn = g/t;
					if (j != k) {
						e.set(j-1, t);
					}
					f = cs*s.get(j) + sn*e.get(j);
					e.set(j, cs*e.get(j) - sn*s.get(j));
					g = sn*s.get(j+1);
					s.set(j+1, cs*s.get(j+1));
					if (wantv) {
						for (var i = 0; i < n; i++) {
							t = cs*V[i][j] + sn*V.get(i, j+1);
							V.set(i, j+1, -sn*V.get(i, j) + cs*V.get(i, j+1));
							V.set(i, j, t);
						}
					}
					t = Math.sqrt(f*f+g*g);
					cs = f/t;
					sn = g/t;
					s.set(j, t);
					f = cs*e.get(j) + sn*s.get(j+1);
					s.set(j+1, -sn*e.get(j) + cs*s.get(j+1));
					g = sn*e.get(j+1);
					e.set(j+1, cs*e.get(j+1));
					if (wantu && (j < m-1)) {
						for (var i = 0; i < m; i++) {
							t = cs*U.get(i, j) + sn*U.get(i, j+1);
							U.set(i, j+1, -sn*U.get(i, j) + cs*U.get(i, j+1));
							U.set(i, j, t);
						}
					}
				}
				e.set(p-2, f);
				iter = iter + 1;
            }
            break;
			
			// Convergence.

            case 4: {

				// Make the singular values positive.
   
				if (s.get(k) <= 0.0) {
					s.set(k, -s.get(k));
					if (wantv) {
						for (var i = 0; i <= pp; i++) {
							V.set(i, k, -V.get(i, k));
						}
					}
				}
   
               // Order the singular values.
   
				while (k < pp) {
					if (s.get(k) >= s.get(k+1)) {
						break;
					}
					var t = s.get(k);
					s.set(k, s.get(k+1));
					s.set(k+1, t);
					if (wantv && (k < n-1)) {
						for (var i = 0; i < n; i++) {
							t = V.get(i, k+1); 
							V.set(i, k+1, V.get(i, k));
							V.set(i, k, t);
						}
					}
					if (wantu && (k < m-1)) {
						for (var i = 0; i < m; i++) {
							t = U.get(i, k+1); 
							U.set(i, k+1, U.get(i, k));
							U.set(i, k, t);
						}
					}
					k++;
				}
				iter = 0;
				p--;
            }
            break;
		}
	}
}

SVD.prototype.norm2 = function() { return s.get(0); };
SVD.prototype.cond = function() { return s.get(0) / s.get(Math.min(m, n)-1); };
SVD.prototype.rank = function() {
	var eps = Math.pow(2.0,-52.0);
	var tol = Math.max(m,n)*s.get(0)*eps;
	var r = 0;
	for (var i = 0; i < s.getDim(); i++) {
		if (s.get(i) > tol) {
			r++;
		}
	}
	return r;
};