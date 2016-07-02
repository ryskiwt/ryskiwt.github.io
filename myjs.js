/* global $, Vue, moment, Synclock */

// Synclockを生成する
var synclock = new Synclock({
  el: "#synclock"
})


// ゲージを初期化
var bgcanvas = document.getElementById("background");
var bgctx = bgcanvas.getContext("2d");
var x = bgcanvas.width/2;
var y = bgcanvas.height/2;
bgctx.translate(x,y);
bgctx.rotate( Math.PI )
for (var i=0; i<100; i++) {
  bgctx.rotate( Math.PI *2 /100 )
  bgctx.strokeStyle = "lightgray";
  bgctx.beginPath();
  bgctx.moveTo(0, x*0.8);
  bgctx.lineTo(0, x*0.9);
  bgctx.stroke();
}
for (var i=0; i<10; i++) {
  bgctx.rotate( Math.PI *2 /10 )
  bgctx.lineWidth = 5
  bgctx.strokeStyle = "lightgray";
  bgctx.beginPath();
  bgctx.moveTo(0, x*0.8);
  bgctx.lineTo(0, x);
  bgctx.stroke();
}


// ゲージの更新
var canvas = document.getElementById("gauge");
var ctx = canvas.getContext("2d");
ctx.translate(x,y);
(function update() {
  ctx.clearRect(-x, -y, x*2, y*2);
  ctx.save();
  ctx.rotate( Math.PI *2 *(0.5+ synclock.synctime.millisecond()/1000 ) )
  ctx.lineWidth = 10;
  bgctx.strokeStyle = "#2C3E50";
  ctx.beginPath();
  ctx.moveTo(0, x*0.8);
  ctx.lineTo(0, x);
  ctx.stroke();
  ctx.restore();

  setTimeout(update, 50)
})();
