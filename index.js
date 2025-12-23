// Countdown logic with a Disney-inspired clock display
var start, isBlink, isLight, isRun, isShow, isWarned, handler, latency, stopBy, delay,
  audioRemind, audioEnd, newAudio, soundToggle, show, adjust, toggle, reset, blink,
  count, run, renderClock;

start = null;
isBlink = false;
isLight = true;
isRun = false;
isShow = true;
isWarned = false;
handler = null;
latency = 0;
stopBy = null;
delay = 60000;
audioRemind = null;
audioEnd = null;

newAudio = function(file) {
  var x$, node;
  x$ = node = new Audio();
  x$.src = file;
  x$.loop = false;
  x$.load();
  document.body.appendChild(node);
  return node;
};

soundToggle = function(des, state) {
  var x$;
  if (state) {
    return des.play();
  } else {
    x$ = des;
    x$.currentTime = 0;
    x$.pause();
    return x$;
  }
};

show = function() {
  isShow = !isShow;
  return $('.fbtn').css('opacity', isShow ? '1.0' : '0.1');
};

adjust = function(it, v) {
  if (isBlink) {
    return;
  }
  delay = delay + it * 1000;
  if (it === 0) {
    delay = v * 1000;
  }
  if (delay <= 0) {
    delay = 0;
  }
  return renderClock(delay);
};

toggle = function() {
  isRun = !isRun;
  $('#toggle').text(isRun ? "停止 / STOP" : "開始 / RUN");
  if (!isRun && handler) {
    stopBy = new Date();
    clearInterval(handler);
    handler = null;
    soundToggle(audioEnd, false);
    soundToggle(audioRemind, false);
  }
  if (stopBy) {
    latency = latency + new Date().getTime() - stopBy.getTime();
  }
  if (isRun) {
    return run();
  }
};

reset = function() {
  if (delay === 0) {
    delay = 1000;
  }
  soundToggle(audioRemind, false);
  soundToggle(audioEnd, false);
  stopBy = 0;
  isWarned = false;
  isBlink = false;
  latency = 0;
  start = null;
  isRun = true;
  toggle();
  if (handler) {
    clearInterval(handler);
  }
  handler = null;
  renderClock(delay);
  return $('#timer .time-part').css('color', '#fff');
};

blink = function() {
  isBlink = true;
  isLight = !isLight;
  return $('#timer .time-part').css('color', isLight ? '#fff' : '#ff5c8a');
};

count = function() {
  var diff;
  diff = start.getTime() - new Date().getTime() + delay + latency;
  if (diff > 60000) {
    isWarned = false;
  }
  if (diff < 60000 && !isWarned) {
    isWarned = true;
    soundToggle(audioRemind, true);
  }
  if (diff < 55000) {
    soundToggle(audioRemind, false);
  }
  if (diff < 0 && !isBlink) {
    soundToggle(audioEnd, true);
    isBlink = true;
    diff = 0;
    clearInterval(handler);
    handler = setInterval(function() {
      return blink();
    }, 500);
  }
  return renderClock(diff);
};

run = function() {
  if (start === null) {
    start = new Date();
    latency = 0;
    isBlink = false;
  }
  if (handler) {
    clearInterval(handler);
  }
  if (isBlink) {
    return handler = setInterval(function() {
      return blink();
    }, 500);
  } else {
    return handler = setInterval(function() {
      return count();
    }, 100);
  }
};

renderClock = function(ms) {
  var totalSeconds, seconds, minutes, hours, pad;
  totalSeconds = Math.max(0, Math.floor(ms / 1000));
  seconds = totalSeconds % 60;
  minutes = Math.floor(totalSeconds / 60) % 60;
  hours = Math.floor(totalSeconds / 3600);
  pad = function(value) {
    return String(value).padStart(2, '0');
  };
  $('.time-part.hours').text(pad(hours));
  $('.time-part.minutes').text(pad(minutes));
  return $('.time-part.seconds').text(pad(seconds));
};

window.onload = function() {
  renderClock(delay);
  audioRemind = newAudio('audio/smb_warning.mp3');
  return audioEnd = newAudio('audio/smb_mariodie.mp3');
};
