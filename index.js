let pencilColor = "#1a3aed";
let canvasBgColor = "#fafcfc";
let eraser = false;
let lineWidth = 5;
let lineCap = "round";

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);

// set default colors for pencil and canvas bg
document.querySelector(`#pencil-color-picker`).setAttribute("value", pencilColor);
document.querySelector(`#canvas-color-picker`).setAttribute("value", canvasBgColor);

let canvas = document.getElementById("canvas");
let canvasContainer = document.getElementById("canvas-container");
const eraserCircle = document.getElementById("eraser");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
const canvasCtx = canvas.getContext("2d");
canvasCtx.fillStyle = canvasBgColor;
canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
const position = { x: 0, y: 0 };

document.addEventListener("mousedown", setPosition);
document.addEventListener("mouseenter", setPosition);
document.addEventListener("mousemove", draw);

// resize the canvas when we resize the window
const handleResize = () => {
  const { clientHeight } = canvasContainer;
  canvas.style.height = `${clientHeight - 0.1}px`;
  canvas.style.width = `${window.innerWidth - 16.1}px`;
};

handleResize();
window.addEventListener("resize", handleResize);

// set the postiton of current pencil
function setPosition(e) {
  var rect = canvas.getBoundingClientRect();
  (position.x = ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width),
    (position.y = ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height);
}

// set pencil / canvas bg colors
function setCanvasOrPencilColor(event, element) {
  const { value } = event.target;
  if (element === "pencil") {
    pencilColor = value;
  } else {
    canvasBgColor = value;
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvasCtx.fillStyle = canvasBgColor;
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

// fires when we start drawing
function draw(e) {
  if (!isMobile && e.buttons !== 1) return;
  if (isMobile) return alert("hey");
  canvasCtx.beginPath();
  canvasCtx.lineCap = "round";
  canvasCtx.lineWidth = lineWidth;
  canvasCtx.strokeStyle = pencilColor;
  canvasCtx.moveTo(position.x, position.y);
  setPosition(e);
  canvasCtx.lineTo(position.x, position.y);
  canvasCtx.closePath();
  canvasCtx.stroke();
}

// clears the canvas
function clearCanvas() {
  canvasCtx.reset();
  canvasCtx.fillStyle = canvasBgColor;
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
}

// download drawing
function download() {
  const imgName = prompt("Save as", "paint");
  if (imgName === null) return;
  let data = canvas.toDataURL("image/jpeg");
  let img = document.createElement("img");
  img.src = data;
  let a = document.createElement("a");
  a.setAttribute("download", `${imgName || "paint"}.png`);
  a.setAttribute("href", data);
  a.appendChild(img);
  a.click();
}

// activate erasse
function activateEraser() {
  tempColor = pencilColor;
  eraserCircle.style.display = eraserCircle.style.display === "" ? "block" : "";
  eraser = !eraser;
}

// move eraser
function moveEraser() {
  canvas.onmousemove = (e) => {
    if (!eraser) {
      canvas.style.cursor = "crosshair";
      return;
    }
    canvas.style.cursor = "none";
    eraserCircle.style.top = e.clientY + "px";
    eraserCircle.style.left = e.clientX + "px";
  };

  canvas.onmousedown = () => {
    if (!eraser) return;
    pencilColor = canvasBgColor;
  };
  canvas.onmouseup = () => {
    if (!eraser) return;
    lineCap = "round";
    pencilColor = tempColor;
  };
}

// increase/decrease pencil size
function handleBrushSizeChange(op) {
  if (op === "-") {
    lineWidth = lineWidth > 1 ? lineWidth - 1 : lineWidth;
  } else if (op === "+") {
    lineWidth = lineWidth < 20 ? lineWidth + 1 : lineWidth;
  }
}
