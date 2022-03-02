
document.body.style.margin = '0px';
document.body.style.overflow = 'hidden';


var raf = function (x) { window.setTimeout(x, 1000 / 60); }
if (window.requestAnimationFrame) raf = window.requestAnimationFrame;       // Firefox 23 / IE 10 / Chrome / Safari 7 (incl. iOS)
else if (window.mozRequestAnimationFrame) raf = window.mozRequestAnimationFrame;    // Firefox < 23
else if (window.webkitRequestAnimationFrame) raf = window.webkitRequestAnimationFrame; // Older versions of Safari / Chrome



var game = {};
game.ended = false;
game.div = document.createElement('div');
game.div.style.cursor = 'pointer';
game.div.style.overflow = 'hidden';
game.div.style.position = 'relative';
game.div.style.width = '100%';
game.div.style.height = '100%';
document.body.appendChild(game.div);

var deathflash = document.createElement('div');
deathflash.style.background = '#FF0000';
deathflash.style.width = '100%';
deathflash.style.height = '100%';
deathflash.style.left = '0px';
deathflash.style.top = '0px';
deathflash.style.position = 'absolute';
deathflash.style.display = 'none';
deathflash.innerHTML = '&nbsp;';
game.div.appendChild(deathflash);



var cell_size = 88;





var resize = function () {
 ww = Math.ceil(window.innerWidth);
 hh = Math.ceil(window.innerHeight);
 
 if (hh > ww) {
  parody.div.innerHTML = 'If you are having trouble playing on your phone, try turning it sideways to landscape mode!';//This website is a parody and is not affiliated with Flappy Bird or .GEARS Studios';
 } else {
  parody.div.innerHTML = '';
 }
 
 var fblikebox = document.getElementById('fblikebox');
 var googbox = document.getElementById('googbox');
 if (fblikebox) {
  if (hh < 710) {
   fblikebox.style.right = '178px';
   if (googbox) {
    googbox.style.bottom = '5px';
    googbox.style.top = 'auto';
   }
  } else {
   fblikebox.style.right = '8px';
   if (googbox) {
    googbox.style.top = '5px';
    googbox.style.bottom = 'auto';
   }
  }
 }
 
 game.div.style.width = ww+'px';
 game.div.style.height = hh+'px';
 
 game.bg.style.width = ww+'px';
 game.bg.style.height = hh+'px';
 /*
 game.canvas.width = ww;
 game.canvas.height = hh;
 game.ctx.fillStyle = '#faf8ef';
 game.ctx.fillRect(0, 0, ww, hh);
 */
 
 ground.canvas.width = ww + 96;
 ground.canvas.height = 88;
 ground.ctx.fillStyle = '#bab8af';
 ground.ctx.fillRect(0, 0, ww + 96, 88);
 var gx = 0;
 while (gx < (ww + 256)) {
  try {
   ground.ctx.drawImage(ground.bit, gx, 0);
  } catch (e) {
   
  }
  gx += 48;
 }
 ground.x = 0;
 ground.canvas.style.left = '0px';
 ground.canvas.style.top = (hh - 88)+'px';
 
 
 logo.reposition();
 gameover.reposition();
 c2s.reposition();
 sndo.reposition();
 playagain.reposition();
 
 
 parody.div.style.left = '16px';//Math.round((ww - 500)/2)+'px';
 parody.div.style.top = '16px';

 

 for (var i = 0; i<scpts.length; i++) {
  var scpt = scpts[i];
  xx = scpt.x;
  yy = scpt.y;
  var div = score.divs[i];
  div.style.left = Math.round(xx + (ww - 300)/2)+'px';
  div.style.top = (yy + 10)+'px';
 }
 
 

 
}

var want_image_count = 0;
var loadGameImage = function (n) {
 want_image_count++;
 var o = document.createElement('img');
 o.onload = function () {
  want_image_count--;
  if ((want_image_count == 0) && (want_sound_count == 0)) {
   gameLoaded();
  }
 }
 o.src = n;
 return o;
}

//var sounds_playing = [];
var want_sound_count = 0;
var loadGameSound = function (n, chc) { // file name, channel count
 var o = {};
 
 o.channels = [];
 o.channel_pos = 0;
 o.chc = chc;
 
 o.play = function () {
  if (!sndo.has_sound) {
   return;
  }
  var tm = new Date().getTime();
  var sc = this.channels.length;
  var got_good_sound = false;
  var ch;
  for (var i = sc; i>=0; i--) {
   this.channel_pos++;
   if (this.channel_pos >= this.channels.length) {
    this.channel_pos = 0;
   }
   var ch = this.channels[this.channel_pos];
   got_good_sound = true;
   break;
  }
  if (ch && ch.sound && got_good_sound) {
   ch.sound.play();
  }
 }
 
 
 for (var i = 0; i<chc; i++) {
  var ao = document.createElement("audio");
  var sch = {};
  sch.sound = ao;
  sch.can_play = true;
  o.channels.push(sch);
  ao.src = n;
  ao.type = "audio/wav";
  document.body.appendChild(ao);
 }
 return o;
}

