const { getLocation } = require('./helpers');
const { addToPrintBuffer } = require('./helpers');
const { findLocation } = require('./helpers');
const { findDynamicLocation } = require('./helpers');
const { setLocationProperty } = require('./helpers');
const { getLocationProperty } = require('./helpers');
const { deleteItem } = require('./helpers');
const { pickupItem } = require('./helpers');
const { getInventoryNames } = require('./helpers');
const { checkForItem } = require('./helpers');
const state = require('./state');

module.exports = {

    move : function(direction, state) {
        const destination = getLocation(state.location).directions[direction].destination;
        if(destination === "") {
            return addToPrintBuffer("You can't go that way.");
        }
        if(getLocationProperty(state.location, `directions.${direction}.access`) === 'open') {
            state.location = destination;
            if(getLocationProperty(state.location, 'firstVisitText') !== "") {
                addToPrintBuffer(getLocationProperty(state.location, 'firstVisitText'));
            }
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
        if (getLocationProperty('RICKENS_DOOR', 'directions.east.access') !== 'open') {
            setLocationProperty('RICKENS_DOOR', "directions.east.access", 'open');
            setLocationProperty('RICKENS_DOOR', 'descriptionNumber', 'secondDescription');
            return addToPrintBuffer('You rap on Ricken\'s door twelve times before he opens it and bids you come in.');
        }
        return console.log('Ricken\'s door is already open.');
    },

    giveRickenGoldBar: function() {
        if (checkForItem('RICKEN')) {
            deleteItem('RICKEN');
            pickupItem('RIFLE');
            setLocationProperty('RICKENS_DOOR', 'directions.north.access', 'open');
            setLocationProperty('RICKENS_DOOR', 'descriptionNumber', 'thirdDescription');
            return addToPrintBuffer('You stare at eachother. Your body shakes. The place is coming down around you. You start to pull the gold bar from your pocket. The orange light from the fire gleams against the trident emblem stamped into the side of the bar. When Ricken sees it he pushes the bar back into your pocket and retrieves two rifles from a case over the mantle. He hands you one of them then walks out to the docks.');
        }
        return console.log('Ricken has gone to the docks.');
    },

    talkToRicken: function() {
        if (checkForItem('RICKEN')) {
            addToPrintBuffer('"Take me with you," you plead. The storm bursts the window and sheets of rain crash on your faces. Ricken\'s voice is plodding. "Boat holds four." "Leave the others," you stammer, "Just take me. I\'m a doctor. Who knows how long it\'ll be until you get picked up?" Ricken\'s face doesn\'t change. He says, "Show it to me."');
        }
        return console.log('Ricken has gone to the docks.');
    },

    displayInventory: function() {
        addToPrintBuffer('You have ' + getInventoryNames().join(', ') + '.');
    }
}
