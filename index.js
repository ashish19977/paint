let pencilColor = "#1a3aed";
let canvasBgColor = "#fafcfc";
let eraser = false;
let lineWidth = 2;
let lineCap = "round";

document.addEventListener("mousedown", setPosition);
document.addEventListener("mouseenter", setPosition);
document.addEventListener("mousemove", draw);

let canvas = document.getElementById("canvas");
const eraserCircle = document.getElementById("eraser");
document.querySelector(`#pencil-color-picker`).setAttribute("value", pencilColor);
document.querySelector(`#canvas-color-picker`).setAttribute("value", canvasBgColor);

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
const canvasCtx = canvas.getContext("2d");
canvasCtx.fillStyle = canvasBgColor;
canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
const position = { x: 0, y: 0 };

function setPosition(e) {
  var rect = canvas.getBoundingClientRect();
  (position.x = ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width),
    (position.y = ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height);
}

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

function draw(e) {
  if (e.buttons !== 1) return;
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

function clearCanvas() {
  canvasCtx.reset();
  canvasCtx.fillStyle = canvasBgColor;
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
}

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

function activateEraser() {
  tempColor = pencilColor;
  eraserCircle.style.display = eraserCircle.style.display === "" ? "block" : "";
  eraser = !eraser;
}

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
    lineCap = "square";
    lineWidth = 10;
    pencilColor = canvasBgColor;
  };
  canvas.onmouseup = () => {
    if (!eraser) return;
    lineCap = "round";
    lineWidth = 2;
    pencilColor = tempColor;
  };
}