var game_loaded = false;
var gameLoaded = function () {
 game.div.appendChild(game.bg);
 game.div.appendChild(ground.canvas);
 game.div.appendChild(logo.img);
 game.div.appendChild(gameover.img);
 document.body.appendChild(playagain.img);
 game.div.appendChild(c2s.img);
 game.div.appendChild(sndo.div);
 game.div.appendChild(parody.div);
 for (var i = score.divs.length-1; i>=0; i--) {
  game.div.appendChild(score.divs[i]);
 }
 game.div.appendChild(bird.div);
 game_loaded = true;
 resize();
 raf(oef);
 oef();
 
 
 document.body.onmousedown = function (e) {
  doFlap();
  e.preventDefault();
 }
 
 document.body.addEventListener('touchstart', function(e){
  doFlap();
  e.preventDefault();
 }, false);
 
 document.body.onkeydown = function (e) {
  if (e.keyCode == 32) {
   doFlap();
   e.preventDefault();
  }
 }
 
 bird.setValue(1);
 
}




var last_flap_tm = 0;
var doFlap = function () {
 if (game.ended) { // then we have to set ended=false with the play again button
  return false;
 }
 if (!game.started) {
  fr = 0;
  wgfr = 0;
  nbfr = fnbfr = 100;
  points = 0;
  score.update();

  for (var i = walls.length-1; i>=0; i--) {
   var wall = walls[i];
   var cells = wall.cells;
   for (var j = cells.length-1; j>=0; j--) {
    game.div.removeChild(cells[j].div);
   }
  }
  walls = [];
  
  doubling = false;
  doubling_cell = null;
  
  bird.stuck_on_bottom = false;
  bird.stuck_on_top = false;
  bird.setValue(1);
  bird.dsz = 0;
  bird.ww = cell_size;// + 150;
  bird.div.style.width = bird.ww+'px';
  game.cur_wall_val = 1; // 1;
  game.started = true;
  wall_fr_gap = wall_fr_start_gap;
  bird.reset();
  logo.showing = false;
  logo.hiding = true;
  gameover.showing = false;
  gameover.hiding = true;
  c2s.showing = false;
  c2s.hiding = true;
  playagain.showing = false;
  playagain.hiding = true;
  parody.div.style.display = 'none';
  points = 0;
  score.update();
 }
 var ctm = new Date().getTime();
 var tslc = 1 - Math.min(1, Math.max(0, (ctm - last_flap_tm) / 666));
 last_flap_tm = ctm;
 bird.vy = -8 - 5*tslc;
 bird.dang = -.5;
 flap.play();
 wing.vfr = 2;
}





var ww = 768;
var hh = 920;







var flap = loadGameSound('flap.wav', 3);

var coin = loadGameSound('coin.wav', 1);

var punch = loadGameSound('punch.wav', 1);





/*
game.canvas = document.createElement('canvas');
game.canvas.width = ww;
game.canvas.height = hh;
game.ctx = game.canvas.getContext('2d');


game.ctx.fillStyle = '#71c5cf';
game.ctx.fillRect(0, 0, ww, hh);
*/


game.bg = document.createElement('div');
game.bg.style.width = ww+'px';
game.bg.style.height = hh+'px';
game.bg.style.background = '#faf8ef';

game.started = false;




var wing = {};

wing.fr = 0;
wing.vfr = 0;

wing.img = loadGameImage('wing.png'); // 150 x 131
wing.canvas = document.createElement('canvas');
wing.canvas.width = 150;
wing.canvas.height = 131;
wing.ctx = wing.canvas.getContext('2d');

wing.canvas2 = document.createElement('canvas');
wing.canvas2.width = 150;
wing.canvas2.height = 131;
wing.ctx2 = wing.canvas2.getContext('2d');






var wingfill = {};

wingfill.img = loadGameImage('wingfill.png'); // 150 x 131
wingfill.canvas = document.createElement('canvas');
wingfill.canvas.width = 150;
wingfill.canvas.height = 131;
wingfill.ctx = wingfill.canvas.getContext('2d');





var logo = {};
logo.a = -.2;
logo.fr = 0;
logo.showing = true;
logo.hiding = false;
logo.img = loadGameImage('logo.png'); // 626 x 188
logo.img.style.position = 'absolute';
logo.img.style.opacity = 0;
logo.img.style.zIndex = '42069';
logo.reposition = function () {
 logo.img.style.left = Math.floor((ww-626)/2)+'px';
 logo.img.style.top = Math.floor(Math.cos(logo.fr/9)*20 + (hh - 188 - 88)/2)+'px';
}



