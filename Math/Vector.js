function Vector(n) {
	this.n = n;// dimension
	this.data = new Array(n);
	for(var i=0; i<this.n; i++) {
		this.data[i] = 0;
	}
}

Vector.prototype.getDim = function() { return this.n; };
Vector.prototype.get = function(idx) { return this.data[idx]; };
Vector.prototype.set = function(idx, val) { this.data[idx] = val; };
Vector.prototype.getSubVector = function(startIdx, endIdx) {
	if(startIdx >= 0 && endIdx < this.n) {
		var vec = new Vector(endIdx - startIdx + 1);
		for(var i=startIdx; i<=endIdx; i++) {
			vec.set(i-startIdx, this.get(i));
		}
		return vec;
	}
	else {
		return null;
	}
};
	
Vector.prototype.setSubVector = function(startIdx, endIdx, vec) {
	if(startIdx >= 0 && endIdx < this.n) {
		for(var i=startIdx; i<=endIdx; i++) {
			this.set(i, vec.get(i-startIdx));
		}
	}
	else
	{
		console.log("[Vector - setSubVector] Error sub vector size.");
	}
};
	
Vector.prototype.toString = function() {
	return this.data.toString();
};
	
Vector.prototype.copyData = function(vec) {
	if(Object.prototype.toString.call(vec) == "[object Array]") { 
		this.n = vec.length;
		this.data = vec;
	} else if(vec.constructor == Vector) { 
		this.n = vec.n;
		this.data = new Array(this.n);
		for(var i=0; i<this.n; i++) {
			this.set(i, vec.get(i));
		}
	} else {
		console.log("[Vector - copyData] Error Input Type.");
	}
};
	
Vector.prototype.clone = function() {
	var vec = new Vector(this.n);
	for(var i=0; i<this.n; i++) {
		vec.set(i, this.get(i));
	}
	return vec;
};
	
	// add and return a new vector
Vector.prototype.add = function(vec) {
	var ret = new Vector(this.getDim());
	for(var i=0; i<this.getDim(); i++) {
		var tmp = this.get(i);
		if(i<vec.getDim()) {
			tmp += vec.get(i);
		}
		ret.set(i, tmp);
	}
	return ret;
};
	
	// add to the vector itself
Vector.prototype.addToSelf = function(vec) {
	for(var i=0; i<this.getDim(); i++) {
		var tmp = this.get(i);
		if(i<vec.getDim()) {
			tmp += vec.get(i);
		}
		this.set(i, tmp);
	}
};
	
	// minus and return a new vector
Vector.prototype.minus = function(vec) {
	var ret = new Vector(this.getDim());
	for(var i=0; i<this.getDim(); i++) {
		var tmp = this.get(i);
		if(i<vec.getDim()) {
			tmp -= vec.get(i);
		}
		ret.set(i, tmp);
	}
	return ret;
};
	
	// add to the vector itself
Vector.prototype.minusToSelf = function(vec) {
	for(var i=0; i<this.getDim(); i++) {
		var tmp = this.get(i);
		if(i<vec.getDim()) {
			tmp -= vec.get(i);
		}
		this.set(i, tmp);
	}
};
	
	// return a real number
Vector.prototype.dot = function(vec) {
	if(this.getDim() != vec.getDim()) {
		return 0;
	}
	var ret = 0;
	for(var i=0; i<this.getDim(); i++) {
		ret += this.get(i) * vec.get(i);
	}
	return ret;
};
	
	// return a vector, only work for 3 dimensional vector
Vector.prototype.cross = function(vec) {
	if(this.getDim() != vec.getDim() || this.getDim() != 3) {
		return null;
	}
	var ret = new Vector(this.getDim());
	ret.set(0, this.get(1)*vec.get(2) - this.get(2)*vec.get(1));
	ret.set(1, this.get(2)*vec.get(0) - this.get(0)*vec.get(2));
	ret.set(2, this.get(0)*vec.get(1) - this.get(1)*vec.get(0));
	return ret;
};
	
	// multiply a scale and return a new vector
Vector.prototype.multiply = function(scale) {
	var ret = new Vector(this.getDim());
	for(var i=0; i<this.getDim(); i++) {
		ret.set(i, this.get(i)*scale);
	}
	return ret;
};

	// multiply to the vector itself
Vector.prototype.multiplyToSelf = function(scale) {
	for(var i=0; i<this.getDim(); i++) {
		this.set(i, this.get(i)*scale);
	}
};

	// divide a scale and return a new vector
Vector.prototype.divide = function(scale) {
	var ret = new Vector(this.getDim());
	for(var i=0; i<this.getDim(); i++) {
		ret.set(i, this.get(i)/scale);
	}
	return ret;
};
	
	// divide to the vector itself
Vector.prototype.divideToSelf = function(scale) {
	for(var i=0; i<this.getDim(); i++) {
		this.set(i, this.get(i)/scale);
	}
};
	
Vector.prototype.norm = function() {
	var sum2 = 0;
	for(var i=0; i<this.getDim(); i++) {
		sum2 += this.get(i)*this.get(i);
	}
	return Math.sqrt(sum2);
};
	
Vector.prototype.normalize = function() {
	var n = this.norm();
	if(n != 0.0)
		this.divideToSelf(n);
};

Vector.Create = function(arr) {
	var vec = new Vector(arr.length);
	vec.copyData(arr);
	return vec;
};

Vector.CreateZero = function(n) {
	var vec = new Vector(n);
	return vec;
};
