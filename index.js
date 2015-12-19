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

var start = function() {
    var duration = getDuration();
    
    console.log(duration);
    
    var startMillis = Date.now();
    
    
    var durationMillis = duration * 60 * 1000;
    
    var countdown = setInterval(function() {
        var currentMillis = Date.now();
        var elapsedMillis = currentMillis - startMillis;

        var remainingMillis = durationMillis - elapsedMillis;

        var remainingMins = Math.ceil((remainingMillis / 1000) / 60);
        
        var dispRemainingMins = getRemainingMins();
        if (dispRemainingMins != remainingMins) {
            setRemainingMins(remainingMins);            
        }
    }, 1000);
               
    setTimeout(function() {
        bonsho();
        clearInterval(countdown);
    }, duration * 60 * 1000);
    
}

window.bonsho = bonsho;
window.clacker = clacker;
window.start = start;
window.updateDuration = updateDuration;
