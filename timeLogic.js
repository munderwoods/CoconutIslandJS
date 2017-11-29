const state = require('./state');

function time () {
    state.time.turnCount++;
    state.time.minutes += 20;
    if (state.time.minutes >= 60) {
        state.time.hours++;
        state.time.minutes = 0;
    }
    if (state.time.hours >= 25) {
        state.time.hours = 0;
    }
    state.time.hoursString = state.time.hours.toString();
    state.time.minutesString = state.time.minutes.toString();
    if (state.time.minutesString === '0') {
        state.time.minutesString = '00';
    }
    state.time.displayTime = [state.time.hoursString, state.time.minutesString].join(':');
}

module.exports = {
    time
}