var gameover = {};
gameover.a = -.2;
gameover.fr = 0;
gameover.showing = false;
gameover.hiding = true;
gameover.img = loadGameImage('gameover.png'); // 626 x 144
gameover.img.style.position = 'absolute';
gameover.img.style.opacity = 0;
gameover.img.style.zIndex = '42069';
gameover.reposition = function () {
 gameover.img.style.left = Math.floor((ww-626)/2)+'px';
 gameover.img.style.top = Math.floor(Math.cos(gameover.fr/32)*0 + (hh - 200 - 144 - 88)/2)+'px';
}
gameover.img.addEventListener('click', function () {
 game.ended = false;
 doFlap();
});
gameover.img.addEventListener('touchstart', function () {
 game.ended = false;
 doFlap();
});





var playagain = {}; //  252x71     592 x 80
playagain.a = -.2;
playagain.fr = 0;
playagain.showing = false;
playagain.hiding = true;
playagain.img = loadGameImage('playagain.png');
playagain.img.style.border = '0px';
playagain.img.style.cursor = 'pointer';
playagain.img.border = 0;
playagain.img.style.position = 'absolute';
playagain.img.style.display = 'none';
playagain.img.style.opacity = 0;
playagain.img.style.zIndex = '142068';
playagain.reposition = function () {
 playagain.img.style.left = Math.floor((ww-252)/2)+'px';
 playagain.img.style.top = Math.floor(Math.cos(playagain.fr/14)*5 + (hh + 320 + 71 - 88)/2)+'px';
}
playagain.img.addEventListener('click', function () {
 game.ended = false;
 doFlap();
});
playagain.img.addEventListener('touchstart', function () {
 game.ended = false;
 doFlap();
});





var c2s = {};
c2s.a = -1;
c2s.showing = true;
c2s.hiding = false;
c2s.img = loadGameImage('clicktostart.png'); // 337 x 75
c2s.img.style.position = 'absolute';
c2s.img.style.opacity = 0;
c2s.img.style.zIndex = '42070';
c2s.reposition = function () {
 c2s.img.style.left = Math.floor((ww-337)/2)+'px';
 c2s.img.style.top = Math.floor((hh + 250)/2)+'px';
}



var sndo = {};
sndo.showing = true;
sndo.hiding = false;
if (localStorage.sound === undefined) {
  localStorage.sound = 'true';
}
sndo.has_sound = localStorage.sound === 'true';
sndo.div = document.createElement('div');
sndo.div.style.backgroundImage = 'url("soundoff.png")';
sndo.div.style.position = 'absolute';
sndo.div.style.width = '64px';
sndo.div.style.height = '64px';
sndo.div.innerHTML = '&nbsp;';
sndo.div.style.zIndex = '144070';
sndo.reposition = function () {
  sndo.div.style.left = '6px';
  sndo.div.style.top = Math.floor(hh - 70)+'px';
}
var sndoOnClick = function () {
  if (sndo.has_sound) {
    sndo.div.style.backgroundPosition = '-64px 0px';
    sndo.has_sound = false;
    localStorage.sound = 'false';
  } else {
    sndo.div.style.backgroundPosition = '0px 0px';
    sndo.has_sound = true;
    localStorage.sound = 'true';
  }
}
sndo.div.addEventListener('click', sndoOnClick);
if (sndo.has_sound) {
  sndo.div.style.backgroundPosition = '0px 0px';
} else {
  sndo.div.style.backgroundPosition = '-64px 0px';
}
sndo.div.addEventListener('touchstart', function () {
 if (sndo.has_sound) {
  sndo.div.style.backgroundPosition = '-64px 0px';
  sndo.has_sound = false;
 } else {
  sndo.div.style.backgroundPosition = '0px 0px';
  sndo.has_sound = true;
 }
});





var parody = {};
parody.div = document.createElement('div');
parody.div.style.width = '500px';
parody.div.style.height = '200px';
parody.div.style.position = 'absolute';
parody.div.style.textAlign = 'left';
parody.div.style.fontFamily = 'Verdana';
parody.div.style.fontSize = '24px';
parody.div.style.fontWeight = 'bold';
parody.div.style.zIndex = 87654;






var points = 0;
var highscore = parseInt(localStorage.getItem('f2048hi')) | 0;


var scpts = [];
var rad = 4;
for (var xx = -rad; xx<=rad; xx++) {
 for (var yy = -rad; yy<=rad; yy++) {
  var d = Math.sqrt(xx*xx + yy*yy);
  if (d <= rad) {
   var o = {};
   o.x = xx;
   o.y = yy;
   scpts.push(o);
  }
 }
}


var score = {};

