var blessed = require('blessed')
  , program = blessed.program();
const state = require('./state');
const index = require('./index');

var i = '0';
index.mainLoop(null, state);



// Create a screen object.
var screen = blessed.screen({
  smartCSR: true,
  autoPadding: true,
  dockBorders: true,
  getKeys: true
});

screen.title = 'Coconut Island';

var form = blessed.form({
    parent: screen,
});


var titleBox = blessed.box({
  top: '0%',
  height: '5%',
  content: '{bold}Coconut Island{/bold}',
  tags: true,
});
var timeBox = blessed.box({
  top: '3%',
  left: '50%',
  width: '40',
  height: '7%',
  border: {
    type: 'line'
  },
  content: state.time.displayTime,
  tags: true,
});
var updateBox = blessed.box({
  top: '3%',
  width: '50%',
  height: '48%',
  content: updateText,
  tags: true,
});
var locationBox = blessed.box({
  top: '52%',
  width: '50%',
  height: '40%',
  content: locationText,
  tags: true,
});
var locationTitleBox = blessed.box({
  top: '50%',
  height: '5%',
  width: '50%',
  content: locationName,
  tags: true,
});
var questionBox = blessed.box({
  top: '93%',
  height: '3%',
  width: '50%',
  content: '{bold}What do you do?{/bold}',
  tags: true,
});
var promptInput = blessed.textbox({
    top: '95%',
    width: '50%',
    height: '3%',
    keyable: true,
    inputOnFocus: true,
    mouse: true,
},);

promptInput.on ('submit', function(param) {
    index.mainLoop(promptInput.value, state);
    updateBox.content = updateText;
    locationBox.content = locationText;
    timeBox.content = state.time.displayTime;
    promptInput.clearValue();
    screen.render();
    promptInput.focus();
});


var box = blessed.box({
  top: 'center',
  left: 'center',
  width: '100%',
  height: '100%',
  children: [titleBox, updateBox,locationTitleBox, locationBox, questionBox, promptInput, timeBox],
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    border: {
      fg: '#f0f0f0'
    },
  }
});
// Append our box to the screen.
screen.append(box);


// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Focus our element.
promptInput.focus();

// Render the screen.
screen.render();
