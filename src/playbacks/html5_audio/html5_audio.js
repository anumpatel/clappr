// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var Playback = require('playback')
var Events = require('../../base/events')

class HTML5Audio extends Playback {
  get name() { return 'html5_audio' }
  get tagName() { return 'audio' }
  get events() {
    return {
      'timeupdate': 'timeUpdated',
      'ended': 'ended'
    }
  }

  constructor(params) {
    super(params);
    this.el.src = params.src
    this.settings = {
      left: ['playpause', 'position', 'duration'],
      right: ['fullscreen', 'volume'],
      default: ['seekbar']
    }
    this.render() // it should render when the container trigger 'ready'
    params.autoPlay && this.play()
  }

  bindEvents() {
    this.listenTo(this.container, Events.CONTAINER_PLAY, this.play)
    this.listenTo(this.container, Events.CONTAINER_PAUSE, this.pause)
    this.listenTo(this.container, Events.CONTAINER_SEEK, this.seek)
    this.listenTo(this.container, Events.CONTAINER_VOLUME, this.volume)
    this.listenTo(this.container, Events.CONTAINER_STOP, this.stop)
  }

  getPlaybackType() {
    return "aod"
  }

  play() {
    this.el.play()
    this.trigger(Events.PLAYBACK_PLAY);
  }

  pause() {
    this.el.pause()
  }

  stop() {
    this.pause()
    this.el.currentTime = 0
  }

  volume(value) {
    this.el.volume = value / 100
  }

  mute() {
    this.el.volume = 0
  }

  unmute() {
    this.el.volume = 1
  }

  isMuted() {
    return !!this.el.volume
  }

  ended() {
    this.trigger(Events.CONTAINER_TIMEUPDATE, 0)
  }

  seek(seekBarValue) {
    var time = this.el.duration * (seekBarValue / 100)
    this.el.currentTime = time
  }

  getCurrentTime() {
    return this.el.currentTime
  }

  getDuration() {
    return this.el.duration
  }

  isPlaying() {
    return !this.el.paused && !this.el.ended
  }

  timeUpdated() {
    this.trigger(Events.PLAYBACK_TIMEUPDATE, this.el.currentTime, this.el.duration, this.name)
  }

  render() {
    return this
  }
 }

HTML5Audio.canPlay = function(resource) {
  return !!resource.match(/(.*).mp3/)
}


module.exports = HTML5Audio
