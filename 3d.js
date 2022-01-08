class Point {
	x;
	y;
	z;

	constructor(x = 0, y = 0, z = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

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

	rotateX(angle, y = 0, z = 0) {
		this.y -= y;
		this.z -= z;
		const y1 = this.y * Math.cos(angle) - this.z * Math.sin(angle) + y;
		const z1 = this.y * Math.sin(angle) + this.z * Math.cos(angle) + z;
		this.y = y1;
		this.z = z1;
		return this;
	}

	rotateY(angle, x = 0, z = 0) {
		this.x -= x;
		this.z -= z;
		const x1 = this.x * Math.cos(angle) - this.z * Math.sin(angle) + x;
		const z1 = this.x * Math.sin(angle) + this.z * Math.cos(angle) + z;
		this.x = x1;
		this.z = z1;
		return this;
	}

	rotateZ(angle, x = 0, y = 0) {
		this.x -= x;
		this.y -= y;
		const x1 = this.x * Math.cos(angle) - this.y * Math.sin(angle) + x;
		const y1 = this.x * Math.sin(angle) + this.y * Math.cos(angle) + y;
		this.x = x1;
		this.y = y1;
		return this;
	}

	move(offsetX = 0, offsetY = 0, offsetZ = 0) {
		this.x += offsetX;
		this.y += offsetY;
		this.z += offsetZ;
		return this;
	}

	scale(ratio, centerPoint = new Point()) {
		this.x = (this.x - centerPoint.x) * ratio + centerPoint.x;
		this.y = (this.y - centerPoint.y) * ratio + centerPoint.y;
		this.z = (this.z - centerPoint.z) * ratio + centerPoint.z;
		return this;
	}

	scaleXYZ(ratioX = 1, ratioY = 1, ratioZ = 1, centerPoint = new Point()) {
		this.x = (this.x - centerPoint.x) * ratioX + centerPoint.x;
		this.y = (this.y - centerPoint.y) * ratioY + centerPoint.y;
		this.z = (this.z - centerPoint.z) * ratioZ + centerPoint.z;
		return this;
	}

	clone() {
		return new Point(this.x, this.y, this.z);
	}
}

class Triangle {
	pointA;
	pointB;
	pointC;

	constructor(pointA = null, pointB = null, pointC = null) {
		this.pointA = pointA?.clone() ?? new Point();
		this.pointB = pointB?.clone() ?? new Point();
		this.pointC = pointC?.clone() ?? new Point();
	}

	rotate(line, angle) {
		this.pointA.rotate(line, angle);
		this.pointB.rotate(line, angle);
		this.pointC.rotate(line, angle);
		return this;
	}

	rotateX(angle, y = 0, z = 0) {
		this.pointA.rotateX(angle, y, z);
		this.pointB.rotateX(angle, y, z);
		this.pointC.rotateX(angle, y, z);
		return this;
	}

	rotateY(angle, x = 0, z = 0) {
		this.pointA.rotateY(angle, x, z);
		this.pointB.rotateY(angle, x, z);
		this.pointC.rotateY(angle, x, z);
		return this;
	}

	rotateZ(angle, x = 0, y = 0) {
		this.pointA.rotateZ(angle, x, y);
		this.pointB.rotateZ(angle, x, y);
		this.pointC.rotateZ(angle, x, y);
		return this;
	}

	move(offsetX = 0, offsetY = 0, offsetZ = 0) {
		this.pointA.move(offsetX, offsetY, offsetZ);
		this.pointB.move(offsetX, offsetY, offsetZ);
		this.pointC.move(offsetX, offsetY, offsetZ);
		return this;
	}

	scale(ratio, centerPoint = null) {
		centerPoint = centerPoint ?? this.center();
		this.pointA.scale(ratio, centerPoint);
		this.pointB.scale(ratio, centerPoint);
		this.pointC.scale(ratio, centerPoint);
		return this;
	}

	scaleXYZ(ratioX = 1, ratioY = 1, ratioZ = 1, centerPoint = null) {
		centerPoint = centerPoint ?? this.center();
		this.pointA.scaleXYZ(ratioX, ratioY, ratioZ, centerPoint);
		this.pointB.scaleXYZ(ratioX, ratioY, ratioZ, centerPoint);
		this.pointC.scaleXYZ(ratioX, ratioY, ratioZ, centerPoint);
		return this;
	}

	center() {
		return new Point(
				(this.pointA.x + this.pointB.x + this.pointC.x) / 3, 
				(this.pointA.y + this.pointB.y + this.pointC.y) / 3, 
				(this.pointA.z + this.pointB.z + this.pointC.z) / 3
			);
	}

	clone() {
		return new Triangle(this.pointA, this.pointB, this.pointC);
	}

	static createFromCoordinates(x1 = 0, y1 = 0, z1 = 0, x2 = 0, y2 = 0, z2 = 0, x3 = 0, y3 = 0, z3 = 0) {
		return new Triangle(new Point(x1, y1, z1), new Point(x2, y2, z2), new Point(x3, y3, z3));
	}
}

class Line {
	pointA;
	pointB;

	constructor(pointA = null, pointB = null) {
		this.pointA = pointA?.clone() ?? new Point();
		this.pointB = pointB?.clone() ?? new Point();
	}

	rotate(line, angle) {
		this.pointA.rotate(line, angle);
		this.pointB.rotate(line, angle);
		return this;
	}

	rotateX(angle, y = 0, z = 0) {
		this.pointA.rotateX(angle, y, z);
		this.pointB.rotateX(angle, y, z);
		return this;
	}

	rotateY(angle, x = 0, z = 0) {
		this.pointA.rotateY(angle, x, z);
		this.pointB.rotateY(angle, x, z);
		return this;
	}

	rotateZ(angle, x = 0, y = 0) {
		this.pointA.rotateZ(angle, x, y);
		this.pointB.rotateZ(angle, x, y);
		return this;
	}

	move(offsetX = 0, offsetY = 0, offsetZ = 0) {
		this.pointA.move(offsetX, offsetY, offsetZ);
		this.pointB.move(offsetX, offsetY, offsetZ);
		return this;
	}

	scale(ratio, centerPoint = null) {
		centerPoint = centerPoint ?? this.center();
		this.pointA.scale(ratio, centerPoint);
		this.pointB.scale(ratio, centerPoint);
		return this;
	}

	scaleXYZ(ratioX = 1, ratioY = 1, ratioZ = 1, centerPoint = null) {
		centerPoint = centerPoint ?? this.center();
		this.pointA.scale(ratioX, ratioY, ratioZ, centerPoint);
		this.pointB.scale(ratioX, ratioY, ratioZ, centerPoint);
		return this;
	}

	center() {
		return new Point(
				(this.pointA.x + this.pointB.x) / 2, 
				(this.pointA.y + this.pointB.y) / 2, 
				(this.pointA.z + this.pointB.z) / 2
			);
	}

	clone() {
		return new Line(this.pointA, this.pointB);
	}

	static createFromCoordinates(x1 = 0, y1 = 0, z1 = 0, x2 = 0, y2 = 0, z2 = 0) {
		return new Line(new Point(x1, y1, z1), new Point(x2, y2, z2));
	}
}

class ThreeDimensionalObject {
	#triangles = [];

	constructor(triangles = []) {
		this.setTriangles(triangles);
	}

	getTriangles() {
		return this.#triangles;
	}

	setTriangles(triangles) {
		this.#triangles = triangles.map(triangle => triangle.clone());
	}

	addTriangle(triangle) {
		this.#triangles.push(triangle.clone());
	}

	center() {
		const line = new Line(
				new Point(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE),
				new Point(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE)
			);

		this.#triangles.forEach(triangle => {
			const minX = Math.min(triangle.pointA.x, triangle.pointB.x, triangle.pointC.x);
			const minY = Math.min(triangle.pointA.y, triangle.pointB.y, triangle.pointC.y);
			const minZ = Math.min(triangle.pointA.z, triangle.pointB.z, triangle.pointC.z);

			const maxX = Math.max(triangle.pointA.x, triangle.pointB.x, triangle.pointC.x);
			const maxY = Math.max(triangle.pointA.y, triangle.pointB.y, triangle.pointC.y);
			const maxZ = Math.max(triangle.pointA.z, triangle.pointB.z, triangle.pointC.z);

			if (minX < line.pointA.x) {
				line.pointA.x = minX;
			}

			if (minY < line.pointA.y) {
				line.pointA.y = minY;
			}

			if (minZ < line.pointA.z) {
				line.pointA.z = minZ;
			}

			if (maxX > line.pointB.x) {
				line.pointB.x = maxX;
			}

			if (maxY > line.pointB.y) {
				line.pointB.y = maxY;
			}

			if (maxZ > line.pointB.z) {
				line.pointB.z = maxZ;
			}
		});
		
		return line.center();
	}

	clone() {
		return new ThreeDimensionalObject(this.#triangles);
	}

	rotate(line, angle) {
		this.#triangles.forEach(triangle => triangle.rotate(line, angle));
		return this;
	}

	rotateX(angle, y = 0, z = 0) {
		this.#triangles.forEach(triangle => triangle.rotateX(angle, y, z));
		return this;
	}

	rotateY(angle, x = 0, z = 0) {
		this.#triangles.forEach(triangle => triangle.rotateY(angle, x, z));
		return this;
	}

	rotateZ(angle, x = 0, y = 0) {
		this.#triangles.forEach(triangle => triangle.rotateZ(angle, x, y));
		return this;
	}

	move(offsetX = 0, offsetY = 0, offsetZ = 0) {
		this.#triangles.forEach(triangle => triangle.move(offsetX, offsetY, offsetZ));
		return this;
	}

	scale(ratio, centerPoint = null) {
		centerPoint = centerPoint ?? this.center();
		this.#triangles.forEach(triangle => triangle.scale(ratio, centerPoint));
		return this;
	}

	scaleXYZ(ratioX = 1, ratioY = 1, ratioZ = 1, centerPoint = null) {
		centerPoint = centerPoint ?? this.center();
		this.#triangles.forEach(triangle => triangle.scaleXYZ(ratioX, ratioY, ratioZ, centerPoint));
		return this;
	}

	merge(object) {
		for (const triangle of object.#triangles) {
			this.#triangles.push(triangle.clone());
		}

		return this;
	}

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

		return sphere.move(centerPoint.x, centerPoint.x, centerPoint.x);
	}

	static createCylinder(baseCenter = new Point(), baseRadius = 1, height = 1, step = 0.2) {
		return this.createCylinderWithXYBase(baseCenter, baseRadius, height, step);
	}

	static createCylinderWithXYBase(baseCenter = new Point(), baseRadius = 1, height = 1, step = 0.2) {
		return this.#getCylinder('xy', baseRadius, height, step).move(baseCenter.x, baseCenter.y, baseCenter.z);
	}

	static createCylinderWithXZBase(baseCenter = new Point(), baseRadius = 1, height = 1, step = 0.2) {
		return this.#getCylinder('xz', baseRadius, height, step).move(baseCenter.x, baseCenter.y, baseCenter.z);
	}

	static createCylinderWithYZBase(baseCenter = new Point(), baseRadius = 1, height = 1, step = 0.2) {
		return this.#getCylinder('yz', baseRadius, height, step).move(baseCenter.x, baseCenter.y, baseCenter.z);
	}

	static createCone(baseCenter = new Point(), baseRadius = 1, height = 1, step = 0.2) {
		return this.createConeWithXYBase(baseCenter, baseRadius, height);
	}

	static createConeWithXYBase(baseCenter = new Point(), baseRadius = 1, height = 1, step = 0.2) {
		return this.#getCone('xy', baseRadius, height, step).move(baseCenter.x, baseCenter.y, baseCenter.z);
	}

	static createConeWithXZBase(baseCenter = new Point(), baseRadius = 1, height = 1, step = 0.2) {
		return this.#getCone('xz', baseRadius, height, step).move(baseCenter.x, baseCenter.y, baseCenter.z);
	}

	static createConeWithYZBase(baseCenter = new Point(), baseRadius = 1, height = 1, step = 0.2) {
		return this.#getCone('yz', baseRadius, height, step).move(baseCenter.x, baseCenter.y, baseCenter.z);
	}

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

