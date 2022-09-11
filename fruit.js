const Bodies = Matter.Bodies;
const Composite = Matter.Composite;
const Body = Matter.Body;

const radius_2 = [52, 80, 108, 120, 152, 184, 194, 258, 308, 308, 408];

export class Fruit {
  constructor(type, x = 240, y = 100) {
    this.type = type;
    this.fruit = Bodies.circle(x, y, 10 * (type + 1), {
      render: {
        sprite: {
          texture: `./img/${type}.png`,
          xScale: 20 * (type + 1) / radius_2[type],
          yScale: 20 * (type + 1) / radius_2[type]
        }
      },
      fruitType: type
    });
  }

  show(world) {
    Composite.add(world, this.fruit);
  }

  refresh() {
    Body.setStatic(this.fruit, true);
  }

  drop(x) {
    Body.setPosition(this.fruit, { x, y: 100 });
    Body.setStatic(this.fruit, false);
  }
}