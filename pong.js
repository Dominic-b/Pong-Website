var animate = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) { window.setTimeout(callback, 1000 / 60) };

var canvas = document.getElementById('myCanvas');
canvas.width = window.innerWidth / 1.33;
canvas.height = window.innerHeight / 1.33;

var width = canvas.width;
var height = canvas.height;
var context = canvas.getContext('2d');

window.onload = function () {
    document.body.appendChild(canvas);
    animate(step);
};

var step = function () {
    update();
    render();
    animate(step);
};

var update = function () {
};

var render = function () {
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, width, height);
};

function Paddle(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
}

Paddle.prototype.render = function () {
    context.fillStyle = "#000000";//sets the color of the paddles to black
    context.fillRect(this.x, this.y, this.width, this.height);
};

function Player() {
    this.paddle = new Paddle(0, (height / 2) - (height / 8), width / 100, height / 4);
}

function Computer() {
    this.paddle = new Paddle(width - 10, (height / 2) - (height / 8), width / 100, height / 4);
}

Player.prototype.render = function () {
    this.paddle.render();
};

Computer.prototype.render = function () {
    this.paddle.render();
};

function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = - width / 180;
    this.y_speed = 0;
    this.radius = width / 90;
}

Ball.prototype.render = function () {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    context.fillStyle = "#000000";
    context.fill();
};

var player = new Player();
var computer = new Computer();
var ball = new Ball(width / 2, height / 2);

var render = function () {
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, width, height);
    player.render();
    computer.render();
    ball.render();
};

var update = function () {
    ball.update();
};

Ball.prototype.update = function () {
    this.x += this.x_speed;
    this.y += this.y_speed;
};

var update = function () {
    ball.update(player.paddle, computer.paddle);
};

Ball.prototype.update = function (paddle1, paddle2) {
    this.x += this.x_speed;
    this.y += this.y_speed;

    if (this.y - this.radius < 0) { // hitting the top
        this.y = this.radius;
        this.y_speed = -this.y_speed;
    } else if (this.y + this.radius > height) { // hitting the bottom
        this.y = height - this.radius;
        this.y_speed = -this.y_speed;
    }

    if (this.x < this.radius || this.x > width - this.radius) { // a point was scored
        this.x_speed = - width / 180;
        this.y_speed = 0;
        this.x = width / 2;
        this.y = height / 2;
    }

    if (this.x - this.radius < paddle1.x + paddle1.width && this.y + this.radius > (paddle1.y) && this.y - this.radius < (paddle1.y + paddle1.height)) {
        this.y_speed += (paddle1.y_speed / 2);
        this.x_speed *= -1;
        this.x += this.x_speed; // make sure it is no longer colliding with the paddle
    } else if (this.x + this.radius > paddle2.x && this.y + this.radius > (paddle2.y) && this.y - this.radius < (paddle2.y + paddle2.height)) {
        this.y_speed += (paddle2.x_speed / 2);
        this.x_speed *= -1;
        this.x += this.x_speed;// make sure it is no longer colliding with the paddle
    }
};

var keysDown = {};

window.addEventListener("keydown", function (event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function (event) {
    delete keysDown[event.keyCode];
});

var update = function () {
    player.update();
    ball.update(player.paddle, computer.paddle);
};

Player.prototype.update = function () {
    for (var key in keysDown) {
        var value = Number(key);
        if (value == 38) { // up arrow
            this.paddle.move(0, - height / 120);
        } else if (value == 40) { // down arrow
            this.paddle.move(0, height / 120);
        }
    }
};

Paddle.prototype.move = function (x, y) {
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    if (this.y < 0) { // at the top
        this.y = 0;
        this.y_speed = 0;
    } else if (this.y + this.height > height) { // at the bottom
        this.y = height - this.height;
        this.y_speed = 0;
    }
}

var update = function () {
    player.update();
    computer.update(ball);
    ball.update(player.paddle, computer.paddle);
};

Computer.prototype.update = function (ball) {
    var diff = -(this.paddle.y + (this.paddle.height / 2) - ball.y);
    if (diff < - height / 120) {
        diff = - height / 120;
    } else if (diff > height / 120) {
        diff = height / 120;
    }
    this.paddle.move(0, diff);
    if (this.paddle.y < 0) {
        this.paddle.y = 0;
    } else if (this.paddle.y + this.paddle.height > height) {
        this.paddle.y = height - this.paddle.height;
    }
};