score.divs = [];
for (var i = 0; i<scpts.length; i++) {
 var scpt = scpts[i];
 xx = scpt.x;
 yy = scpt.y;
 var div = document.createElement('div');
 score.divs.push(div);

 div.style.width = '300px';
 div.style.height = '60px';
 div.style.position = 'absolute';
 div.style.textAlign = 'center';
 div.style.fontFamily = '"Clear Sans", "Helvetica Neue", Arial, sans-serif';
 div.style.fontWeight = 'bold';
 div.style.fontSize = '40px';
 div.style.color = '#faf8ef';
 div.style.zIndex = 88887;
 div.style['user-select'] = 'none';
 div.style['-webkit-user-select'] = 'none';
 div.style['-moz-user-select'] = 'none';
 div.style['-ms-user-select'] = 'none';
 div.style['-o-user-select'] = 'none';
 
 
   /*
   -webkit-user-select: none; // Chrome/Safari
   -moz-user-select: none; // Firefox
   -ms-user-select: none; // IE10+

   // Rules below not implemented in browsers yet
   -o-user-select: none;
   user-select: none;
   */
 if ((xx == 0) && (yy == 0)) {
  div.style.color = '#6c6c6c';
  div.style.zIndex = 88888;
 }

 div.innerHTML = '';
}
score.update = function () {
 for (var i = score.divs.length-1; i>=0; i--) {
  score.divs[i].innerHTML = points + ' / ' + highscore;
 }
}





var ground = {};

ground.canvas = document.createElement('canvas');
ground.canvas.style.position = 'absolute';
ground.canvas.style.zIndex = '31337';
ground.ctx = ground.canvas.getContext('2d');
ground.bit = loadGameImage('ground.png');



var vstrs = ['1'];
var getValueStr = function (num) {
 while (vstrs.length <= num) {
  var s = vstrs[vstrs.length - 1];
  var n = 0;
  var r = 0;
  var fs = '';
  for (var i = s.length-1; i>=0; i--) {
   n = Number(""+s.charAt(i));
   n *= 2;
   n += r;
   r = Math.floor(n/10);
   n -= r*10;
   fs = n + '' + fs;
  }
  if (r > 0) {
   fs = r + '' + fs;
  }
  vstrs.push(fs);
 }
 return vstrs[num-1];
}


var text_colors = ['606060', '606060', '606060', 'ffffff'];
var tile_colors = ['eeeeee', 'eae8e4', 'ede0c8', 'f2b179', 'f59563', 'f67c5f', 'f65e3b', 'edcf72', 'edcc61', 'edc850', 'edc53f', 'edc53f', '3c3a32'];
var tile_colors_2 = ['4c4c4c', '5c5c5c', '4c5c6c', '4c4c7c', '3c3c6c', '2c2c5c', '2c3c4c', '2c4c3c', '2c5c2c', '3c3a32'];// 'c050c0', '9050ff', '5090ff', '60b060', '40b0b0', 'b0b040', '3c3a32'];

function newCell () {
 var cell = {};
 cell.a = 1;
 cell.dsa = 1;
 cell.tn = null;
 cell.birdlock = .15;
 cell.x = 0;
 cell.y = 0;
 cell.vx = 0;
 cell.vy = 0;
 cell.dsz = 0;
 cell.ang = cell.dang = 0;
 cell.clfr = 0;
 var div = document.createElement('div');
 cell.div = div;
 div.style.left = cell.x+'px';
 div.style.top = cell.y+'px';
 div.style.width = cell_size+'px';
 div.style.height = cell_size+'px';
 div.style.lineHeight = cell_size+'px'; // for vertical align of text
 div.style.position = 'absolute';
 div.style.textAlign = 'center';
 div.style.fontFamily = '"Clear Sans", "Helvetica Neue", Arial, sans-serif';
 div.style.fontSize = '70px';
 div.style.color = '#606060';
 div.style.fontWeight = 'bold';
 div.style.marginTop = 'auto';
 div.style.marginBottom = 'auto';
 div.style.border = '12px solid #a0a0a0';
 div.style.borderRadius = '8px';
 div.style.zIndex = 311;
 div.className = 'cellol';
 div.unselectable = 'on';
 div.style.background = cell.background = '#'+tile_colors[0];
 cell.updatePos = function () {
  this.div.style.left = Math.round(this.x - 0*this.dsz/2)+'px';
  this.div.style.top = Math.round(this.y - 0*this.dsz/2)+'px';
 }
 cell.value = 1; // 1 = "1", 2 = "2", 3 = "4", 4 = "8", 5 = "16", 6 = "32", etc.
 cell.setValue = function (n) {
  this.value = n;
  var div = this.div;
  if (cell.tn != null) {
   div.removeChild(cell.tn);
   cell.tn = null;
  }
  if (n == 0) {
   div.innerHTML = '';
   div.style.background = this.background = '#a0a0a0';
   this.vs = ' ';
  } else {
   div.style.color = '#'+text_colors[Math.max(0, Math.min(text_colors.length-1, this.value-1))];
   var tci = this.value-1;
   var c;
   if (tci < 0) tci = 0;
   if (tci >= tile_colors.length) {
    //tci = 2 + ((this.value-1) % (tile_colors.length-3));
    tci -= tile_colors.length;
    tci %= tile_colors_2.length;
    c = tile_colors_2[tci];
   } else {
    c = tile_colors[tci];
   }
   if (this == bird) {
    wing.ctx.globalCompositeOperation = 'source-over';
    wing.ctx.clearRect(0, 0, 117, 131);
    wing.ctx2.fillStyle = '#'+c;
    wing.ctx2.fillRect(0, 0, 117, 131);
    wing.ctx.drawImage(wing.canvas2, 0, 0);
    wing.ctx.globalCompositeOperation = 'destination-atop';
    wing.ctx.drawImage(wingfill.img, 0, 0);
    wing.ctx.globalCompositeOperation = 'source-over';
    wing.ctx.drawImage(wing.img, 0, 0);
   }
   div.style.background = this.background = '#'+c;
   var s = getValueStr(this.value);
   this.vs = s;
   div.style.fontSize = Math.round(60 * Math.pow(9/(9 + Math.min(7, s.length)-1), 2.3))+'px';
   cell.tn = document.createTextNode(''+s);
   div.appendChild(cell.tn);
   //div.innerHTML = ''+s;
  }
 }
 cell.setValue(cell.value);
 return cell;
}


