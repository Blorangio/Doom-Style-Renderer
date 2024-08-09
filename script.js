let mainCanvas = document.getElementById("mainCanvas");

//To center the canvas (known width and height are 1600 and 900 respectively)
mainCanvas.style.marginLeft = (window.innerWidth - 1600) / 2 + "px";
mainCanvas.style.marginTop = (window.innerHeight - 900) / 2 + "px";

//Define graphics component
let paint = mainCanvas.getContext("2d");