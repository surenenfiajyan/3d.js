/**
 * Three-dimensional point
 */
class Point {
	/**
	 * X coordinate
	 * @type number
	 */
	x;

	/**
	 * Y coordinate
	 * @type number
	 */
	y;

	/**
	 * Z coordinate
	 * @type number
	 */
	z;

	/**
	 * Construct a point from X, Y and Z coordinates
	 * @param {number} x
	 * @param {number} y
	 * @param {number} z
	 */
	constructor(x = 0, y = 0, z = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	/**
	 * Flip around YZ plane with the given center distance
	 * @param {number} centerOffset
	 * @returns {Point}
	 */
	flipX(centerOffset = 0) {
		this.x = 2 * centerOffset - this.x;
		return this;
	}

	/**
	 * Flip around XZ plane with the given center distance
	 * @param {number} centerOffset
	 * @returns {Point}
	 */
	flipY(centerOffset = 0) {
		this.y = 2 * centerOffset - this.y;
		return this;
	}

	/**
	 * Flip around XY plane with the given center distance
	 * @param {number} centerOffset
	 * @returns {Point}
	 */
	flipZ(centerOffset = 0) {
		this.z = 2 * centerOffset - this.z;
		return this;
	}

	/**
	 * Rotate around the line
	 * @param {Line} line
	 * @param {number} angle
	 * @returns {Point}
	 */
	rotate(line, angle) {
		const normalizedEndPoint = line.pointB.clone().move(-line.pointA.x, -line.pointA.y, -line.pointA.z);
		const angleX = (normalizedEndPoint.y !== 0 || normalizedEndPoint.z !== 0) ? Math.atan(normalizedEndPoint.y / normalizedEndPoint.z) : 0;

		if (angleX !== 0) {
			this.rotateX(angleX, line.pointA.y, line.pointA.z);
			normalizedEndPoint.rotateX(angleX);
		}

		const angleY = (normalizedEndPoint.x !== 0 || normalizedEndPoint.z !== 0) ? Math.atan(normalizedEndPoint.x / normalizedEndPoint.z) : 0;

		if (angleY !== 0) {
			this.rotateY(angleY, line.pointA.x, line.pointA.z);
			normalizedEndPoint.rotateY(angleY);
		}

		this.rotateZ(normalizedEndPoint.z >= 0 ? angle : -angle, line.pointA.x, line.pointA.y);

		if (angleY !== 0) {
			this.rotateY(-angleY, line.pointA.x, line.pointA.z);
		}

		if (angleX !== 0) {
			this.rotateX(-angleX, line.pointA.y, line.pointA.z);
		}

		return this;
	}

	/**
	 * Rotate around X axis
	 * @param {number} angle
	 * @param {number} y
	 * @param {number} z
	 * @returns {Point}
	 */
	rotateX(angle, y = 0, z = 0) {
		this.y -= y;
		this.z -= z;
		const y1 = this.y * Math.cos(angle) - this.z * Math.sin(angle) + y;
		const z1 = this.y * Math.sin(angle) + this.z * Math.cos(angle) + z;
		this.y = y1;
		this.z = z1;
		return this;
	}

	/**
	 * Rotate around Y axis
	 * @param {number} angle
	 * @param {number} x
	 * @param {number} z
	 * @returns {Point}
	 */
	rotateY(angle, x = 0, z = 0) {
		this.x -= x;
		this.z -= z;
		const x1 = this.x * Math.cos(angle) - this.z * Math.sin(angle) + x;
		const z1 = this.x * Math.sin(angle) + this.z * Math.cos(angle) + z;
		this.x = x1;
		this.z = z1;
		return this;
	}

	/**
	 * Rotate around Z axis
	 * @param {number} angle
	 * @param {number} x
	 * @param {number} y
	 * @returns {Point}
	 */
	rotateZ(angle, x = 0, y = 0) {
		this.x -= x;
		this.y -= y;
		const x1 = this.x * Math.cos(angle) - this.y * Math.sin(angle) + x;
		const y1 = this.x * Math.sin(angle) + this.y * Math.cos(angle) + y;
		this.x = x1;
		this.y = y1;
		return this;
	}

	/**
	 * Move by X, Y and Z
	 * @param {number} offsetX
	 * @param {number} offsetY
	 * @param {number} offsetZ
	 * @returns {Point}
	 */
	move(offsetX = 0, offsetY = 0, offsetZ = 0) {
		this.x += offsetX;
		this.y += offsetY;
		this.z += offsetZ;
		return this;
	}

	/**
	 * Scale uniformly around the point
	 * @param {number} ratio
	 * @param {Point} centerPoint
	 * @returns {Point}
	 */
	scale(ratio, centerPoint = new Point()) {
		this.x = (this.x - centerPoint.x) * ratio + centerPoint.x;
		this.y = (this.y - centerPoint.y) * ratio + centerPoint.y;
		this.z = (this.z - centerPoint.z) * ratio + centerPoint.z;
		return this;
	}

	/**
	 * Scale by X, Y and Z dimensions around a point
	 * @param {number} ratioX
	 * @param {number} ratioY
	 * @param {number} ratioZ
	 * @param {Point} centerPoint
	 * @returns {Point}
	 */
	scaleXYZ(ratioX = 1, ratioY = 1, ratioZ = 1, centerPoint = new Point()) {
		this.x = (this.x - centerPoint.x) * ratioX + centerPoint.x;
		this.y = (this.y - centerPoint.y) * ratioY + centerPoint.y;
		this.z = (this.z - centerPoint.z) * ratioZ + centerPoint.z;
		return this;
	}

	/**
	 * Create a new copy
	 * @returns {Point}
	 */
	clone() {
		return new Point(this.x, this.y, this.z);
	}
}

/**
 * Three-dimensional triangle
 */
class Triangle {
	/**
	 * Vertex point A
	 * @type {Point}
	 */
	pointA;

