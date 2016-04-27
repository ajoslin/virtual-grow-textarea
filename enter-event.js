'use strict'

var BaseEvent = require('value-event/base-event')
var ENTER = 13

module.exports = BaseEvent(function handleEnter (event, broadcast) {
  // Don't care about non-enter
  if (event.type !== 'keypress' || event.keyCode !== ENTER) return

  // Enter alone, no shift/ctrl/meta
  if (event.shiftKey || event.metaKey || event.ctrlKey) return

  // Success: prevent textarea growth and broadcast
  event.preventDefault()
  broadcast(this.data)
})
