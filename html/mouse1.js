const canvas1 = document.getElementsByTagName("canvas")[0];

const ctx1 = canvas1.getContext("2d");

canvas1.width = window.innerWidth;
canvas1.height = window.innerHeight;
function start() {
  function Particle(x, y, radius, color, velocity, ttl) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.ttl = 30;

    this.draw = () => {
      ctx1.beginPath();
      ctx1.arc(this.x, this.y, this.radius, Math.PI * 2, false);
      ctx1.fillStyle = this.color;
      ctx1.fill();

      ctx.closePath();
    };

    this.update = () => {
      this.draw();
      this.ttl--;
      this.x += this.velocity.x;
      this.y += this.velocity.y;
    };
  }

  const mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };
  function render() {
    setTimeout(render, 10);
    for (let i = 0; i <= 40; i++) {
      const radius = (Math.PI * 2) / 40;
      const velocity = {
        x: Math.cos(radius * i),
        y: Math.sin(radius * i),
      };
      particles.push(new Particle(mouse.x, mouse.y, 3, "#330033", velocity));
    }
  }
  let particles;
  particles = [];

  //const particles = new Particle(100, 100, 40, "red");

  function animate() {
    requestAnimationFrame(animate);

    // ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx1.fillStyle = "rgba(0,0,0,0.05)";
    ctx1.fillRect(0, 0, canvas1.width, canvas1.height);

    //  particles.forEach(item => console.log(item))

    particles.forEach((item, index) => {
      if (item.ttl == 0) {
        particles.splice(index, 1);
      }
      item.update();
    });
  }

  render();
  animate();
  window.addEventListener("mousemove", function (event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
  });
}
