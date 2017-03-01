// LICENSE : MIT
"use strict";
function loadImage(imagePath) {
    return new Promise(function(resolve, reject) {
        var img = new Image();
        img.addEventListener('load', function() {
            resolve(img);
        });
        img.src = imagePath;
    });
}
// http://jsdo.it/tam0927/AqQn
function roundRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x, y + r);
    ctx.lineTo(x, y + h - r);
    ctx.quadraticCurveTo(x, y + h, x + r, y + h);
    ctx.lineTo(x + w - r, y + h);
    ctx.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
    ctx.lineTo(x + w, y + r);
    ctx.quadraticCurveTo(x + w, y, x + w - r, y);
    ctx.lineTo(x + r, y);
    ctx.quadraticCurveTo(x, y, x, y + r);
}

var offset = {
    x: 270,
    y: 30
};
var size = {
    width: 365,
    height: 300
};
// 吹き出しの> position
var fukidashi = {
    x: offset.x + size.width + 100,
    y: offset.y + 140
};
function drawFukidashi(ctx) {
    ctx.shadowBlur = 8.0;
    ctx.shadowOffsetX = 1.0;
    ctx.shadowOffsetY = 1.0;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    roundRect(ctx, offset.x, offset.y, size.width, size.height, 12);
    ctx.moveTo(fukidashi.x, fukidashi.y);
    ctx.lineTo(offset.x + size.width, offset.y + 80);
    ctx.lineTo(offset.x + size.width, offset.y + 120);
    ctx.closePath();
    ctx.fill();
}
function wrapText(ctx, text) {
    var margin = 10;
    var x = offset.x + margin, y = offset.y * 2, maxWidth = size.width - margin, lineHeight = 25;
    var words = text.split('');
    var line = '';
    ctx.font = "24px 'Monotype Corsiva'";
    ctx.fillStyle = '#000';
    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = ctx.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}
function draw(ctx, size, text) {
    loadImage("./resources/yosuke_furukawa.jpg").then(function(image) {
        ctx.clearRect(0, 0, size.width, size.height);
        ctx.drawImage(image, 0, 0, size.width, size.height);
        drawFukidashi(ctx);
        wrapText(ctx, text);
    });
}

function main() {
    var canvasSize = {
        width: 1280,
        height: 640
    };
    var textarea = document.querySelector("#js-textarea");
    textarea.addEventListener("input", function(event) {
        var text = event.target.value;
        draw(ctx, canvasSize, text);
    });
    var canvas = document.querySelector("#js-canvas");
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    var ctx = canvas.getContext('2d');
    draw(ctx, canvasSize, textarea.value);
    canvas.addEventListener("click", function(event) {
        event.currentTarget.toBlob(function(blob) {
            var a = document.createElement("a");
            a.download = "yosuke_furukawa.png";
            a.href = URL.createObjectURL(blob);
            a.click();
            URL.revokeObjectURL(blob);
        }, "image/png", 0.9);
    });
}
window.onload = function() {
    main();
};
