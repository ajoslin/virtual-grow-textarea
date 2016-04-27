'use strict'

var test = require('tape')
var Textarea = require('./')
var raf = require('raf')
var dispatchEvent = require('dispatch-event')
var createComponent = require('thermometer').createComponent

test('initial value', function (t) {
  t.plan(1)
  createComponent(Textarea, {value: '123'}, function (state, element, done) {
    t.equal(state.value(), '123')
  })
})

test('state.value => textarea', function (t) {
  t.plan(1)
  createComponent(Textarea, function (state, element, done) {
    state.value.set('hello')
    raf(function () {
      t.equal(element.value, 'hello')
    })
  })
})

test('input -> state.value and onInput', function (t) {
  t.plan(2)
  createComponent(Textarea, function (state, element, done) {
    Textarea.onInput(state, onInput)

    element.value = 'super'
    dispatchEvent(element, 'input', {bubbles: true})

    raf(function () {
      t.equal(state.value(), 'super')
    })

    function onInput () {
      t.pass('onInput')
    }
  })
})

test('enter with no shift -> submit by default', function (t) {
  t.plan(1)
  createComponent(Textarea, function (state, element, done) {
    Textarea.onSubmit(state, onSubmit)
    dispatchEvent(element, 'keypress', {keyCode: 13})

    // enter+shiftKey does not submit
    dispatchEvent(element, 'keypress', {
      keyCode: 13,
      shiftKey: true
    })

    function onSubmit () {
      t.pass('onSubmit')
    }
  })
})

test('enterSubmit option false', function (t) {
  t.plan(1)
  var renderOptions = {enterSubmit: false}
  createComponent(Textarea, null, renderOptions, function (state, element, done) {
    Textarea.onSubmit(state, onSubmit)

    dispatchEvent(element, 'keypress', {keyCode: 13})

    function onSubmit () {
      t.fail('Should not be called')
    }
    t.pass()
  })
})
