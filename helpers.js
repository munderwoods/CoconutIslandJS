const locations = require('./locations');


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
    if(findDynamicLocation(locationKey)) {
		var currentObject = findDynamicLocation(locationKey);
		for (var i = 0; i < propertyArray.length; i++) {
			if( currentObject[propertyArray[i]] === undefined ) {
				currentObject[propertyArray[i]] = {}
			}
			if(i === propertyArray.length - 1) {
				currentObject[propertyArray[i]] = value;
            }
			currentObject = currentObject[propertyArray[i]];
		}
    } else {
        state.dynamicLocations.push({key: locationKey});
        var currentObject = findDynamicLocation(locationKey);
		for (var i = 0; i < propertyArray.length; i++) {
			if( currentObject[propertyArray[i]] === undefined ) {
				currentObject[propertyArray[i]] = {}
			}
			if(i === propertyArray.length - 1) {
				currentObject[propertyArray[i]] = value;
            }
			currentObject = currentObject[propertyArray[i]];
		}
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

module.exports = {
    getLocation,
    addToPrintBuffer,
    findLocation,
    setLocationProperty,
    getLocationProperty
}
