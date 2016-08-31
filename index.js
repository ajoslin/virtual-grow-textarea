'use strict'

var State = require('dover')
var Value = require('observ')
var Event = require('weakmap-event')
var h = require('virtual-dom/h')
var changeEvent = require('value-event/change')
var autosize = require('autosize')
var AppendHook = require('append-hook')
var RemoveHook = require('remove-hook')
var WeakStore = require('weakmap-shim/create-store')
var extend = require('xtend')
var ObservThunk = require('observ-thunk')
var partial = require('ap').partial
var raf = require('raf')
var enterEvent = require('./enter-event')

var store = WeakStore()
function noop () {}

module.exports = Textarea

function Textarea (data) {
  data = data || {}
  var state = State({
    value: Value(data.value || ''),
    height: Value(),
    channels: {
      input: input,
      submit: submit
    },
    events: {
      load: onLoad,
      unload: onUnload
    }
  })

  state.value(ObservThunk(onChange))

  return state

  function onLoad (element) {
    store(state).element = element

    autosize(element)

    element.addEventListener('autosize:resized', partial(onResize, element))
  }

  function onUnload (element) {
    autosize.destroy(element)
  }

  function onChange (value) {
    var element = store(state).element
    raf(partial(autosize.update, element))
  }

  function onResize (element) {
    var height = parseInt(element.style.height, 10) || element.offsetHeight
    state.height.set(height)
  }
}

var InputEvent = Event()
Textarea.onInput = InputEvent.listen

var SubmitEvent = Event()
Textarea.onSubmit = SubmitEvent.listen

function input (state, data) {
  var value = data[data.name]
  if (state.value() === value) return
  state.value.set(value)
  InputEvent.broadcast(state, {})
}

function submit (state, data) {
  SubmitEvent.broadcast(state, {})
}

var defaults = {
  rows: '1',
  enterSubmit: true
}
Textarea.render = function render (state, options) {
  options = extend(defaults, options || {})

  if (!options.name) {
    options.name = 'virtual-grow-textarea'
  }

  options = extend(options, {
    style: {
      height: state.height + 'px'
    },
    name: options.name,
    value: state.value,
    'textarea-load': AppendHook(state.events.load),
    'textarea-unload': RemoveHook(state.events.unload),
    type: 'textarea',
    'ev-input': changeEvent(state.channels.input, {
      name: options.name
    }),
    'ev-keypress': !options.enterSubmit ? noop : enterEvent(state.channels.submit)
  })

  return h('textarea', options)
}