	/**
	 * Vertex point B
	 * @type {Point}
	 */
	pointB;

	/**
	 * Vertex point C
	 * @type {Point}
	 */
	pointC;

	/**
	 * Construct a triangle with vertex points A, B and C
	 * @param {Point|null} pointA
	 * @param {Point|null} pointB
	 * @param {Point|null} pointC
	 */
	constructor(pointA = null, pointB = null, pointC = null) {
		this.pointA = pointA?.clone() ?? new Point();
		this.pointB = pointB?.clone() ?? new Point();
		this.pointC = pointC?.clone() ?? new Point();
	}

	/**
	 * Flip around YZ plane with the given center distance
	 * @param {number} centerOffset
	 * @returns {Triangle}
	 */
	flipX(centerOffset = 0) {
		this.pointA.flipX(centerOffset);
		this.pointB.flipX(centerOffset);
		this.pointC.flipX(centerOffset);
		return this;
	}

	/**
	 * Flip around XZ plane with the given center distance
	 * @param {number} centerOffset
	 * @returns {Triangle}
	 */
	flipY(centerOffset = 0) {
		this.pointA.flipY(centerOffset);
		this.pointB.flipY(centerOffset);
		this.pointC.flipY(centerOffset);
		return this;
	}

	/**
	 * Flip around XY plane with the given center distance
	 * @param {number} centerOffset
	 * @returns {Triangle}
	 */
	flipZ(centerOffset = 0) {
		this.pointA.flipZ(centerOffset);
		this.pointB.flipZ(centerOffset);
		this.pointC.flipZ(centerOffset);
		return this;
	}

	/**
	 * Rotate around the line
	 * @param {Line} line
	 * @param {number} angle
	 * @returns {Triangle}
	 */
	rotate(line, angle) {
		this.pointA.rotate(line, angle);
		this.pointB.rotate(line, angle);
		this.pointC.rotate(line, angle);
		return this;
	}

	/**
	 * Rotate around X axis
	 * @param {number} angle
	 * @param {number} y
	 * @param {number} z
	 * @returns {Triangle}
	 */
	rotateX(angle, y = 0, z = 0) {
		this.pointA.rotateX(angle, y, z);
		this.pointB.rotateX(angle, y, z);
		this.pointC.rotateX(angle, y, z);
		return this;
	}

	/**
	 * Rotate around Y axis
	 * @param {number} angle
	 * @param {number} x
	 * @param {number} z
	 * @returns {Triangle}
	 */
	rotateY(angle, x = 0, z = 0) {
		this.pointA.rotateY(angle, x, z);
		this.pointB.rotateY(angle, x, z);
		this.pointC.rotateY(angle, x, z);
		return this;
	}

	/**
	 * Rotate around Z axis
	 * @param {number} angle
	 * @param {number} x
	 * @param {number} y
	 * @returns {Triangle}
	 */
	rotateZ(angle, x = 0, y = 0) {
		this.pointA.rotateZ(angle, x, y);
		this.pointB.rotateZ(angle, x, y);
		this.pointC.rotateZ(angle, x, y);
		return this;
	}

	/**
	 * Move by X, Y and Z
	 * @param {number} offsetX
	 * @param {number} offsetY
	 * @param {number} offsetZ
	 * @returns {Triangle}
	 */
	move(offsetX = 0, offsetY = 0, offsetZ = 0) {
		this.pointA.move(offsetX, offsetY, offsetZ);
		this.pointB.move(offsetX, offsetY, offsetZ);
		this.pointC.move(offsetX, offsetY, offsetZ);
		return this;
	}

	/**
	 * Scale uniformly around the point
	 * @param {number} ratio
	 * @param {Point|null} centerPoint
	 * @returns {Triangle}
	 */
	scale(ratio, centerPoint = null) {
		centerPoint = centerPoint ?? this.center();
		this.pointA.scale(ratio, centerPoint);
		this.pointB.scale(ratio, centerPoint);
		this.pointC.scale(ratio, centerPoint);
		return this;
	}

	/**
	 * Scale by X, Y and Z dimensions around a point
	 * @param {number} ratioX
	 * @param {number} ratioY
	 * @param {number} ratioZ
	 * @param {Point|null} centerPoint
	 * @returns {Triangle}
	 */
	scaleXYZ(ratioX = 1, ratioY = 1, ratioZ = 1, centerPoint = null) {
		centerPoint = centerPoint ?? this.center();
		this.pointA.scaleXYZ(ratioX, ratioY, ratioZ, centerPoint);
		this.pointB.scaleXYZ(ratioX, ratioY, ratioZ, centerPoint);
		this.pointC.scaleXYZ(ratioX, ratioY, ratioZ, centerPoint);
		return this;
	}

	/**
	 * Get the center point
	 * @returns {Point}
	 */
	center() {
		return new Point(
			(this.pointA.x + this.pointB.x + this.pointC.x) / 3,
			(this.pointA.y + this.pointB.y + this.pointC.y) / 3,
			(this.pointA.z + this.pointB.z + this.pointC.z) / 3
		);
	}

	/**
	 * Create a new copy
	 * @returns {Triangle}
	 */
	clone() {
		return new Triangle(this.pointA, this.pointB, this.pointC);
	}

