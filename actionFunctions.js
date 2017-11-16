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
    }
}
