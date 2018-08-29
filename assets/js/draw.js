var ctx,
  flag = false,
  prevX = 0,
  currX = 0,
  prevY = 0,
  currY = 0,
  dot_flag = false;

var lineColor = "#c02702",
  lineWidth = 4;

const canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
w = canvas.width;
h = canvas.height;

// @TODO set to size on load
canvas.setAttribute("width", "700");
canvas.setAttribute("height", "540");

canvas.addEventListener(
  "mousemove",
  function(e) {
    findxy("move", e);
  },
  false
);
canvas.addEventListener(
  "mousedown",
  function(e) {
    findxy("down", e);
  },
  false
);
canvas.addEventListener(
  "mouseup",
  function(e) {
    findxy("up", e);
  },
  false
);
canvas.addEventListener(
  "mouseout",
  function(e) {
    findxy("out", e);
  },
  false
);

function draw() {
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(currX, currY);
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
  ctx.closePath();
}

function erase() {
  var m = confirm("Want to clear");
  if (m) {
    ctx.clearRect(0, 0, w, h);
    document.getElementById("canvasimg").style.display = "none";
  }
}

function save() {
  document.getElementById("canvasimg").style.border = "2px solid";
  var dataURL = canvas.toDataURL();
  document.getElementById("canvasimg").src = dataURL;
  document.getElementById("canvasimg").style.display = "inline";
}

function findxy(res, e) {
  if (res == "down") {
    prevX = currX;
    prevY = currY;

    const offsets = canvas.getBoundingClientRect();
    currX = e.clientX - offsets.x;
    currY = e.clientY - offsets.y;

    flag = true;
    dot_flag = true;
    if (dot_flag) {
      ctx.beginPath();
      ctx.fillStyle = lineColor;
      ctx.fillRect(currX, currY, 2, 2);
      ctx.closePath();
      dot_flag = false;
    }
  }
  if (res == "up" || res == "out") {
    flag = false;
  }
  if (res == "move") {
    if (flag) {
      prevX = currX;
      prevY = currY;

      const offsets = canvas.getBoundingClientRect();
      currX = e.clientX - offsets.x;
      currY = e.clientY - offsets.y;

      draw();
    }
  }
}