	/**
	 * Create a triangle from raw coordinates
	 * @param {number} x1
	 * @param {number} y1
	 * @param {number} z1
	 * @param {number} x2
	 * @param {number} y2
	 * @param {number} z2
	 * @param {number} x3
	 * @param {number} y3
	 * @param {number} z3
	 * @returns {Triangle}
	 */
	static createFromCoordinates(x1 = 0, y1 = 0, z1 = 0, x2 = 0, y2 = 0, z2 = 0, x3 = 0, y3 = 0, z3 = 0) {
		return new Triangle(new Point(x1, y1, z1), new Point(x2, y2, z2), new Point(x3, y3, z3));
	}
}

/**
 * Three-dimensional line
 */
class Line {
	/**
	 * Point A
	 * @type Point
	 */
	pointA;

	/**
	 * Point B
	 * @type Point
	 */
	pointB;

	/**
	 * Construct a point with points A and B
	 * @param {Point|null} pointA
	 * @param {Point|null} pointB
	 */
	constructor(pointA = null, pointB = null) {
		this.pointA = pointA?.clone() ?? new Point();
		this.pointB = pointB?.clone() ?? new Point();
	}

	/**
	 * Flip around YZ plane with the given center distance
	 * @param {number} centerOffset
	 * @returns {Line}
	 */
	flipX(centerOffset = 0) {
		this.pointA.flipX(centerOffset);
		this.pointB.flipX(centerOffset);
		return this;
	}

	/**
	 * Flip around XZ plane with the given center distance
	 * @param {number} centerOffset
	 * @returns {Line}
	 */
	flipY(centerOffset = 0) {
		this.pointA.flipY(centerOffset);
		this.pointB.flipY(centerOffset);
		return this;
	}

	/**
	 * Flip around XY plane with the given center distance
	 * @param {number} centerOffset
	 * @returns {Line}
	 */
	flipZ(centerOffset = 0) {
		this.pointA.flipZ(centerOffset);
		this.pointB.flipZ(centerOffset);
		return this;
	}

	/**
	 * Rotate around the line
	 * @param {Line} line
	 * @param {number} angle
	 * @returns {Line}
	 */
	rotate(line, angle) {
		this.pointA.rotate(line, angle);
		this.pointB.rotate(line, angle);
		return this;
	}

	/**
	 * Rotate around X axis
	 * @param {number} angle
	 * @param {number} y
	 * @param {number} z
	 * @returns {Line}
	 */
	rotateX(angle, y = 0, z = 0) {
		this.pointA.rotateX(angle, y, z);
		this.pointB.rotateX(angle, y, z);
		return this;
	}

	/**
	 * Rotate around Y axis
	 * @param {number} angle
	 * @param {number} x
	 * @param {number} z
	 * @returns {Line}
	 */
	rotateY(angle, x = 0, z = 0) {
		this.pointA.rotateY(angle, x, z);
		this.pointB.rotateY(angle, x, z);
		return this;
	}

	/**
	 * Rotate around Z axis
	 * @param {number} angle
	 * @param {number} x
	 * @param {number} y
	 * @returns {Line}
	 */
	rotateZ(angle, x = 0, y = 0) {
		this.pointA.rotateZ(angle, x, y);
		this.pointB.rotateZ(angle, x, y);
		return this;
	}

	/**
	 * Move by X, Y and Z
	 * @param {number} offsetX
	 * @param {number} offsetY
	 * @param {number} offsetZ
	 * @returns {Line}
	 */
	move(offsetX = 0, offsetY = 0, offsetZ = 0) {
		this.pointA.move(offsetX, offsetY, offsetZ);
		this.pointB.move(offsetX, offsetY, offsetZ);
		return this;
	}

	/**
	 * Scale uniformly around the point
	 * @param {number} ratio
	 * @param {Point|null} centerPoint
	 * @returns {Line}
	 */
	scale(ratio, centerPoint = null) {
		centerPoint = centerPoint ?? this.center();
		this.pointA.scale(ratio, centerPoint);
		this.pointB.scale(ratio, centerPoint);
		return this;
	}

	/**
	 * Scale by X, Y and Z dimensions around a point
	 * @param {number} ratioX
	 * @param {number} ratioY
	 * @param {number} ratioZ
	 * @param {Point|null} centerPoint
	 * @returns {Line}
	 */
	scaleXYZ(ratioX = 1, ratioY = 1, ratioZ = 1, centerPoint = null) {
		centerPoint = centerPoint ?? this.center();
		this.pointA.scale(ratioX, ratioY, ratioZ, centerPoint);
		this.pointB.scale(ratioX, ratioY, ratioZ, centerPoint);
		return this;
	}

	/**
	 * Get the center point
	 * @returns {Point}
	 */
	center() {
		return new Point(
			(this.pointA.x + this.pointB.x) / 2,
			(this.pointA.y + this.pointB.y) / 2,
			(this.pointA.z + this.pointB.z) / 2
		);
	}

	/**
	 * Create a new copy
	 * @returns {Line}
	 */
	clone() {
		return new Line(this.pointA, this.pointB);
	}

	/**
	 * Create a line from raw coordinates
	 * @param {number} x1
	 * @param {number} y1
	 * @param {number} z1
	 * @param {number} x2
	 * @param {number} y2
	 * @param {number} z2
	 * @returns {Line}
	 */
	static createFromCoordinates(x1 = 0, y1 = 0, z1 = 0, x2 = 0, y2 = 0, z2 = 0) {
		return new Line(new Point(x1, y1, z1), new Point(x2, y2, z2));
	}
}

/**
 * Three-dimensional object
 */
class ThreeDimensionalObject {
	/**
	 * Triangles
	 * @type {Triangle[]}
	 */
	#triangles = [];

