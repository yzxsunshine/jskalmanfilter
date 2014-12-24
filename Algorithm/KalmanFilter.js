/**
 * @author yzx
 * 
 * x' = Fx + Bu + w
 * z = Hx + v
 * 
 */

function KalmanFilter(sysSize, ctrlSize, meaSize) {
	this.sysDim = sysSize;
	this.ctrlDim = ctrlSize;
	this.meaDim = meaSize;
	this.x = Vector.CreateZero(sysSize);
	this.u = Vector.CreateZero(ctrlSize);
	this.z = Vector.CreateZero(meaSize);
	this.F = Matrix.CreateZero(sysSize, sysSize);
	this.B = Matrix.CreateZero(sysSize, ctrlSize);
	this.H = Matrix.CreateZero(meaSize, sysSize);
	this.P = Matrix.CreateZero(sysSize, sysSize);
	this.Q = Matrix.CreateZero(sysSize, sysSize);
	this.R = Matrix.CreateZero(meaSize, meaSize);
}

// prediction step
KalmanFilter.prototype.predict = function() {
	this.x = this.F.mul(this.x);
	if(this.ctrlDim > 0) {
		this.x = this.x.add(this.B.mul(this.u));
	}
	this.P = (this.F.mul(this.P)).mul(this.F.transpose()).add(this.Q);
};

// update step
KalmanFilter.prototype.update = function() {
	var y = this.z.minus(this.H.mul(this.x));
	var S = (this.H.mul(this.P)).mul(this.H.transpose()).add(this.R);
	var Sinv = S.inv();
	if(Sinv != null) {
		var K = (this.P.mul(this.H.transpose())).mul(Sinv);
		this.x = this.x.add(K.mul(y));
		this.P = (Matrix.CreateIdentity(sysSize, sysSize).minus(K.mul(H))).mul(P);
	}
};

// set status transition matrix F
KalmanFilter.prototype.setF = function(fMat) {
	this.F = fMat;
};

// set observation model matrix H
KalmanFilter.prototype.setH = function(hMat) {
	this.H = hMat;
};

// set input control matrix B
KalmanFilter.prototype.setB = function(bMat) {
	this.B = bMat;
};

// set initial covariance matrix P
KalmanFilter.prototype.setF = function(pMat) {
	this.P = pMat;
};

// set system noise matrix Q
KalmanFilter.prototype.setQ = function(scale) {
	Q = Matrix.CreateIdentity(this.sysDim, this.sysDim).mulScale(scale);
};

// set measurement noise matrix R
KalmanFilter.prototype.setR = function(scale) {
	R = Matrix.CreateIdentity(this.measureDim, this.measureDim).mulScale(scale);
};

// set x vector
KalmanFilter.prototype.setX = function(vec) {
	x = vec.clone();
};

// set x vector
KalmanFilter.prototype.setU = function(vec) {
	u = vec.clone();
};

// set z vector
KalmanFilter.prototype.setZ = function(vec) {
	x = vec.clone();
};