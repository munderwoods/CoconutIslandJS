const locations = require('./locations');
const state = require('./state');
const staticItems = require('./staticItems');
const obtainableItems = require('./obtainableItems');
const makeableItems = require('./makeableItems');


function getLocation(key) {
    return locations.find(l => key === l.key);
}

function addToPrintBuffer(string) {
	state.printBuffer.push(string);
}

function findLocation(locationKey) {
    return locations.find(l => locationKey === l.key);
}

function findDynamicLocation(locationKey) {
    return state.dynamicLocations.find(l => locationKey === l.key);
}

function setLocationProperty(locationKey, property, value) {
	propertyArray = property.split(".");
    if (!findDynamicLocation(locationKey)) {
        state.dynamicLocations.push({key: locationKey});
    }
    var currentObject = findDynamicLocation(locationKey);
    for (var i = 0; i < propertyArray.length; i++) {
        if( currentObject[propertyArray[i]] === undefined ) {
            currentObject[propertyArray[i]] = {}
        }
        if(i === propertyArray.length - 1) {
            currentObject[propertyArray[i]] = value;
            break;
        }
        currentObject = currentObject[propertyArray[i]];
    }
}

function findStaticLocationProperty(locationKey, propertyArray) {
    var currentObject = findLocation(locationKey);
    for (var i = 0; i < propertyArray.length; i++) {
        currentObject = currentObject[propertyArray[i]];
        if (i === propertyArray.length - 1) {
            return currentObject;
        }
    }
}

function findDynamicLocationProperty(locationKey, propertyArray) {
    var currentObject = findDynamicLocation(locationKey);
    if (currentObject === undefined) {
        return false;
    }
    for (var i = 0; i < propertyArray.length; i++) {
        if(currentObject === undefined) {
            return false;
        }
        currentObject = currentObject[propertyArray[i]];
        if (i === propertyArray.length - 1) {
            return currentObject;
        }
    }
}

function getLocationProperty(locationKey, property) {
    propertyArray = property.split(".");
    return findDynamicLocationProperty(locationKey, propertyArray) || findStaticLocationProperty(locationKey, propertyArray);
}

function getByPath(path, obj) {
    return path
        .split('.')
        .reduce(
            (acc, current) => (typeof acc === 'object' ? acc[current] : acc),
            obj
        );
}

function findByKey(key, list) {
    list.find(i => i.key === key);
}

function locationByKey(key, list=locations) {
    findByKey(key, list);
}

function getLocationProp(locationKey, property) {
    const staticValue = getByPath(property, locationByKey(locationKey));

    if (typeof staticValue !== 'undefined') return staticValue;

    return getByPath(property, locationByKey(locationKey, state.dynamicLocations));
}

function getAvailableItems() {
    return [].concat(getLocationProperty(state.location, 'items'), state.inventory);
}

function findAvailableItemInPromptInput(promptInput) {
    return getAvailableItems().find(i => promptInput.toLowerCase().match(i.toLowerCase()));
}

function checkForItem(itemKey) {
    return getAvailableItems().find(i => i === itemKey);
}

function getLocalItems() {
    return getLocationProperty(state.location, 'items');
}

function deleteItem(item) {
    state.inventory = state.inventory.filter(i => i !==item);
    setLocationProperty(state.location, 'items', getLocationProperty(state.location, 'items').filter(i => i !== item));
}

function addItemToInventory(itemKey) {
    return state.inventory.push(getAllItems().find(i => i.key === itemKey).key);
}

function pickupItem(item) {
    state.inventory.push(getLocalItems().find(i => i ===item));
    setLocationProperty(state.location, 'items', getLocationProperty(state.location, 'items').filter(i => i !== item));
}

function getItem(itemKey) {
    return staticItems.find(i => i.key === itemKey) || makeableItems.find(i => i.key === itemKey) || obtainableItems.find(i => i.key === itemKey);
}
function getItemProperty (itemKey, property) {
    return getByPath(property, getItem(itemKey));
}

function getInventoryNames() {
    inventoryNames = [];
    state.inventory.forEach(i => inventoryNames.push(getItemProperty(i, 'name')));
    return inventoryNames;
}

function getAllItems() {
        allItems = [];
        allItems.push(...staticItems, ...obtainableItems, ...makeableItems);
        return allItems
}
function itemKeyToName(itemKey) {
    return getAllItems().find(i => itemKey === i.key).name;
}

function findAvailableItem(promptInput) {
        return getAvailableItems().find(i => promptInput.toLowerCase().match(itemKeyToName(i).toLowerCase()));
}

function findLocalItem(promptInput) {
        return getLocalItems().find(i => promptInput.toLowerCase().match(itemKeyToName(i).toLowerCase()));
}

function getItemProperty(itemKey, property) {
    return getByPath(property, getAllItems().find(i => itemKey === i.key));
}

function itemKeyToObject(itemKey) {
    return getAllItems().find(i => itemKey === i.key);
}

function getLocalItemObjects() {
    return [] = getLocalItems().forEach(i => itemKeyToObject(i));
}

function checkForItemWithTrait(property, value) {
    return getLocalItemObjects().find(i => value === getByPath(property, i))
}

function matchPromptInputToItemTrait(property, promptInput) {
    traits = []
    getAllItems().forEach(i => traits.push(getByPath(property, i)));
    newTraits = traits.filter(i => i !== '');
    newTraits = newTraits.filter(i => i !== undefined);
    return newTraits.find(i => promptInput.toLowerCase().match(i.toLowerCase()));
}

function matchPromptInputAgainstInventory(promptInput) {
    return state.inventory.find(i => promptInput.toLowerCase().match(i.toLowerCase()));
}

function removeItemFromInventory(itemKey) {
    return state.inventory.pop(i => i.key === itemKey);
}

function checkMakeables(promptInput) {
    return makeableItems.find(i => promptInput.toLowerCase().match(i.key.toLowerCase())).key;
}

module.exports = {
    getLocation,
    addToPrintBuffer,
    findLocation,
    setLocationProperty,
    getLocationProperty,
    deleteItem,
    getLocalItems,
    pickupItem,
    checkForItem,
    getInventoryNames,
    getAllItems,
    itemKeyToName,
    getAvailableItems,
    findLocalItem,
    findAvailableItem,
    getItemProperty,
    getLocalItems,
    checkForItemWithTrait,
    matchPromptInputToItemTrait,
    matchPromptInputAgainstInventory,
    removeItemFromInventory,
    addItemToInventory,
    checkMakeables,
    findAvailableItemInPromptInput



}
