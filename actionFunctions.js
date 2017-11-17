const { getLocation } = require('./helpers');
const { addToPrintBuffer } = require('./helpers');


module.exports = {

    move : function(direction, state) {
        const destination = getLocation(state.location).directions[direction].destination;
        if(destination === "") {
            return addToPrintBuffer("You can't go that way.");
        }

        state.location = destination;
    },

    exit : function() {
        process.exit()
    },

    help : function() {
        return addToPrintBuffer('Thank you for playing Coconut Island! I am Matthew S Underwood and this is my first game. You can only move in cardinal directions: north, south, east, and west. Keep an eye on your stats and try using items you pick up on other items to craft! github.com/munderwoods');
    },

    knock : function() {
        return addToPrintBuffer('knock knock KNOCK');
    }
}
