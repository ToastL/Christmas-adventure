class TerrainGenerator1D {
  constructor(length, scale, seed) {
    this.length = length; // Length of the visible terrain
    this.scale = scale;   // Controls the "zoom" of the noise
    this.seed = seed;     // Seed for reproducibility
    this.gradients = [];  // Stores gradients at integer points
    this.position = 0;    // Current offset (position) in the terrain
    this.generateGradients();
  }

  generateGradients() {
    // Initialize random gradients for integer points based on the seed
    const random = this.seededRandom(this.seed);
    for (let i = 0; i <= this.length; i++) {
      this.gradients[i] = random() * 2 - 1; // Gradients in the range [-1, 1]
    }
  }

  seededRandom(seed) {
    return () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }

  lerp(a, b, t) {
    return a + t * (b - a);
  }

  smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  dotGradient(ix, x) {
    const dx = x - ix;
    const gradient = this.getGradient(ix);
    return gradient * dx;
  }

  getGradient(index) {
    // Procedurally generate gradients beyond the initially generated range
    if (this.gradients[index] === undefined) {
      const random = this.seededRandom(this.seed + index);
      this.gradients[index] = random() * 2 - 1;
    }
    return this.gradients[index];
  }

  generateTerrain(offset) {
    const terrain = [];

    for (let i = 0; i < this.length; i++) {
      const x = i + offset; // Adjust for the current position
      const nx = x / this.scale;

      // Determine the integer grid coordinates
      const x0 = Math.floor(nx);
      const x1 = x0 + 1;

      // Compute the dot products at the two points
      const n0 = this.dotGradient(x0, nx);
      const n1 = this.dotGradient(x1, nx);

      // Interpolate between the two points
      const u = this.smoothstep(nx - x0);
      terrain[i] = this.lerp(n0, n1, u);
    }

    return terrain;
  }

  move(offsetChange) {
    // Update the position and return the new terrain
    this.position += offsetChange;
    return this.generateTerrain(this.position);
  }
}

// Example Usage:
const generator = new TerrainGenerator1D(50, 20, 12345);

// Initial terrain at position 0
let terrain = generator.generateTerrain(0);
console.log("Initial Terrain:", terrain);

// Move forward by 10 units
terrain = generator.move(10);
console.log("Moved +10:", terrain);

// Move backward by 5 units
terrain = generator.move(-5);
console.log("Moved -5:", terrain);