class Renderer {
	#zBuffer = [[]];
	#viewPoint;

	constructor(width = null, height = null, viewPoint = null) {
		this.resize(width, height, viewPoint);
	}

	moveViewPoint(offsetX = 0, offsetY = 0, offsetZ = 0) {
		this.#viewPoint.move(offsetX, offsetY, offsetZ);
	}

	setViewPoint(viewPoint) {
		this.#viewPoint = viewPoint.clone();
	}

	resize(width = null, height = null, viewPoint = null) {
		height = height ?? this.height();
		width = width ?? this.width();
		viewPoint = viewPoint ?? (this.#viewPoint ?? new Point());

		if (width !== this.width || height !== this.height) {
			this.#zBuffer.length = height;

			for (let y = this.#zBuffer.length - 1; y >= 0; --y) {
				this.#zBuffer[y] = new Array(width);
			}
		}

		if (viewPoint !== this.#viewPoint) {
			this.#viewPoint = viewPoint.clone();
		}
	}

	height() {
		return this.#zBuffer.length;
	}

	width() {
		return this.#zBuffer.length > 0 ? this.#zBuffer[0].length : 0;
	}

	viewPoint() {
		return this.#viewPoint;
	}

	render(objects) {
		const width = this.width();
		const height = this.height();

		objects.forEach(object => {
			object.getTriangles().forEach(tringle => {
				this.#renderTriangle(tringle, width, height);
			});
		});

		let s = '';
		const gradient = ['.', '"', '?', '%', '%', '#', '@'];

		for(let y = 0; y < this.#zBuffer.length - 2; ++y) {
			for(let x = 0; x < this.#zBuffer[y].length - 2; ++x) {
				if (this.#zBuffer[y][x] !== undefined) {
					this.#zBuffer[y][x] = (
						this.#zBuffer[y][x] + 
						(this.#zBuffer[y + 1][x] ?? this.#zBuffer[y][x]) +
						(this.#zBuffer[y][x + 1] ?? this.#zBuffer[y][x]) +
						(this.#zBuffer[y + 1][x + 1] ?? this.#zBuffer[y][x])
					) / 4;
				}
			}
		}

		for(let y = 1; y < this.#zBuffer.length; ++y) {
			for(let x = 1; x < this.#zBuffer[y].length; ++x) {
				if (this.#zBuffer[y][x] !== undefined) {
					this.#zBuffer[y][x] = (
						this.#zBuffer[y][x] + 
						(this.#zBuffer[y - 1][x] ?? this.#zBuffer[y][x]) +
						(this.#zBuffer[y][x - 1] ?? this.#zBuffer[y][x]) +
						(this.#zBuffer[y - 1][x - 1] ?? this.#zBuffer[y][x])
					) / 4;
				}
			}
		}

		for(let y = 0; y < this.#zBuffer.length - 1; ++y) {
			for(let x = 0; x < this.#zBuffer[y].length - 1; ++x) {
				if (this.#zBuffer[y][x] !== undefined) {
					let angleCoefficient = 2 * this.#zBuffer[y][x] - 
						(this.#zBuffer[y][x + 1] ?? -Number.MAX_VALUE) - 
						(this.#zBuffer[y + 1][x] ?? -Number.MAX_VALUE);

					angleCoefficient *= 6;
					angleCoefficient = Math.min(angleCoefficient, gradient.length - 1);
					angleCoefficient = Math.max(angleCoefficient, 0);
					angleCoefficient = Math.round(angleCoefficient);
					s += gradient[angleCoefficient];
					s += gradient[angleCoefficient];
					this.#zBuffer[y][x] = undefined;
				} else {
					s += '  ';
				}
			}

			s += '\n';
		}

		return s;
	}

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
					if (z < this.#viewPoint.z && (!this.#zBuffer[y][x] || z > this.#zBuffer[y][x])) {
						this.#zBuffer[y][x] = z;
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
					if (z < this.#viewPoint.z && (!this.#zBuffer[y][x] || z > this.#zBuffer[y][x])) {
						this.#zBuffer[y][x] = z;
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