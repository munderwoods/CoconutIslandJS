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

const testFunctions = {
    keyword : function(pi, test) {
        return pi.toLowerCase().match(test.parameter);
    },

    location: function(pi, test) {
        return state.location === test.parameter;
    }
};

function mainLoop(promptInput) {
    printLocalItemsDescriptions();
    console.log(state.printBuffer.join(" "));
    clearPrintBuffer();
    getInput();
}

function getInput() {
    console.log(getLocation(state.location).descriptions.firstDescription);
    promptly.prompt('What do you do? ', function (err, promptInput) {
        state.promptInput = promptInput;
        const action = actionTest(promptInput);
        if (action) {
            performBehavior(action, state);
        } else {
            addToPrintBuffer("You cannot.");
        }
        mainLoop(state.promptInput);
    })
}

function getLocalItems() {
    return localItems = getLocation(state.location).items.map(function(i){return i;});
    }

function printLocalItemsDescriptions() {
    getLocalItems().forEach(function(itemKey) {
        addToPrintBuffer((staticItems.find(l => itemKey === l.key) || obtainableItems.find(l => itemKey === l.key || makeableItems.find(l => itemKey === l.key))).locationDescription);
    })
}
function clearPrintBuffer() {
    state.printBuffer = [];
}

function actionTest(string) {
    return actions.find(a => a.test.every(test => testFunctions[test.type](string, test)));
}

function performBehavior(action, state)  {
    if (typeof actionFunctions[action.behavior.type] === "function") {
        actionFunctions[action.behavior.type](action.behavior.parameter, state);
    } else addToPrintBuffer("You cannot.");
}


mainLoop(state.promptInput);