	/**
	 * Construct a three-dimensional object with optional triangles
	 * @param {Triangle[]} triangles
	 */
	constructor(triangles = []) {
		this.setTriangles(triangles);
	}

	/**
	 * Get the triangles
	 * @returns {Triangle[]}
	 */
	getTriangles() {
		return this.#triangles.map(triangle => triangle.clone());
	}

	/**
	 * Replace the triangles
	 * @param {Triangle[]} triangles
	 */
	setTriangles(triangles) {
		this.#triangles = triangles.map(triangle => triangle.clone());
	}

	/**
	 * Add a triangle
	 * @param {Triangle} triangle
	 */
	addTriangle(triangle) {
		this.#triangles.push(triangle.clone());
	}

	/**
	 * Get the center point
	 * @returns {Point}
	 */
	center() {
		const line = new Line(
			new Point(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE),
			new Point(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE)
		);

		this.#triangles.forEach(triangle => {
			line.pointA.x = Math.min(triangle.pointA.x, triangle.pointB.x, triangle.pointC.x, line.pointA.x);
			line.pointA.y = Math.min(triangle.pointA.y, triangle.pointB.y, triangle.pointC.y, line.pointA.y);
			line.pointA.z = Math.min(triangle.pointA.z, triangle.pointB.z, triangle.pointC.z, line.pointA.z);

			line.pointB.x = Math.max(triangle.pointA.x, triangle.pointB.x, triangle.pointC.x, line.pointB.x);
			line.pointB.y = Math.max(triangle.pointA.y, triangle.pointB.y, triangle.pointC.y, line.pointB.y);
			line.pointB.z = Math.max(triangle.pointA.z, triangle.pointB.z, triangle.pointC.z, line.pointB.z);
		});

