/**
 * @author yzx
 */
var kf = new KalmanFilter(4, 0, 2);
var dt = 0.03;
var fMat = Matrtix.Create([
				[1, 0, dt, 0],
				[0, 1, 0, dt],
				[0, 0, 1, 0],
				[0, 0, 0, 1]
			]);
var hMat = Matrtix.Create([
				[1, 0, 0, 0],
				[0, 1, 0, 0]
			]);
kf.setF(fMat);
kf.setH(hMat);
kf.setQ(0.01);
kf.setR(0.01);

kf.setX(Vector.Create(new Array(0, 0, 0, 0)));

kf.setZ(Vector.Create(new Array(0, 0)));

kf.predict();

kf.update();
