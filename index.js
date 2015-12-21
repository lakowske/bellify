/*
 * (C) 2015 Seth Lakowske
 */

var bonsho = function() {
    document.getElementById('bonsho').play();
}

var clacker = function() {
    document.getElementById('clacker').play();
}

var getDuration = function() {
    return document.getElementById('duration').value;
}

var updateDuration = function() {
    setRemainingMins(getDuration());
}

var setRemainingMins = function(mins) {
    document.getElementById('remaining').innerHTML = mins;
}

var getRemainingMins = function() {
    return document.getElementById('remaining').innerHTML;
}

var hide = function(id) {
    var el = document.getElementById(id);
    el.hidden = true;
}

var show = function(id) {
    var el = document.getElementById(id);
    el.hidden = false;
}

var stop = function() {
    clearInterval(countdown);
    clearTimeout(timeout);
    
    setRemainingMins(0);

    show('durationInput');
    hide('remainingDisplay');    
    show('startButton');
    hide('stopButton');
    
}

var countdown = null;
var timeout = null;

var start = function() {
    var duration = getDuration();
    console.log(duration);
    var startMillis = Date.now();
    var durationMillis = duration * 60 * 1000;

    setRemainingMins(Math.ceil(duration));
    hide('durationInput');
    show('remainingDisplay');    
    hide('startButton');
    show('stopButton');
    
    countdown = setInterval(function() {
        var currentMillis = Date.now();
        var elapsedMillis = currentMillis - startMillis;

        var remainingMillis = durationMillis - elapsedMillis;

        var remainingMins = Math.ceil((remainingMillis / 1000) / 60);
        
        var dispRemainingMins = getRemainingMins();
        if (dispRemainingMins != remainingMins) {
            setRemainingMins(remainingMins);            
        }
    }, 1000);
               
    timeout = setTimeout(function() {
        bonsho();
        stop();
    }, duration * 60 * 1000);
}

window.bonsho = bonsho;
window.clacker = clacker;
window.start = start;
window.stop  = stop;
window.updateDuration = updateDuration;
