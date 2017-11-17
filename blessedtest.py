var blessed = require('blessed');

// Create a screen object.
var screen = blessed.screen({
  smartCSR: true
});

screen.title = 'Coconut Island';

// Create a box perfectly centered horizontally and vertically.
var box = blessed.box({
  top: 'center',
  left: 'center',
  width: '100%',
  height: '100%',
  content: '{bold}Coconut Island{/bold}',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'black',
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
box.focus();

// Render the screen.
screen.render();
