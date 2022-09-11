import { Fruit } from "./fruit.js";

const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Events = Matter.Events;

export class Game{
  constructor() {
    this.gameTurn = 0;
    const engine = Engine.create();
    this.engine = engine;
    const render = Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: 480,
        height: 700,
        wireframes: false,
        background: 'rgb(245, 222, 178)'
      }
    });
    this.render = render;
    this.runner = Runner.create();
    this.canvas = render.canvas;
    this.fruit = null;
    this.active = true;
  }

  start() {
    Composite.clear(this.engine.world);
    this.gameTurn = 0;
    this.active = true; 
    this.startMatter();
    this.startListener();
    this.setNewFruit();
  }

  startMatter() {
    const top = Bodies.rectangle(240, -100, 480, 200, { isStatic: true });
    const right = Bodies.rectangle(580, 350, 200, 700, { isStatic: true });
    const bottom = Bodies.rectangle(240, 800, 480, 200, { isStatic: true });
    const left = Bodies.rectangle(-100, 350, 200, 700, { isStatic: true });
    Composite.add(this.engine.world, [top, right, bottom, left]);
    Render.run(this.render);
    Runner.run(this.runner, this.engine);
  }

  startListener() {
    this.canvas.addEventListener('click', e => {
      if (!this.active) return;
      if (e.clientX < 0 || e.clientX > 480 || e.clientY < 0 || e.clientY > 700) return;
      const now = this.fruit;
      now.drop(e.clientX);
      setTimeout(() => {
        this.setNewFruit();
        if (now.position(y) - (now.fruitType + 1) * 10 < 100) {
          this.endGame();
        }
      }, 500);
    });

    Events.on(this.engine, 'collisionStart', e => {
      for (let pair of e.pairs) {
        const [fruitA, fruitB] = [pair.bodyA, pair.bodyB];
        if (fruitA.fruitType !== undefined && fruitA.fruitType === fruitB.fruitType && fruitA.fruitType < 10) {
          const position = [(fruitA.position.x + fruitB.position.x) / 2, (fruitA.position.y + fruitB.position.y) / 2];
          const type = fruitA.fruitType + 1;
          Composite.remove(this.engine.world, [fruitA, fruitB]);
          this.setComposeFruit(type, ...position);
        }
      }
    });
  }

  setNewFruit() {
    this.fruit = new Fruit(this.gameTurn < 5 ? this.gameTurn : Math.floor(Math.random() * 5));
    this.fruit.refresh();
    this.fruit.show(this.engine.world);
    this.gameTurn += 1;
  }

  setComposeFruit(type, x, y) {
    const newFruit = new Fruit(type, x, y);
    newFruit.show(this.engine.world);
  }

  endGame() {
    this.active = false;
    const line = Bodies.rectangle(240, 98, 480, 4, { isStatic: true, render: { fillStyle: 'rgb(256, 0, 0)' } });
    Composite.add(this.engine.world, [line]);
    setTimeout(() => {
      Composite.remove(this.engine.world, [line]);
      this.start();
    }, 2000);
  }
}

