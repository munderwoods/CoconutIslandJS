//require('babel-register');
const promptly = require('promptly');
const state = require('./state');
const actions = require('./actions');
const actionFunctions = require('./actionFunctions');
const locations = require('./locations.json');
const staticItems = require('./staticItems');
const { getLocation } = require('./helpers');
const { addToPrintBuffer } = require('./helpers');



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
        performBehavior(action, state);
        mainLoop(state.promptInput);
    })
}

function getLocalItems() {
    localItems=[];
    for (var i in getLocation(state.location).items) {
        localItems.push(getLocation(state.location).items[i]);
    }
    return localItems;
}

function printLocalItemsDescriptions() {
    for (var i in getLocalItems()) {
        itemKey = getLocalItems()[i];
        addToPrintBuffer(staticItems.find(l => itemKey === l.key).locationDescription);
    }
}
function clearPrintBuffer() {
    state.printBuffer = [];
}

function actionTest(string) {
    return actions.find(a => string.toLowerCase().match(a.test));
}

function performBehavior(action, state)  {
    if (typeof actionFunctions[action.behavior.type] === "function") {
        actionFunctions[action.behavior.type](action.behavior.parameter, state);
    } else addToPrintBuffer("You cannot.");
}


mainLoop(state.promptInput);
