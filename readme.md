# virtual-grow-textarea [![Build Status](https://travis-ci.org/ajoslin/virtual-grow-textarea.svg?branch=master)](https://travis-ci.org/ajoslin/virtual-grow-textarea)

> Growable textarea for virtual-dom, backed by [autosize](https://github.com/jackmoore/autosize)

## Install

```
$ npm install --save virtual-grow-textarea
```

## Usage

```js
var Textarea = require('virtual-grow-textarea')

var textarea = Textarea()

function render (state) {
  var vtree = Textarea.render(state)
  // => use virtual-dom to patch vtree into real DOM
}

textarea(render)
```

## API

#### `Textarea(data)` -> `function`

##### data

Type: `object`

###### value

Type: `string`

The value of the textarea.

#### `Textarea.render(state, options) -> vtree`

Render a textarea state into a virtual DOM tree.

##### state

*Required*
Type: `object`

A textarea state.

##### options

Type: `object`

`options` will be merged with the defaults (`{rows: '1', placholder: ''}`) and passed to [virtual-hyperscript](https://github.com/Matt-Esch/virtual-dom/tree/master/virtual-hyperscript).

Additionally, there are some options that affect the textarea's behavior:

###### options.enterSubmit

Type: `boolean`  
Default: `true`

If true, pressing enter will not grow the textarea, and instead will trigger `Textarea.onSubmit`.  The user will have to press `shift-enter` to grow the textarea.

Suggestion: Set `options.enterSubmit` to true on desktop and false on mobile.

#### `Textarea.onSubmit(state, listener)` -> `function`

Returns a function that removes the listener.

##### state

*Required*  
Type: `function`

An observable Textarea state.

##### listener

*Required*  
Type: `function`

A function that will be called when the user submits the textarea with enter while `options.enterSubmit` is set to true.

#### `Textarea.onInput(state, listener)` -> `function`

Returns a function that removes the listener.

##### state

*Required*  
Type: `function`

An observable Textarea state.

##### listener

*Required*  
Type: `function`

A function that will be called when the user inputs a value into the textarea.

#### `Textarea.dispose(state)`

Disables all listeners that the textarea creates internally.

##### state

*Required*  
Type: `function`

An observable Textarea state.

## License

MIT © [Andrew Joslin](http://ajoslin.com)
