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
    x: 300,
    y: 40
};
var fukidashi_size = {
    width: 260,
    height: 245
};
// 吹き出しの> position
var fukidashi = {
    x: offset.x + fukidashi_size.width + 10,
    y: offset.y + 150
};

function drawFukidashi(ctx) {
    ctx.shadowBlur = 8.0;
    ctx.shadowOffsetX = 1.0;
    ctx.shadowOffsetY = 1.0;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.fillStyle = '#FFF';
    ctx.beginPath();
    roundRect(ctx, offset.x, offset.y, fukidashi_size.width, fukidashi_size.height, 12);
    ctx.moveTo(fukidashi.x, fukidashi.y);
    ctx.lineTo(offset.x + fukidashi_size.width, offset.y + 80);
    ctx.lineTo(offset.x + fukidashi_size.width, offset.y + 120);
    ctx.closePath();
    ctx.fill();
}

function wrapText(ctx, text) {
    var marginLeft = 60;
    var marginRight = 80;
    var x = offset.x + marginLeft;
    var y = offset.y * 2;
    var maxWidth = fukidashi_size.width - marginRight;
    var lineHeight = 25;
    var words = text.split('');
    var line = '';
    ctx.font = "14px 'Monotype Corsiva'";
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
    var fukidashi = loadImage("./resources/fukidashi.png");
    var yousuke_furukawa = loadImage("./resources/yousuke_furukawa_2.jpg");
    Promise.all([fukidashi, yousuke_furukawa]).then(function(images) {
        var fukidashiImage = images[0];
        var yousuke_furukawaImage = images[1];
        ctx.clearRect(0, 0, size.width, size.height);

        ctx.beginPath();
        var grad = ctx.createLinearGradient(0, 0, size.width, size.height);
        grad.addColorStop(0, '#F6F3F5');
        grad.addColorStop(1, '#F6F3F5');
        ctx.fillStyle = grad;
        ctx.rect(0, 0, size.width, 150);
        ctx.fill();
        ctx.drawImage(yousuke_furukawaImage, 0, 150, 720, 450);
        var fukidash = {
            x: 300,
            y: 0
        };
        ctx.drawImage(fukidashiImage, fukidash.x, fukidash.y, fukidashi_size.width, fukidashi_size.height);
        wrapText(ctx, text);
    });
}

function main() {
    var canvasSize = {
        width: 720,
        height: 150 + 450
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
