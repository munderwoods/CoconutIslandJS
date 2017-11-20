const { getLocation } = require('./helpers');
const { addToPrintBuffer } = require('./helpers');
const { findLocation } = require('./helpers');
const { findDynamicLocation } = require('./helpers');
const { setLocationProperty } = require('./helpers');
const { getLocationProperty } = require('./helpers');


module.exports = {

    move : function(direction, state) {
        const destination = getLocation(state.location).directions[direction].destination;
        if(destination === "") {
            return addToPrintBuffer("You can't go that way.");
        }
        if(getLocationProperty(state.location, `directions.${direction}.access`) === 'open') {
        state.location = destination;
        } else {
            return addToPrintBuffer("You can't go that way.");
        }
    },
    exit : function() {
        process.exit()
    },

    help : function() {
        return addToPrintBuffer('Thank you for playing Coconut Island! I am Matthew S Underwood and this is my first game. You can only move in cardinal directions: north, south, east, and west. Keep an eye on your stats and try using items you pick up on other items to craft! github.com/munderwoods');
    },

    knock : function() {
		setLocationProperty('RICKENS_DOOR', "directions.east.access", 'open');
        setLocationProperty('RICKENS_DOOR', 'descriptionNumber', 'secondDescription');
        return addToPrintBuffer('You rap on Ricken\'s door twelve times before he opens it and bids you come in.');
    }
}