var wall_fr_start_gap = 150;
var wall_fr_gap = wall_fr_start_gap;
var vxr = 1;


var bird = newCell();
bird.wingdiv = document.createElement('div');
bird.wingdiv.style.position = 'absolute';
bird.wingdiv.style.left = '-70px';
bird.wingdiv.style.top = '-30px';
bird.wingdiv.style.width = '150px';
bird.wingdiv.style.height = '131px';
bird.div.appendChild(bird.wingdiv);
bird.reset = function () {
 this.x = 150;
 this.y = 150;
 this.vvy = 0;
}
bird.reset();
bird.div.style.zIndex = 666;
//bird.div.style.opacity = 1;
bird.wingdiv.appendChild(wing.canvas);
bird.updatePos();


var wall_cell_count = 24;

var walls = [];
var newWall = function (wall_val) {
 var wall = {};
 wall.clc = null;
 wall.cells = [];
 wall.x = ww + 32;
 wall.vx = -5 * vxr;
 wall.value = wall_val;
 var maxlen = 0;
 var cells = wall.cells;
 for (var i = 0; i<wall_cell_count; i++) {
  var cell = newCell();
  cell.x = wall.x;
  cell.sty = (i+1)*(cell_size + 14);
  cell.y = (hh-88) - cell.sty;
  cell.sy = cell.y;
  cell.vx = wall.vx;
  game.div.appendChild(cell.div);
  cells.push(cell);
  cell.setValue(wall_val);//Math.max(1, game.cur_wall_val + Math.floor(Math.random()*4) - 2));
  maxlen = Math.max(maxlen, cell.vs.length);
  if ((cell.y <= 0) && (cells.length >= 4)) {
   break;
  }
 }
 
 wall.ww = (cell_size + Math.max(0, 22 * (maxlen-6)));
 var right_value = wall_val;//+1;
 var vals = [];
 var v;
 v = wall_val - Math.round(cells.length/2);
 if (v <= 1) v = 1;
 for (var i = cells.length-1; i>=1; i--) {
  v++;
  if (v == wall_val) v += 2;
  //if (v == right_value) v++;
  vals.push(v);
 }
 
 var j = Math.floor(Math.random()*vals.length);
 v = vals[j];
 vals.splice(j, 1);
 cells[cells.length-1].setValue(v);

 var j = Math.floor(Math.random()*vals.length);
 v = vals[j];
 vals.splice(j, 1);
 cells[0].setValue(v);
 
 vals.push(right_value);
 for (var i = cells.length-2; i>=1; i--) {
  var j = Math.floor(Math.random()*vals.length);
  v = vals[j];
  vals.splice(j, 1);
  cells[i].setValue(v);//Math.max(1, game.cur_wall_val + Math.floor(Math.random()*4) - 2));
 }
 
 var clg = cells.length;
 for (var i = cells.length-1; i>=0; i--) { // clone the wall into itself to pad the vertical scrolling
  var cell = cells[i];
  
  var cell2 = newCell();
  cell2.x = wall.x;
  cell2.sty = cell.sty + clg*(cell_size + 14);
  cell2.y = (hh-88) - cell2.sty;
  cell2.sy = cell2.y;
  cell2.vx = wall.vx;
  game.div.appendChild(cell2.div);
  cells.push(cell2);
  cell2.setValue(cell.value);
 }
 
 for (var i = cells.length-1; i>=0; i--) {
  var cell = cells[i];
  cell.ww = wall.ww;
  cell.div.style.width = cell.ww+'px';
 }
 
 wall.kill = function () {
  for (var i = this.cells.length-1; i>=0; i--) {
   var cell = this.cells[i];
   game.div.removeChild(cell.div);
  }
  for (var j = walls.length-1; j>=0; j--) {
   if (walls[j] == this) {
    walls.splice(j, 1);
   }
  }
 }
 
 wall.vspeed = (wall_val/11 - 1) * .66;
 if (wall.vspeed > 1.5) wall.vspeed = 1.5;
 if (wall.vspeed < 0) wall.vspeed = 0;
 wall.dir = (wall_val%2 == 0)?(1):(-1);
 
 walls.push(wall);
 
 return wall;
}


