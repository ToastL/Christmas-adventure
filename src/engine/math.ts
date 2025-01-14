class Vector2 {
    private _x
    private _y

    constructor(x: number, y: number) {
        this._x = x
        this._y = y
    }

    public get x() { return this._x }
    public set x(value) { this._x = value }
    public get y() { return this._y}
    public set y(value) { this._y = value }

    public get floor() {
        return new Vector2(
            Math.floor(this.x),
            Math.floor(this.y)
        )
    }
}

class Vector3 {
    private _x
    private _y
    private _z

    constructor(x: number, y: number, z: number) {
        this._x = x
        this._y = y
        this._z = z
    }

    public get x() { return this._x }
    public set x(value) { this._x = value }
    public get y() { return this._y }
    public set y(value) { this._y = value }
    public get z() { return this._z }
    public set z(value) { this._z = value }

    public get floor() {
        return new Vector3(
            Math.floor(this.x),
            Math.floor(this.y),
            Math.floor(this.z)
        )
    }
}

class Matrix3x3 {
    private _matrix

    constructor(matrix?: number[]) {
        this._matrix = [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]

        if (matrix) this.matrix = matrix
    }

    public get matrix() { return this._matrix }
    public set matrix(matrix) { 
        if (matrix.length != 9)
            throw new Error('Given matrix is not correct length')

        this._matrix = matrix
    }

    public get Float32Array(): Float32Array {
        return new Float32Array(this._matrix)
    }

    public multiply(matrix: Matrix3x3) {
        return new Matrix3x3([
            this.matrix[0] * matrix.matrix[0] + this.matrix[1] * matrix.matrix[3] + this.matrix[2] * matrix.matrix[6],
            this.matrix[0] * matrix.matrix[1] + this.matrix[1] * matrix.matrix[4] + this.matrix[2] * matrix.matrix[7],
            this.matrix[0] * matrix.matrix[2] + this.matrix[1] * matrix.matrix[5] + this.matrix[2] * matrix.matrix[8],

            this.matrix[3] * matrix.matrix[0] + this.matrix[4] * matrix.matrix[3] + this.matrix[5] * matrix.matrix[6],
            this.matrix[3] * matrix.matrix[1] + this.matrix[4] * matrix.matrix[4] + this.matrix[5] * matrix.matrix[7],
            this.matrix[3] * matrix.matrix[2] + this.matrix[4] * matrix.matrix[5] + this.matrix[5] * matrix.matrix[8],

            this.matrix[6] * matrix.matrix[0] + this.matrix[7] * matrix.matrix[3] + this.matrix[8] * matrix.matrix[6],
            this.matrix[6] * matrix.matrix[1] + this.matrix[7] * matrix.matrix[4] + this.matrix[8] * matrix.matrix[7],
            this.matrix[6] * matrix.matrix[2] + this.matrix[7] * matrix.matrix[5] + this.matrix[8] * matrix.matrix[8],
        ])
    }

    public translate(x: number, y: number) {
        return new Matrix3x3([
            this.matrix[0],
            this.matrix[1] ,
            this.matrix[2],

            this.matrix[3],
            this.matrix[4],
            this.matrix[5],

            x * this.matrix[0] + y * this.matrix[3] + this.matrix[6],
            x * this.matrix[1] + y * this.matrix[4] + this.matrix[7],
            x * this.matrix[2] + y * this.matrix[5] + this.matrix[8]
        ])
    }

    public resize(x: number, y: number) {
        return new Matrix3x3([
            this.matrix[0] * x,
            this.matrix[1] * x,
            this.matrix[2] * x,

            this.matrix[3] * y,
            this.matrix[4] * y,
            this.matrix[5] * y,

            this.matrix[6],
            this.matrix[7],
            this.matrix[8]
        ])
    }
}

class ValueNoise {
    private seed: number;
    private frequency: number;
    private amplitude: number;
    private persistence: number;
    private octaves: number;
  
    constructor(seed: number, frequency = 0.01, amplitude = 50, persistence = 0.5, octaves = 4) {
      this.seed = seed;
      this.frequency = frequency;
      this.amplitude = amplitude;
      this.persistence = persistence;
      this.octaves = octaves;
    }
  
    private hash(x: number): number {
      const h = Math.sin(x * 127.1 + this.seed) * 43758.5453123;
      return h - Math.floor(h);
    }
  
    private lerp(a: number, b: number, t: number): number {
      return a + t * (b - a);
    }
  
    private smoothStep(t: number): number {
      return t * t * (3 - 2 * t);
    }
  
    private valueNoise(x: number): number {
      const x0 = Math.floor(x);
      const x1 = x0 + 1;
      const t = this.smoothStep(x - x0); 
  
      const v0 = this.hash(x0);
      const v1 = this.hash(x1);
  
      return this.lerp(v0, v1, t);
    }
  
    private perlinNoise(x: number): number {
      let total = 0;
      let frequency = this.frequency;
      let amplitude = this.amplitude;
  
      for (let i = 0; i < this.octaves; i++) {
        total += this.valueNoise(x * frequency) * amplitude;
        frequency *= 2;
        amplitude *= this.persistence;
      }
  
      return total;
    }
  
    public getHeight(iteration: number): number {
      return this.perlinNoise(iteration);
    }
}

export { Vector2, Vector3, Matrix3x3, ValueNoise}

