<template>
  <div
    :class="[
      'video-plyr',
      (theme && `theme--${theme}`)
    ]"
  >
    <video
      :class="classes"
      :loop="loop"
      :autoplay="autoplay"
      :muted="muted"
      :playsinline="playsinline"
      :controls="controls"
      ref="video"
    >
      <source :src="url" />
    </video>

    <div style="display: none">
      <svg class="play-icon" ref="playIcon" xmlns="http://www.w3.org/2000/svg" width="34.979" height="44.396" viewBox="0 0 34.979 44.396">
        <path id="Polygon_2" data-name="Polygon 2" d="M22.2,0,44.4,34.978H0Z" transform="translate(34.979) rotate(90)" fill="#fd5858"/>
      </svg>

      <svg class="volume-icon" ref="volumeIcon" xmlns="http://www.w3.org/2000/svg" width="58.234" height="44.395" viewBox="0 0 58.234 44.395">
        <g id="Polygon_4" data-name="Polygon 4" transform="translate(0 44.395) rotate(-90)" fill="none">
          <path d="M22.2,0,44.4,34.978H0Z" stroke="none"/>
          <path d="M 22.1976318359375 3.732572555541992 L 3.637977600097656 32.97808456420898 L 40.75728607177734 32.97808456420898 L 22.1976318359375 3.732572555541992 M 22.1976318359375 3.814697265625e-06 L 44.395263671875 34.97808456420898 L 0 34.97808456420898 L 22.1976318359375 3.814697265625e-06 Z" stroke="none" fill="#fd5858"/>
        </g>
        <path id="Path_81" data-name="Path 81" d="M21,0a11.953,11.953,0,0,1,0,23.907" transform="translate(16.88 10.291)" fill="none" stroke="#fd5858" stroke-width="2"/>
        <path id="Path_82" data-name="Path 82" d="M21,0a19.355,19.355,0,0,1,0,38.711" transform="translate(16.88 2.515)" fill="none" stroke="#fd5858" stroke-width="2"/>
        <path id="Path_83" data-name="Path 83" d="M21,0a5.9,5.9,0,0,1,0,11.8" transform="translate(16.955 15.969)" fill="none" stroke="#fd5858" stroke-width="2"/>
      </svg>
    </div>
  </div>
</template>

<script>
import Plyr from 'plyr'

export default {
  props: {
    url: {
      type: String
    },
    loop: {
      type: Boolean,
      default: true,
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    muted: {
      type: Boolean,
      default: true,
    },
    playsinline: {
      type: Boolean,
      default: true,
    },
    controls: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      required: false,
      validator: t => ['dark', 'red'].includes(t)
    }
  },
  data() {
    return {
      isLoaded: false
    }
  },
  mounted() {
    this.plyr = new Plyr(this.$refs.video, {
      controls: this.controls ? ['play', 'mute', 'progress'] : [],
      disableContextMenu: false,
      autoplay: this.autoplay,
      muted: this.muted,
      fullscreen: {
        enabled: false
      },
      tooltips: {
        controls: false,
        seek: false
      }
    })

    // Insert different icons
    const $volumeIcon = this.$refs.volumeIcon
    const $playIcon = this.$refs.playIcon

    const muteButton = this.plyr.elements.buttons.mute
    const playButton = this.plyr.elements.buttons.play[0]

    $volumeIcon.parentNode.removeChild($volumeIcon)
    $playIcon.parentNode.removeChild($playIcon)

    muteButton.insertBefore($volumeIcon, muteButton.childNodes[0])
    playButton.insertBefore($playIcon, playButton.childNodes[0])

    muteButton.addEventListener('click', this.onMuteButtonClick) 

    this.plyr.on('ready', e => {
      this.plyr.pip = false // Turn off
      
      if (this.muted) {
        this.plyr.volume = 0
      }

      this.isLoaded = true
    })
  },
  beforeDestroy() {
    this.plyr && this.plyr.destroy()
  },
  computed: {
    classes() {
      return [
        'video-plyr__video',
        { 'is-loaded': this.isLoaded }
      ]
    }
  },
  methods: {
    play() {
      this.plyr && this.plyr.play()
    },
    onMuteButtonClick() {
      if (this.plyr.volume === 0) {
        this.plyr.muted = false
        this.plyr.volume = 1
      } else {
        this.plyr.muted = true
        this.plyr.volume = 0
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.video-plyr {
  ::v-deep .plyr__video-wrapper {
    background-color: $black;
    background-image: $dark-gradient;
  }

  ::v-deep .plyr__control {
    .icon--not-pressed,
    .play-icon {
      display: none;
    }

    &:not(.plyr__control--pressed) .play-icon {
      display: block;
    }
  }

  ::v-deep .plyr__volume {
    .icon--pressed,
    .icon--not-pressed {
      display: none;
    }
  }

  ::v-deep .plyr__volume .plyr__control .volume-icon {
    width: auto;
  }

  ::v-deep .plyr__volume .plyr__control:not(.plyr__control--pressed) .volume-icon g path:first-child {
    fill: currentColor;
  }
}

.video-plyr__video {
  opacity: 0;
  transition: opacity 1s ease-out;

  &.is-loaded {
    opacity: 1;
  }
}
</style>