var doubling = false;
var doubling_cell = null;

var fr = 0;
var wgfr = 0;
var ltm = 0;
var oef = function () {
 if (game_loaded) {
  var ftm = new Date().getTime();
  var tm;
  var tj = 0;
  while (ltm < ftm) {
   ltm += 20;
   tj++;
   if (tj > 10) { // we're way too many frames behind. just give up.
    ltm = ftm;
    break;
   }
   if (game.started) {
    fr++;
    wgfr++;
    ground.x -= 5*vxr;
    ground.x %= 48;
    if (ground.x > 0) ground.x -= 48;
    ground.canvas.style.left = ground.x+'px';
    
    wing.fr += .25;
    wing.fr += wing.vfr;
    wing.vfr *= .9;

    var deg = Math.cos(wing.fr/2)*23 + 15;
    deg = Math.round(deg*100)/100;
    var sc = 1;
    var div = wing.canvas;
    div.style.webkitTransform = 'rotate('+deg+'deg) scale('+sc+','+sc+')';
    div.style.mozTransform    = 'rotate('+deg+'deg) scale('+sc+','+sc+')';
    div.style.msTransform     = 'rotate('+deg+'deg) scale('+sc+','+sc+')';
    div.style.oTransform      = 'rotate('+deg+'deg) scale('+sc+','+sc+')';
    div.style.transform       = 'rotate('+deg+'deg) scale('+sc+','+sc+')';
   }
   
   if (logo.showing) {
    logo.a += .03;
    if (logo.a >= 1) {
     logo.a = 1;
     logo.showing = false;
    }
    logo.img.style.opacity = logo.a;
   }
   if (logo.hiding) {
    logo.a -= .05;
    if (logo.a <= 0) {
     logo.a = 0;
     logo.hiding = false;
    }
    logo.img.style.opacity = logo.a;
   }
   if (logo.a > 0) {
    logo.fr++;
    logo.reposition();
   }
   if (logo.a > .01) {
    if (!logo.visible) {
     logo.visible = true;
     logo.img.style.display = 'inline';
    }
   } else {
    if (logo.visible) {
     logo.visible = false;
     logo.img.style.display = 'none';
    }
   }
   
   if (gameover.showing) {
    gameover.a += .03;
    if (gameover.a >= 1) {
     gameover.a = 1;
     gameover.showing = false;
    }
    gameover.img.style.opacity = gameover.a;
   }
   if (gameover.hiding) {
    gameover.a -= .1;
    if (gameover.a <= 0) {
     gameover.a = 0;
     gameover.hiding = false;
    }
    gameover.img.style.opacity = gameover.a;
   }
   if (gameover.a > 0) {
    gameover.fr++;
    gameover.reposition();
   }
   if (gameover.a > .01) {
    if (!gameover.visible) {
     gameover.visible = true;
     gameover.img.style.display = 'inline';
    }
   } else {
    if (gameover.visible) {
     gameover.visible = false;
     gameover.img.style.display = 'none';
    }
   }
   if (playagain.showing) {
    playagain.a += .03;
    if (playagain.a >= 1) {
     playagain.a = 1;
     playagain.showing = false;
    }
    playagain.img.style.opacity = playagain.a;
   }
   if (playagain.hiding) {
    playagain.a -= .1;
    if (playagain.a <= 0) {
     playagain.a = 0;
     playagain.hiding = false;
    }
    playagain.img.style.opacity = playagain.a;
   }
   if (playagain.a > 0) {
    playagain.fr++;
    playagain.reposition();
   }
   if (playagain.a > .01) {
    if (!playagain.visible) {
     playagain.visible = true;
     playagain.img.style.display = 'inline';
    }
   } else {
    if (playagain.visible) {
     playagain.visible = false;
     playagain.img.style.display = 'none';
    }
   }
   

   if (c2s.showing) {
    c2s.a += .03;
    if (c2s.a >= 1) {
     c2s.a = 1;
     c2s.showing = false;
    }
    c2s.img.style.opacity = c2s.a;
   }
   if (c2s.hiding) {
    c2s.a -= .1;
    if (c2s.a <= 0) {
     c2s.a = 0;
     c2s.hiding = false;
    }
    c2s.img.style.opacity = c2s.a;
   }
   if (c2s.a > .01) {
    if (!c2s.visible) {
     c2s.visible = true;
     c2s.img.style.display = 'inline';
    }
   } else {
    if (c2s.visible) {
     c2s.visible = false;
     c2s.img.style.display = 'none';
    }
   }
   
   if (game.started) {
    wgfr %= wall_fr_gap;
    if (wgfr == 10) { // fr%150
     var wall = newWall(game.cur_wall_val);
     wall_fr_gap = Math.max(wall_fr_gap, wall_fr_start_gap + Math.floor(.5*Math.ceil(wall.ww - cell_size)));
     game.cur_wall_val++;
    }
    for (var i = walls.length-1; i>=0; i--) {
     var wall = walls[i];
     var mhv = wall.cells.length*(cell_size + 14);
     var cells = wall.cells;
     wall.x += wall.vx;
     for (var j = cells.length-1; j>=0; j--) {
      var cell = cells[j];
      cell.vx = wall.vx;
      cell.x = wall.x;
      cell.y = (hh-88) - (cell.sty + mhv*30 + wall.vspeed*wall.dir*(wall.x - (wall.ww + 12*2) - bird.x))%mhv;//(cell.sy + (wall.x + 16 - bird.x));
      //while (cell.y > (hh-88)) {
      // cell.y -= wall_cell_count*(cell_size + 14);
      //}
      cell.updatePos();
     }
     if (wall.x < (-wall.ww - 140)) {
      wall.kill();
     }
    }
    bird.x += (150 - bird.x) * .9;//bird.vx;
    bird.y += Math.max(-8, Math.min(13, bird.vy));
    bird.ang += (bird.dang - bird.ang) * .3;

    var gclm = false;
    
    var touching_wall = false;
    for (var i = walls.length-1; i>=0; i--) {
     var wall = walls[i];
     var cx = bird.x;
     if (!wall.passed) {
      var dest_value = wall.value; // wall.value + 1;
      var cspb = wall.ww + 12*2;
      var clc = null;
      var clm = false;
      var cells = wall.cells;
      var flrt = 1;
      var flamt = 1;
      if (!clm) {
       if (wall.clc != null) {
        clc = wall.clc;
        clm = true;
        gclm = true;
       } else {
        if (cx > (wall.x - cspb)) {
         if (cx < (wall.x + cspb)) {
          var cly = 999999;
          for (var j = cells.length-1; j>=0; j--) {
           var cell = cells[j];
           var dy = Math.abs(cell.y - bird.y);
           if (dy < cly) {
            cly = dy;
            clc = cell;
            wall.clc = clc;
            gclm = true;
            clm = true;
           }
          }
         }
        }
       }
      }
      if (clc == null) {
       if (wall.value <= 3) {
        for (var j = 0; j<cells.length; j++) {//cells.length-1; j>=0; j--) {
         var cell = cells[j];
         if (cell.value == dest_value) {
          clc = cells[j];
          clm = false;
          flamt = .4;
          flrt = .4;
          break;
         }
        }
       }
      }
      if (clc != null) {
       var c = clc.background.split('#').join('');
       var rr = parseInt(c.substr(0, 2), 16);
       var gg = parseInt(c.substr(2, 2), 16);
       var bb = parseInt(c.substr(4, 2), 16);
       clc.clfr += flrt;
       var amt = Math.sin(clc.clfr/2)*32*flamt;
       rr += amt;
       gg += amt;
       bb += amt;
       rr = Math.max(0, Math.min(255, Math.round(rr)));
       gg = Math.max(0, Math.min(255, Math.round(gg)));
       bb = Math.max(0, Math.min(255, Math.round(bb)));
       var s;
       rr = ("00"+rr.toString(16));
       gg = ("00"+gg.toString(16));
       bb = ("00"+bb.toString(16));
       c = '#'+rr.substr(rr.length-2) + gg.substr(gg.length-2) + bb.substr(bb.length-2);
       clc.div.style.background = c;
       //bird.x = clc.x - cspb;
       //bird.x += (clc.x - bird.x) * .15;
       if (clm) {
        //clc.a -= .05;
        clc.div.style.opacity = Math.floor(clc.a*100)/100;
        bird.y += (clc.y - bird.y) * clc.birdlock;
        clc.birdlock += .1;
        if (clc.birdlock >= 1) {
         clc.birdlock = 1;
        }
        bird.vy *= .7;
        bird.dang *= .8;
        if (bird.y > (hh-166)) {
         bird.vy = -13;
        }
        if (bird.stuck_on_bottom || (bird.y >= (hh-89 - (cell_size + 12*2)))) {
         bird.stuck_on_bottom = true;
         bird.y = hh-89 - (cell_size + 12*2);
         bird.vy = -14;
        }
        if (bird.stuck_on_top || (bird.y < -(cell_size + 12*2))) {
         bird.stuck_on_top = true;
         bird.y = -(cell_size + 12*2);
         bird.vy = 0;
        }
        touching_wall = true;
        if (clc.value != dest_value) {
         punch.play();
         bird.vy = -10;
         game.ended = true;
        } else if (bird.x > (clc.x + 16)) {
         wall.passed = true;
         if (!doubling) {
          bird.setValue(bird.value + 1);
          bird.stuck_on_bottom = false;
          bird.stuck_on_top = false;
          bird.ww = clc.ww;
          bird.div.style.width = clc.ww+'px';
          doubling = true;
          doubling_cell = clc;
          coin.play();
          points += 1;
          if (points > highscore) {
           highscore = points;
           localStorage.setItem('f2048hi', highscore);
          }
          score.update();
         }
        }
       }
      }
     }
    }
    
    if (doubling) {
     bird.vvy = 0;
     var wedc = 0; // want end doubling count
     doubling_cell.a -= .15;
     if (doubling_cell.a <= 0) {
      doubling_cell.a = 0;
      wedc++;
     }
     doubling_cell.dsa -= .15;
     if (doubling_cell.dsa <= 0) {
      doubling_cell.dsa = 0;
      wedc++;
     }
     var dsz = .5*Math.sin(Math.PI*doubling_cell.dsa);
     bird.dsz = dsz;
     //bird.div.style.width = (doubling_cell.ww + dsz)+'px';
     //bird.div.style.height = (cell_size + dsz)+'px';
     //bird.div.style.lineHeight = (cell_size + dsz)+'px'; // for vertical align of text
     doubling_cell.div.style.opacity = Math.floor(doubling_cell.a*100)/100;
     if (wedc == 2) { // all conditions requiring doubling to end are true
      wedc = 0;
      doubling = false;
     }
    }
    
    if ((!touching_wall) && (!doubling)) {
     bird.vvy += .1;
     if (bird.vvy > 1) bird.vvy = 1;
     bird.vy += .65 * bird.vvy;
     if (bird.vy >= 13) bird.vy = 13;
     bird.dang += .025;
     if (bird.dang > .5) bird.dang = .5;
    }
    
    
    
    bird.updatePos();
    var div = bird.div;
    var deg = bird.ang * (cell_size/Math.max(cell_size, cell_size + (bird.ww - cell_size)*2)) * 180/Math.PI;
    deg = Math.round(deg*100)/100;
    var sc = 1 + bird.dsz;
    /*
    div.style.webKitTransformOrigin = '100% 50%'; // Opera, Chrome, Safari
    div.style.mozTransformOrigin = '100% 50%';
    div.style.msTransformOrigin = '100% 50%'; // IE 9
    div.style.oTransformOrigin = '100% 50%';
    div.style.transformOrigin = '100% 50%';
    */
    div.style.webkitTransform = 'rotate('+deg+'deg) scale('+sc+','+sc+')';
    div.style.mozTransform    = 'rotate('+deg+'deg) scale('+sc+','+sc+')';
    div.style.msTransform     = 'rotate('+deg+'deg) scale('+sc+','+sc+')';
    div.style.oTransform      = 'rotate('+deg+'deg) scale('+sc+','+sc+')';
    div.style.transform       = 'rotate('+deg+'deg) scale('+sc+','+sc+')';

    var mxy = hh - 88 - (cell_size + 12*2);
    
    if (bird.y > mxy) {
     if (!gclm) {
      punch.play();
      bird.vy = -10;
      game.ended = true;
     }
    }
    
    if (game.ended) { // •••• you have to implement this. when the game is over, this is set to true.
     game.end_fr = 0;
     deathflash.style.display = 'inline';
     deathflash.style.opacity = .8;
     deathflash.style.zIndex = 999999;
     game.started = false;
     game.ended = true;
     gameover.hiding = false;
     gameover.showing = true;
     playagain.hiding = false;
     playagain.showing = true;
     if (points > highscore) {
      highscore = points;
      localStorage.setItem('f2048hi', highscore);
     }
    }
   }
  }
 }
 
 if (game.ended) {
  game.end_fr++;
  var op = .8 * (1 - game.end_fr/20);
  if (op < 0) {
   deathflash.style.display = 'none';
   deathflash.style.zIndex = 0;
  } else {
   deathflash.style.opacity = op;
  }
  var div = bird.div;
  div.style.webkitTransform = 'rotate(0deg) scale(1,1)';
  div.style.mozTransform    = 'rotate(0deg) scale(1,1)';
  div.style.msTransform     = 'rotate(0deg) scale(1,1)';
  div.style.oTransform      = 'rotate(0deg) scale(1,1)';
  div.style.transform       = 'rotate(0deg) scale(1,1)';
  bird.vy += .55;
  bird.y += bird.vy;
  var mxy = hh - 88 - (cell_size + 12*2);
  if (bird.y > mxy) {
   bird.y = mxy;
  }
  bird.updatePos();
 }
 raf(oef);
}


window.onresize = function () {
 resize();
}
