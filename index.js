'use strict'

var State = require('dover')
var Value = require('observ')
var Event = require('weakmap-event')
var h = require('virtual-dom/h')
var valueEvent = require('value-event/value')
var autosize = require('autosize')
var AppendHook = require('append-hook')
var RemoveHook = require('remove-hook')
var WeakStore = require('weakmap-shim/create-store')
var extend = require('xtend')
var ObservThunk = require('observ-thunk')
var nextTick = require('next-tick')
var partial = require('ap').partial
var raf = require('raf')
var cuid = require('cuid')
var enterEvent = require('./enter-event')

var store = WeakStore()
function noop () {}

module.exports = Textarea

function Textarea (data) {
  data = data || {}
  var state = State({
    value: Value(data.value || ''),
    channels: {
      input: input,
      submit: submit
    },
    events: {
      load: onLoad,
      unload: onUnload
    }
  })

  var unlisten = state.value(ObservThunk(onChange))
  store(state).dispose = dispose

  return state

  function onLoad (element) {
    store(state).element = element
    autosize(element)
  }

  function onUnload (element) {
    autosize.destroy(element)
  }

  function onChange (value) {
    var element = store(state).element
    raf(partial(autosize.update, element))
  }

  function dispose () {
    unlisten()
  }
}

var InputEvent = Event()
Textarea.onInput = InputEvent.listen

var SubmitEvent = Event()
Textarea.onSubmit = SubmitEvent.listen

function input (state, data) {
  state.value.set(data[data.name])
  InputEvent.broadcast(state, {})
}

function submit (state, data) {
  // Ensure the vlaue has been updated from input events before broadcasting
  nextTick(partial(SubmitEvent.broadcast, state, {}))
}

var defaults = {
  rows: '1',
  enterSubmit: true
}
Textarea.render = function render (state, options) {
  options = extend(defaults, options || {})

  if (!options.name) {
    options.name = 'textarea-' + cuid()
  }

  options = extend(options, {
    name: options.name,
    value: state.value,
    'textarea-load': AppendHook(state.events.load),
    'textarea-unload': RemoveHook(state.events.unload),
    'ev-event': [
      valueEvent(state.channels.input, {
        name: options.name
      }),
      !options.enterSubmit ? noop : enterEvent(state.channels.submit)
    ]
  })

  return h('textarea', options)
}

Textarea.dispose = function dispose (state) {
  var dispose = store(state).dispose
  if (dispose) dispose()
}
