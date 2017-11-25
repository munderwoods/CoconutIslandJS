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
const { findAvailableItem } = require('./helpers');
const { itemKeyToName } = require('./helpers');
const { getItemProperty } = require('./helpers');
const { getLocalItems } = require('./helpers');
const { checkForItemWithTrait } = require('./helpers');
const { matchPromptInputToItemTrait } = require('./helpers');
const { addItemToInventory } = require('./helpers');
const { matchPromptInputAgainstInventory } = require('./helpers');
const { removeItemFromInventory } = require('./helpers');
const { checkMakeables } = require('./helpers');
const { findAvailableItemInPromptInput } = require('./helpers');


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
        return addToPrintBuffer('Ricken\'s door is already open.');
    },

    giveRickenGoldBar: function() {
        if (checkForItem('RICKEN')) {
            deleteItem('RICKEN');
            pickupItem('RIFLE');
            setLocationProperty('RICKENS_DOOR', 'directions.north.access', 'open');
            setLocationProperty('RICKENS_DOOR', 'descriptionNumber', 'thirdDescription');
            return addToPrintBuffer('You stare at eachother. Your body shakes. The place is coming down around you. You start to pull the gold bar from your pocket. The orange light from the fire gleams against the trident emblem stamped into the side of the bar. When Ricken sees it he pushes the bar back into your pocket and retrieves two rifles from a case over the mantle. He hands you one of them then walks out to the docks.');
        }
        return addToPrintBuffer('Ricken has gone to the docks.');
    },

    talkToRicken: function() {
        if (checkForItem('RICKEN')) {
            addToPrintBuffer('"Take me with you," you plead. The storm bursts the window and sheets of rain crash on your faces. Ricken\'s voice is plodding. "Boat holds four." "Leave the others," you stammer, "Just take me. I\'m a doctor. Who knows how long it\'ll be until you get picked up?" Ricken\'s face doesn\'t change. He says, "Show it to me."');
        }
        return addToPrintBuffer('Ricken has gone to the docks.');
    },

    displayInventory: function() {
        if (getInventoryNames().length > 0) {
            return addToPrintBuffer('You have ' + getInventoryNames().join(', ') + '.');
        }
        return (addToPrintBuffer('You have nothing.'));
    },

    shoot: function() {
        state.location = 'UNCONSCIOUS';
        deleteItem('RIFLE');
        deleteItem('GOLD_BAR');
        addToPrintBuffer('You kill one of the men. Ricken gets two more. The lightning starts again and you can see the worst of it now in strobes--billowing dark clouds the size of mountains, paradise coming down around you. A knife goes into your thigh and you slip in the blood. Your boat pushes off and away. You can see the mother treading water. You see a figure through your fogged glasses. It outlines a beast with tendrils thirty stories high but then it\'s a wave coming over the top of Ingrete. You are the only one looking back when Siere Marta is washed away by the sea. The wave breaks in front of you and your boat rides the swell high into the air. You lose consciousness.');
    },

    wake: function() {
        state.selfIcon = '@';
        state.mapPosition = {
            'y': 1,
            'x': 8,
        },
        state.location = 'SHORE';
        addToPrintBuffer('You wake up on a gray beach, half submerged and vomit into the ocean. Your leg hurts bad. It\'s been wrapped in cloth, but it\'s still bleeding. It needs some sort of ointment to stop it. You are alone.');
    },
    pickup: function(parameter, state, promptInput) {
        if (state.inventory.find(i => promptInput.toLowerCase().match(i.toLowerCase()))) {
            return addToPrintBuffer('You already have that.');
        }
        item = findAvailableItem(promptInput);
        if (item && getItemProperty(item, 'obtainable') === 1) {
            pickupItem(item)
            return addToPrintBuffer('You have obtained ' + itemKeyToName(item) + '.');
        }
        this.pickupFromSource(parameter, state, promptInput);
    },

    pickupFromSource: function(parameter, state, promptInput) {
        if (state.inventory.find(i => promptInput.toLowerCase().match(i.toLowerCase()))) {
            return addToPrintBuffer('You already have that.');
        }
        item = matchPromptInputToItemTrait('yields', promptInput);
        if (item) {
            addItemToInventory(item);
            return addToPrintBuffer('You have obtained ' + itemKeyToName(item) + '.');
        }
    },

    dropItem: function(parameter, state, promptInput) {
        item = matchPromptInputAgainstInventory(promptInput);
        if (item) {
            localItems = getLocalItems();
            localItems.push(item);
            removeItemFromInventory(item);
            return addToPrintBuffer('You have dropped ' + itemKeyToName(item) + '.');
        }
        return addToPrintBuffer('You do not have that.');
    },

    useCoconutOnButton: function(parameter, state, promptInput) {
        setLocationProperty('CAVE', 'directions.south.access', 'open');
        this.dropItem(parameter, state, promptInput);
        setLocationProperty('CAVE', 'descriptionNumber', 'secondDescription');
        return addToPrintBuffer('The coconut leaves your hand in a perfect arch and makes definite contact with the button. A light flickers from somewhere high above the button then a ring of fire encircles the ceiling of the cave. The fire decends down the oily walls and soon you are surrounded by flames. One the wall of the cave to the south collapses and burns away. It was a false wall.');
    },

    make: function(parameter, state, promptInput) {
        itemToMake = checkMakeables(promptInput);
        if (getItemProperty(itemToMake, 'requires').every(i => checkForItem(i))) {
            getItemProperty(itemToMake, 'requires').forEach(i => deleteItem(i));
            if (getItemProperty(itemToMake, 'obtainable') === 1) {
            addItemToInventory(itemToMake);
            } else {
                localItems = getLocalItems();
                localItems.push(itemToMake);
                setLocationProperty(state.location, 'items', localItems);
            }
            return console.log('You have made ' + itemKeyToName(itemToMake) + '.');
        }
        return console.log('You do not have what you need to make that.')
    },

    inspectItem: function(parameter, state, promptInput) {
        item = findAvailableItemInPromptInput(promptInput);
        if (item) {
            return addToPrintBuffer(getItemProperty(item, 'visualDescription'));
        }
        addToPrintBuffer('You do not see that.');
    }

}