		return line.center();
	}

	/**
	 * Create a new copy
	 * @returns {ThreeDimensionalObject}
	 */
	clone() {
		return new ThreeDimensionalObject(this.#triangles);
	}

	/**
	 * Flip around YZ plane with the given center distance
	 * @param {number} centerOffset
	 * @returns {ThreeDimensionalObject}
	 */
	flipX(centerOffset = 0) {
		this.#triangles.forEach(triangle => triangle.flipX(centerOffset));
		return this;
	}

	/**
	 * Flip around XZ plane with the given center distance
	 * @param {number} centerOffset
	 * @returns {ThreeDimensionalObject}
	 */
	flipY(centerOffset = 0) {
		this.#triangles.forEach(triangle => triangle.flipY(centerOffset));
		return this;
	}

	/**
	 * Flip around XY plane with the given center distance
	 * @param {number} centerOffset
	 * @returns {ThreeDimensionalObject}
	 */
	flipZ(centerOffset = 0) {
		this.#triangles.forEach(triangle => triangle.flipZ(centerOffset));
		return this;
	}

	/**
	 * Rotate around the line
	 * @param {Line} line
	 * @param {number} angle
	 * @returns {ThreeDimensionalObject}
	 */
	rotate(line, angle) {
		this.#triangles.forEach(triangle => triangle.rotate(line, angle));
		return this;
	}

	/**
	 * Rotate around X axis
	 * @param {number} angle
	 * @param {number} y
	 * @param {number} z
	 * @returns {ThreeDimensionalObject}
	 */
	rotateX(angle, y = 0, z = 0) {
		this.#triangles.forEach(triangle => triangle.rotateX(angle, y, z));
		return this;
	}

	/**
	 * Rotate around Y axis
	 * @param {number} angle
	 * @param {number} x
	 * @param {number} z
	 * @returns {ThreeDimensionalObject}
	 */
	rotateY(angle, x = 0, z = 0) {
		this.#triangles.forEach(triangle => triangle.rotateY(angle, x, z));
		return this;
	}

	/**
	 * Rotate around Z axis
	 * @param {number} angle
	 * @param {number} x
	 * @param {number} y
	 * @returns {ThreeDimensionalObject}
	 */
	rotateZ(angle, x = 0, y = 0) {
		this.#triangles.forEach(triangle => triangle.rotateZ(angle, x, y));
		return this;
	}

	/**
	 * Move by X, Y and Z
	 * @param {number} offsetX
	 * @param {number} offsetY
	 * @param {number} offsetZ
	 * @returns {ThreeDimensionalObject}
	 */
	move(offsetX = 0, offsetY = 0, offsetZ = 0) {
		this.#triangles.forEach(triangle => triangle.move(offsetX, offsetY, offsetZ));
		return this;
	}

	/**
	 * Scale uniformly around the point
	 * @param {number} ratio
	 * @param {Point|null} centerPoint
	 * @returns {ThreeDimensionalObject}
	 */
	scale(ratio, centerPoint = null) {
		centerPoint = centerPoint ?? this.center();
		this.#triangles.forEach(triangle => triangle.scale(ratio, centerPoint));
		return this;
	}

	/**
	 * Scale by X, Y and Z dimensions around a point
	 * @param {number} ratioX
	 * @param {number} ratioY
	 * @param {number} ratioZ
	 * @param {Point|null} centerPoint
	 * @returns {ThreeDimensionalObject}
	 */
	scaleXYZ(ratioX = 1, ratioY = 1, ratioZ = 1, centerPoint = null) {
		centerPoint = centerPoint ?? this.center();
		this.#triangles.forEach(triangle => triangle.scaleXYZ(ratioX, ratioY, ratioZ, centerPoint));
		return this;
	}

	/**
	 * Merge with another three-dimensional object
	 * @param {ThreeDimensionalObject} object
	 * @returns {ThreeDimensionalObject}
	 */
	merge(object) {
		for (const triangle of object.#triangles) {
			this.#triangles.push(triangle.clone());
		}

		return this;
	}

	/**
	 * Merge all vertexes points that have coordinates within the merge radius in order to reduce the vertex count
	 * @param {number} mergeRadius
	 * @returns {ThreeDimensionalObject}
	 */
	optimize(mergeRadius = 0.1) {
		/**
		 * @param {Point} point
		 * @returns
		 */
		function getKeyFromPoint(point) {
			return `${Math.round(point.x / mergeRadius)},${Math.round(point.y / mergeRadius)},${Math.round(point.z / mergeRadius)}`;
		}

		const newPoints = new Map();
		const newTriangles = new Map();

		for (const triangle of this.#triangles) {
			const pointAKey = getKeyFromPoint(triangle.pointA);
			const pointBKey = getKeyFromPoint(triangle.pointB);
			const pointCKey = getKeyFromPoint(triangle.pointC);

			if (pointAKey !== pointBKey && pointBKey !== pointCKey && pointAKey !== pointCKey) {
				newTriangles.set(`${pointAKey}|${pointBKey}|${pointCKey}`, triangle);
			}
		}

		this.#triangles = [...newTriangles.values()];

		for (const triangle of this.#triangles) {
			newPoints.set(getKeyFromPoint(triangle.pointA), triangle.pointA);
			newPoints.set(getKeyFromPoint(triangle.pointB), triangle.pointB);
			newPoints.set(getKeyFromPoint(triangle.pointC), triangle.pointC);
		}

		for (const triangle of this.#triangles) {
			triangle.pointA = newPoints.get(getKeyFromPoint(triangle.pointA)).clone();
			triangle.pointB = newPoints.get(getKeyFromPoint(triangle.pointB)).clone();
			triangle.pointC = newPoints.get(getKeyFromPoint(triangle.pointC)).clone();
		}

		return this;
	}

	/**
	 * Create a box with a diagonal
	 * @param {Line} diagonal
	 * @returns {ThreeDimensionalObject}
	 */
	static createBox(diagonal = new Line(new Point(0, 0, 0), new Point(1, 1, 1))) {
		return new ThreeDimensionalObject([
			new Triangle(
				diagonal.pointA,
				new Point(diagonal.pointB.x, diagonal.pointA.y, diagonal.pointA.z),
				new Point(diagonal.pointA.x, diagonal.pointB.y, diagonal.pointA.z)
			),
			new Triangle(
				diagonal.pointA,
				new Point(diagonal.pointB.x, diagonal.pointA.y, diagonal.pointA.z),
				new Point(diagonal.pointA.x, diagonal.pointA.y, diagonal.pointB.z)
			),
			new Triangle(
				diagonal.pointA,
				new Point(diagonal.pointA.x, diagonal.pointB.y, diagonal.pointA.z),
				new Point(diagonal.pointA.x, diagonal.pointA.y, diagonal.pointB.z)
			),

			new Triangle(
				diagonal.pointB,
				new Point(diagonal.pointA.x, diagonal.pointB.y, diagonal.pointB.z),
				new Point(diagonal.pointB.x, diagonal.pointA.y, diagonal.pointB.z)
			),
			new Triangle(
				diagonal.pointB,
				new Point(diagonal.pointA.x, diagonal.pointB.y, diagonal.pointB.z),
				new Point(diagonal.pointB.x, diagonal.pointB.y, diagonal.pointA.z)
			),
			new Triangle(
				diagonal.pointB,
				new Point(diagonal.pointB.x, diagonal.pointA.y, diagonal.pointB.z),
				new Point(diagonal.pointB.x, diagonal.pointB.y, diagonal.pointA.z)
			),

			new Triangle(
				new Point(diagonal.pointA.x, diagonal.pointA.y, diagonal.pointB.z),
				new Point(diagonal.pointB.x, diagonal.pointA.y, diagonal.pointB.z),
				new Point(diagonal.pointA.x, diagonal.pointB.y, diagonal.pointB.z)
			),
			new Triangle(
				new Point(diagonal.pointA.x, diagonal.pointB.y, diagonal.pointA.z),
				new Point(diagonal.pointB.x, diagonal.pointB.y, diagonal.pointA.z),
				new Point(diagonal.pointA.x, diagonal.pointB.y, diagonal.pointB.z)
			),
			new Triangle(
				new Point(diagonal.pointB.x, diagonal.pointA.y, diagonal.pointA.z),
				new Point(diagonal.pointB.x, diagonal.pointB.y, diagonal.pointA.z),
				new Point(diagonal.pointB.x, diagonal.pointA.y, diagonal.pointB.z)
			),

			new Triangle(
				new Point(diagonal.pointB.x, diagonal.pointB.y, diagonal.pointA.z),
				new Point(diagonal.pointA.x, diagonal.pointB.y, diagonal.pointA.z),
				new Point(diagonal.pointB.x, diagonal.pointA.y, diagonal.pointA.z)
			),
			new Triangle(
				new Point(diagonal.pointB.x, diagonal.pointA.y, diagonal.pointB.z),
				new Point(diagonal.pointA.x, diagonal.pointA.y, diagonal.pointB.z),
				new Point(diagonal.pointB.x, diagonal.pointA.y, diagonal.pointA.z)
			),
			new Triangle(
				new Point(diagonal.pointA.x, diagonal.pointB.y, diagonal.pointB.z),
				new Point(diagonal.pointA.x, diagonal.pointA.y, diagonal.pointB.z),
				new Point(diagonal.pointA.x, diagonal.pointB.y, diagonal.pointA.z)
			),
		]);
	}

	/**
	 * Create a sphere with a center point and radius
	 * @param {Point} centerPoint
	 * @param {number} radius
	 * @param {number} step
	 * @returns {ThreeDimensionalObject}
	 */
	static createSphere(centerPoint = new Point(), radius = 1, step = 0.2) {
		let outerAngle = 0;
		const sphere = new ThreeDimensionalObject();

		do {
			const nextOuterAngle = Math.min(outerAngle + step, Math.PI);

			const r1 = radius * Math.sin(outerAngle);
			const r2 = radius * Math.sin(nextOuterAngle);
			const z1 = radius * Math.cos(outerAngle);
			const z2 = radius * Math.cos(nextOuterAngle);

			let innerAngle = 0;

			do {
				const nextInnerAngle = Math.min(innerAngle + step, 2 * Math.PI);

				const pA = new Point(r1 * Math.cos(innerAngle), r1 * Math.sin(innerAngle), z1);
				const pB = new Point(r1 * Math.cos(nextInnerAngle), r1 * Math.sin(nextInnerAngle), z1);
				const pC = new Point(r2 * Math.cos(nextInnerAngle), r2 * Math.sin(nextInnerAngle), z2);
				const pD = new Point(r2 * Math.cos(innerAngle), r2 * Math.sin(innerAngle), z2);

				if (r1 > 0) {
					sphere.addTriangle(new Triangle(pA, pB, pC));
				}

				if (r2 > 0) {
					sphere.addTriangle(new Triangle(pA, pC, pD));
				}

				innerAngle = nextInnerAngle;
			} while (innerAngle < 2 * Math.PI);

			outerAngle = nextOuterAngle;
		} while (outerAngle < Math.PI);

		return sphere.move(centerPoint.x, centerPoint.y, centerPoint.z);
	}

	/**
	 * Creates a XY base cylinder with base radius and height
	 * @param {Point} baseCenter
	 * @param {number} baseRadius
	 * @param {number} height
	 * @param {number} step
	 * @returns {ThreeDimensionalObject}
	 */
	static createCylinder(baseCenter = new Point(), baseRadius = 1, height = 1, step = 0.2) {
		return this.createCylinderWithXYBase(baseCenter, baseRadius, height, step);
	}

	/**
	 * Creates a XY base cylinder with base radius and height
	 * @param {Point} baseCenter
	 * @param {number} baseRadius
	 * @param {number} height
	 * @param {number} step
	 * @returns {ThreeDimensionalObject}
	 */
	static createCylinderWithXYBase(baseCenter = new Point(), baseRadius = 1, height = 1, step = 0.2) {
		return this.#getCylinder('xy', baseRadius, height, step).move(baseCenter.x, baseCenter.y, baseCenter.z);
	}

	/**
	 * Creates a XZ base cylinder with base radius and height
	 * @param {Point} baseCenter
	 * @param {number} baseRadius
	 * @param {number} height
	 * @param {number} step
	 * @returns {ThreeDimensionalObject}
	 */
	static createCylinderWithXZBase(baseCenter = new Point(), baseRadius = 1, height = 1, step = 0.2) {
		return this.#getCylinder('xz', baseRadius, height, step).move(baseCenter.x, baseCenter.y, baseCenter.z);
	}

	/**
	 * Creates a YZ base cylinder with base radius and height
	 * @param {Point} baseCenter
	 * @param {number} baseRadius
	 * @param {number} height
	 * @param {number} step
	 * @returns {ThreeDimensionalObject}
	 */
	static createCylinderWithYZBase(baseCenter = new Point(), baseRadius = 1, height = 1, step = 0.2) {
		return this.#getCylinder('yz', baseRadius, height, step).move(baseCenter.x, baseCenter.y, baseCenter.z);
	}

	/**
	 * Creates a XY base cone with base radius and height
	 * @param {Point} baseCenter
	 * @param {number} baseRadius
	 * @param {number} height
	 * @param {number} step
	 * @returns {ThreeDimensionalObject}
	 */
	static createCone(baseCenter = new Point(), baseRadius = 1, height = 1, step = 0.2) {
		return this.createConeWithXYBase(baseCenter, baseRadius, height, step);
	}

	/**
	 * Creates a XY base cone with base radius and height
	 * @param {Point} baseCenter
	 * @param {number} baseRadius
	 * @param {number} height
	 * @param {number} step
	 * @returns {ThreeDimensionalObject}
	 */
	static createConeWithXYBase(baseCenter = new Point(), baseRadius = 1, height = 1, step = 0.2) {
		return this.#getCone('xy', baseRadius, height, step).move(baseCenter.x, baseCenter.y, baseCenter.z);
	}

	/**
	 * Creates a XZ base cone with base radius and height
	 * @param {Point} baseCenter
	 * @param {number} baseRadius
	 * @param {number} height
	 * @param {number} step
	 * @returns {ThreeDimensionalObject}
	 */
	static createConeWithXZBase(baseCenter = new Point(), baseRadius = 1, height = 1, step = 0.2) {
		return this.#getCone('xz', baseRadius, height, step).move(baseCenter.x, baseCenter.y, baseCenter.z);
	}

	/**
	 * Creates a YZ base cone with base radius and height
	 * @param {Point} baseCenter
	 * @param {number} baseRadius
	 * @param {number} height
	 * @param {number} step
	 * @returns {ThreeDimensionalObject}
	 */
	static createConeWithYZBase(baseCenter = new Point(), baseRadius = 1, height = 1, step = 0.2) {
		return this.#getCone('yz', baseRadius, height, step).move(baseCenter.x, baseCenter.y, baseCenter.z);
	}

	/**
	 * @param {string} mode
	 * @param {number} r
	 * @param {number} h
	 * @param {number} step
	 * @returns {ThreeDimensionalObject}
	 */
	static #getCylinder(mode, r, h, step) {
		const getPoint = this.#getPointMapper(mode);
		const cylinder = new ThreeDimensionalObject();
		let outerAngle = 0;

		const center1 = getPoint(0, 0, h);
		const center2 = getPoint(0, 0, 0);

		do {
			const nextOuterAngle = Math.min(outerAngle + step, 2 * Math.PI);
			const pointA = getPoint(r * Math.cos(outerAngle), r * Math.sin(outerAngle), h);
			const pointB = getPoint(r * Math.cos(nextOuterAngle), r * Math.sin(nextOuterAngle), h);
			const pointC = getPoint(r * Math.cos(nextOuterAngle), r * Math.sin(nextOuterAngle), 0);
			const pointD = getPoint(r * Math.cos(outerAngle), r * Math.sin(outerAngle), 0);

			cylinder.addTriangle(new Triangle(pointA, pointB, center1));
			cylinder.addTriangle(new Triangle(pointC, pointD, center2));
			cylinder.addTriangle(new Triangle(pointA, pointB, pointC));
			cylinder.addTriangle(new Triangle(pointC, pointD, pointA));

			outerAngle = nextOuterAngle;
		} while (outerAngle < 2 * Math.PI);

		return cylinder;
	}

	/**
	 * @param {string} mode
	 * @param {number} r
	 * @param {number} h
	 * @param {number} step
	 * @returns {ThreeDimensionalObject}
	 */
	static #getCone(mode, r, h, step) {
		const getPoint = this.#getPointMapper(mode);
		const cone = new ThreeDimensionalObject();
		let outerAngle = 0;

		const center1 = getPoint(0, 0, h);
		const center2 = getPoint(0, 0, 0);

		do {
			const nextOuterAngle = Math.min(outerAngle + step, 2 * Math.PI);
			const pointA = getPoint(r * Math.cos(outerAngle), r * Math.sin(outerAngle), 0);
			const pointB = getPoint(r * Math.cos(nextOuterAngle), r * Math.sin(nextOuterAngle), 0);

			cone.addTriangle(new Triangle(pointA, pointB, center1));
			cone.addTriangle(new Triangle(pointA, pointB, center2));

			outerAngle = nextOuterAngle;
		} while (outerAngle < 2 * Math.PI);

		return cone;
	}

	/**
	 * @callback mapperResult
	 * @param {number} x
	 * @param {number} y
	 * @param {number} z
	 * @returns {Point}
	 */

	/**
	 * @param {string} mode
	 * @returns {mapperResult}
	 */
	static #getPointMapper(mode) {
		switch (mode) {
			case 'xy':
				return (x, y, z) => new Point(x, y, z);
			case 'xz':
				return (x, y, z) => new Point(x, z, y);
			case 'yz':
				return (x, y, z) => new Point(z, x, y);
			default:
				return (x, y, z) => new Point(x, y, z);
		}
	}
}

