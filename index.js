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

canvas.addEventListener("mousedown", setPosition);
canvas.addEventListener("mouseenter", setPosition);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseover", moveEraser);

// mob
canvas.addEventListener("touchstart", setPosition);
canvas.addEventListener("touchmove", (e) => {
  if (eraser) return moveEraser(e);
  draw(e);
});

// resize the canvas when we resize the window
const handleResize = () => {
  const { clientHeight } = canvasContainer;
  canvas.style.height = `${clientHeight - 0.1}px`;
  canvas.style.width = `${window.innerWidth - 16.1}px`;
};

handleResize();
window.addEventListener("resize", handleResize);

const getClientXY = (e) => {
  const ele = isMobile ? e?.touches?.[0] : e;
  return ele ? { clientX: ele.clientX, clientY: ele.clientY } : {};
};

// set the postiton of current pencil
function setPosition(e) {
  const { clientX, clientY } = getClientXY(e);
  var rect = canvas.getBoundingClientRect();
  (position.x = ((clientX - rect.left) / (rect.right - rect.left)) * canvas.width),
    (position.y = ((clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height);
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
  const onMove = (e) => {
    if (!eraser) {
      canvas.style.cursor = "crosshair";
      return;
    }
    canvas.style.cursor = "none";
    const { clientX, clientY } = getClientXY(e);
    eraserCircle.style.top = clientY + "px";
    eraserCircle.style.left = clientX + "px";
    draw(e);
  };
  // web
  canvas.addEventListener("mousemove", onMove);
  canvas.addEventListener("touchmove", onMove);

  // on web mouse down
  const onDown = (e) => {
    if (!eraser) return;
    pencilColor = canvasBgColor;
  };
  canvas.addEventListener("mousedown", onDown);
  canvas.addEventListener("touchstart", onDown);

  // on web mouse up or web touch end
  const onUp = (e) => {
    if (!eraser) return;
    lineCap = "round";
    pencilColor = tempColor;
  };
  canvas.addEventListener("mouseup", onUp);
  canvas.addEventListener("touchend", onUp);
}

// increase/decrease pencil size
function handleBrushSizeChange(op) {
  if (op === "-") {
    lineWidth = lineWidth > 1 ? lineWidth - 1 : lineWidth;
  } else if (op === "+") {
    lineWidth = lineWidth < 20 ? lineWidth + 1 : lineWidth;
  }
}
