const locations = require('./locations');
const state = require('./state');

module.exports = {

getLocation: function(key) {
    return locations.find(l => key === l.key);
},

addToPrintBuffer: function(string) {
	state.printBuffer.push(string);
}

}
