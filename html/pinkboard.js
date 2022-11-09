/*
      
       * Settings
      
       */

var settings = {
  particles: {
    length: 3500,

    duration: 3,

    velocity: 55, // kich thuoc
    // toa hay khong thi xuong kia

    effect: -0.5,
    // do doi, doi qua thi vo
    // viet them functino o day cho mau me ma luoi

    size: 25,
  },
};

/*
        
         * Point class
        
         */

var x = 0;
var y = 0;
var Point = (function () {
  function Point(x, y) {
    this.x = x;

    this.y = y;
  }

  Point.prototype.clone = function () {
    return new Point(this.x, this.y);
  };

  Point.prototype.length = function (length) {
    if (typeof length == "undefined")
      return Math.sqrt(this.x * this.x + this.y * this.y);

    this.normalize();

    this.x *= length;

    this.y *= length;

    return this;
  };

  Point.prototype.normalize = function () {
    var length = this.length();

    this.x /= length;

    this.y /= length;

    return this;
  };

  return Point;
})();

var Particle = (function () {
  function Particle() {
    this.position = new Point();

    this.velocity = new Point();

    this.acceleration = new Point();

    this.age = 0;
  }

  Particle.prototype.initialize = function (x, y, dx, dy) {
    this.position.x = x;

    this.position.y = y;

    this.velocity.x = dx;

    this.velocity.y = dy;

    this.acceleration.x = dx * settings.particles.effect;

    this.acceleration.y = dy * settings.particles.effect;

    this.age = 0;
  };

  Particle.prototype.update = function (deltaTime) {
    this.position.x += this.velocity.x * 7 * deltaTime;

    this.position.y += this.velocity.y * 7 * deltaTime;

    this.velocity.x += this.acceleration.x * 2 * deltaTime;

    this.velocity.y += this.acceleration.y * 2 * deltaTime;

    this.age += deltaTime / 2;
  };

  // size 1 tim
  Particle.prototype.draw = function (context, image) {
    function ease(t) {
      return --t * t * t + 1;
    }

    var size = image.width * ease(this.age / settings.particles.duration);

    // opacioty
    context.globalAlpha = 0.9 - this.age;

    context.drawImage(
      image,
      this.position.x - size,
      this.position.y - size,
      size * 2,
      size * 2
    );
  };

  return Particle;
})();

var ParticlePool = (function () {
  var particles,
    firstActive = 0,
    firstFree = 0,
    duration = settings.particles.duration;

  function ParticlePool(length) {
    particles = new Array(length);

    for (var i = 0; i < particles.length; i++) particles[i] = new Particle();
  }

  // chinh sua so luong hat

  ParticlePool.prototype.add = function (x, y, dx, dy) {
    particles[firstFree].initialize(x, y, dx, dy);

    firstFree = firstFree + 1;

    if (firstFree == particles.length) firstFree = firstActive;

    if (firstActive == firstFree) firstActive = firstActive + 1;

    if (firstActive == particles.length) firstActive = 0;
  };

  ParticlePool.prototype.update = function (deltaTime) {
    var i;

    // cap nhat

    if (firstActive < firstFree) {
      for (i = firstActive; i < firstFree; i++) particles[i].update(deltaTime);
    }

    if (firstFree < firstActive) {
      for (i = firstActive; i < particles.length; i++)
        particles[i].update(deltaTime);

      for (i = 0; i < firstFree; i++) particles[i].update(deltaTime);
    }

    //xoa deo lien quanm

    while (particles[firstActive].age >= duration && firstActive != firstFree) {
      firstActive++;

      if (firstActive == particles.length) firstActive = 0;
    }
  };

  ParticlePool.prototype.draw = function (context, image) {
    if (firstActive < firstFree) {
      for (i = firstActive; i < firstFree; i++)
        particles[i].draw(context, image);
    }

    if (firstFree < firstActive) {
      for (i = firstActive; i < particles.length; i++)
        particles[i].draw(context, image);

      for (i = 0; i < firstFree; i++) particles[i].draw(context, image);
    }
  };

  return ParticlePool;
})();

// tim toa han khong toa thi o cho nay ne
// de ten thi chon khong toa * 2 leen
(function (canvas) {
  var context = canvas.getContext("2d"),
    particles = new ParticlePool(settings.particles.length),
    particleRate =
      (settings.particles.length / settings.particles.duration) * 1.5,
    time;

  // ve trai tim khuc nay

  function pointOnHeart(t) {
    return new Point(
      160 * Math.pow(Math.sin(t), 3),

      130 * Math.cos(t) -
        50 * Math.cos(2 * t) -
        20 * Math.cos(3 * t) -
        10 * Math.cos(4 * t) +
        25
    );
  }

  var image = (function () {
    var canvas = document.createElement("canvas"),
      context = canvas.getContext("2d");

    canvas.width = settings.particles.size;

    canvas.height = settings.particles.size;

    function to(t) {
      var point = pointOnHeart(t);

      point.x =
        settings.particles.size / 2 + (point.x * settings.particles.size) / 350;

      point.y =
        settings.particles.size / 2 - (point.y * settings.particles.size) / 350;

      return point;
    }

    context.beginPath();

    var t = -Math.PI;

    var point = to(t);

    context.moveTo(point.x, point.y);

    while (t < Math.PI) {
      t += 0.0001;

      point = to(t);

      context.lineTo(point.x, point.y);
    }

    context.closePath();

    context.fillStyle = "#AA0000";

    context.fill();

    var image = new Image();

    image.src = canvas.toDataURL();

    return image;
  })();

  function render() {
    requestAnimationFrame(render);

    // cho lon nay set time render ne di me
    var newTime = new Date().getTime() / 3000,
      deltaTime = newTime - (time || newTime);

    time = newTime;

    context.clearRect(0, 0, canvas.width, canvas.height);

    var amount = particleRate * deltaTime;

    for (var i = 0; i < amount; i++) {
      var pos = pointOnHeart(Math.PI * Math.PI * Math.random());

      var dir = pos.clone().length(settings.particles.velocity);

      particles.add(
        canvas.width / 2 + pos.x,
        canvas.height / 2 - pos.y,
        dir.x,
        -dir.y
      );
    }

    particles.update(deltaTime);

    particles.draw(context, image);
  }

  // size

  function onResize() {
    canvas.width = canvas.clientWidth;

    canvas.height = canvas.clientHeight;
  }

  window.onresize = onResize;

  // delay rendering bootstrap

  setTimeout(function () {
    onResize();

    render();
  }, 1);
})(document.getElementById("pinkboard"));