/**
 * A renderer that renders objects
 */
class Renderer {
	/**
	 * Z buffer
	 * @type {number[][]}
	 */
	#zBuffer = [[]];
	/**
	 * Gradient buffer
	 * @type {string[][]}
	 */
	#gradientBuffer = [[]];
	/**
	 * View point
	 * @type {Point}
	 */
	#viewPoint;
	/**
	 * Gradient
	 * @type {string[]}
	 */
	#gradient = ['.', '"', '?', '%', '%', '#', '@'];

	/**
	 * Construct a renderer with view point and viewport width and height
	 * @param {number|null} width
	 * @param {number|null} height
	 * @param {Point|null} viewPoint
	 */
	constructor(width = null, height = null, viewPoint = null) {
		this.resize(width, height, viewPoint);
	}

	/**
	 * Move the view point
	 * @param {number} offsetX
	 * @param {number} offsetY
	 * @param {number} offsetZ
	 */
	moveViewPoint(offsetX = 0, offsetY = 0, offsetZ = 0) {
		this.#viewPoint.move(offsetX, offsetY, offsetZ);
	}

	/**
	 * Update the view point
	 * @param {Point} viewPoint
	 */
	setViewPoint(viewPoint) {
		this.#viewPoint = viewPoint.clone();
	}

