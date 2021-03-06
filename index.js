//require('babel-register');
const promptly = require('promptly');
const state = require('./state');
const actions = require('./actions');
const actionFunctions = require('./actionFunctions');
const locations = require('./locations.json');
const staticItems = require('./staticItems');
const obtainableItems = require('./obtainableItems');
const makeableItems = require('./makeableItems');
const { getLocation } = require('./helpers');
const { addToPrintBuffer } = require('./helpers');
const { findLocation } = require('./helpers');
const { findDynamicLocation } = require('./helpers');
const { setLocationProperty } = require('./helpers');
const { getLocationProperty } = require('./helpers');
const { getLocalItems } = require('./helpers');
const _ = require('lodash');
const states = require('./states');
const { getAvailableItems } = require('./helpers');
const { itemKeyToName } = require('./helpers');
const { getAllItems } = require('./helpers');
const { findAvailableItem } = require('./helpers');
const { findLocalItem } = require('./helpers');
const { matchPromptInputToItemTrait } = require('./helpers');
const { matchPromptInputAgainstInventory } = require('./helpers');
const { time } = require('./timeLogic');
locationText = "";
updateText = "";
locationName = getLocationProperty(state.location, 'name');

const testFunctions = {
    keyword : function(pi, test) {
        return test.parameter.some(i => pi.toLowerCase().match(i));
    },

    localItem: function (pi) {
        return findLocalItem(pi) || matchPromptInputToItemTrait('yields', pi);
    },

    inventoryItem: function(pi) {
        return matchPromptInputAgainstInventory(pi);
    },

    location: function(pi, test) {
        return state.location === test.parameter;
    },

};

function mainLoop(promptInput, oldState) {
    let newState;
    if (promptInput === 'back' && states.length > 1) {
        states.pop();
        newState = states[states.length - 1];
    } else {
        newState = calculateState(promptInput, oldState);
        states.push(_.cloneDeep(newState));
    }

    renderDisplay(newState);
    getInput(function(nextInput){mainLoop(nextInput, newState)});
}

function calculateState(promptInput, oldState) {
    if(promptInput !== null) {
        time();
        clearPrintBuffer();
        const action = actionTest(promptInput);
        if (action) {
            performBehavior(action, oldState, promptInput);
        } else {
            addToPrintBuffer("You cannot.");
        }
    }
    printLocalItemsDescriptions();
    return oldState;
}

function renderDisplay(state) {
    updateText = state.printBuffer.join(" ");
    locationText = getLocation(state.location).descriptions[getLocationProperty(state.location, "descriptionNumber")];
}

function getInput(cb) {
    //promptly.prompt('What do you do? ', function (err, promptInput) {
    //    cb(promptInput);
   // })
}




function findItem(itemKey) {
    return getAllItems().find(l => itemKey === l.key);
}

function printLocalItemsDescriptions() {
    getLocalItems().forEach(function(itemKey) {
        addToPrintBuffer(findItem(itemKey).locationDescription);
    })
}
function clearPrintBuffer() {
    state.printBuffer = [];
}

function actionTest(string) {
    return actions.find(a => a.test.every(test => testFunctions[test.type](string, test)));
}

function performBehavior(action, state, promptInput)  {
    if (typeof actionFunctions[action.behavior.type] === "function") {
        actionFunctions[action.behavior.type](action.behavior.parameter, state, promptInput);
    } else addToPrintBuffer("You cannot.");
}


mainLoop(null, state);
module.exports = {
    mainLoop,
    locationText,
    updateText,
    locationName
}