	/**
	 * Update the renderer
	 * @param {number|null} width
	 * @param {number|null} height
	 * @param {Point|null} viewPoint
	 */
	resize(width = null, height = null, viewPoint = null) {
		height = height ?? this.height();
		width = width ?? this.width();
		viewPoint = viewPoint ?? (this.#viewPoint ?? new Point());

		if (width !== this.width() || height !== this.height()) {
			this.#gradientBuffer.length = this.#zBuffer.length = height;

			for (let y = this.#zBuffer.length - 1; y >= 0; --y) {
				this.#zBuffer[y] = Array(width).fill(Number.NEGATIVE_INFINITY);
				this.#gradientBuffer[y] = Array(width).fill(' ');
			}
		}

		if (viewPoint !== this.#viewPoint) {
			this.#viewPoint = viewPoint.clone();
		}
	}

	/**
	 * Get height
	 * @returns {number}
	 */
	height() {
		return this.#zBuffer.length;
	}

	/**
	 * Get width
	 * @returns {number}
	 */
	width() {
		return this.#zBuffer.length > 0 ? this.#zBuffer[0].length : 0;
	}

	/**
	 * Get view point
	 * @returns {Point}
	 */
	viewPoint() {
		return this.#viewPoint;
	}

	/**
	 * Renders the given three-dimensional object(s) in a string
	 * @param {ThreeDimensionalObject[]|ThreeDimensionalObject} objects
	 * @returns {string}
	 */
	render(objects) {
		const width = this.width();
		const height = this.height();

		(Array.isArray(objects) ? objects : [objects]).forEach(object => {
			object.getTriangles().forEach(tringle => {
				this.#renderTriangle(tringle, width, height);
			});
		});

		let s = '';

		for (let y = 0; y < this.#gradientBuffer.length; ++y) {
			for (const c of this.#gradientBuffer[y]) {
				s += c.repeat(2);
			}

			this.#gradientBuffer[y].fill(' ');
			this.#zBuffer[y].fill(Number.NEGATIVE_INFINITY);
			s += '\n';
		}

		return s;
	}

	/**
	 * @param {Triangle} triangle
	 * @returns {string}
	 */
	#getGradient(triangle) {
		const x1 = triangle.pointB.x - triangle.pointA.x;
		const y1 = triangle.pointB.y - triangle.pointA.y;
		const z1 = triangle.pointB.z - triangle.pointA.z;

		const x2 = triangle.pointC.x - triangle.pointA.x;
		const y2 = triangle.pointC.y - triangle.pointA.y;
		const z2 = triangle.pointC.z - triangle.pointA.z;

		let xToY = (- x1 * z2 + z1 * x2) / (y1 * z2 - z1 * y2);
		let xToZ = (- x1 * y2 + y1 * x2) / (z1 * y2 - y1 * z2);

		xToY = isNaN(xToY) ? 0 : xToY;
		xToZ = isNaN(xToZ) ? 0 : xToZ;

		const ratio = 1 / Math.sqrt(1 + xToY * xToY + xToZ * xToZ);
		const coefficient = xToZ >= 0 ? (1 + ratio) / 2 : (1 - ratio) / 2;
		const index = Math.floor(coefficient * this.#gradient.length);
		return this.#gradient[index] ?? this.#gradient[index - 1];
	}

	/**
	 * @param {Triangle} triangle
	 * @param {number} width
	 * @param {number} height
	 */
	#renderTriangle(triangle, width, height) {
		const sumOfSizes = width + height;
		const [a, b, c] = [triangle.pointA, triangle.pointB, triangle.pointC]
			.map(p => new Point(
				Math.round((p.x - this.#viewPoint.x) * sumOfSizes / (Math.abs(this.#viewPoint.z - p.z) + 1) - this.#viewPoint.x + width / 2),
				Math.round((p.y - this.#viewPoint.y) * sumOfSizes / (Math.abs(this.#viewPoint.z - p.z) + 1) - this.#viewPoint.y + height / 2),
				p.z + 1
			))
			.sort((a, b) => a.y - b.y);

		if (isNaN(a.x) || isNaN(a.y) || isNaN(b.x) || isNaN(b.y) || isNaN(c.x) || isNaN(c.y)) {
			return;
		}

		const char = this.#getGradient(triangle);
		const xLongInc = (c.x - a.x) / (c.y - a.y + 1);
		const xShortInc1 = (b.x - a.x) / (b.y - a.y + 1);
		const xShortInc2 = (c.x - b.x) / (c.y - b.y + 1);

		let xStart = a.x, xEnd = a.x;
		let zStart = a.z, zEnd = a.z;

		const zLongInc = (c.z - a.z) / (c.y - a.y + 1);
		const zShortInc1 = (b.z - a.z) / (b.y - a.y + 1);
		const zShortInc2 = (c.z - b.z) / (c.y - b.y + 1);

		let [startInc, endInc] = xLongInc < xShortInc1 ? [xLongInc, xShortInc1] : [xShortInc1, xLongInc];
		let [startZInc, endZInc] = xLongInc < xShortInc1 ? [zLongInc, zShortInc1] : [zShortInc1, zLongInc];

		for (let y = a.y; y <= b.y; ++y) {
			const start = Math.max(Math.round(xStart), 0);
			const end = Math.min(Math.round(xEnd), width - 1);
			let z = zStart;
			let incZ = (zEnd - zStart) / (end - start + 1);

			if (y >= 0 && y < height) {
				for (let x = start; x <= end; ++x) {
					if (z < this.#viewPoint.z && z > this.#zBuffer[y][x]) {
						this.#zBuffer[y][x] = z;
						this.#gradientBuffer[y][x] = char;
					}

					z += incZ;
				}
			}

			xStart += startInc;
			xEnd += endInc;
			zStart += startZInc;
			zEnd += endZInc;
		}

		[startInc, endInc] = xLongInc > xShortInc2 ? [xLongInc, xShortInc2] : [xShortInc2, xLongInc];
		[startZInc, endZInc] = xLongInc > xShortInc2 ? [zLongInc, zShortInc2] : [zShortInc2, zLongInc];

		for (let y = b.y + 1; y <= c.y; ++y) {
			const start = Math.max(Math.round(xStart), 0);
			const end = Math.min(Math.round(xEnd), width - 1);
			let z = zStart;
			let incZ = (zEnd - zStart) / (end - start + 1);

			if (y >= 0 && y < height) {
				for (let x = start; x <= end; ++x) {
					if (z < this.#viewPoint.z && z > this.#zBuffer[y][x]) {
						this.#zBuffer[y][x] = z;
						this.#gradientBuffer[y][x] = char;
					}

					z += incZ;
				}
			}

			xStart += startInc;
			xEnd += endInc;
			zStart += startZInc;
			zEnd += endZInc;
		}
	}
}
